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

### Common code

В этом примере источником данных нам будет служить хранилище устройства, а средствами библиотеки [multiplatform-settings](https://github.com/russhwolf/multiplatform-settings) мы будем получать не просто значение по ключу, а `Flow` и подписываться на него.
[Инструкция](https://github.com/russhwolf/multiplatform-settings#coroutine-apis) по подключению `multiplatform-settings-coroutines`.

Начнем с класса `KeyValueStorage`, к которому будем обращаться через объект репозитория.   

`KeyValueStorage.kt`:
```kotlin
private const val MESSAGE_KEY = "message_key"

@ExperimentalSettingsApi
class KeyValueStorage(private val settings: ObservableSettings, coroutineScope: CoroutineScope) {

  val messageFlow: Flow<String?> = settings.getStringOrNullFlow(MESSAGE_KEY)
  private var messageValue by settings.nullableString(MESSAGE_KEY)

  fun changeMessageValue(message: String?){
    this.messageValue = message
  }

  fun resetData() {
    settings.clear()
  }
}
```

Нам понадобятся:
  - `MESSAGE_KEY` - константа-ключ, чтобы не хардкодить его
  - `messageFlow` - `Flow` значения по ключу `MESSAGE_KEY`, на который мы будем подписываться
  - `messageValue` - приватная переменная, с помощью которой мы сможем задать значение переменной по ключу `MESSAGE_KEY`
  - `changeMessageValue(message: String?)` - функция-сеттер для `messageValue` 
  - `resetData()` - функция для очистки значений всех сохраненных переменных

На `UI` мы преобразуем `messageFlow` в `StateFlow`, чтобы заработал его функционал с доступом к последнему значению по переменной `value`.  
`messageValue` мы используем из-за того, что в библиотеке `multiplatform-settings` нет возможности получить `MutableStateFlow`, а нам нужна возможность изменять значение, чтобы увидеть реактивность нашего репозитория. Преобразовать `Flow` в `MutableStateFlow` довольно проблематично, поэтому оставим пока так.

Как будет выглядеть репозиторий:
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

Все просто, работать мы будем не напрямую с `keyValueStorage`, а используя вспомогательные функции `setMessage(message: String?)` и `getMessage()`.

### Android

Наше приложение будет выглядеть следующим образом:
  - `MainActivity` - для создания и инициализации графа навигации и репозитория
  - два фрагмента, которые содержат элементы:
    - `EditText` - для обновления значения во флоу
    - `TextView` - для отображения значения из `Flow`
    - кнопка для перехода на другой фрагмент, перед переходом будет происходить обновление значения во `Flow`

`StateFlow` во фрагменте:
```kotlin
val messageStateFlow: StateFlow<String?> = repository.getMessage().stateIn(lifecycleScope, SharingStarted.Eagerly, null)
```

Подписка на флоу во фрагменте, теперь в `TextView` всегда будет отображаться актуальное значение:
```kotlin
lifecycleScope.launch {
  messageStateFlow.collect {
    titleVew.text = it
  }
}
```

Действие по кнопке перехода с одного фрагмента на другой:
```kotlin
routeButton.setOnClickListener {
  val text = editText.editableText.toString()
  repository.setMessage(text)

  findNavController().navigate(R.id.action_firstFragment_to_secondFragment)
}
```
Изменяем текущее значение во `Flow` на то, что ввели в `EditText` и переходим на другой фрагмент.
Таким образом `TextView` на обоих фрагментах будут реактивно обновляться при изменении значения `Flow`. Можете добавить еще по кнопке - для перехода между фрагментами без изменения `Flow`, чтобы убедиться в этом :)

### iOS
***Дописать***

## Практическое задание
Повторите пример с двумя репозиториями и реактивным репозиторием, работающем с `multiplatform-settings`.