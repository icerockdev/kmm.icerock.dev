---
sidebar_position: 3
---

# Compose и moko-mvvm

Библиотеки из экосистемы MOKO предоставляют готовые решения для совместной работы с Compose Multiplatform.

## StateFlow и collectAsState

Данные из `ViewModel` (StateFlow) преобразуются в Compose-состояние через `collectAsState()`:

```kotlin
@Composable
fun UserScreen(viewModel: UserViewModel) {
    val user by viewModel.user.collectAsState()

    Text("Hello, ${user.name}")
}
```

## moko-mvvm с Compose

`ViewModel` из moko-mvvm не требует специальных адаптеров — достаточно `collectAsState()` для `StateFlow` и `collectAsMutableState()` для двустороннего биндинга:

```kotlin
val (code, onCodeChange) = viewModel.code.data.collectAsMutableState()

AuthCodeContent(
    code = code,
    onCodeChange = onCodeChange,
    codeError = viewModel.code.error.collectAsState().value?.localized()
)
```

## BindEffect

Для привязки контроллеров к жизненному циклу Compose используйте `BindEffect`:

```kotlin
@Composable
fun Sample(viewModel: PermissionsViewModel) {
    BindEffect(viewModel.permissionsController)
    // ...
}
```

Поддерживается для:
- `PermissionsController` из `moko-permissions`;
- `MediaPickerController` из `moko-media`;
- `LocationTracker` из `moko-geo`;

## remember-фабрики

Для создания экземпляров контроллеров внутри `@Composable` используются фабрики:

```kotlin
@Composable
fun Sample() {
    val factory = rememberMediaPickerControllerFactory()
    val picker = remember(factory) { factory.createMediaPickerController() }

    BindMediaPickerEffect(picker)
}
```

Доступные фабрики:
- `rememberPermissionsControllerFactory()` — из `moko-permissions-compose`;
- `rememberMediaPickerControllerFactory()` — из `moko-media-compose`;
- `PermissionsControllerFactory` — для кастомной конфигурации.

## Дополнительная информация

- [moko-mvvm](https://github.com/icerockdev/moko-mvvm)
- [moko-permissions](https://github.com/icerockdev/moko-permissions)
- [moko-media](https://github.com/icerockdev/moko-media)
