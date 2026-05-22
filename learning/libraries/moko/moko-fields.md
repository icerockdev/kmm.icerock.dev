---
sidebar_position: 6
---

# moko-fields

Библиотека [moko-fields](https://github.com/icerockdev/moko-fields) позволяет реализовывать формы ввода, а также их валидацию в общем коде.  
<iframe src="//www.youtube.com/embed/a9RnGvYS4sY" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
<br/>

<iframe src="//www.youtube.com/embed/WXBbbF5pKho?list=PL6yFiPOVXVUi90sQ66dtmuXP-1-TeHwl5" frameborder="0" allowfullscreen width="675" height="380"></iframe>


## Состав библиотеки

Библиотека состоит из нескольких модулей:
- `fields-core` — базовые классы и логика валидации
- `fields-livedata` — интеграция с `LiveData` из moko-mvvm
- `fields-flow` — интеграция с `Flow` из kotlinx.coroutines
- `fields-material` — Android View компоненты с Material Design

## FormField

Потребность в библиотеке возникла из-за того, что для создания логики формы ввода в общем коде необходимы следующие элементы:
- `LiveData/StateFlow(String)` - текст поля
- `LiveData/StateFlow(Bool)` - валидно/невалидно поле 
- `LiveData/StateFlow(String)` - текст ошибки валидации

А представьте, что у вас 7 или 8 таких полей, получится много однотипного кода, в котором легко будет запутаться и допустить ошибку.

Библиотека позволяет использовать специальный класс `FormField` для форм ввода, который включает в себя все эти три лайвдаты/стейт флоу.

Для создания `FormField` необходимо только установить тип и задать валидацию для этого значения. Тип поля не обязательно должен быть `String`, подойдет любой, который можно как-то установить: `int`, `bitmap`, `data` и тд.

Для Jetpack Compose и Compose Multiplatform двусторонная связка для передачи значения введенного текста поля в View Model не работает, необходимо реализовывать на UI TextField c onValueChange.<br/>
В коде экрана:

```kotlin
val (code, onCodeChange) = viewModel.code.data.collectAsMutableState()

AuthCodeContent(
    code = code,
    onCodeChange = onCodeChange,
    codeError = viewModel.code.error.collectAsState().value?.localized(),
    ...
)
```

В контенте экрана:

```kotlin
@Composable
fun AuthCodeContent(
    code: String,
    onCodeChange: (String) -> Unit,
    codeError: String?,
    ...
) {
    ...
    BasicTextField(
        ...
        value = code,
        onValueChange = { newValue ->
            onCodeChange(newValue)
        },
        isError = codeError !=null
    )
    ...
}
```

## Валидация

Разберем, как добавлять валидацию в `FormField`:
- можно использовать [встроенные валидаторы](https://github.com/icerockdev/moko-fields/tree/master/fields-core/src/commonMain/kotlin/dev/icerock/moko/fields/core/validations)
- можно создать полностью свою валидацию

Как можно настроить валидацию:
- валидацию можно вызвать в любой момент
    - Зачем? Чтобы поведение было таким: при первом вводе юзера - валидация не должна проверяться, пока он не закончит ввод до конца и не нажмет кнопку, к которой будет привязана валидация, чтобы, пока он еще не ввел все, что задумал, у него не светились ошибки.
- поля можно объединить в список и валидировать их одновременно:
  ```kotlin
  private val fields = listOf(emailField, passwordField)
  
  fun onSubmit() {
      if (!fields.validate()) return
      // данные валидны
  }
  ```
- валидация полей может быть завязана на других полях (пароль + повторите пароль)
- у FormField есть поле `isValid` и `validationError`

## Использование с Flow

Для работы с корутинами используйте модуль `fields-flow`.

`FormField` создаётся с указанием `CoroutineScope`:

```kotlin
val emailField: FormField<String, StringDesc> = FormField(
    scope = viewModelScope,
    initialValue = "",
    validation = flowBlock { email ->
        ValidationResult.of(email) {
            notBlank("Email не может быть пустым".desc())
            matchRegex("Неверный формат".desc(), EMAIL_REGEX)
        }
    }
)
```

Валидация строится через `ValidationResult` — цепочкой:

```kotlin
ValidationResult.of(value)
    .notBlank("Поле не может быть пустым".desc())
    .matchRegex("Неверный формат".desc(), SOME_REGEX)
    .validate()
```

Или через DSL, как в примере выше.

В UI данные доступны через `StateFlow`:

```kotlin
val email: String by viewModel.emailField.data.collectAsState()

TextField(
    value = email,
    onValueChange = { viewModel.emailField.data.value = it }
)
```
