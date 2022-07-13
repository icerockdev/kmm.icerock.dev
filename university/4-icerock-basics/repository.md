---
sidebar_position: 13
---

# Реактивный источник данных

## Проблема и решение
Почти во всех приложениях обязательно есть работа с данными, которые мы получаем от сервера, из интернета, от базы данных и т.д.  
Какие-то данные будут отображаться на одном экране приложения, какие-то на двух, а какие-то на трех и более.

Например, приложение любой социальной сети: один пост может быть репостнут разными людьми и группами. У поста есть лайки, комментарии, репосты и просмотры.  
Чтобы на всех экранах отображать данные о постах в актуальном состоянии мы можем закидывать сервер запросами, однако нет гарантии, что мы нигде не ошибемся и где-нибудь не забудем добавить обновление. Из-за этого отображение поста на разных экранах будет отличаться. В любом случае, поддерживать такой проект будет очень тяжело.  

Чтобы избежать всех этих проблем нам нужно использовать такой источник данных, который бы позволил обновлять данные автоматически, а не вручную.  
То, что нам нужно называется ***Реактивный источник данных*** - он выдает подписки, т.е. что-то, на что мы можем подписаться на `UI`. Благодаря этому, при любых обновлениях данных в источнике на экране они также обновятся.   

Как это представлено в проекте: 
- источник данных, который использует паттерн [Observer](https://ru.wikipedia.org/wiki/%D0%9D%D0%B0%D0%B1%D0%BB%D1%8E%D0%B4%D0%B0%D1%82%D0%B5%D0%BB%D1%8C_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F)), например [Flow](https://developer.android.com/kotlin/flow) или [LiveData](https://developer.android.com/topic/libraries/architecture/livedata):
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

class KeyValueStorage(private val settings: ObservableSettings) {

  val messageFlow: Flow<String?> = settings.getStringOrNullFlow(MESSAGE_KEY)
  private var messageValue: String? by settings.nullableString(MESSAGE_KEY)

  fun changeMessageValue(message: String?) {
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

В репозитории мы будем работать не напрямую с `keyValueStorage`, а используя вспомогательные функции `setMessage(message: String?)` и `getMessage()`.  

`Repository.kt`:
```kotlin
class Repository(observableSettings: ObservableSettings) {
  private val keyValueStorage = KeyValueStorage()

  fun getMessage(): Flow<String?> {
    return keyValueStorage.messageFlow
  }

  fun setMessage(message: String?) {
    keyValueStorage.changeMessageValue(message)
  }
}
```

И наконец, вьюмодель:
`ViewModel`:
```kotlin
class FirstViewModel(private val repository: Repository) : ViewModel() {

  val message: StateFlow<String?> =
    repository.getMessage().stateIn(viewModelScope, SharingStarted.Lazily, null)

  fun setMessage(message: String?) {
    repository.setMessage(message)
  }
}
```

Теперь, со стороны `UI` нам достаточно будет просто подписаться на обновления `message`, и получать актуальные значения при его изменении. Изменять `message` можно будет используя функцию `setMessage(message: String?)`.

***Этот подход используется на реальных проектах, мы будем применять его в восьмом блоке.***  
