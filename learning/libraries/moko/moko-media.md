---
sidebar_position: 12
---

# moko-media

Библиотека [moko-media](https://github.com/icerockdev/moko-media) позволяет работать с медиафайлами в общем коде: получать фото из галереи или с камеры, управлять видеоплеером.

## Состав библиотеки

- `media` — базовый модуль с `MediaPickerController`;
- `media-compose` — интеграция с Compose Multiplatform;
- `media-test` — утилиты для тестирования.

## MediaPickerController

Основной класс для получения изображений. Использует `PermissionsController` из `moko-permissions`.

### Общий код

```kotlin
class ViewModel(val mediaController: MediaPickerController) : ViewModel() {
    fun onSelectPhotoPressed() {
        viewModelScope.launch {
            try {
                val bitmap = mediaController.pickImage(MediaSource.CAMERA)
                // фото получено
            } catch (_: CanceledException) {
                // пользователь отменил
            } catch (error: Throwable) {
                // нет разрешения или ошибка чтения
            }
        }
    }
}
```

### Android

```kotlin
val permissionsController = PermissionsController()
val mediaController = MediaPickerController(permissionsController)
val viewModel = ViewModel(mediaController)

viewModel.mediaController.bind(lifecycle, supportFragmentManager)
```

### iOS

```swift
let permissionsController = PermissionsController()
let mediaController = MediaPickerController(
    permissionsController: permissionsController,
    viewController: self
)
let viewModel = ViewModel(mediaController: mediaController)
```

### Compose Multiplatform

```kotlin
@Composable
fun Sample() {
    val factory = rememberMediaPickerControllerFactory()
    val picker = remember(factory) { factory.createMediaPickerController() }
    val coroutineScope = rememberCoroutineScope()

    BindMediaPickerEffect(picker)

    Button(onClick = {
        coroutineScope.launch {
            val result = picker.pickImage(MediaSource.GALLERY)
            // используем результат
        }
    }) {
        Text("Выбрать фото")
    }
}
```
