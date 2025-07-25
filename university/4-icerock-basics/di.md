---
sidebar_position: 5
---

# Внедрение зависимостей

## Dependency inversion - инверсия зависимостей 
### Введение
Как мы уже разобрали в блоке [многомодульность](multimodularity), нам нужно разбить проект на модули и обеспечить их минимальную связанность, чтобы скорость сборки не уменьшалась с ростом проекта (особенно на `iOS`)  
Так как модули не знают друг про друга, но приложение целостное и оно должно использовать: 
- один общий источник данных
- общие строки локализации
- общие картинки 
- и т.д.

Поэтому нам нужно обеспечить передачу некоторых общих компонентов и классов во все модули. Использовать один общий модуль для таких компонентов мы не можем, это также описывалось в блоке [многомодульность](multimodularity).  
В этом случае нам подойдет вариант с обратной зависимостью:
- модули не зависят от каких-то компонент
- необходимые модулю компоненты будут предоставляться извне
- модули не знают, кто именно передаст им компоненты и как они будут реализованы

Это называется [Dependency inversion](https://habr.com/ru/post/313796/) - инверсия зависимостей.

### Пример
Допустим, мы делаем фичу авторизации.  
Для авторизации нам нужно: отправить запрос на сервер с номером телефона и кодом авторизации.  
За логику работы с сетью у нас отвечает общий для всех модулей репозиторий. Поэтому в фиче авторизации объявляем интерфейс с функцией `signIn`:

```kotlin
interface AuthRepository {
    suspend fun signIn(
        phoneNumber: String,
        authCode: String
    )
}
```
А в конструкторе `AuthViewModel` объявляем поле, типа этого интерфейса:
```kotlin
class AuthViewModel(
   //...
   repository: AuthRepository,
   //...
) 
```
Таким образом вьюмодель как бы объявляет: мне для работы нужен кто-то, кто реализует интерфейс `AuthRepository`, потому что у него есть нужный мне метод `signIn`. Мне вообще не важно, кто и как будет его реализовывать.  
В классе общего репозитория реализуем интерфейс `AuthRepository` и при создании фичи будем передавать объект общего репозитория.

## DI на проектах

Вся логика приложения находится в общем коде. На платформах (`iOS` и `Android`) мы просто реализуем `UI` и связываем его с логикой.
В общем коде вся логика сосредоточена во вьюмоделях разных фич, поэтому для каждого экрана от общего кода нужно получить нужную ему вьюмодель.

Однако, вьюмодель - это как правило большой и сложный класс, который нуждается в настройке.  
Например, для создания стандартной вьюмодели ей необходимы:
- репозиторий, через который идет общение с источником данных
- `exceptionHandler` - объект, реализующий интерфейс [ExceptionHandler](https://github.com/icerockdev/moko-errors/blob/ece79111fb5a9451e6179ba8c5367213c117421b/errors/src/commonMain/kotlin/dev/icerock/moko/errors/handler/ExceptionHandler.kt) и помогающий обрабатывать ошибки из общего кода (о нем вы узнаете позднее из `moko-errors`)

Наша цель - избавить платформу от сложности настройки вьюмоделей, чтобы не пришлось во фрагменте или вьюконтроллере получать все эти объекты, необходимые для создания вьюмодели.

Решение - по максимуму оставить логику настройки вьюмоделей в общем коде, используя Koin для предоставления зависимостей, чтобы со стороны платформы можно было получить готовую вьюмодель.

### Уровень фичи

Нам потребуется модуль Koin для получения всех вьюмоделей одной фичи. Разбирать будем на примере фичи авторизации, а вьюмодель, которую мы хотим получить - вьюмодель экрана сброса пароля.

Начнем с вьюмодели, которую создадим в папке presentation фичи: 

`ResetPasswordViewModel.kt`:
```kotlin
class ResetPasswordViewModel(
   private val repository: ResetPasswordRepository
) {
   ...
}
```
Рядом с `ResetPasswordViewModel` в папке model создаем интерфейс репозитория. В конструктор `ResetPasswordViewModel` принимает объект, который реализует этот интерфейс. В данном случае - кого-то, кто реализует метод для сброса пароля.  

`ResetPasswordRepository.kt`:
```kotlin
interface ResetPasswordRepository {
   suspend fun resetPassword(
      phoneNumber: String,
      confirmCode: String
   )
}
```
Класс репозитория фичи - `AuthRepositoryImpl`, который будет реализовывать этот интерфейс разберем позднее.

Теперь сделаем `featureAuthModule` - модуль Koin, с помощью которого будем предоставлять зависимости для вьюмоделей фичи авторизации и создавать вьюмодели.

`featureAuthModule.kt`:
```kotlin
...
import org.koin.core.Koin
import org.koin.core.module.Module
import org.koin.core.module.dsl.factoryOf
import org.koin.core.parameter.parametersOf
import org.koin.dsl.module

val featureAuthModule: Module = module {
    factoryOf(::ResetPasswordViewModel)
    factoryOf(::AuthPhoneViewModel)
    factoryOf(::AuthCodeViewModel)
}
fun Koin.createResetPasswordViewModel(): ResetPasswordViewModel {
    return get<ResetPasswordViewModel>()
}

fun Koin.createAuthPhoneViewModel: AuthPhoneViewModel {
    return get<AuthPhoneViewModel>()
}

fun Koin.createAuthCodeViewModel(phone: String): AuthCodeViewModel {
    return get<AuthCodeViewModel> {
        parametersOf(phone)
    }
}
``` 

В этот модуль мы будем добавлять методы, аналогичные `createResetPasswordViewModel` для создания других вьюмоделей, для них всех `repository` будет одинаковым.

Теперь у нас есть доступ ко всем вьюмоделям фичи авторизации, чтобы создать какую-либо вьюмодель нужно просто вызвать нужную функцию, где требуется, с передачей аргумента (в примере выше это номер телефона). 

### Уровень mpp-library

Логика работы приложения с источником данных (сервер, БД и т.д.) выносятся в классы - репозитории, в данном случае сделаем репозиторий для фичи авторизации, имплементирующий интерфейс ResetPasswordRepository - `AuthRepositoryImpl`

`AuthRepositoryImpl.kt`:
```kotlin
class AuthRepositoryImpl internal constructor(
    private val keyValueStorage: KeyValueStorage,
    private val dao: AppDao,
    private val api: AuthApi
) : ResetPasswordRepository {
   override fun resetPassword(
      phoneNumber: String,
      confirmCode: String
   ) {
      // TODO
   }
}
```
Этот класс реализует все интерфейсы вьюмоделей фичи авторизации для работы с источником данных. Для всех новых вьюмоделей других фичей мы будем объявлять свои интерфейсы, и реализовывать их в классе репозитория конкретной фичи, а затем прокидывать объект репозитория всем вьюмоделям.

Также нам потребуется модуль Koin для получения всех репозиториев, в том числе для фичи авторизации.

```kotlin
...
import org.koin.core.module.Module
import org.koin.core.module.dsl.binds
import org.koin.core.module.dsl.singleOf
import org.koin.dsl.bind
import org.koin.dsl.module

internal val repositoriesModule: Module = module {
    singleOf(::AuthRepositoryImpl) {
        binds(
            classes = listOf(
                ResetPasswordRepository::class,
                AuthCodeRepository::class,
                ...
            )
        )
    }
    singleOf(::ProfileRepositoryImpl) bind ProfileRepository::class

```
Теперь нужно собрать все модули фичей в `FeatureModule.kt`:
```kotlin
internal val featuresModules = module {
    includes(featureAuthModule)
    includes(featureProfileModule)
    ...
}
```

Теперь нужно зарегистрировать все модули Koin:

```kotlin
internal fun registerKoinModules(
    baseUrl: String
): List<Module> = listOf(
    apiModule(baseUrl = baseUrl),
    featuresModules,
    repositoriesModule,
    ...
)
```

Также в commonMain подготовим функцию для инициализации Koin:

```kotlin
fun startDI(
    baseUrl: String,
    antilog: Antilog?,
    exceptionLogger: ExceptionLogger,
    appDeclaration: KoinAppDeclaration? = null
): KoinApplication {
    antilog?.also { Napier.base(antilog = it) }
    Napier.base(CrashReportingAntilog(exceptionLogger))
    configureExceptionMappers()

    return startKoin {
        modules(
            registerKoinModules(
                baseUrl = baseUrl
            )
        )
        appDeclaration?.invoke(this)
    }
}
```

***

### Уровень платформы

Параметры `startDI` - это то, что мы не можем создать из общего кода, а можем получить только с платформы.

***iOS***

Для удобства создаем `Koin.swift`:
```swift
typealias KoinApplication = Koin_coreKoinApplication
typealias Koin = Koin_coreKoin
```
И `KoinManager.swift`:

```swift
fileprivate var koinInstance: Koin!

extension Koin {
    static var shared: Koin {
        return koinInstance
    }

    internal static func setup() {
        guard koinInstance == nil else {
            fatalError("koin already initialized!")
        }

        let antilog: Antilog?
        #if DEBUG
            antilog = DebugAntilog(defaultTag: "debug")
        #else
            antilog = nil
        #endif

        let koinApp: KoinApplication = KoinKt.startDI(
            baseUrl: Environment.Keys.serverBaseUrl.value(),
            antilog: antilog,
            exceptionLogger: CrashlyticsExceptionLogger()
        )

        koinInstance = koinApp.koin
    }
}

```

В методе `application` класса `AppDelegate` инициализируем Koin.
```
func application(
    _: UIApplication,
    didFinishLaunchingWithOptions _: [UIApplication.LaunchOptionsKey: Any]? = nil
) -> Bool {
    FirebaseApp.configure()

    #if DEBUG
        Crashlytics.crashlytics().setCrashlyticsCollectionEnabled(false)
    #endif

    Koin.setup()

    return true
}
```

Получение вьюмодели в контроллере выглядит вот так:

```
private var resetPasswordViewModel: ResetPasswordViewModel = Koin.shared
    .createResetPasswordViewModel()
```

***Android***

```kotlin
class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        ...
        val antilog: LogcatAntilog? = if (BuildConfig.DEBUG) {
            LogcatAntilog()
        } else {
            null
        }

        startDI(
            baseUrl = BuildConfig.BASE_URL,
            antilog = antilog,
            exceptionLogger = CrashlyticsLogger()
        ) {
            if (BuildConfig.DEBUG) {
                androidLogger()
            }
            androidContext(this@MainApplication)
        }
    }
}
```

Таким образом, чтобы начать работу с общим кодом, нужно только инициализировать Koin c помощью `startDI`, передав ему несколько параметров, доступных только на платформе.

## Практическое задание
- Используйте проект, готовый после раздела [Многомодульность](./multimodularity#практическое-задание)
- Добавьте модули Koin для фичей и его инициализацию
