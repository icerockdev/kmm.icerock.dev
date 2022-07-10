---
sidebar_position: 7
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

Поэтому, нам нужно обеспечить передачу некоторых общих компонентов и классов во все модули. Использовать один общий модуль для таких компонентов мы не можем, это также описывалось в блоке [многомодульность](multimodularity).  
В этом случае нам подойдет вариант с обратной зависимостью:
- модули не зависят от каких-то компонент
- необходимые модулю компоненты будут предоставляться извне
- модули не знают, кто именно передаст им компоненты и как они будут реализованы

Это называется [Dependency inversion](https://habr.com/ru/post/313796/) - инверсия зависимостей.

### Пример
Допустим, мы делаем фичу авторизации.  
Для авторизации нам нужно: отправить запрос на сервер с номером телефона и кодом авторизации.  
За логику работы с сетью у нас отвечает общий для всех модулей репозиторий. Поэтому, в фиче авторизации объявляем интерфейс с функцией `signIn`:

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
В классе общего репозитория реализуем интерфейс `AuthRepository` и, при создании фичи будем передавать объект общего репозитория.

## DI на проектах

Вся логика приложения находится в общем коде. На платформах (`iOS` и `Android`) мы просто реализуем `UI` и связываем его с логикой.
В общем коде вся логика сосредоточена во вьюмоделях разных фич, поэтому, для каждого экрана от общего кода нужно получить нужную ему вьюмодель.

Однако, вьюмодель - это как правило большой и сложный класс, который нуждается в настройке.  
Например, для создания стандартной вьюмодели ей необходимы:
- строки локализации - строки, использующиеся в общем коде
- репозиторий, через который идет общение с источником данных
- `exceptionHandler` - объект, реализующий интерфейс [ExceptionHandler](https://github.com/icerockdev/moko-errors/blob/ece79111fb5a9451e6179ba8c5367213c117421b/errors/src/commonMain/kotlin/dev/icerock/moko/errors/handler/ExceptionHandler.kt) и помогающий обрабатывать ошибки из общего кода (о нем вы узнаете позднее из `moko-errors`)
- `eventsDispatcher` - объект, служащий для отправки событий(actions) от `viewModel` на `UI` (о нем вы узнаете уже в следующем разделе) 

Наша цель - избавить платформу от сложности настройки вьюмоделей, чтобы не пришлось во фрагменте или вьюконтроллере получать все эти объекты, необходимые для создания вьюмодели.

Решение - по максимуму оставить логику настройки вьюмоделей в общем коде, чтобы со стороны платформы можно было практически сразу получить готовую вьюмодель.

### Уровень фичи

Первый уровень абстракции над вьюмоделями это фабрика фичи. Она позволяет получить все вьюмодели одной фичи. Разбирать будем на примере фичи авторизации, а вьюмодель, которую мы хотим получить - вьюмодель экрана сброса пароля.

Начнем с вьюмодели: 

`ResetPasswordViewModel.kt`:
```kotlin
class ResetPasswordViewModel(
   override val eventsDispatcher: EventsDispatcher<EventsListener>,
   val exceptionHandler: ExceptionHandler,
   private val repository: ResetPasswordRepository,
   private val strings: Strings
) {
   interface Strings {
      val resetDescription: StringDesc
   }
}
```
Вьюмодель объявляет интерфейс `Strings` - необходимые ей строки локализации. Далее мы разберем это подробнее. 

Рядом с `ResetPasswordViewModel` создаем интерфейс репозитория. Сделали мы это для того, чтобы не устанавливать связь фича-модуля на модуль со строками локализации. В конструктор `ResetPasswordViewModel` принимает объект, который реализует этот интерфейс. В данном случае - кого-то, кто реализует метод для сброса пароля.  

`ResetPasswordRepository.kt`
```kotlin
interface ResetPasswordRepository {
   suspend fun resetPassword(
      phoneNumber: String,
      confirmCode: String
   )
}
```
Класс репозитория фичи - `AuthRepository`, который будет реализовывать этот интерфейс разберем позднее.

Теперь сделаем `AuthFactory` - класс, с помощью которого будем настраивать общие компоненты вьюмоделей фичи авторизации и создавать их. Класс фабрики также объявляется в модуле фичи.

`AuthFactory.kt`:
```kotlin
class AuthFactory(
   private val createExceptionHandler: () -> ExceptionHandler,
   private val authRepository: AuthRepository,
   private val strings: Strings
) {
   fun createResetPasswordViewModel(
      eventsDispatcher: EventsDispatcher<ResetPasswordViewModel.EventsListener>
   ) = ResetPasswordViewModel(
      eventsDispatcher = eventsDispatcher,
      exceptionHandler = createExceptionHandler(),
      repository = authRepository,
      strings = strings
   )

   interface Strings : ResetPasswordViewModel.Strings
}
```
`interface Strings` фабрики реализует все интерфейсы `Strings` из других вьюмоделей. 

В эту фабрику мы будем добавлять методы, аналогичные `createResetPasswordViewModel` для создания других вьюмоделей, для них всех `createExceptionHandler`, `repository` и `strings` будут одинаковыми.

Теперь у нас есть доступ ко всем вьюмоделям фичи авторизации - чтобы создать какую-либо вьюмодель нужно просто вызвать нужную функцию у фабрики и передать один единственный аргумент. 

### Уроверь mpp-library

Логика работы приложения с источником данных (сервер, БД и т.д.) выносятся в классы - репозитории, в данном случае сделаем репозиторий для фичи авторизации - `AuthRepository`

`AuthRepository.kt`:
```kotlin
internal class AuthRepository constructor(
    private val keyValueStorage: KeyValueStorage,
    private val dao: AppDao,
    private val coroutineScope: CoroutineScope
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

Второй уровень абстракции: фабрика фабрик - `SharedFactory`. В ней мы также создадим все фабрики, как до этого создавали вьюмодели в фабриках, настроим их, чтобы для работы с общим кодом нужно было создать только одну общую фабрику - `SharedFactory`.

`SharedFactory.kt`:
```kotlin
class SharedFactory internal constructor(
    settings: Settings,
    antilogs: List<Antilog>,
    databaseDriverFactory: DatabaseDriverFactory,
    repositoryCoroutineScope: CoroutineScope
) {
    // public constructor for platform side usage
    constructor(
        settings: Settings,
        antilog: Antilog?,
        databaseDriverFactory: DatabaseDriverFactory?,
        mpiServiceConnector: MpiServiceConnector?
    ) : this(
        settings = settings,
        antilogs = listOfNotNull(
            antilog,
            CrashReportingAntilog(CrashlyticsLogger())
        ),
        databaseDriverFactory = databaseDriverFactory,
        mpiServiceConnector = mpiServiceConnector,
        repositoryCoroutineScope = CoroutineScope(Dispatchers.Main)
    )
    
    internal val authRepository: AuthRepository by lazy {
        AuthRepository(
            //TODO
        )
    }

    val authFactory: AuthFactory by lazy {
        AuthFactory(
            createExceptionHandler = ::createExceptionHandler,
            authRepository = authRepository,
            strings = object : AuthFactory.Strings {
                override val resetDescription: StringDesc =
                    MR.strings.reset_description.desc()
            }
        )
    }

    private fun createExceptionHandler(): ExceptionHandler = ExceptionHandler(
        // TODO
    )
}
```
В `SharedFactory` мы создали оставшиеся необходимые фабрикам компоненты - `authRepository` и `createExceptionHandler`, а также установили все строки локализации, необходимые фиче.  
Поскольку, вьюмодель у нас пока что-то одна, объект `strings` для `AuthFactory` содержит только строки `ResetPasswordViewModel`. Если бы вьюмоделей было больше - все необходимые им строки задавались бы здесь.

***
Фиче может понадобиться гораздо больше строк локализации, чем одна, и самих фич в проекте может быть очень много. Если инициализировать строки локализации каждой в фабрики фичей именно в `SharedFactory`, то класс со временем сильно разрастется и ориентироваться в нем будет сложно.  
Предлагаем вам использовать вспомогательные функции, расположенные рядом с `SharedFactory`, чтобы инициализировать фабрики строками именно там, а в `SharedFactory` вызывать эти функции.

`AuthFactoryInit.kt`:
```kotlin
internal fun AuthFactory(
    createExceptionHandler: () -> ExceptionHandler,
    authRepository: AuthRepositoryInterface
): AuthFactory {
    return AuthFactory(
        createExceptionHandler = createExceptionHandler,
        authRepository = authRepository,
        strings = object : AuthFactory.Strings {
            override val resetDescription: StringDesc =
                MR.strings.reset_description.desc()
        }
    )
}
```
Вызов в `SharedFactory`:

```kotlin
val authFactory: AuthFactory by lazy {
    AuthFactory(
        createExceptionHandler = ::createExceptionHandler,
        authRepository = authRepository
    )
}
```
***

### Уроверь платформы

Параметры `SharedFactory` - это то, что мы не можем создать из общего кода а можем получить только с платформы.


***iOS***

Класс со статической переменной - фабрикой
```
class AppComponent {
    static var factory: SharedFactory!
}
```

В методе `application` класса `AppDelegate` инициализируем фабрику и прокидываем дальше в `AppCoordinator`. О нем вы узнаете уже в следующем разделе `Навигация между экранами`.
```
func application(_: UIApplication, didFinishLaunchingWithOptions _: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
    FirebaseApp.configure()
    MokoFirebaseCrashlytics.setup()

    let antilog: Antilog?
    #if DEBUG
        antilog = DebugAntilog(defaultTag: "debug")
    #else
        antilog = nil
    #endif

    AppComponent.factory = SharedFactory(
        settings: AppleSettings(delegate: UserDefaults.standard),
        antilog: antilog,
        databaseDriverFactory: SqlDatabaseDriverFactory(),
    )

    let window = UIWindow()

    coordinator = AppCoordinator(
        window: window,
        factory: AppComponent.factory
    )
    coordinator.start()

    window.makeKeyAndVisible()
    self.window = window

    return true
}
```

`AppCoordinator` прокидывает ее дальше, в дочерние координаторы, которые, в свою очередь, отправляют ее уже в контроллеры.
Получение вьюмоедли в контроллере выглядит вот так:

```
vc.resetPasswordViewModel = factory
.authFactory
.createResetPasswordViewModel(eventsDispatcher: EventsDispatcher<ResetPasswordViewModelEventsListener>(listener: vc))
```

***Android***

```kotlin
val factory = SharedFactory(
    AndroidSettings(
        delegate = context.getSharedPreferences("app", MODE_PRIVATE)
    ),
    antilog = antilog,
    databaseDriverFactory = SqlDatabaseDriverFactory(context)
)

val resetPasswordViewModel = factory.authFactory.createResetPasswordViewModel(
    eventsDispatcher = eventsDispatcherOnMain()
)
```

Наконец, как добавлять новые компоненты в фичи и вьюмодели, если вдруг что-то понадобилось: 
   - все что общее для вьюмоделей одной фичи - настраивается в фабрике
   - все, что общее для всех фабрик - настраивается в `SharedFactory`


Таким образом, чтобы начать работу с общим кодом - нужно только создать объект `SharedFactory`, передав ему несколько параметров, доступных только на платформе.  

## Практическое задание
- Используйте проект, готовый после раздела [Ресурсы в общем коде](./resources-in-common#практическое-задание)
- Добавьте необходимые фрагменты в Android-приложение, фрагменты наследуйте от `MvvmFragment` из `moko-mvvm`, ориентируйтесь на практику 3 блока
- Настройте Android приложение - чтобы его логикой, кроме управления списков, управлял общий код 
- Android приложение должно работать
