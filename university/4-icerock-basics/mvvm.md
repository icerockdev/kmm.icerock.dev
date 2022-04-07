---
sidebar_position: 4
---

# MVVM

## moko-mvvm
Все наши проекты мы делаем используя паттерн [Mvvm](https://habr.com/ru/post/338518/).  
Логика приложения, находится во вьюмоделях, которые, в свою очередь, расположены в общем коде. На `Android` и `iOS` остается только реализовать `UI` и подцепиться к вьюмодели.  
Как вы уже знаете из [статьи](/learning/android/states-events), вьюмодели имеют набор [LiveData](https://developer.android.com/topic/libraries/architecture/livedata) и [Flow](https://kotlinlang.org/docs/flow.html) объектов, для привязки со стороны `UI`.


`LiveData` в общем коде доступна из библиотеки [moko-mvvm](/learning/libraries/moko/moko-mvvm):
- для `Android` будет использована [нативная реализация](https://developer.android.com/topic/libraries/architecture/livedata)
- для `iOS` же, `LiveData` это реактивное хранилище, реализация в `moko-mvvm`.

Также, в `moko-mvvm` есть реализация класса `ViewModel`. Для `Android`, опять же, используется [нативная реализация](https://developer.android.com/topic/libraries/architecture/viewmodel), а для `iOS` - из `moko-mvvm`.

Для `Android` и `iOS` в библиотеке содержится набор методов для привязки `UI` к  объектам `liveData`.

Привязка `UI` к `LiveData` называется биндинг, от основновго метода привязки из `moko-mvvm` - `bind`:
- [для Android](https://github.com/icerockdev/moko-mvvm/blob/master/mvvm-livedata/src/androidMain/kotlin/dev/icerock/moko/mvvm/utils/LiveDataExt.kt)
- [для iOS](https://github.com/icerockdev/moko-mvvm/blob/master/mvvm-livedata/src/iosMain/kotlin/dev/icerock/moko/mvvm/utils/LiveDataExt.kt)

### Примеры
Рассмотрим [примеры](https://github.com/icerockdev/moko-mvvm/tree/master/sample) из `moko-mvvm`:

`SimpleViewModel`:
```kotlin
class SimpleViewModel : ViewModel() {
    private val _counter: MutableLiveData<Int> = MutableLiveData(0)
    val counter: LiveData<String> = _counter.map { it.toString() }

    fun onCounterButtonPressed() {
        _counter.value += 1
    }
}
```

Биндинг в `Android`: воспользовались готовой функцией `bindText` - привязали значение поля `TextView` к `LiveData<String>` и установлили действие кнопке: 
```kotlin
binding.counterTextView.bindText(this.viewLifecycleOwner, viewModel.counter)

binding.countButton.setOnClickListener {
    viewModel.onCounterButtonPressed()
}
```

Биндинг в `iOS`: также воспользовались готовой функцией, только уже для `iOS` - `bindText`, и установили действие кнопке:
```
counterLabel.bindText(liveData: viewModel.counter)
    
@IBAction func onCounterButtonPressed() {
    viewModel.onCounterButtonPressed()
}
```

### Extensions

Если в `moko-mvvm` не оказалось нужной вам функции биндинга для `iOS` или `Android`, вы можете добавить свой `extension` к `LiveData`.  
Например, добавим функцию `bindToMenuItemVisible` для связи `LiveData<Boolean>` и `MenuItem` на `Android`:
```kotlin
internal fun LiveData<Boolean>.bindToMenuItemVisible(
    lifecycleOwner: LifecycleOwner,
    menuItem: MenuItem
): Closeable {
    return bindNotNull(lifecycleOwner) { value ->
        menuItem.isVisible = value
    }
}
```

Для `iOS` добавим функцию `bindToUIToolbarVisible` для связи `UIToolbar` c `LiveData<KotlinBoolean>` (на `iOS` из общего кода вместо `Boolean` приходит `KotlinBoolean`) вот как это будет выглядеть:
```
extension UIToolbar {
    func bindToUIToolbarVisible(liveData: LiveData<KotlinBoolean>) {
        liveData.addObserver { [weak self] value in
            self?.isHidden = value!.boolValue
        }
    }
}
```

Важно, в методах биндинга должна быть только привязка `liveData` к объекту `UI`, никакой логики быть не должно!
Вся логика должна быть во вьюмодели, если нужно как-то преобразовать значение `liveData`, делайте это там.

### Практическое задание

Выполните следующие действия: 
- склонируйте себе библиотеку [moko-mvvm](https://github.com/icerockdev/moko-mvvm)
- запустите `sample-app` на `Android` и `iOS`, убедитесь, что все работает (для `Android` там используется `DataBinding`, не пугайтесь)
- добавьте следующие изменения во `viewModel`:
    - `isCheckBoxVisible: LiveData<Boolean>` переменную, для контроля за `visivility` элемента `checkBox`
    - публичные функции `hideCheckBox` и `showCheckBox` - для изменения значения isCheckBoxVisible
- добавьте на `UI`: 
    - `checkBox`, свяжите его с `isCheckBoxVisible`, воспользуйтесь функцией `bindVisibleOrGone`
    - разберитесь с другими доступными для `checkBox` функциями биндинга: `bindEnabled`, `bindChecked`, `bindCheckedTwoWay` и т.д.
    - две кнопки, действиями для них станут `hideCheckBox` и `showCheckBox` соответственно
- убедитесь, что все работает

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
**Первая проблема** заключается в том, что на `iOS` не удастся использовать `Flow APIs`, потому что `Flow` - это интерфейс с дженериком, который после компиляции `Kotlin/Native` со стороны `Swift` дженерик исчезнет и будет просто протокол `Flow`.  
**Вторая проблема** - `sealed interface` нельзя использовать в `switch` на `iOS` также, как мы используем его в `when` на `Kotlin`. Чтобы использовать его в `switch` нужно чтобы он был `Enum`-ом.

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
С этим подходом нужно разобраться, потому что на многих проектах сейчас используется именно он.  
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
Мы уже рассмотрели, с какими проблемами мы столкнулись бы, если бы использовали `Flow` в общем коде.  
Разберем теперь, как можно решить эти проблемы, начнем с отстутвия типов у `Flow` на `iOS`.

Мы будем использовать классы-обертки `CFlow` и `CStateFlow` из [moko-mvvm](https://github.com/icerockdev/moko-mvvm), а также функции, позволяющие преобразовать в них `Flow` и `StateFlow`.

`CFlow` и `CStateFlow` - это те же самые `Flow` и `StateFlow`, только в виде классов. Сделаны они были для того, чтобы использовать именно классы, потому что для классов на `iOS` дженерики доступны.  
В `common`-коде мы будем использовать `CFlow` и `CStateFlow` только для `public API` соответственно, потому что в общем коде можно будет использовать обычное `Flow APIs`.   
Таким образом, мы решили первую проблему - отсутствие типов у `Flow` на `iOS`.

Теперь разберемся со второй проблемой - преобразованием `sealed interface` к `Enum` на `Swift`.

Используя плагин [moko-kswift](https://github.com/icerockdev/moko-kswift), мы можем получать автоматически генерируемые `Swift Enums`, соответствующие `sealed-interface`-ам общего кода, а после работать с ними в `switch`.  
Для более полного понимания проблемы и решения, советуем изучить [README](https://github.com/icerockdev/moko-kswift#readme) библиотеки и обязательно прочитайте [статью](https://medium.com/icerock/how-to-implement-swift-friendly-api-with-kotlin-multiplatform-mobile-e68521a63b6d), там вы узнаете весь порядок действий на примере.

## Практическое задание

Создайте следующее приложение:
- две вьюмодели
- два экрана, с кнопками для перехода друг на друга
- с первого экрана переходим на второй используя `EventsDispatcher`
- со второго экрана переходим на первый используя `Flow` и `moko-kswift`


