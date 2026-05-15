---
sidebar_position: 21
---

# Единый стейт экрана

Во всех экранах используется общий подход: ViewModel из `shared`-модулей хранит состояние в `StateFlow`/`MutableStateFlow` (Kotlin), а для iOS они оборачиваются в `CStateFlow`/`CMutableStateFlow` через библиотеку MOKO MVVM.

## Типы стейта

В проекте используются два основных подхода к организации стейта:

**1. Отдельные `CStateFlow`-свойства** — для простых экранов, где каждое свойство UI независимо:

```kotlin
class AuthViewModel : ViewModel() {
    val isLoading: CStateFlow<Boolean> = _isLoading.cStateFlow()
    val showPasswordField: CStateFlow<Boolean> = _showPasswordField.cStateFlow()
    val isLoginButtonEnabled: CStateFlow<Boolean> = combine(...).cStateIn(viewModelScope, ...)
    val authType: CMutableStateFlow<ContactMethodType> = CMutableStateFlow(ContactMethodType.PHONE)
}
```

**2. Единый `State` data class** — для сложных экранов, где состояние описывается одним объектом:

```kotlin
class OrdersBoardViewModel : ViewModel() {
    data class State(
        val orders: BoardRemoteState = BoardRemoteState.Loading,
        val sortedType: StringDesc = MR.strings.sort_by_start_date.desc(),
        val dateFilter: DateFilterItem = DateFilterItem.AnyDay,
        val showNewOrdersButton: Boolean = false,
    )

    val state: CStateFlow<RemoteStateUi<State>> = combine(...)
        .cStateIn(viewModelScope, SharingStarted.Eagerly, RemoteState.Loading)
}
```

## Обёртки для iOS-интеропа

Kotlin `StateFlow` напрямую недоступен в Swift. Библиотека MOKO MVVM предоставляет обёртки:

| Kotlin тип         | Обёртка для iOS         | Расширение          |
|--------------------|------------------------|---------------------|
| `StateFlow<T>`     | `CStateFlow<T>`        | `.cStateFlow()`     |
| `MutableStateFlow<T>` | `CMutableStateFlow<T>` | `.cMutableStateFlow()` |
| `Flow<T>`          | `CFlow<T>`             | `.cFlow()`          |

Утилиты из `shared/utils`:

```kotlin
// Быстрое создание CMutableStateFlow
val authType: CMutableStateFlow<ContactMethodType> = CMutableStateFlow(ContactMethodType.PHONE)

// Flow -> CStateFlow (stateIn + cStateFlow в одном вызове)
val isLoginButtonEnabled: CStateFlow<Boolean> = combine(...)
    .cStateIn(viewModelScope, SharingStarted.Eagerly, true)
```

---

## Базовый пример с подпиской

### ViewModel (shared)

```kotlin
class ProfileViewModel(
    private val loadProfileUseCase: LoadProfileUseCase,
) : ViewModel() {
    private val _isLoading = MutableStateFlow(false)
    val isLoading: CStateFlow<Boolean> = _isLoading.cStateFlow()

    private val _userName = MutableStateFlow("")
    val userName: CStateFlow<String> = _userName.cStateFlow()

    private val _actions: Channel<Actions> = Channel()
    val actions: CFlow<Actions> = _actions.receiveAsFlow().cFlow()

    sealed interface Actions {
        data class ShowError(val error: StringDesc) : Actions
        data object RouteToEdit : Actions
    }

    fun onStart() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val profile = loadProfileUseCase()
                _userName.value = profile.fullName
            } catch (exception: Exception) {
                sendAction(_actions, Actions.ShowError(exception.mapThrowable()))
            } finally {
                _isLoading.value = false
            }
        }
    }
}
```

### Android (Compose)

