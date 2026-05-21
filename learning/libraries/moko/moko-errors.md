---
sidebar_position: 7
---

# moko-errors

Библиотека [moko-errors](https://github.com/icerockdev/moko-errors) позволяет обрабатывать и показывать ошибки на экране из общего кода.

## ExceptionMappersStorage

`ExceptionMappersStorage` — синглтон, хранящий набор конвертеров исключений в классы ошибок, требуемые `ErrorPresenter`.

Регистрация простого маппера:

```kotlin
ExceptionMappersStorage
    .register<IllegalArgumentException, StringDesc> {
        "Был передан недопустимый аргумент!".desc()
    }
    .register<HttpException, Int> {
        it.code
    }
```

Регистрация маппера с условием:

```kotlin
ExceptionMappersStorage.condition<StringDesc>(
    condition = { it is CustomException && it.code == 10 },
    mapper = { "Произошла кастомная ошибка!".desc() }
)
```

Для каждого типа ошибки (кроме `StringDesc`, у которого уже есть значение по умолчанию) необходимо задать fallback-значение через `setFallbackValue`:

```kotlin
ExceptionMappersStorage
    .setFallbackValue<Int>(520)

val throwableToIntMapper: (Throwable) -> Int =
    ExceptionMappersStorage.throwableMapper()
```

Регистрацию можно выстраивать в цепочку:

```kotlin
ExceptionMappersStorage
    .condition<StringDesc>(
        condition = { it is CustomException && it.code == 10 },
        mapper = { "Произошла кастомная ошибка!".desc() }
    )
    .register<IllegalArgumentException, StringDesc> {
        "Был передан недопустимый аргумент!".desc()
    }
    .register<HttpException, Int> {
        it.code
    }
    .setFallbackValue<Int>(520)
```

## ExceptionHandler

`ExceptionHandler` реализует безопасное выполнение кода и автоматическое отображение ошибок через `ErrorPresenter`.

Объявление в ViewModel:

```kotlin
class SimpleViewModel(
    val exceptionHandler: ExceptionHandler
) : ViewModel()
```

Привязка на платформе.

На Android в Activity или Fragment:

```kotlin
viewModel.exceptionHandler.bind(
    lifecycleOwner = this,
    activity = this
)
```

На iOS в ViewController:

```swift
viewModel.exceptionHandler.bind(viewController: self)
```

Создание экземпляра `ExceptionHandler`:

```kotlin
val exceptionHandler = ExceptionHandler<StringDesc>(
    errorPresenter = errorPresenter,
    exceptionMapper = ExceptionMappersStorage.throwableMapper(),
    onCatch = { println("Поймано исключение: $it") }
)
```

Использование в ViewModel:

```kotlin
fun onSendRequest() {
    viewModelScope.launch {
        exceptionHandler.handle {
            serverRequest()
        }.finally {
            // код после выполнения
        }.execute()
    }
}
```

Можно добавлять кастомные `catch`-обработчики:

```kotlin
fun onSendRequest() {
    viewModelScope.launch {
        exceptionHandler.handle {
            serverRequest()
        }.catch<IllegalArgumentException> {
            // кастомная обработка
            false // true — отменяет показ ошибки; false — позволяет ErrorPresenter показать ошибку
        }.execute()
    }
}
```

## ErrorPresenter

Набор реализаций `ErrorPresenter`, определяющих способ отображения ошибки на платформе:

- `AlertErrorPresenter` — показывает ошибку в alert-диалоге;
- `ToastErrorPresenter` — показывает ошибку в toast на Android (на iOS — alert-диалог);
- `SnackBarErrorPresenter` — показывает ошибку в snackbar на Android (на iOS — alert-диалог);
- `SelectorErrorPresenter` — выбирает презентер по условию.

Создание презентеров в общем коде:

```kotlin
val alertErrorPresenter = AlertErrorPresenter(
    alertTitle = "Ошибка".desc(),
    positiveButtonText = "OK".desc()
)
val toastErrorPresenter = ToastErrorPresenter(
    duration = ToastDuration.LONG
)
```

`SelectorErrorPresenter` позволяет выбрать способ показа в зависимости от типа исключения:

```kotlin
val selectorErrorPresenter = SelectorErrorPresenter { throwable ->
    when (throwable) {
        is CustomException -> alertErrorPresenter
        else -> toastErrorPresenter
    }
}

val exceptionHandler = ExceptionHandler(
    errorPresenter = selectorErrorPresenter,
    exceptionMapper = ExceptionMappersStorage.throwableMapper()
)
```

## Дополнительные материалы

<iframe src="//www.youtube.com/embed/scvtK62zqz8" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
<br/>

<iframe src="//www.youtube.com/embed/_jBNZxoIqm4" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
