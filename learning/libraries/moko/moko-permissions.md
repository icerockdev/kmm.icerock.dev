---
sidebar_position: 10
---

# moko-permissions

Библиотека [moko-permissions](https://github.com/icerockdev/moko-permissions) позволяет запрашивать runtime-разрешения в общем коде для iOS и Android.

## Состав библиотеки

Библиотека состоит из базового модуля и набора модулей для конкретных разрешений:

- `permissions` — базовый модуль с `PermissionsController` и `Permission`;
- `permissions-camera` — разрешение `Permission.CAMERA`;
- `permissions-contacts` — `Permission.CONTACTS`;
- `permissions-gallery` — `Permission.GALLERY`;
- `permissions-location` — `Permission.LOCATION`, `COARSE_LOCATION`, `BACKGROUND_LOCATION`;
- `permissions-microphone` — `Permission.RECORD_AUDIO`;
- `permissions-motion` — `Permission.MOTION`;
- `permissions-notifications` — `Permission.REMOTE_NOTIFICATION`;
- `permissions-storage` — `Permission.STORAGE`, `WRITE_STORAGE`;
- `permissions-bluetooth` — `Permission.BLUETOOTH_LE`, `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT`, `BLUETOOTH_ADVERTISE`;
- `permissions-compose` — интеграция с Compose Multiplatform;
- `permissions-test` — вспомогательные утилиты для тестирования.

## Использование

### Общий код

```kotlin
class ViewModel(val permissionsController: PermissionsController) : ViewModel() {
    fun onPhotoPressed() {
        viewModelScope.launch {
            try {
                permissionsController.providePermission(Permission.GALLERY)
                // разрешение получено
            } catch (deniedAlways: DeniedAlwaysException) {
                // разрешение запрещено навсегда — только настройки
            } catch (denied: DeniedException) {
                // разрешение запрещено в текущей сессии
            }
        }
    }
}
```

### Android

```kotlin
val viewModel = ViewModel(PermissionsController())
viewModel.permissionsController.bind(activity)
```

### iOS

```swift
let viewModel = ViewModel(permissionsController: PermissionsController())
```

### Compose Multiplatform

```kotlin
@Composable
fun Sample() {
    val factory: PermissionsControllerFactory = rememberPermissionsControllerFactory()
    val controller: PermissionsController = remember(factory) {
        factory.createPermissionsController()
    }
    val coroutineScope = rememberCoroutineScope()

    Button(onClick = {
        coroutineScope.launch {
            controller.providePermission(Permission.REMOTE_NOTIFICATION)
        }
    }) {
        Text("give permissions")
    }
}
```

## Denied и DeniedAlways

Результат запроса разрешения может быть:

- `Granted` — разрешение получено;
- `Denied` — в текущей сессии не получено, можно запросить повторно. При повторном отказе переходит в `DeniedAlways`;
- `DeniedAlways` — разрешение запрещено для приложения, системный диалог больше не показывается. Переход в `Granted` возможен только через настройки приложения.

На iOS состояния только `granted` и `always denied` (аналог `DeniedAlways`).

## Дополнительные материалы

<iframe src="//www.youtube.com/embed/qDhGnTbX8XY" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
