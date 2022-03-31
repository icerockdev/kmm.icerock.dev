---
sidebar_position: 4
---

# Реактивный источник данных

## Проблема и решение
Почти во всех приложениях обязательно есть работа с данными, которые мы получаем от сервера, из интернета, от базы данных и т.д.  
Какие-то данные будут отображаться на одном экране приложения, какие-то на двух, а какие-то на трех и более.

Например, приложение любой социальной сети: один пост может быть репостнут разными людьми и группами. У поста есть лайки, комментарии, репосты и просмотры.  
Чтобы на всех экранах отображать данные о постах в актуальном состоянии мы можем закидывать сервер запросами, однако нет гарантии, что мы нигде не ошибемся и где-нибудь не забудем добавить обновление. Из-за этого отображение поста на разных экранах будет отличаться. В любом случае, поддерживать такой проект будет очень тяжело.  

Чтобы избежать всех этих проблем нам нужно использовать такой источник данных, который бы позволил обновлять данные автоматически, а не вручную.  
То, что нам нужно называется ***Реактивный источник данных*** - он выдает подписки, т.е. что-то, на что мы можем подписаться из. Благодаря этому, при любых обновлениях данных в источнике на экране они также обновятся.   

Как это представлено в проекте: 
- источник данных, который ильпользует паттерн [Observer](https://ru.wikipedia.org/wiki/%D0%9D%D0%B0%D0%B1%D0%BB%D1%8E%D0%B4%D0%B0%D1%82%D0%B5%D0%BB%D1%8C_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F)), например [Flow](https://developer.android.com/kotlin/flow) или [LiveData](https://developer.android.com/topic/libraries/architecture/livedata):
    - база данных, которая выдает `Flow`
    - репозиторий, который держит `StateFlow` или `LiveData` в оперативной памяти
    - `Socket`, который выдает `Flow`
- подписываемся на `Flow` или `LiveData` у источника данных

## Пример реализации
### Реализация источника данных

Мы будем реализовывать источник данных на основе библиотеки [multiplatform-settings](https://github.com/russhwolf/multiplatform-settings)
Она позволяет возвращать flow, [гайд](https://github.com/russhwolf/multiplatform-settings#coroutine-apis) 

Как будет выглядеть наш репозиторий в общем коде:

`Repository.kt`
```kotlin
@ExperimentalSettingsApi
class Repository(observableSettings: ObservableSettings, coroutineScope: CoroutineScope) {
  private val keyValueStorage = KeyValueStorage(observableSettings, coroutineScope)

  fun getMessage(): Flow<String?> {
    return keyValueStorage.messageFlow
  }

  fun setMessage(message: String?){
    keyValueStorage.changeMessageValue(message)
  }
}
```

`KeyValueStorage.kt`
```kotlin
@ExperimentalSettingsApi
class KeyValueStorage(private val settings: ObservableSettings, coroutineScope: CoroutineScope) {
  
  val messageFlow: Flow<String?> = settings.getStringOrNullFlow("message")
  private var messageValue by settings.nullableString("message")

  fun changeMessageValue(message: String?){
    this.messageValue = message
  }

  fun resetData() {
    settings.clear()
  }
}
```

Нам понадобятся две переменные `messageFlow` и `messageValue`, чтобы направить все общение UI на flow - messageValue сделаем приватной и установим функцию-сеттер

flow мы преобразуем в stateFlow и подпишемся, а value нам нужно для сохранения данных в этот flow, из-за того, что преобразовать flow в MutableStateFlow довольно проблематично, оставим пока так.  

Для простоты, создадим репозиторий в `MainActivity` (т.к. mainActivity будет жить, пока пересоздаются фрагменты, -> репозиторий тоже останется )
```kotlin
val repository: Repository by lazy {
  val sharedPrefs = this.getSharedPreferences("app", Context.MODE_PRIVATE)
  val settings = AndroidSettings(sharedPrefs)
  Repository(settings, MainScope())
}
```

Получать репозиторий во фрагментах будем следующийм образом:
```kotlin
val mainActivity: MainActivity = parentFragment?.activity as MainActivity
val repository = mainActivity.repository
```

Далее, создадим два фрагмента, добавим в каждый следующие элементы: 
  - editText - для обновления значения во флоу 
  - textView - для отображения занчения из flow,  чтобы увидеть реактивность
  - кнопка для перехода на другой фрагмент, перед переходом будет происходить обновление значения во flow
  - кнопка, по которой покажется текущее значение из флоу

объект flow во фрагменте
```kotlin
val messageStateFlow: StateFlow<String?> = repository.getMessage().stateIn(lifecycleScope, SharingStarted.Eagerly, null)
```

Подписка на флоу во фрагменте, теперь текствью отобразит флоу, когда он изменится без каких-либо действий
```kotlin
lifecycleScope.launch {
  messageStateFlow.collect {
    titleVew.text = it
  }
}
```

Действие по кнопке перехода: 
- берем текст из эдиттекста
- изменяем текущее значение flow
- переходим на другой фрагмент

```kotlin
routeButton.setOnClickListener {
  val text = editText.editableText.toString()
  repository.setMessage(text)

  findNavController().navigate(R.id.action_firstFragment_to_secondFragment)
}
```

Кнопка вывода текущего значения, чтобы точно удостовериться, что там лежит
```kotlin
toastButton.setOnClickListener {
  Toast.makeText(
    requireContext(),
    messageStateFlow.value,
    Toast.LENGTH_SHORT
  ).show()
}
```

Таким образом textview на обоих фрагментах будут реактивно обновляться при изменении значения flow, можете добавить еще по кнопке - для перехода между фрагментами без изменения flow, посмотрим на  

### Как подписаться на Flow

***
ПЕРЕПИСАТЬ
***

Итак, теперь мы получаем от таблицы не просто объект `Ship`, а `Flow`, на который можем подписаться из `viewModel`:

Вариант подписки, используя `StateFlow`:
```kotlin
val currentShip: StateFlow<Ship?> = repository.getShipById(id).stateIn(viewModelScope, SharingStarted.Eagerly, null )
```

Вариант подписки, используя `LiveData`:
```kotlin
val currentShip: LiveData<Ship?> = repository.getShipById(id).asLiveData(viewModelScope, initialValue = null)
```

Теперь, если данные в таблице изменятся, то все методы, у которых изменилось возвращаемые значение, вызовутся еще раз. Все места в приложении, где используются данные из этого запроса, обновятся. Нигде не придется ничего вызывать и обновлять вручную. Данные изменились - `UI` сразу обновится.  

Например: в источнике данных обновился `rating` корабля с идентификатором `id` - он автоматически обновится на всех экранах, где мы его отображаем, потому что результат `repository.getShipById(id)` - это `Flow`, а мы на него подписались.

## Практическое задание
***
ПЕРЕПИСАТЬ
***

Сделайте приложение, которое содержит: 
- Реактивный репозиторий
- Источник данных для репозитория - база данных [SQLDelight](https://cashapp.github.io/sqldelight/)
- Экран со списком элементов, и двумя кнопками
    - данные для списка реактивно тянутся от репозитория
    - по нажатию на первую кнопку в БД добавляется еще один элемент списка
    - по нажатию на вторую кнопку БД очищается
