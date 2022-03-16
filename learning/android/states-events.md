# Состояния и события

## Состояние

написать про единый стейт экрана, про то как его проектировать


Когда мы в любой момент можем узнать текущее значение какой-нибудь переменной, то это называется ***состояние***. 
Примеры: значение текстового поля, включена кнопка или нет, заголовок на экране и тд.

Состояния бывают двух видов: изменяемые [MutableLiveData](https://developer.android.com/reference/android/arch/lifecycle/MutableLiveData) / [MutableStateFlow](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-mutable-state-flow/index.html) и неизменяемые [LiveData](https://developer.android.com/reference/android/arch/lifecycle/LiveData) / [StateFlow](https://developer.android.com/kotlin/flow/stateflow-and-sharedflow)

Изменяемые состояния - это те значения, которые могут изменяться как на стороне вьюмодели, так и на стороне юзера. Например - значение текстового поля: со стороны юзера происходит ввод, а со стороны вьюмодели - валидация + автоисправление.  
Изменяемые состояния необходимо привязывать двусторонней привязкой, т.е. при изменении на UI данные меняются и во `ViewModel`, а при изменении во `ViewModel` должны измениться на `UI`.

Разберем, как мы будем описывать состояния вьюмодели на примере экрана авторизации. Описывать `viewModel` нужно так, будто бы юзер будет взаимодействовать напрямую с ней:
- Поля ввода `phoneNumber` / `smsCode`. Как со стороны юзера, так и со стороны вьюмодели значения полей могут изменяться, следовательно эти состояния будут изменяемыми. Например, `phoneNumber` во `viewModel` будет представлен как:
  
  показать отдельно про двустороннюю и одностороннюю
  
  ```kotlin
  val phoneNumber: MutableLiveData<String> = MutableLiveData("")
  ```
  Изменяемые состояния нужно привязывать к UI двусторонней привязкой. Делается это для того, чтобы при изменении со стороны вьюмодели данные обновлялись на UI и наоборот.  
  Пример реализации двусторонней привязки:
  ```kotlin
  private val textWatcher = object : TextWatcher {
      override fun afterTextChanged(s: Editable?) {
      }
      override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
      }
      override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
          authViewModel.phoneNumber.value = s
      }
  }
  
  binding.phoneNumberEditTest.addTextChangedListener(textWatcher)
  ```

делайте экстреншены

- Таймер повторной отправки смс-кода. Значение поля изменяется только со стороны вьюмодели, юзер изменить его никак не сможет, следовательно - состояние неизменяемое. Если значение неизменяемого состояния будет меняться после инициализации, то для изменения внутри вьюмодели создается `private MutableLivedata`, а для привязки к фрагменту используется Livedata, которая геттером берет изменяемую. На неизменяемые состояния нужно просто подписаться из UI.  
  ```kotlin
  private val _smsCodeTimer: MutableLiveData<String> = MutableLiveData("")
  val smsCodeTimer: LiveData<Boolean> get() = _smsCodeTimer
  ```
  Пример реализации односторонней привязки:
  ```kotlin
  authViewModel.smsCodeTimer.observe(viewLifecycleOwner, Observer { smsCodeTimer ->
     binding.smsCodeTimerLabel.text = smsCodeTimer
  })
  ```

## Событие

Событие - это нечто, что срабатывает в определенный момент, выполняет свою работу и завершается. Текущего значения у события нет. Мы можем только подписаться на получение событий, чтобы обработать событие когда оно произойдет.
Примеры событий: переход на другой экран, показ алерта или тоста,

Для событий во вьюмодели используется Flow.

## Дополнительно
Для работы с событиями и состояниями у нас в компании используются возможности библиотеки [moko-mvvm](https://github.com/icerockdev/moko-mvvm). С ее помощью проиходят привязки, как односторонняя, так и двусторонняя. Событиями занимается класс EventsDispatcher.