```kotlin
@Composable
fun ProfileScreen(
    navController: NavController,
    viewModel: ProfileViewModel = getViewModel { getProfileViewModel().apply(::onStart) }
) {
    val isLoading by viewModel.isLoading.collectAsState()
    val userName by viewModel.userName.collectAsState()

    viewModel.actions.observeAsActions { action ->
        when (action) {
            is ProfileViewModel.Actions.ShowError -> { /* показать ошибку */ }
            is ProfileViewModel.Actions.RouteToEdit -> navController.navigate("edit")
        }
    }

    if (isLoading) {
        LoadingView()
    } else {
        Text(text = userName)
    }
}
```

### iOS (SwiftUI)

```swift
struct ProfileScreen: View {
    @ViewModelWrapper private var viewModel: ProfileViewModel = Koin.shared.getProfileViewModel()

    init() {
        // onStart вызывается ровно один раз
        _viewModel = .init(wrappedValue: {
            let vm = Koin.shared.getProfileViewModel()
            vm.onStart()
            return vm
        }())
    }

    var body: some View {
        content
            .onReceive(createPublisher(viewModel.actions), perform: handleAction)
    }

    private var content: some View {
        if viewModel.state(\.isLoading) {
            LoadingView()
        } else {
            Text(viewModel.state(\.userName))
        }
    }

    private func handleAction(_ action: ProfileViewModelActions) {
        switch onEnum(of: action) {
        case .showError(let obj):
            showErrorAlert(message: obj.error.localized())
        case .routeToEdit:
            router.push(.profileEdit)
        }
    }
}
```

:::tip Ключевые моменты
- На Android используем `getViewModel { getVm().apply(::onStart) }` — `onStart()` вызывается внутри фабрики.
- На iOS `onStart()` вызывается в `init` closure `@ViewModelWrapper` — это гарантирует ровно один вызов.
- `@ViewModelWrapper` автоматически вызывает `onCleared()` при уничтожении экрана.
- На iOS для чтения стейта используем `viewModel.state(\.property)` — он подписывается на `CStateFlow` и триггерит `objectWillChange` при изменении.
  :::

---

## Надежная обработка стейта

Для экранов с загрузкой данных из сети используется `RemoteState<T, E>` — запечатанный класс с тремя состояниями: `Loading`, `Success`, `Error`.

```kotlin
sealed class RemoteState<out T : Any, out E : Any> {
    data object Loading : RemoteState<Nothing, Nothing>()
    data class Success<T : Any>(val data: T) : RemoteState<T, Nothing>()
    data class Error<E : Any>(val error: E) : RemoteState<Nothing, E>()
}

typealias RemoteStateUi<T> = RemoteState<T, ErrorBundle>
```

### ViewModel (shared)

```kotlin
class OrdersBoardViewModel : ViewModel() {
    data class State(
        val orders: List<OrderItem> = emptyList(),
        val isRefreshing: Boolean = false,
    )

    private val _state = MutableStateFlow<RemoteStateUi<State>>(RemoteState.Loading)
    val state: CStateFlow<RemoteStateUi<State>> = _state.cStateFlow()

    fun onStart() {
        viewModelScope.launch {
            loadOrders()
        }
    }

    private suspend fun loadOrders() {
        _state.value = RemoteState.Loading
        try {
            val orders = loadOrdersUseCase()
            _state.value = RemoteState.Success(State(orders = orders))
        } catch (exception: Exception) {
            _state.value = RemoteState.Error(exception.mapThrowable())
        }
    }
}
```

Для запуска асинхронной работы с автоматической обработкой ошибок и лоадингом используется утилита `launchGuard`:

```kotlin
launchGuard(
    loading = _isLoading,
    actions = _actions,
    errorToAction = Actions::ShowError
) {
    val result = doSomething()
    sendAction(_actions, Actions.RouteToNext(result))
}
```

### Android (Compose)

```kotlin
@Composable
fun OrdersBoardScreen(
    viewModel: OrdersBoardViewModel = getViewModel {
        getOrdersBoardViewModel().apply { onStart() }
    }
) {
    val state by viewModel.state.collectAsState()

    when (state) {
        is RemoteState.Loading -> LoadingView()
        is RemoteState.Success -> OrdersList(state.data.orders)
        is RemoteState.Error -> ErrorView(state.error)
    }
}
```

