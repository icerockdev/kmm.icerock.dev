---
sidebar_position: 7
---

# Навигация между экранами

## Android 

Для навигации в Android-приложении мы будем использовать [Navigation component](https://developer.android.com/guide/navigation).  
Вы уже читали об этом в блоке [Экраны и навигация](/university/android-basics/user-interface#экраны-и-навигация), повторите при необходимости.

## iOS

Для понимания того, как будет реализована навигация в `iOS` прилоежниях на проектах, ознакомьтесь со [статьей](/learning/ios/navigation) и материалами из нее.

В наших проектах, для верстки и навигации на iOS мы больше не будем использовать `.storyboard`, вместо этого мы будем пользоваться следующими инструментами:
- `AppCoordinator` - главный координатор приложения, который будет запускать другие координаторы в зависимости от входных данных
- Другие координаторы - отвечают за свои зоны приложения (авторизация, просмотр новостей, редактирование профиля и тд)
- `.xib` и `код` для верстки
    - экраны верстаем в `.xib`
    - `navigation items` и более сложные настройки делаем через `код`

## ApplicationCoordinator - практическое задание

В качестве практики предлагаем вам потренироваться в использовании `ApplicationCoordinator`. На основе [mobile-moko-boilerplate](https://gitlab.icerockdev.com/scl/boilerplate/mobile-moko-boilerplate) сделать следующее приложение:
- всего 2 экрана: `AuthViewController` и `HomeViewController` и 3 координатора: `AppCoordinator`, `AuthCoordinator` и `HomeCoordinator`
- `AuthViewController` - экран регистрации, добавьте сюда поле для ввода никнейма и кнопку "Login"
- `HomeViewController` - основной экран приложения, добавьте сюда `Label` с приветствием юзера по никнейму и кнопку "Logout"
- никнейм сохранять в параметры устройства используя `NSUserDefaults`
- использовать `ApplicationCoordinator` для первичной навигации - если никнейм есть - значит запускать `GreetingCoordinator`, иначе запускать `AuthCoordinator`
- не используйте `.storyboard`, создайте необходимые контроллеры и свяжите их с `.xib`
- для `UserEditViewController` используйте `.xib` с таким же именем, а для `CitiesViewController` создайте `.xib` с отличающимся именем

## KMM
Для начала, освежите в памяти что такое [события/действия](/learning/android/states-events#событие-действие), для чего они нужны и как реализуются на `Android`.
За всю логику в приложении, в том числе и за принятие решения, когда нужно перейти на другой экран отвечает `viewModel`. Поэтому `viewModel` должна как-то сообщать фрагменту или `viewController`-y, что нужно выполнить какое-то действие (`Action`).

Разберем несколько подходов для передачи событий от вьюмодели на UI: 
- используя [Flow](https://kotlinlang.org/docs/flow.html)
- используя `EventsDispatcher` из [moko-mvvm](https://github.com/icerockdev/moko-mvvm)
- используя [Flow](https://kotlinlang.org/docs/flow.html) вместе с [moko-kswift](https://github.com/icerockdev/moko-kswift)

### Flow  

В [статье](/learning/android/states-events) про состояния и события вы уже ознакомились с передачей событий на `Android` используя `Flow APIs`.  
Однако, теперь нам нужно отправлять такие действия из общего кода, который потом подключится к `iOS` и `Android` приложениям.  
**Первая проблема** заключается в том, что на `iOS` не удастся использовать `Flow APIs`, потому что там нет параметризированных интерфейсов, и дженерик, объявленный в общем коде просто пропадет.  
**Вторая проблема** - `sealed interface` не преобразуется к `Emum` на `iOS`, как в `Kotlin`.  

Рассмотрим на примере:

Допустим, у нас для переходов между экранами во `viewModel` объявлен вот такой `sealed interface Action`:  
```kotlin
sealed interface Action {
  object RouteToMainScreen : Action
  object RouteToAuthScreen : Action
  object RouteToSettingsScreen : Action
}
```
При необходимости перейти на другой экран `viewModel` помещает во `flow` объекты `Action`. `Fragment` и `viewController` подписываются на этот флоу, и, когда он меняет состояние на новое, определяют по нему на какой экран переходить.

Представим, что мы подписались на `flow` во фрагменте: каждый новый объект обрабатывается `when`-ом. Если все объекты из `sealed interface`-а обработаны в `when`, то на `Android` ветка `else` не потребуется.  
В `iOS` же, `interface` не преобразуется в `enum`, из-за чего даже при переборе всех объектов в `when`, нужно будет добавить ветку `else`.  
Теперь, предположим, что нам понадобилось добавить еще один объект в `Action` для событий, которые кидает вьюмодель.  
В `Kotlin`-мире мы получим ошибку при компиляции, надо будет добавить в `when` обработку еще одного объекта - нового, который только что добавили во вьюмодель.  
А на `iOS` компилятор нам ничего не подскажет, потому что новый объект будет обрабатываться в ветке `else`. Из-за этого, логика перехода на `iOS` нарушится. Поиск ошибки может занять некоторое время, в зависимости от знаний разработчика.  
Чтобы не сталкиваться с этим на практике мы долгое время использовали другой подход - с помощью `EventsDispatcher` из [moko-mvvm](https://github.com/icerockdev/moko-mvvm). Разберемся, как он работает.

### EventsDispatcher
С этим подходом разобраться, потому что на многих проектах сейчас используется именно он.  
`EventDispatcher` - это класс с одной единственной задачей - гарантировать доставку события и вызов его обработчика на `UI`, после сигнала от `viewModel`.

Во вьюмодели объявляется интерфейс с методами, реализация которых ей нужна на платформе, например, метод для перехода на какой-нибудь экран:

```kotlin 
interface EventsListener {
    fun routeToSomeoneScreen()
}
```

Далее, все что остается сделать, чтобы вызвать событие на `UI` - это получить во вьюмодели объект `eventsDispatcher` и, когда пора переходить на `SomeoneScreen`, послать платформе `event`:
``` kotlin
eventsDispatcher.dispatchEvent { routeToSomeoneScreen() }
```

На платформах `Fragment` и `ViewController` реализуют этот интерфейс.
Пример реализации во фрагменте:

```kotlin
override fun routeToSomeoneScreen() {
    findNavController().navigate(R.id.action_testFragment_to_someoneFragment)
}
```

За счет интерфейса обе платформы знают, какой набор действий должны поддерживать.  
Если во вьюмодели нужно будет добавить еще одно событие, и мы забудем реализовать его на какой-нибудь из платформ, компилятор выделит, что отсутствует реализация метода интерфейса.

***Важно***  
В `dispatchEvent` нельзя передавать лямбду из общего кода, например, для установки действия по кнопке в [AlertDialog](https://developer.android.com/reference/android/app/AlertDialog). Нельзя этого делать потому, что на `Android` мы не сможем ее никуда сохранить, поэтому при пересоздании экрана она пропадет.  
Если вам нужно установить чему-либо на платформе действие - делайте соответствующий метод во `viewModel`.

### Flow c moko-kswift
***Заменить тут примеры кода на ссылки на moko-mvvm, когда смержится ветка***  
Мы уже рассмотрели, с какими проблемами мы столкнулись бы, если бы использовали `Flow` в общем коде.  
Разберем теперь, как можно решить эти проблемы, начнем с отстутвия типов у `Flow` на `iOS`.

Мы будем использовать классы-обертки `CFlow` и `CStateFlow` из [moko-mvvm](https://github.com/icerockdev/moko-mvvm), а также функции, позволяющие преобразовать в них `Flow` и `StateFlow`: 

```kotlin
expect class CFlow<T>(flow: Flow<T>) : Flow<T>

expect class CStateFlow<T>(flow: StateFlow<T>) : StateFlow<T>

fun <T> Flow<T>.cFlow(): CFlow<T> = CFlow(this)
fun <T> StateFlow<T>.cStateFlow(): CStateFlow<T> = CStateFlow(this)
```

Для `Android` никакой разницы между обычными `Flow/StateFlow` и новыми `CFlow/CStateFlow` нет, всю реализацию назначаем на одноименные интерфейсы.   
```kotlin
actual class CFlow<T> actual constructor(private val flow: Flow<T>) : Flow<T> by flow
actual class CStateFlow<T> actual constructor(private val flow: StateFlow<T>) : StateFlow<T> by flow
```
На `iOS` же мы реализуем возможность подписки на `CFlow` и `CStateFlow`:
```kotlin
actual open class CFlow<T> actual constructor(private val flow: Flow<T>) : Flow<T> by flow {

    fun subscribe(coroutineScope: CoroutineScope, onCollect: (T) -> Unit): Disposable {
        val job: Job = coroutineScope.launch(Dispatchers.Main) {
            flow.onEach {
                println("collect $it")
                onCollect(it)
            }
                .collect()
        }
        return object : Disposable {
            override fun dispose() {
                println("cancel job")
                job.cancel()
            }
        }
    }

    fun subscribe(onCollect: (T) -> Unit): Disposable {
        @Suppress("OPT_IN_USAGE")
        return subscribe(coroutineScope = GlobalScope, onCollect)
    }

    interface Disposable {
        fun dispose()
    }
}

actual class CStateFlow<T> actual constructor(
    private val flow: StateFlow<T>
) : CFlow<T>(flow), StateFlow<T> {
    override val replayCache: List<T> get() = flow.replayCache

    override suspend fun collect(collector: FlowCollector<T>): Nothing = flow.collect(collector)

    override val value: T get() = flow.value
}
```
В `common`-коде используем `CFlow` и `CStateFlow` соответственно, поскольку это классы, а не интерфейсы, дженерик на `iOS` никуда не пропадет.  
Таким образом, мы решили первую проблему - отсутствие типов у `Flow` на `iOS`.  

Теперь разберемся со второй - преобразованием `sealed interface` к `Enum` на `Swift`.    

Благодаря библиотеке [moko-kswift](https://github.com/icerockdev/moko-kswift) мы можем использовать `sealed interface` в общем коде, и без проблем обрабатывать его на `iOS`.  
Для более полного понимания проблемы и решения, советуем изучить [README](https://github.com/icerockdev/moko-kswift#readme) библиотеки и прочитать [статью](https://medium.com/icerock/how-to-implement-swift-friendly-api-with-kotlin-multiplatform-mobile-e68521a63b6d).

## Практическое задание

Создайте следующее приложение:
  - два экрана
  - две вьюмодели
  - обработка событий перехода между экранами реализована:
    - `EventsDispatcher`
    - `Flow` и `moko-kswift`
