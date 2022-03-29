---
sidebar_position: 6
---

# Внедрение зависимостей и ресурсов

## Dependency inversion - инверсия зависимостей 
### Введение
Как мы уже разобрали в блоке [многомодульность](multimodularity), нам нужно разбить проект на модули и обеспечить их минимальную связанность, чтобы скорость сборки не уменьшалась с ростом проекта (особенно на `iOS`)  
Так как модули не знают друг про друга, но приложение целостное и оно должно использовать: 
- один общий источник данных
- одинаковые строчки локализации
- одинаковые картинки 
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
      phoneNumber: Int,
      authCode: Long
   ): Int
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
Таким образом вьюмодель как бы объявляет: мне для работы нужен кто-то, кто реализует интерфейс `AuthRepository`, потому что у него есть нужный мне метод `signIn`. Мне абсолютно не важно, кто и как будет его реализовывать.  
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

Рядом с `ResetPasswordViewModel` создаем интерфейс репозитория. Сделали мы это ради принципа `Dependency Inversion`. В конструктор `ResetPasswordViewModel` принимает объект, который реализует этот интерфейс. В данном случае - кого-то, кто реализует метод для сброса пароля.  

`ResetPasswordRepository.kt`
```kotlin
interface ResetPasswordRepository {
   suspend fun resetPassword(
      phoneNumber: Int,
      confirmCode: Long
   ): Int
}
```
Далее, рассмотрим того, кто будет реализовывать этот метод.  
Вся логика работы приложения с источником данных (сервер, БД и т.д.) вынесена в один класс - `AppRepository`

`AppRepository.kt`:
```kotlin
internal class AppRepository constructor(
    private val keyValueStorage: KeyValueStorage,
    private val dao: AppDao,
    private val coroutineScope: CoroutineScope
) : ResetPasswordRepository {
   override fun resetPassword(
      phoneNumber: Int,
      confirmCode: Long
   ): Int {
      // TODO
   }
}
```
Этот класс реализует абсолютно все интерфейсы, реализацию которых требуют вьюмодели всех фич. Для всех новых вьюмоделей мы будем объявлять новый интерфейс, и реализовывать его здесь, а затем прокидывать объект общего репозитория всем вьюмоделям.

Теперь сделаем `AuthFactory` - класс, с помощью которого будем настраивать общие компоненты вьюмоделей фичи и создавать их. Класс фабрики также объявляется в модуле фичи.

`AuthFactory.kt`:
```kotlin
class AuthFactory(
   private val createExceptionHandler: () -> ExceptionHandler,
   private val repository: AuthRepository,
   private val strings: Strings
) {
   fun createResetPasswordViewModel(
      eventsDispatcher: EventsDispatcher<ResetPasswordViewModel.EventsListener>
   ) = ResetPasswordViewModel(
      eventsDispatcher = eventsDispatcher,
      exceptionHandler = createExceptionHandler(),
      repository = repository,
      strings = strings
   )

   interface Strings : ResetPasswordViewModel.Strings
}
```
`interface Strings` фабрики реализует все интерфейсы `Strings` из других вьюмоделей. 

В эту фабрику мы будем добавлять методы, аналогичные `createResetPasswordViewModel` для создания других вьмоделей, для них всех `createExceptionHandler`, `repository` и `strings` будут одинаковыми.

Теперь у нас есть доступ ко всем вьюмоделям фичи авторизации - чтобы создать какую-либо вьюмодель нужно просто вызвать нужную функцию у фабрики и передать один единственный аргумент. Осталось как-то создать `AuthFactory`: 

Функция для создания фабрики фичи авторизации, объявляется непосредственно на уровне выше чем фичи (mpp-library/src), чтобы был доступ к MR строчкам (***? тут не уверен, причину надо более внятную ?*): 
```kotlin
internal fun AuthFactory(
    createExceptionHandler: () -> ExceptionHandler,
    authRepository: AuthRepository
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
Здесь мы устанавливаем все строки локализации, необходимые фиче.  
Поскольку, вьюмодель у нас пока что-то одна, объект `strings` содержит только строки `ResetPasswordViewModel`. Если бы вьюмоделей было больше - все необходимые им строки задавались бы здесь. 

Второй уровень абстракции: фабрика фабрик - `SharedFactory`. В ней мы также создадим все фабрики, как до этого создавали вьюмодели в фабриках, настроим их, чтобы для работы с общим кодом нужно было создать только одну общую фабрику - `SharedFactory`.

`SharedFactory.kt`
```kotlin
class SharedFactory internal constructor(
   settings: Settings,
   antilogs: List<Antilog>,
   databaseDriverFactory: DatabaseDriverFactory,
   repositoryCoroutineScope: CoroutineScope
) {
   internal val appRepository: AppRepository by lazy {
      AppRepository(
         //TODO
      )
   }

   val authFactory: AuthFactory by lazy {
      AuthFactory(
         createExceptionHandler = ::createExceptionHandler,
         authRepository = appRepository
      )
   }

   private fun createExceptionHandler(): ExceptionHandler = ExceptionHandler(
      // TODO
   )
}
```
В `SharedFactory` мы создали оставшиеся необходимые фабрикам компоненты - `Repository` и `createExceptionHandler`.  
Если бы были какие-то другие компоненты, необходимые другим фабрикам или вьюмоделям - то добавляли бы по следующему принципу:  
   - все что общее для вьюмоделей одной фичи - настраивается в фабрике
   - все, что общее для всех фабрик - настраивается в `SharedFactory`

Параметры `SharedFactory` - это то, что мы не можем создать из общего кода а можем получить только с платформы.

Таким образом, чтобы начать работу с общим кодом - нужно только создать объект `SharedFactory`, передав ему несколько параметров, доступных только на платформе.  
Получить нужную вьюмодель можно будет следующим образом: `sharedFactory.authFactory.createAuthViewModel()` - быстро и просто, без всяких настроек

## Библиотека moko-resources

[github](https://github.com/icerockdev/moko-resources)

отправить читать ридми

Описать что делают, как помогают на мульиплатформе

рассказать про master.sh, какие есть параметры, как найти гуглтаблицу по файлу

задание: подключить библиотеку к проекту, вынести общие ресурсы

## master.sh

Для локализации мы используем интеграцию с google sheets т.к. можно передать заказчику и он сможет сам задать строчки 