### iOS (SwiftUI)

```swift
struct OrdersBoardScreen: View {
    @ViewModelWrapper private var viewModel: OrdersBoardViewModel

    init() {
        _viewModel = .init(wrappedValue: {
            let vm = Koin.shared.getOrdersBoardViewModel()
            vm.onStart()
            return vm
        }())
    }

    var body: some View {
        let state: RemoteStateUiState = viewModel.state(\.state)

        switch state {
        case .loading:
            LoadingView()
        case let .success(data):
            OrdersList(orders: data.orders)
        case let .error(errorBundle):
            ErrorView(error: errorBundle)
        default:
            EmptyView()
        }
    }
}
```

:::warning
`RemoteState` — `sealed class`, а не `sealed interface`. Это сделано специально для iOS — `class` позволяет реализовать `Hashable` и корректно работать с `isEqual` в Objective-C.
:::

---

## Экран с полем ввода

Для полей ввода с валидацией используется `FormField<String, StringDesc>` из MOKO Fields. Он предоставляет `data: MutableStateFlow<String>` и `error: StateFlow<StringDesc?>`.

### ViewModel (shared)

```kotlin
class AuthViewModel : ViewModel() {
    val phoneField: FormField<String, StringDesc> = FormField(
        scope = viewModelScope,
        initialValue = "",
        validation = fieldValidation {
            matchRegex(
                MR.strings.auth_error_incorrect_phone.desc(),
                Validations.PHONE_REGEX
            )
        }
    )

    val passwordField: FormField<String, StringDesc> = FormField(
        scope = viewModelScope,
        initialValue = "",
        validation = fieldValidation {
            notBlank(MR.strings.auth_error_blank_password.desc())
        }
    )

    val isLoginButtonEnabled: CStateFlow<Boolean> = combine(
        phoneField.error,
        passwordField.error,
    ) { phoneError, passwordError ->
        phoneError == null && passwordError == null
    }.cStateIn(viewModelScope, SharingStarted.Eagerly, true)

    fun onLoginClick() {
        if (!phoneField.validate()) return
        if (!passwordField.validate()) return
        // ... логика
    }
}
```

:::tip Валидация
`validate()` возвращает `false` и записывает ошибку в `error: StateFlow<StringDesc?>`. Если ошибка уже `null` — `validate()` не перевалидирует (оптимизация).
`fieldValidation { }` позволяет перечисление правил списком/цепочкой: `notBlank(...)` затем `matchRegex(...)`.
:::

### Android (Compose)

На Android для FormField есть утилита `asFieldState()`:

```kotlin
@Composable
fun AuthScreen(
    viewModel: AuthViewModel = getViewModel { getAuthViewModel() }
) {
    val phoneState = viewModel.phoneField.asFieldState()
    val passwordState = viewModel.passwordField.asFieldState()
    val isLoginEnabled by viewModel.isLoginButtonEnabled.collectAsState()

    Column {
        InputField(
            text = phoneState.text,
            error = phoneState.error.value,
            placeholder = "Телефон"
        )

        InputField(
            text = passwordState.text,
            error = passwordState.error.value,
            placeholder = "Пароль"
        )

        Button(
            enabled = isLoginEnabled,
            onClick = viewModel::onLoginClick
        )
    }
}
```

Утилита `asFieldState()` создаёт `FieldState` с `MutableState<String>` для текста и `State<StringDesc?>` для ошибки — оба работают через `collectAsState`/`collectAsMutableState`.

### iOS (SwiftUI)

На iOS FormField доступен через `binding` (для записи) и `stateNullable` (для чтения ошибки):

```swift
struct SignInScreen: View {
    @ViewModelWrapper private var viewModel: AuthViewModel = Koin.shared.getAuthViewModel()

    var body: some View {
        VStack {
            InputView(
                text: viewModel.binding(\.phoneField.data),
                labelText: "Телефон",
                errorText: viewModel.stateNullable(\.phoneField.error)
            )

            InputView(
                text: viewModel.binding(\.passwordField.data),
                labelText: "Пароль",
                errorText: viewModel.stateNullable(\.passwordField.error)
            )

            ButtonView(
                title: "Войти",
                isDisabled: !viewModel.state(\.isLoginButtonEnabled),
                action: viewModel.onLoginClick
            )
        }
    }
}
```

