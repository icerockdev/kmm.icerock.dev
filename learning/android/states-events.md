# Состояния и события

## Состояние

Когда мы можем у чего-то узнать его текущее значение, то это - состояние. Состояния мы можем узнать в любой момент. 
Примеры: значение текстового поля, включена кнопка или нет, заголовок на экране и тд.

Состояния бывают двух видов: изменяемые (MutableLiveData/MutableStateFlow) и неизменяемые (LiveData/StateFlow).

- Как выбрать, какого типа должно быть состояние?  
Те данные, которые может изменять юзер - Mutable, остальные - Immutable.
  
Изменяемые состояния это те, которые могут изменяться как на стороне вьюмодели, так и на стороне юзера, например, значение текстового поля (со стороны юзера происходит ввод, а со стороны вьюмодели - валидация + автоисправление)
Изменяемые состояния необходимо привязывать двусторонней привязкой, т.е. при изменении на UI данные меняются и во ViewModel, а при изменении во ViewModel должны измениться на UI.

Разберем на примере экрана авторизации, как мы будем описывать состояния viewModel:

Описывать viewModel нужно так, будто бы юзер будет взаимодействовать напрямую с ней:

юзер может менять значения полей ввода (логин/пароль) -> например, пароль во viewModel будет представлен как:
```kotlin
val password: MutableLiveData<String> = MutableLiveData("")
```

- [Биндинг к лайвдате](https://developer.android.com/topic/libraries/data-binding/architecture)  

Привязка поля пароля к LiveData во вьюмодели:
```kotlin
authViewModel.password.observe(viewLifecycleOwner, Observer { password ->
   binding.passwordLabel.text = password
})
```

- [Двусторонняя привязка](https://developer.android.com/topic/libraries/data-binding/two-way#samples)  

При изменении текста в поле пароля автоматичеки будет обновляться и лайвдата:
```kotlin
private val textWatcher = object : TextWatcher {
    override fun afterTextChanged(s: Editable?) {
    }
    override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
    }
    override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
        authViewModel.password.value = s
    }
}

binding.passwordLabel.addTextChangedListener(textWatcher)
```

Может в любой момент времени узнать, enabled ли кнопка "войти", показан ли `progressBar` - Все это: значения полей, enabled/disabled, `progressBar` - состояния. 
поля ввода - не только можно видеть, но и менять, значит это MutableLiveData(String) и она привяжется к UI двусторонней привязкой.

## Событие

Событие - это нечто, что срабатывает в определенный момент, выполняет свою работу и завершается. Текущего значения у события нет. Мы можем только подписаться на получение событий, чтобы обработать событие когда оно произойдет.
Примеры событий: переход на другой экран, показ алерта или тоста,

Для событий во вьюмодели используется Flow.

## Дополнительно
Для работы с событиями и состояниями у нас в компании используются возможности библиотеки [moko-mvvm](https://github.com/icerockdev/moko-mvvm). С ее помощью проиходят привязки, как односторонняя, так и двусторонняя. Событиями занимается класс EventsDispatcher.