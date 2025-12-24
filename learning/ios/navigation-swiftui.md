# Навигация для SwiftUI

В стандартном `NavigationStack` есть ограничения: нельзя просто очистить стек экранов, неудобно обрабатывать logout, сложно управлять переходами между флоу.
Чтобы это решить, мы используем кастомный навигационный слой, построенный на базе:
- **AppRouter<T: Hashable>** — управляет навигационными событиями (`push`, `pop`, `replace`, `replaceStack`, `popUntil` и др.) через Combine.
- **AppRouterHost<T: Hashable>** — хост для `NavigationStack`, слушает команды роутера и обновляет стек экранов.
- **AppRoute** — перечисление маршрутов приложения (`signIn`, `main`, `detail`).

Главное преимущество такого подхода — полный контроль над стеком навигации, анимациями и маршрутизацией.

## AppRoute

`AppRoute` - это основа навигации. Каждый экран, на который вы хотите перейти, должен быть кейсом этого `enum`.

```swift
import SwiftUI

enum AppRoute: Hashable {
    case signIn
    case main
    case detail(id: Int)
}

```
- Enum обязательно должен реализовывать `Hashable`, чтобы `NavigationStack` мог работать с этим enum'ом.
- Параметры экранов передаются через associated values `(.detail(id: Int))`.
- В сложных проектах можно заводить несколько Route, например AuthRoute для авторизации и AppRoute для основного функционала приложения.

## AppRouter

AppRouter — это "пульт управления" навигацией. Он сам не переключает экраны, а только отправляет команды.

```swift
class AppRouter<T: Hashable>: ObservableObject {
    // Приватные сабджекты для управления событиями
    private let commandSubject = PassthroughSubject<RouterCommand<T>, Never>()

    // Публичные паблишеры
    var commandPublisher: AnyPublisher<RouterCommand<T>, Never> {
        commandSubject.eraseToAnyPublisher()
    }

    /// Добавить экран следующим в стеке навигации
    func push(_ route: T) {
        commandSubject.send(.push(route: route))
    }

    /// Заменить весь стек навигации на новый роут
    func replace(_ route: T) {
        commandSubject.send(.replace(route: route))
    }

    /// Заменить весь стек навигации на другой стек
    func replaceStack(_ stack: [T]) {
        commandSubject.send(.replaceStack(stack: stack))
    }

    func popUntil(popIf: @escaping (T) -> Bool) {
        commandSubject.send(.popUntil(popIf: popIf))
    }

    /// Убрать из стека навигации роуты удовлетворяющие условию и добавить новый
    func popUntilAndPush(popIf: @escaping (T) -> Bool, pushRoute: T) {
        commandSubject.send(.popUntilAndPush(popIf: popIf, pushRoutes: [pushRoute]))
    }

    /// Убрать из стека навигации роуты удовлетворяющие условию и добавить несколько новых
    func popUntilAndPush(popIf: @escaping (T) -> Bool, pushRoutes: [T]) {
        commandSubject.send(.popUntilAndPush(popIf: popIf, pushRoutes: pushRoutes))
    }

    /// Убрать из стека навигации один экран
    func pop() {
        commandSubject.send(.pop)
    }
}

enum RouterCommand<T: Hashable> {
    case push(route: T)
    case popUntil(popIf: (T) -> Bool)
    case popUntilAndPush(popIf: (T) -> Bool, pushRoutes: [T])
    case pop
    case replace(route: T)
    case replaceStack(stack: [T])
}

```

Пример использования:

```swift
@EnvironmentObject var router: AppRouter<AppRoute> 

router.push(.main)        // перейти на главный экран
router.pop()              // вернуться назад
router.replace(.signIn)   // очистить стек и перейти на авторизацию

```
Как router передается между экранами:
Роутер удобно получать через `@EnvironmentObject`, так его не нужно вручную передавать во все экраны.
- AppRouterHost создаёт и хранит объект `AppRouter`.
- Все экраны внутри этого хоста получают роутер через `environmentObject(router)`.
- SwiftUI автоматически вкладывает объект в иерархию view, так что любой экран, который находится внутри `AppRouterHost`, может использовать его через @`EnvironmentObject`.

В AppRouterHost:

```swift
@ObservedObject private var router = AppRouter<T>()

var body: some View {
    NavigationStack(path: $navigationPath) {
        routeView(router, rootRoute)
        .navigationDestination(
            or: T.self,
            destination: { routeView(router, $0) }
        )
    }.environmentObject(router) // роутер передается всем дочерним экранам
}

```

