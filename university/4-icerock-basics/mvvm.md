---
sidebar_position: 6
---

# MVVM

## Выбор подхода

Когда мы начинали внедрять Kotlin Multiplatform в разработку проектов мы стремились максимально избавиться от дублирования между платформами, но не вредя конечному UI и UX (оставляя его полностью нативным и привычным пользователям). Проведя некоторое исследование решили, что паттерн **Model-View-ViewModel**, который мы уже активно применяли на Android, **наиболее хорошо подойдет для переиспользования** между платформами. 

*На тот момент декларативного UI в виде SwiftUI и Jetpack Compose еще не было, поэтому рассматривалось удобство и надежность интеграции с обычными `View`.*

В результате, мы имеем в общей Kotlin Multiplatform библиотеке:
- Для каждого экрана ViewModel с логикой работы
- Работа с сетью
- Работа с базой данных
- Процессинг данных, преобразования, расчеты

И остается на стороне платформы - верстка UI, привязка к общим ViewModel и навигация.

:::info

С самим подходом MVVM вы уже знакомились в разделе Android. Для освежения памяти особо полезно будет перечитать статью [Единый стейт экрана](../../learning/state)

:::

## moko-mvvm

Для использования MVVM мы реализовали библиотеку [moko-mvvm](https://github.com/icerockdev/moko-mvvm). Главное, что мы стремились достичь при ее реализации, это использование оригинальных классов JetPack `ViewModel` и `StateFlow` со стороны Android, чтобы продолжить использовать существующие в Android интеграции с данными классами (включая логику хранения `ViewModel` в `ViewModelStore` чтобы переживать смену конфигурации). Для iOS стороны (и других платформ тоже) классы `ViewModel` и `StateFlow` были реализованы нами, в более простом виде чем в Android (так как только в Android есть сложный жизненный цикл компонентов с пересозданием). По сути классы `ViewModel` и `StateFlow` являются expect классами с разными actual реализациями на платформах.

Для знакомства с библиотекой посмотрите материалы на странице в базе знаний - [moko-mvvm](../../learning/libraries/moko/moko-mvvm).

### Привязка StateFlow к UI

В библиотеке также содержатся готовые методы для привязки `StateFlow` к UI элементам, по аналогии с методами, которые были использованы нами в [статье про State](../../learning/state). Данные методы доступны и для Android и для iOS, а поэтому в большинстве случаев вам не потребуется писать вручную привязку каждого типа данных к каждому UI элементу.

Привязкой UI к `StateFlow` называется binding, и основано на использовании метода `bind`:
- [для Android](https://github.com/icerockdev/moko-mvvm/blob/master/mvvm-flow/src/androidMain/kotlin/dev/icerock/moko/mvvm/flow/binding/BindingBase.kt)
- [для iOS](https://github.com/icerockdev/moko-mvvm/blob/master/mvvm-flow/src/iosMain/kotlin/dev/icerock/moko/mvvm/flow/binding/BindingBase.kt)

Для Android нам доступны например:
```kotlin
fun EditText.bindTextTwoWay(
    lifecycleOwner: LifecycleOwner,
    flow: MutableStateFlow<String>
): DisposableHandle

fun TextView.bindText(
    lifecycleOwner: LifecycleOwner,
    flow: StateFlow<String>
): DisposableHandle

fun View.bindVisibleOrGone(
    lifecycleOwner: LifecycleOwner,
    flow: StateFlow<Boolean>
): DisposableHandle
```

И для iOS соответственно:
```swift
extension UITextField {
  @discardableResult
  func bindTextTwoWay(flow: CMutableStateFlow<String>) -> DisposableHandle
}

extension UILabel {
  @discardableResult
  func bindText<T : String>(flow: CStateFlow<T>) -> DisposableHandle
}

extension UIView {
  @discardableResult
  func bindHidden(flow: CStateFlow<Boolean>) -> DisposableHandle
}
```

#### Пример

shared code:
```kotlin
class SimpleViewModel : ViewModel() {
    private val _counter: MutableStateFlow<Int> = MutableStateFlow(0)
    val counter: CStateFlow<String> = _counter.map { it.toString() }.cStateFlow()

    fun onCounterButtonPressed() {
        _counter.value += 1
    }
}
```

android app: 
```kotlin
class SimpleFragment: Fragment(R.layout.fragment_simple) {
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val viewModel: SimpleViewModel = getViewModel { SimpleViewModel() }
        
        val binding = FragmentSimpleBinding.bind(view)
        binding.counterText.bindText(viewLifecycleOwner, viewModel.counter)
        binding.incrementButton.setOnClickListener { viewModel.onCounterButtonPressed() }
    }
}
```

ios app:
```swift
class SimpleViewController: UIViewController {
    @IBOutlet private var counterLabel: UILabel!
    
    private var viewModel: SimpleViewModel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        viewModel = SimpleViewModel()
        
        counterLabel.bindText(flow: viewModel.counter)
    }
    
    @IBAction func onCounterButtonPressed() {
        viewModel.onCounterButtonPressed()
    }
}
```

#### Добавление своих расширений

Если в `moko-mvvm` не оказалось нужной вам функции биндинга для `iOS` или `Android`, вы можете добавить свой `extension` к `CStateFlow`.  
Например, добавим функцию `bindToMenuItemVisible` для связи `CStateFlow<Boolean>` и `MenuItem` на `Android`:
```kotlin
internal fun CStateFlow<Boolean>.bindToMenuItemVisible(
    lifecycleOwner: LifecycleOwner,
    menuItem: MenuItem
): DisposableHandle {
    return bind(lifecycleOwner) { value ->
        menuItem.isVisible = value
    }
}
```

Для `iOS` добавим функцию `bindToUIToolbarVisible` для связи `UIToolbar` c `CStateFlow<KotlinBoolean>` (на `iOS` из общего кода вместо `Boolean` приходит `KotlinBoolean`) вот как это будет выглядеть:
```swift
extension UIToolbar {
    func bindToUIToolbarVisible(flow: CStateFlow<KotlinBoolean>) -> DisposableHandle {
        return flow.subscribe { [weak self] value in
            let kotlinBool = value as! KotlinBoolean
            self?.isHidden = kotlinBool.boolValue
        }
    }
}
```

Важно, в методах биндинга должна быть только привязка `flow` к объекту `UI`, никакой логики быть не должно!
Вся логика должна быть во `ViewModel`, если нужно как-то преобразовать значение `flow`, делайте это там.

### MvvmActivity и MvvmFragment
В moko-mvvm реализованы абстрактные классы [MvvmFragment](https://github.com/icerockdev/moko-mvvm/blob/b4b2ed1a86451bd303aa0733ecd776be96c6f455/mvvm-viewbinding/src/main/kotlin/dev/icerock/moko/mvvm/viewbinding/MvvmEventsFragment.kt) и [MvvmActivity](https://github.com/icerockdev/moko-mvvm/blob/b6f2630df03bbd405e5659d85ea7df03f38e5dc7/mvvm-viewbinding/src/main/kotlin/dev/icerock/moko/mvvm/viewbinding/MvvmActivity.kt), наследуясь от которых вы:
- автоматически получите доступ к `binding` и `viewModel` 

Пример фрагмента, наследника обычного Fragment:
```kotlin
@AndroidEntryPoint
class TestFragment : Fragment() {
    private var _binding: TestFragmentBinding? = null

    private val binding
        get() = _binding!!

    @Inject
    lateinit var testFactory: TestFactory

    private lateinit var viewModel: TestViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        viewModel = getViewModel {
            testFactory.createTestViewModel()
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = TestFragmentBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.testLayout.bindFormField(viewLifecycleOwner, viewModel.testText)
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        
        _binding = null
    }
}
```

А теперь тот же самый фрагмент, но наследник MvvmFragment: 
```kotlin
@AndroidEntryPoint
class TestFragment : MvvmFragment<TestFragmentBinding, AuthViewModel>() {
  @Inject
  lateinit var testFactory: TestFactory

  override val viewModelClass: Class<AuthViewModel>
    get() = AuthViewModel::class.java

  override fun viewBindingInflate(
    inflater: LayoutInflater,
    container: ViewGroup?
  ): TestFragmentBinding = TestFragmentBinding
    .inflate(inflater, container, false)

  override fun viewModelFactory(): ViewModelProvider.Factory = ViewModelFactory {
    testFactory.createTestViewModel()
  }

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    binding.testLayout.bindFormField(viewLifecycleOwner, viewModel.testText)
  }
}
```

### Передача событий из ViewModel на UI

Для начала, освежите в памяти что такое [события/действия](../../learning/state#событие-действие), для чего они нужны и как реализуются на Android.
За всю логику в приложении, в том числе и за принятие решения, когда нужно перейти на другой экран отвечает `ViewModel`. Поэтому `ViewModel` должна как-то сообщать `Fragment`-у или `UIViewController`-y, что нужно выполнить какое-то действие (`Action`).

Разберем несколько подходов для передачи событий от `ViewModel` на UI:
- используя `Flow`
- используя `Flow` вместе с [moko-kswift](https://github.com/icerockdev/moko-kswift)

#### Flow

В [статье](../../learning/state) про состояния и события вы уже ознакомились с передачей событий на Android используя Flow APIs.  
Однако, теперь нам нужно отправлять такие действия из общего кода, который потом подключится к iOS и Android приложениям.  

**Первая проблема** заключается в том, что на iOS не удастся использовать Flow APIs, потому что `Flow` - это interface с generic типом, который после компиляции Kotlin/Native со стороны Swift generic тип исчезнет и будет просто protocol `Flow`.  

**Вторая проблема** - `sealed interface` нельзя использовать в `switch` на iOS также, как мы используем его в `when` на Kotlin. Чтобы использовать его в `switch` нужно чтобы он был `enum`-ом.

Рассмотрим на примере:

Допустим, у нас для переходов между экранами во `ViewModel` объявлен вот такой `sealed interface`:
```kotlin
sealed interface Action {
  object RouteToMainScreen : Action
  object RouteToAuthScreen : Action
  object RouteToSettingsScreen : Action
}
```
При необходимости перейти на другой экран `ViewModel` помещает во `Flow` объекты `Action`. `Fragment` и `UIViewController` подписываются на этот `Flow`, и, когда он получает новый объект, определяют по нему на какой экран переходить.

Представим, что мы подписались на `Flow` в `Fragment`: каждый новый объект обрабатывается `when`-ом. Если все объекты из `sealed interface`-а обработаны в `when`, то на Android ветка `else` не потребуется.  

В iOS же, `sealed interface` не преобразуется в `enum`, из-за чего даже при переборе всех объектов в `switch`, нужно будет добавить ветку `else`.  
Теперь, предположим, что нам понадобилось добавить еще один объект в `Action` для событий, которые кидает `ViewModel`.  
В Kotlin-мире мы получим ошибку при компиляции, надо будет добавить в `when` обработку еще одного объекта - нового, который только что добавили во `ViewModel`.  
А на iOS компилятор нам ничего не подскажет, потому что новый объект будет обрабатываться в ветке `else`. Из-за этого, логика перехода на iOS нарушится. Поиск ошибки может занять некоторое время, в зависимости от знаний разработчика.  

Чтобы не сталкиваться с этим на практике мы используем другой подход - с помощью `Channel`. Разберемся, как он работает

#### Передача Action с помощью Channel

Во view model добавляем канал и события для передачи:
```kotlin
private val _actions: Channel<Actions> = Channel()
val actions: CFlow<Actions> = _actions.receiveAsFlow().cFlow()
...
sealed interface Actions {
    data class ShowMessage(val messageText: StringDesc) : Actions
    data object RouteToBack : Actions
}
```
В Android подписываемся на события. В экране на Compose UI это выглядит так:
```kotlin
viewModel.actions.observeAsActions { action ->
    when (action) {
        is Actions.ShowMessage -> {
            ...
        }

        Actions.RouteToBack -> {
            ...
        }
    }
}
```
В iOS подписка выглядит так:
```swift
viewModel.actions.subscribe { [weak self] action in
    guard let self = self,
          let action = action else { return }
    let actionKs = SimpleViewModelActionKs(action)
    switch actionKs {
    case .showMessage(let data):
        ...
    case .routeToBack:
        ...
    }
}
```

#### Flow c moko-kswift
Мы уже рассмотрели, с какими проблемами мы столкнулись бы, если бы использовали `Flow` в общем коде.  
Разберем теперь, как можно решить эти проблемы, начнем с отсутствия типов у `Flow` на iOS.

Мы будем использовать классы-обертки `CFlow` и `CStateFlow` из [moko-mvvm](https://github.com/icerockdev/moko-mvvm), а также функции, позволяющие преобразовать в них `Flow` и `StateFlow`.

`CFlow` и `CStateFlow` - это те же самые `Flow` и `StateFlow`, только в виде классов. Сделаны они были для того, чтобы использовать именно классы, потому что для классов в Swift generic типы доступны.  
В common-коде мы будем использовать `CFlow` и `CStateFlow` только для public API, а в внутренней реализации общего кода нет нужды использовать классы вместо интерфейсов - можно будет использовать обычное `Flow` API.   
Таким образом, мы решили первую проблему - отсутствие типов у `Flow` на iOS.

Теперь разберемся со второй проблемой - преобразованием `sealed interface` к `enum` в Swift.

Используя плагин [moko-kswift](https://github.com/icerockdev/moko-kswift), мы можем получать автоматически генерируемые Swift `enum`, соответствующие `sealed-interface`-ам общего кода, а после работать с ними в `switch`.  
Для более полного понимания проблемы и её решения, изучите [страницу](../../learning/legacy/moko-kswift) плагина в базе знаний.

## Удобное public api общего кода

Благодаря переносу всей логики приложения в общий код мы получаем более удобное и простое API библиотеки для интеграции на платформы. Мы знаем что есть, например, ряд `ViewModel`-ей, в которых есть `StateFlow` на которые нужно подписаться и события, которые нужно обрабатывать. Все передаваемые на UI данные уже подготовлены к отображению и не требуют дополнительной обработки.

Вот некоторый список преимуществ, которые мы получаем за счет использования `ViewModel`-ей в общем коде:

- Вся обработка ошибок (`Exception`) внутри Kotlin кода, на UI привязываются строки с текстом - нам не надо на Swift пытаться распознать что такое `KotlinException`;
- `suspend` функции все внутри Kotlin кода.

## Практическое задание
- Используйте проект, готовый после раздела [Внедрение зависимостей](./di#практическое-задание)
- Подключите библиотеку `moko-mvvm`
- Подключите плагин `moko-kswift`
- Добавьте в ваши фичи репозиторий, необходимые классы и вьюмодели, которые вы делали в третьем блоке для Android, все вьюмодели наследуйте от `ViewModel` из `moko-mvvm`
  - Ориентируйтесь на классы из практики 3его блока и [диаграмму классов mpp-library](./practice#классы-приложения)
  - Используйте `CFlow` и `CStateFlow` для для `state` public API
- Добавьте необходимые фрагменты в Android-приложение, фрагменты наследуйте от `MvvmFragment` из `moko-mvvm`, ориентируйтесь на практику 3 блока
- Добавьте необходимые `ViewController`-ы в iOS приложение, все `ViewController`-ы наследуйте от `MVVMController` из `moko-mvvm`
- Подключите вьюмодели к iOS и Android
- Настройте Android и iOS приложения - их логикой, кроме управления списков, должен управлять общий код
- Приложения должны запускаться
