# Состояния и события

## Состояние

Когда мы в любой момент можем узнать текущее значение какой-нибудь переменной, то это называется ***состояние***. 
Примеры: значение текстового поля, включена кнопка или нет, заголовок на экране и тд.

Состояния бывают двух видов: изменяемые [MutableLiveData](https://developer.android.com/reference/android/arch/lifecycle/MutableLiveData) / [MutableStateFlow](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-mutable-state-flow/index.html) и неизменяемые [LiveData](https://developer.android.com/reference/android/arch/lifecycle/LiveData) / [StateFlow](https://developer.android.com/kotlin/flow/stateflow-and-sharedflow)

Изменяемые состояния - это те значения, которые могут изменяться как на стороне вьюмодели, так и на стороне юзера. Например - значение текстового поля: со стороны юзера происходит ввод, а со стороны вьюмодели - валидация + автоисправление.  
Изменяемые состояния необходимо привязывать двусторонней привязкой, т.е. при изменении на UI данные меняются и во `ViewModel`, а при изменении во `ViewModel` должны измениться на `UI`.

Описывать `viewModel` нужно так, будто бы юзер будет взаимодействовать напрямую с ней. Разберем, как мы будем описывать состояния вьюмодели на примере экрана авторизации.
На UI должны быть:
- поле ввода номера телефона
- поле ввода смс-кода 
- кнопка повторной отправки смс-кода
- кнопка "Зарегистрироваться"
- текстовое поле с таймером до следующей возможности отправить смс-код
- активити-индикатор
  
Разобьем эти элементы на две группы, в зависимости от того, с каким типом состояния они будут работать - изменяемым или неизменяемым.

**Изменяемые состояния:**
- поле ввода номера телефона `val phoneNumber: MutableLiveData(String)`
- поле ввода смс-кода `val smsCode MutableLiveData(String)`

Со стороны UI `phoneNumber` и `smsCode` будут представлены как EditText. Как со стороны юзера, так и со стороны вьюмодели значения полей могут изменяться, следовательно эти состояния будут изменяемыми.

**Неизменяемые состояния:**
- кнопка повторной отправки смс-кода `val isResendButtonEnabled LiveData(Boolean)`
- кнопка "Зарегистрироваться" `lav isRegisterButtonEnabled LiveData(Boolean)`
- текстовое поле с таймером до следующей возможности отправить смс-код `val smsCodeTimer LiveData(String)`
- активити-индикатор `val isIndicatorVisible LiveData(Boolean)`

Все эти элементы работают с неизменяемыми состояниями, т.к. они изменяется только со стороны вьюмодели, юзер изменить его никак не сможет. Если значение неизменяемого состояния будет меняться после инициализации, то для изменения внутри вьюмодели создается `private MutableLiveData`, а для привязки к фрагменту используется `LiveData`, которая геттером берет изменяемую. На неизменяемые состояния нужно просто подписаться из `UI`.  

Теперь, рассмотрим как делаются двусторонняя и односторонняя привязки:  
**Совет**: используйте [Extensions](https://kotlinlang.org/docs/extensions.html) для распространенных функций привязки, чтобы использовать их во всем проекте, а не делать каждый раз вручную.
## Двусторонняя привязка:

Сделаем двустороннюю привязку для связи `EditText` и `MutableLiveData(String)`

```kotlin
fun EditText.bindTextTwoWay(liveData: MutableLiveData<String>, lifecycleOwner: LifecycleOwner){
    val textWatcher = object : TextWatcher {
      override fun afterTextChanged(s: Editable?) = Unit
      override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) = Unit
        
      override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
          liveData.value = s.toString()
      }
    }
    
    this.addTextChangedListener(textWatcher)
    
    liveData.observe(lifecycleOwner) { text ->
        //  проверка делается для того, чтобы не провоцировать рекурсию при изменении значения editText на точно такое же
        if (this.text.toString() == text) return@observe
        
        this.setText(text)
    }
}
```
Во фргаменте нужно будет просто вызвать метод: 
```kotlin
phoneNunberEditText.bindTextTwoWay(liveData = viewModel.phoneNumber, lifecycleOwner = viewLifecycleOwner)
```

## Одностороння привязка

Разберем, как делается односторонняя привязка на примере текстового поля с таймером повторной отправки смс-кода: 

```kotlin
private val _smsCodeTimer: MutableLiveData<String> = MutableLiveData("")
val smsCodeTimer: LiveData<String> get() = _smsCodeTimer
```
Создадим `extension-функцию` к `TextView`
```kotlin
fun LiveData<String>.bindToTextViewText(textView: TextView, lifecycleOwner: LifecycleOwner) {
    this.observe(lifecycleOwner) { text ->
      textView.text = text
    }
}
```

Во фрагменте просто вызываем метод:
```kotlin
viewModel.smsCodeTimer.bindToTextViewText(textView = timerTextView, lifecycleOwner = viewLifecycleOwner)
```

## Единый стейт экрана 

Еще один подход, который помогает избегать противоречивого состояния экрана представляет из себя привязку нескольких UI компонентов к одному объекту-состоянию всего экрана.

Для начала, представим что у нас есть `viewModel`, в которой есть следующие лайвдаты которые относятся к загрузке какой-нибудь страницы из интернета:
- `val loading: LiveData(Boolean)`
- `val loaded: LiveData(NewsObject)`
- `val errorText: LiveData(String)`
- `val isDataEmpty: LiveData(Boolean)`

Как нам отображать экран, если, например из-за ошибки, мы получили такие значения лайвдат:
- `loading = true`
- `loaded = {объект новости}`
- `errorText = "Какая-нибудь ошибка"`
- `isDataEmpty = true`

Значения лайвдат противоречат друг другу, потому что по нашей задуманной логике не может быть одновременно `loaded = {объект новости}` и `isDataEmpty = true`, но у нас это случилось, и придется долго искать ошибку.

Чтобы не допускать такого, переделать это можно следующим образом: 
Создать `data class State`, а во вьюмодели переменную `val state: LiveData(State)`.

```kotlin
data class State(
  val loading: Boolean,
  val loaded: NewsObject,
  val errorText: String,
  val isDataEmpty: Boolean
)
```

Однако, мы опять не застраховались от того, что где-то случайно будет создан следующий объект:  
```kotlin
State(
    loading = true,
    loaded = NewsObject(),
    errorText = "some_error_message",
    isDataEmpty = true
)
```

Наконец, правильный подход для решения этой задачи - использовать [sealed interface](https://kotlinlang.org/docs/sealed-classes.html) с вложенными `data class-ами`.
Каждый класс несет в себе те данные, которые необходимы `UI` для отображения именно этого состояния. Это обезопасит от рассинхрона, потому что данные в этот момент точно будут.

Используя такой подход, у нас никогда не будет противоречащих данных в лайвдате `state`.

```kotlin
val state: LiveData<State>
      
sealed interface State {
    object Loading : State
    data class Loaded(val news: NewsObject) : State
    data class Error(val error: String) : State
    object Empty : State
}
```

## Событие (действие)

Чаще всего, `viewModel` не информирует `UI` обо всем подряд, а только тогда, когда необходимо выполнить какое-то действие, например: перейти на другой экран, показать `alert` или `toast`.
Для реализации такого механизма, чтобы `UI` сразу же получил информацию о том, что пора что-то сделать, используется механизм [Channel](https://kotlinlang.org/docs/channels.html) и [Flow](https://developer.android.com/kotlin/flow).

Разберем пример. Со стороны вьюмодели у нас будет `Channel`, который на публично будет виден как `Flow`. Со стороны `UI` мы подпишемся к нему и будем обрабатывать события.

```kotlin
private val _actions: Channel<Action> = Channel(Channel.BUFFERED)
val actions: Flow<Action> = _actions.receiveAsFlow()
```

Подписка из `activity` в `onCreate`:
```kotlin
this.lifecycleScope.launch {
    lifecycle.repeatOnLifecycle(Lifecycle.State.STARTED) {
        viewModel.actions.collect {
            handleAction(it)
        }
    }
}
```

Подписка из `fragment` в `onViewCreated`:
```kotlin
lifecycleScope.launch {
    viewModel.actions.collect { handleAction(it) }
}
```

интерфейс `viewModel`:
```kotlin
sealed interface Action {
    data class ShowToastAction(val message: String) : Action
    object RouteSuccessAction : Action
}
```

метод `MainActivity`:
```kotlin
private fun handleAction(action: Action) {
    when (action) {
        Action.RouteSuccessAction -> routeSuccess()
        is Action.ShowToastAction -> showToast(action.message)
    }
}
```
Для отправки событий в `Channel` служат две функции [send](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-send-channel/index.html#-1166499008%2FFunctions%2F1975948010) и [trySend](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-send-channel/index.html#-1976436467%2FFunctions%2F1975948010).
```kotlin
viewModelScope.launch {
    _actions.send(State.Empty)
}

_actions.trySend(State.Empty)
```
Их отличия заключается в следующем:
- `send` засаспендится в случае невозможности добавления значения в `Channel` из-за превышения размера буфера значений. Будет висеть, пока место не освободится.
- `trySend` же возвращает `Boolean`: `true` - если добавить новое значение удалось, `false` - если не удается добавить из-за превышения объема буфера значений. Это значит что если в очереди уже есть какие-то события, которые не успел получить UI, то новое просто будет утерено. Поэтому всегда следует использовать `send`.

## Дополнительно
Для работы с событиями и состояниями у нас в компании используются возможности библиотеки [moko-mvvm](https://github.com/icerockdev/moko-mvvm). С ее помощью происходят привязки, как односторонняя, так и двусторонняя. Событиями занимается класс EventsDispatcher.
