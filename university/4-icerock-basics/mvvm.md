---
sidebar_position: 6
---

# MVVM

## Выбор подхода

При разработке на Kotlin Multiplatform мы стремимся максимально перенести логику в общий код, оставляя на стороне платформы только верстку UI и навигацию. Паттерн **Model-View-ViewModel** оптимально подходит для переиспользования между платформами.

В общем коде (shared) содержится:
- ViewModel для каждого экрана с бизнес-логикой
- Работа с сетью, БД, процессинг данных
- Преобразование данных в формат, готовый к отображению

На стороне платформы остаётся:
- Верстка UI (Compose на Android, SwiftUI на iOS)
- Привязка UI к ViewModel
- Навигация

:::info

С самим подходом MVVM вы уже знакомились в разделе Android. Для освежения памяти полезно перечитать статью [Единый стейт экрана](../../learning/state).

:::

## moko-mvvm

Для реализации MVVM в KMP мы используем библиотеку [moko-mvvm](https://github.com/icerockdev/moko-mvvm). Она предоставляет базовый класс `ViewModel` с `viewModelScope`, классы-обёртки `CFlow`/`CStateFlow`/`CMutableStateFlow` для совместимости с iOS, а также готовые интеграции с Compose и SwiftUI.

Подробное описание подключения и API — на странице [moko-mvvm](../../learning/libraries/moko/moko-mvvm) в базе знаний.

## ViewModel в общем коде

Каждая ViewModel наследуется от `ViewModel` из `moko-mvvm`, использует `viewModelScope` для корутин и хранит:

- **Состояние** — `CStateFlow` / `CMutableStateFlow` для данных, отображаемых в UI
- **Одноразовые события** — `Channel`, обёрнутый в `CFlow`, для действий (навигация, snackbar, диалоги)

```kotlin
class SimpleViewModel : ViewModel() {
    private val _counter: CMutableStateFlow<Int> =
        MutableStateFlow(0).cMutableStateFlow()
    val counter: CStateFlow<String> =
        _counter.map { it.toString() }
            .stateIn(viewModelScope, SharingStarted.Lazily, "0")
            .cStateFlow()

    private val _actions: Channel<Actions> = Channel()
    val actions: CFlow<Actions> = _actions.receiveAsFlow().cFlow()

    fun onCounterButtonPressed() {
        _counter.value += 1
    }

    fun onNavigatePressed() {
        viewModelScope.launch {
            _actions.send(Actions.RouteToMain)
        }
    }

    sealed interface Actions {
        data object RouteToMain : Actions
    }
}
```

### DI-регистрация

ViewModel регистрируется в Koin как фабрика:

```kotlin
val featureModule: Module = module {
    factoryOf(::SimpleViewModel)
}

fun Koin.getSimpleViewModel(): SimpleViewModel {
    return get()
}
```

## Подключение ViewModel на Android

На Android используется Jetpack Compose. ViewModel получается через `koinViewModel` или `getViewModel` с сохранением в `ViewModelStoreOwner` (переживает смену конфигурации).

```kotlin
@Composable
fun CounterScreen(
    viewModel: SimpleViewModel = koinViewModel()
) {
    val counter: String by viewModel.counter.collectAsState()

    viewModel.actions.observeAsActions { action ->
        when (action) {
            SimpleViewModel.Actions.RouteToMain -> { /* навигация */ }
        }
    }

    Column {
        Text(text = counter)
        Button(onClick = { viewModel.onCounterButtonPressed() }) {
            Text("Нажать")
        }
    }
}
```

`observeAsActions` из `moko-mvvm-flow-compose` автоматически учитывает жизненный цикл и гарантирует однократную обработку каждого события.

## Подключение ViewModel на iOS

На iOS используется SwiftUI. Для управления временем жизни ViewModel применяется `@ViewModelWrapper` — он вызывает `viewModel.onCleared()` при удалении экрана.

```swift
extension ViewModel: ObservableObject {}

struct CounterView: View {
    @ViewModelWrapper private var viewModel: SimpleViewModel =
        Koin.instance.getSimpleViewModel()

    var body: some View {
        VStack {
            Text(viewModel.state(\.counter))
            Button("Нажать") { viewModel.onCounterButtonPressed() }
        }
    }
}
```

Метод `state(\.counter)` — расширение `ViewModelState`, которое подписывается на `CStateFlow` и уведомляет SwiftUI об изменениях.

Для событий (CFlow) используется `toPublisher()` из Combine:

```swift
viewModel.actions.toPublisher()
    .sink { [weak self] action in
        guard let action else { return }
        // обработка действия
    }
    .store(in: &cancellables)
```

## Передача событий из ViewModel на UI

ViewModel принимает решения о навигации, показах сообщений и других действиях. Для передачи одноразовых событий используется паттерн **Channel + CFlow**.

**ViewModel:**
```kotlin
private val _actions: Channel<Actions> = Channel()
val actions: CFlow<Actions> = _actions.receiveAsFlow().cFlow()

sealed interface Actions {
    data class ShowMessage(val message: StringDesc) : Actions
    data object RouteToBack : Actions
}
```

**Android (Compose):**
```kotlin
viewModel.actions.observeAsActions { action ->
    when (action) {
        is Actions.ShowMessage -> { /* показать сообщение */ }
        Actions.RouteToBack -> { /* навигация назад */ }
    }
}
```

**iOS (SwiftUI):**
```swift
viewModel.actions.toPublisher()
    .sink { [weak self] action in
        guard let action else { return }
        switch action {
        case is Actions.ShowMessage: break
        case is Actions.RouteToBack: break
        default: break
        }
    }
    .store(in: &cancellables)
```

### Sealed interface на iOS

На iOS sealed interface из Kotlin не преобразуется в enum Swift. При использовании `switch` требуется ветка `default`, что снижает типобезопасность — при добавлении нового типа Actions ошибки компиляции на iOS не возникнет.

Плагин [SKIE](https://skie.touchlab.co/) решает часть этих проблем, генерируя Swift-friendly обёртки для Kotlin Flow и suspend-функций. Подробнее — в [статье про SKIE](../../learning/kotlin-multiplatform/mobile-highlights).

## ResourceState — состояния экрана

Типовой sealed class для описания состояния экрана:

```kotlin
sealed class ResourceState<out T, out E> {
    class Loading<out T, out E> : ResourceState<T, E>()
    data class Success<out T, out E>(val data: T) : ResourceState<T, E>()
    class Empty<out T, out E> : ResourceState<T, E>()
    data class Failed<out T, out E>(val error: E) : ResourceState<T, E>()
}
```

В ViewModel:

```kotlin
val state: CStateFlow<ResourceState<List<Book>, StringDesc>> = ...

fun loadBooks() {
    viewModelScope.launch {
        _state.value = ResourceState.Loading
        val result = repository.getBooks()
        _state.value = ResourceState.Success(result)
    }
}
```

В Compose:

```kotlin
when (val s = state.collectAsState().value) {
    is ResourceState.Loading -> LoadingState()
    is ResourceState.Success -> BookList(s.data)
    is ResourceState.Empty -> EmptyState()
    is ResourceState.Failed -> ErrorState(s.error)
}
```

## Удобное public API общего кода

Вся логика обработки ошибок скрыта внутри Kotlin-кода — на UI приходят готовые строки (через `StringDesc`). Все `suspend`-функции инкапсулированы в ViewModel. Платформенный код работает только с `CStateFlow` и `CFlow`.

## Практическое задание

- Используйте проект, готовый после раздела [Внедрение зависимостей](./di#практическое-задание)
- Подключите библиотеку `moko-mvvm` (настройка описана в [базе знаний](../../learning/libraries/moko/moko-mvvm))
- Добавьте в ваши фичи ViewModel, наследуя их от `ViewModel` из `moko-mvvm`
  - Для стейта используйте `CStateFlow` / `CMutableStateFlow`
  - Для одноразовых событий используйте `Channel<Actions>` + `CFlow`
- Зарегистрируйте ViewModel в Koin через `factoryOf`
- На Android реализуйте экраны на Jetpack Compose, получайте ViewModel через `koinViewModel`
- На iOS реализуйте экраны на SwiftUI, используйте `@ViewModelWrapper` для интеграции
- Ориентируйтесь на классы из практики третьего блока и [диаграмму классов mpp-library](./practice#классы-приложения)
- Приложения должны запускаться
