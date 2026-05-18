---
sidebar_position: 4
---

# Compose и интеграция с платформой

Compose Multiplatform предоставляет механизмы для встраивания платформенных компонентов в Compose UI и наоборот — встраивания Compose в существующие UIKit/SwiftUI проекты.

## AndroidView

Для использования Android View внутри Compose:

```kotlin
@Composable
fun CameraPreview(modifier: Modifier = Modifier) {
    AndroidView(
        factory = { context ->
            PreviewView(context).apply {
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )
                scaleType = PreviewView.ScaleType.FILL_CENTER
            }
        },
        modifier = modifier
    )
}
```

## UIKitView (iOS)

Для встраивания UIKit компонентов в Compose на iOS:

```kotlin
@Composable
fun NativeMap(modifier: Modifier = Modifier) {
    UIKitView(
        factory = { MKMapView() },
        modifier = modifier
    )
}
```

## ComposeUIViewController (iOS)

Для встраивания Compose UI в существующий UIKit/SwiftUI проект используется `ComposeUIViewController`:

```kotlin
fun MainViewController() = ComposeUIViewController {
    MaterialTheme {
        Greeting("iOS")
    }
}
```

В SwiftUI оборачивается через `UIViewControllerRepresentable`:

```swift
struct ComposeView: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> UIViewController {
        MainViewControllerKt.MainViewController()
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
}
```

## Compose внутри SwiftUI ScrollView

При встраивании Compose компонента в SwiftUI `ScrollView` необходимо явно указывать высоту, так как `UIViewControllerRepresentable` не определяет свой размер автоматически.

Используйте `onGloballyPositioned` в Compose для измерения и колбэк высоты в SwiftUI:

```kotlin
// Kotlin
fun ViewController(onHeightChanged: (Int) -> Unit) = ComposeUIViewController {
    Column(modifier = Modifier.onGloballyPositioned { coordinates ->
        onHeightChanged(coordinates.size.height)
    }) {
        // содержимое
    }
}
```

```swift
// SwiftUI
struct ComponentView: UIViewControllerRepresentable {
    @Binding var measuredHeight: CGFloat

    func makeUIViewController(context: Context) -> UIViewController {
        ViewControllerKt.ViewController { height in
            let scale = UIScreen.main.scale
            measuredHeight = CGFloat(height) / scale
        }
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
}

// В SwiftUI ScrollView
ScrollView {
    ComponentView(measuredHeight: $measuredHeight)
        .frame(height: measuredHeight)
}
```

## Дополнительная информация

- [Compose iOS Integration](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-ios.html)
- [AndroidView](https://developer.android.com/reference/kotlin/androidx/compose/ui/viewinterop/AndroidView)
- [UIKitView](https://jetbrains.github.io/compose-multiplatform/kotlin/multiplatform/ios/UIKitView)
- [SwiftUI Integration Guide](https://johnoreilly.dev/posts/swiftui-component-compose-ios/) — John O'Reilly