:::info Методы доступа к стейту на iOS

| Метод | Назначение | Пример |
|---|---|---|
| `viewModel.state(\.prop)` | Чтение `CStateFlow<T>` | `viewModel.state(\.isLoading)` → `Bool` |
| `viewModel.stateNullable(\.prop)` | Чтение nullable `CStateFlow<T>` | `viewModel.stateNullable(\.phoneField.error)` → `String?` |
| `viewModel.binding(\.prop)` | Двусторонний `Binding` из `CMutableStateFlow` | `viewModel.binding(\.phoneField.data)` → `Binding<String>` |

Для кастомных типов с маппингом:

```swift
let selectedSort: Binding<OrdersSorting> = viewModel.binding(
    \.ordersSorting,
    equals: { $0 == $1 },
    getMapper: { $0.toSwiftEnum() },
    setMapper: { $0.toKotlinEnum() }
)
```
:::

---

## События (Actions)

ViewModel не только отображает данные, но и информирует UI о разовых действиях: переход на другой экран, показ alert/toast, закрытие экрана.

Для этого используется [Channel](https://kotlinlang.org/docs/channels.html) + `Flow`:

```kotlin
class LoginViewModel : ViewModel() {
    private val _actions: Channel<Action> = Channel(Channel.BUFFERED)
    val actions: CFlow<Action> = _actions.receiveAsFlow().cFlow()

    sealed interface Action {
        data class ShowToast(val message: String) : Action
        data object RouteToMain : Action
        data class ShowError(val error: StringDesc) : Action
    }

    fun onLoginClicked() {
        viewModelScope.launch {
            // ... логика логина ...
            _actions.send(Action.RouteToMain)
        }
    }
}
```

Для отправки действий используется утилита `sendAction` из `shared/utils`:

```kotlin
// Вместо viewModelScope.launch { _actions.send(action) } пишем:
sendAction(_actions, Action.RouteToMain)
```

### Обработка Actions на Android (Compose)

```kotlin
@Composable
fun LoginScreen(viewModel: LoginViewModel = viewModel()) {
    val context = LocalContext.current

    viewModel.actions.observeAsActions { action ->
        when (action) {
            is LoginViewModel.Action.ShowToast -> {
                Toast.makeText(context, action.message, Toast.LENGTH_SHORT).show()
            }
            is LoginViewModel.Action.RouteToMain -> {
                // навигация на главный экран
            }
            is LoginViewModel.Action.ShowError -> {
                // показ ошибки
            }
        }
    }
}
```

`observeAsActions` из moko-mvvm автоматически подписывается на `CFlow` и отписывается при уходе с экрана.

### Обработка Actions на iOS (SwiftUI)

```swift
struct LoginScreen: View {
    @ViewModelWrapper private var viewModel: LoginViewModel = Koin.shared.getLoginViewModel()

    var body: some View {
        content
            .onReceive(createPublisher(viewModel.actions), perform: handleAction)
    }

    private func handleAction(_ action: LoginViewModelAction) {
        switch onEnum(of: action) {
        case .showToast(let obj):
            showToast(message: obj.message)
        case .routeToMain:
            navigateToMain()
        case .showError(let obj):
            showErrorAlert(message: obj.error.localized())
        }
    }
}
```

`createPublisher()` конвертирует `CFlow` в Combine `AnyPublisher`, а `.onReceive()` подписывается на него в жизненном цикле SwiftUI-вью.

:::warning
`send` vs `trySend`:
- `send` — suspend-функция, приостанавливается, если буфер Channel полон. **Рекомендуется** для гарантии доставки.
- `trySend` — неблокирующая, возвращает результат. Если буфер полон — событие теряется.
  :::
