# Состояния и события

## Состояние

Когда мы в любой момент можем узнать текущее значение какой-нибудь переменной, то это называется ***состояние***. 
Примеры: значение текстового поля, включена кнопка или нет, заголовок на экране и тд.

Состояния бывают двух видов: изменяемые [MutableLiveData](https://developer.android.com/reference/android/arch/lifecycle/MutableLiveData) / [MutableStateFlow](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-mutable-state-flow/index.html) и неизменяемые [LiveData](https://developer.android.com/reference/android/arch/lifecycle/LiveData) / [StateFlow](https://developer.android.com/kotlin/flow/stateflow-and-sharedflow)

Изменяемые состояния - это те значения, которые могут изменяться как на стороне вьюмодели, так и на стороне юзера. Например - значение текстового поля: со стороны юзера происходит ввод, а со стороны вьюмодели - валидация + автоисправление.  
Изменяемые состояния необходимо привязывать двусторонней привязкой, т.е. при изменении на UI данные меняются и во `ViewModel`, а при изменении во `ViewModel` должны измениться на `UI`.

Описывать `viewModel` нужно так, будто бы юзер будет взаимодействовать напрямую с ней. Разберем, как мы будем описывать состояния вьюмодели на примере экрана авторизации.
На UI должны быть поля ввода номера телефона и смс кода, кнопка повторной отправки смс-кода, кнопка "Зарегистрироваться" текстовое поле с таймером до следующей возможности отправить смс-код и прогрессбар. Разобьем эти элементы на дву группы, в зависимости от того, с каким типом состояния они будут работать - изменяемым или неизменяемым.

- Поля ввода `phoneNumber` / `smsCode`. Со стороный UI будут представленны как EditText. Как со стороны юзера, так и со стороны вьюмодели значения полей могут изменяться, следовательно эти состояния будут изменяемыми.

Разберем, как делается двусторонняя привязки:  

**Совет**: используйте [Extensions](https://kotlinlang.org/docs/extensions.html) для распространенных функций привязки, чтобы использовать их во всем проекте, а не делать каждый раз вручную.
## Привязка со стороны лайвдаты к значению на UI
Привязка лайвдаты к значению editText, чтобы при изменнии текста менялась лайвдата:
  ```kotlin
  fun EditText.bindTextTwoWay(liveData: MutableLiveData<String>, lifecycleOwner: LifecycleOwner){
      val textWatcher = object : TextWatcher {
          override fun afterTextChanged(s: Editable?) {
          }
          override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
          }
          override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
              val str = s.toString()

              //  проверка делается для того, чтобы не провоцировать рекурсию при изменении значения лайвдаты на точно такое же 
              if (str == liveData.value) return
              liveData.value = str
          }
      }
  
      this.addTextChangedListener(textWatcher)

      liveData.observe(lifecycleOwner) { text ->
        this.setText(text)
      }
  }
  ```

## Привязка со стороны UI к значению лайвдаты

- Таймер повторной отправки смс-кода, `enabled` для кнопок "Зарегистрироваться", "Отправить код повторно" и показа прогрссаба. Все эти элементы работают с неизменяемыми состояниями, т.к. они изменяется только со стороны вьюмодели, юзер изменить его никак не сможет. Если значение неизменяемого состояния будет меняться после инициализации, то для изменения внутри вьюмодели создается `private MutableLivedata`, а для привязки к фрагменту используется Livedata, которая геттером берет изменяемую. На неизменяемые состояния нужно просто подписаться из UI.  

Разберем, как делается односторонняя привязка на примере текстового поля с таймером повторной отправки смс-кода: 

  ```kotlin
  private val _smsCodeTimer: MutableLiveData<String> = MutableLiveData("")
  val smsCodeTimer: LiveData<String> get() = _smsCodeTimer
  ```
  Создадим extension-функцию к TextView
  ```kotlin
  fun LiveData<String>.bindToTextViewText(textView: TextView, lifecycleOwner: LifecycleOwner) {
    this.observe(lifecycleOwner) { text ->
      textView.text = text
    }
  }


  Привязка EditText к лайвдате, при изменении лайвдаты изменится значение EditText
  ```kotlin
  fun MutableLiveData<String>.bindToEditText(editText: EditText, lifecycleOwner: LifecycleOwner) {
    this.observe(lifecycleOwner) { text ->
      editText.setText(text)
    }
  }
  ```

  Теперь, если в проекте где-то еще потребуется связать EditText c лайвдатой можно будет использовать эти функции

  ```
  

## Единый стейт экрана 

Еще один подход, который помогает (... дописать) представляет из себя привязку нескольких UI компонентов к одному объекту-состоянию всего экрана.
Этот объект представляет из себя sealed interface с вложенными data class-ами, каждый класс несет в себе те данные, которые необходимы UI для отображения именно этого состояния. Это обезопасит от рассинхрона, потому что данные в этот момент точно будут

```kotlin
val state: LiveData<State>
      
sealed interface State {
    object Loading : State
    data class Loaded(val repos: List<Repo>) : State
    data class Error(val error: String) : State
    object Empty : State
}
```

## Событие

Событие - это нечто, что срабатывает в определенный момент, выполняет свою работу и завершается. Текущего значения у события нет. Мы можем только подписаться на получение событий, чтобы обработать событие когда оно произойдет.
События нам нужны для того, чтобы сделать что-то на UI, что нельзя сделать из общего кода, например: перейти на другой экран, показать alert или toast.

 val events: Flow<EventState> = flow {}

viewLifecycleOwner.lifecycleScope.launchWhenStarted {
    viewModel.events.collect { event ->
        doEvent(event)
    }
}


sealed interface EventState {
  object ShowToast : EventState
  object RouteSuccess : EventState
}


private fun doEvent(event: EventState){
  switch (event){
    case ShowToast: {
      ...
    }
    case RouteSuccess: {
      ...
    }
  }
}

Для событий во вьюмодели используется Flow.

## Дополнительно
Для работы с событиями и состояниями у нас в компании используются возможности библиотеки [moko-mvvm](https://github.com/icerockdev/moko-mvvm). С ее помощью происходят привязки, как односторонняя, так и двусторонняя. Событиями занимается класс EventsDispatcher.