В любом дочернем экране:
```swift
struct AuthScreen: View {
    @EnvironmentObject var router: AppRouter<AppRoute>

    var body: some View {
        Button("Войти") {
            router.replace(.main)
        }
    }
}
```

## AppRouterHost

`AppRouterHost` связывает `AppRouter` с `NavigationStack`. Он слушает команды роутера и обновляет, какие экраны должны быть показаны.

Основные свойства:
- `rootRoute` — корневой экран (с которого начинается навигация).
- `navigationPath` — стек экранов, которые уже открыты.
- `routeView` - билдер конкретного экрана. В аргумент приходит роут. Когда используем enum для роута - делаем просто switch по вариантам этого enum и возвращаем нужные экраны.

Пример: 

```swift
AppRouterHost<AppRoute>(initialRoute: .signIn) { router, route in
    switch route {
    case .signIn:
        AuthScreen()
    case .main:
        MainScreen()
    case let .detail(id):
        DetailScreen(id: id)
    }
}
```
- При старте открывается signIn. 
- Если вызвать router.push(.main) → перейдем на экран main. 
- Если вызвать router.pop() → вернемся обратно на signIn.

В итоге у нас получается такая последовательность: 

Экран → AppRouter (отправил команду) → AppRouterHost (выполнил) → NavigationStack (обновился)


## RootScreenView

Как видно из названия, это корневой экран приложения, именно он решает какой экран показать в данный момент. Если в приложении несколько роутов, то именно здесь будет происходить переключение между ними 

```swift
struct RootScreenView: View {
    @State private var root: RootScreen = .splash

    var body: some View {
        LogoutNavigationHookView(onLogout: {
            root = .mainFlow(route: .signIn)
        }) {
            switch root {
            case .splash:
                SplashScreen(root: $root)
            case let .mainFlow(route):
                MainNavigationView(initialRoute: route)
            }
        }
    }
}
```

При запуске приложения `root = .splash`, соответсвенно показываться будет SplashScreen. 
После этого сплешскрин определяет, авторизован юзер или нет. 
Если не авторизван то меняет значение `root` на `.mainFlow(.signIn)`.
Если авторизован, то меняет значение `root` на `.mainFlow(.main)`.
В этот момент RootScreenView переключает показ на `MainNavigationView`.
Если пользователь нажимает "Выйти", то срабатывает `LogoutNavigationHookView`, и всё сбрасывается на SignIn.

## LogoutNavigationHookView

В приложениях часто нужно сбросить навигацию при выходе пользователя. Для этого используется LogoutNavigationHookView.
Он оборачивает контент и отслеживает события логаута через logoutHandler. Когда происходит событие логаута, вызывается onLogout(), и можно, например, сбросить стек навигации на экран авторизации.

```swift 
import Combine
import MultiPlatformLibrary
import SwiftUI

struct LogoutNavigationHookView<Content: View>: View {

    // LogoutNavigationHookView слушает события логаута через logoutHandler.
    private var logoutHandler: LogoutHandler = Koin.instance.getLogoutHandler()

    let onLogout: () -> Void
    let content: () -> Content

    init(onLogout: @escaping () -> Void, @ViewBuilder content: @escaping () -> Content) {
        self.onLogout = onLogout
        self.content = content
    }

    var body: some View {
        content()
            .onReceive(
                logoutHandler.logoutEvents.toPublisher()
                    .catch { _ in Empty<KotlinUnit, Never>() }
                    .assertNoFailure()
            ) { _ in

                // При логауте вызывается onLogout(), которое сбрасывает root.
                onLogout()
            }
    }
}

```

В этом примере вызов `onLogout` приводит к сбросу значения root на .mainFlow(.signIn).
`RootScreenView` реагирует на изменение root и показывает экран авторизации.

```swift
struct RootScreenView: View {
    @State private var root: RootScreen = .splash

    var body: some View {
        LogoutNavigationHookView(onLogout: {

            // Сбрасываем стек навигации на экран авторизации
            root = .mainFlow(route: .signIn)
        }) {
            switch root {
            case .splash:
                SplashScreen(root: $root)
            case let .mainFlow(route):
                MainNavigationView(initialRoute: route)
            }
        }
    }
}
```
Если мы получаем событие logout на любом экране, весь стек навигации автоматически сбрасывается.

- [Навигация для UIKit через координаторы (Архив)](./navigation-uikit.md)
