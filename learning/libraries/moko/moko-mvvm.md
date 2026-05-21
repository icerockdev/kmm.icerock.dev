---
sidebar_position: 3
---

# moko-mvvm

Библиотека [moko-mvvm](https://github.com/icerockdev/moko-mvvm) предоставляет архитектурные компоненты Model-View-ViewModel для Kotlin Multiplatform. ViewModel работает в общем коде, на Android обеспечивается lifecycle-aware поведение через интеграцию с `androidx.lifecycle`.

## Возможности

- **ViewModel** — хранение и управление UI и данными с `viewModelScope` (CoroutineScope, отменяемый в `onCleared`)
- **LiveData / Flow** — реактивные обёртки с операторами (`map`, `merge`, `combine`, `all`)
- **EventsDispatcher** — отправка одноразовых событий из ViewModel во View с контролем lifecycle (устаревший подход)
- **CFlow / CStateFlow / CMutableStateFlow** — обёртки над корутинными Flow, совместимые со Swift
- **ResourceState** — sealed class для состояний: `Loading`, `Success`, `Empty`, `Failed`
- **Compose Multiplatform / SwiftUI** — готовая интеграция

## Требования

- Android API 16+
- iOS 11.0+
- Gradle 6.8+

## Подключение

```kotlin
// shared/build.gradle.kts
dependencies {
    commonMainApi("dev.icerock.moko:mvvm-core:0.16.1")
    commonMainApi("dev.icerock.moko:mvvm-flow:0.16.1")
    commonMainApi("dev.icerock.moko:mvvm-state:0.16.1")

    // Compose Multiplatform
    commonMainApi("dev.icerock.moko:mvvm-compose:0.16.1")
    commonMainApi("dev.icerock.moko:mvvm-flow-compose:0.16.1")

    commonTestImplementation("dev.icerock.moko:mvvm-test:0.16.1")
}
```

Экспорт в iOS framework:

```kotlin
kotlin {
    targets.withType(KotlinNativeTarget::class.java).all {
        binaries.withType(Framework::class.java).all {
            export("dev.icerock.moko:mvvm-core:0.16.1")
            export("dev.icerock.moko:mvvm-flow:0.16.1")
        }
    }
}
```

## Simple ViewModel — счётчик на CStateFlow

```kotlin
// commonMain
class SimpleViewModel : ViewModel() {
    private val _counter = MutableStateFlow(0)
    val counter: CStateFlow<String> =
        _counter.map { it.toString() }
            .stateIn(viewModelScope, SharingStarted.Lazily, "0")
            .cStateFlow()

    fun onCounterButtonPressed() {
        _counter.value++
    }
}
```

**Compose:**

```kotlin
@Composable
fun CounterScreen(
    viewModel: SimpleViewModel = getViewModel(
        factory = createViewModelFactory { SimpleViewModel() }
    )
) {
    val counter: String by viewModel.counter.collectAsState()

    Column {
        Text(text = counter)
        Button(onClick = { viewModel.onCounterButtonPressed() }) {
            Text("Press me")
        }
    }
}
```

**SwiftUI:**

```swift
struct CounterView: View {
    @ObservedObject var viewModel: SimpleViewModel = SimpleViewModel()

    var body: some View {
        VStack {
            Text(viewModel.counter.state(\.counter))
            Button("Press me") { viewModel.onCounterButtonPressed() }
        }
    }
}
```

## ResourceState

```kotlin
sealed class ResourceState<out T, out E> {
    class Loading<out T, out E> : ResourceState<T, E>()
    data class Success<out T, out E>(val data: T) : ResourceState<T, E>()
    class Empty<out T, out E> : ResourceState<T, E>()
    data class Failed<out T, out E>(val error: E) : ResourceState<T, E>()
}
```

```kotlin
val state: CStateFlow<ResourceState<List<Book>, StringDesc>> = ...

// Compose
when (val s = state.collectAsState().value) {
    is ResourceState.Loading -> LoadingState()
    is ResourceState.Success -> BookList(s.data)
    is ResourceState.Empty -> EmptyState()
    is ResourceState.Failed -> ErrorState(s.error)
}
```

## Дополнительный материал

<iframe src="//www.youtube.com/embed/qe8FcIQEmyA?list=PL6yFiPOVXVUi90sQ66dtmuXP-1-TeHwl5" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
<br/>

- [Референс библиотеки](https://github.com/icerockdev/moko-mvvm)
- [Семплы (DataBinding)](https://github.com/icerockdev/moko-mvvm/tree/master/sample)
- [Семплы (Compose + SwiftUI)](https://github.com/icerockdev/moko-mvvm/tree/master/sample-declarative-ui)
