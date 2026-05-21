---
sidebar_position: 11
---

# moko-geo

Библиотека [moko-geo](https://github.com/icerockdev/moko-geo) предоставляет возможность отслеживать геолокацию пользователя из общего кода.

## Состав библиотеки

- `geo` — базовый модуль с `LocationTracker`;
- `geo-compose` — интеграция с Compose Multiplatform.

## LocationTracker

Основной класс `LocationTracker` использует `PermissionsController` из `moko-permissions` для запроса разрешений и позволяет управлять процессом отслеживания.

### Общий код

```kotlin
class TrackerViewModel(
    val locationTracker: LocationTracker
) : ViewModel() {

    init {
        viewModelScope.launch {
            locationTracker.getLocationsFlow()
                .distinctUntilChanged()
                .collect { location ->
                    println("new location: $location")
                }
        }
    }

    fun onStartPressed() {
        viewModelScope.launch { locationTracker.startTracking() }
    }

    fun onStopPressed() {
        locationTracker.stopTracking()
    }
}
```

### Android

```kotlin
val locationTracker = LocationTracker(
    permissionsController = PermissionsController(applicationContext)
)
val viewModel = TrackerViewModel(locationTracker)

viewModel.locationTracker.bind(lifecycle, this, supportFragmentManager)
```

### Compose

```kotlin
val locationTracker = LocationTracker(
    permissionsController = PermissionsController(applicationContext)
)
val viewModel = TrackerViewModel(locationTracker)

BindLocationTrackerEffect(locationTracker = locationTracker)
```

### iOS

```swift
let viewModel = TrackerViewModel(
    locationTracker: LocationTracker(
        permissionsController: PermissionsController(),
        accuracy: kCLLocationAccuracyBest
    )
)
```
