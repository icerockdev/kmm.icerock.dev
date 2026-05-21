---
sidebar_position: 2
---

# Подключение и настройка

## Плагин Compose Multiplatform

Для подключения Compose Multiplatform используется официальный Gradle-плагин `org.jetbrains.compose`.

```kotlin
plugins {
    kotlin("multiplatform")
    id("org.jetbrains.compose")
    id("org.jetbrains.kotlin.plugin.compose") // Kotlin Compose compiler plugin
}
```

Версия плагина задаётся в `gradle.properties` или `build.gradle.kts`:

```kotlin
// build.gradle.kts
plugins {
    kotlin("multiplatform") version "2.0.21"
    id("org.jetbrains.compose") version "1.7.3"
    id("org.jetbrains.kotlin.plugin.compose") version "2.0.21"
}
```

## Подключение модулей

```kotlin
kotlin {
    androidTarget()
    listOf(iosX64(), iosArm64(), iosSimulatorArm64()).forEach { iosTarget ->
        iosTarget.binaries.framework {
            baseName = "shared"
            isStatic = true
        }
    }

    sourceSets {
        commonMain.dependencies {
            implementation(compose.runtime)
            implementation(compose.foundation)
            implementation(compose.material3)
            implementation(compose.ui)
        }

        androidMain.dependencies {
            implementation(compose.preview)
            implementation("androidx.activity:activity-compose:1.9.3")
        }
    }
}
```

## Android

В Android Activity используйте `setContent`:

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Greeting("Android")
            }
        }
    }
}
```

## iOS

На iOS Compose UI выводится через `ComposeUIViewController`:

```kotlin
// commonMain
fun MainViewController() = ComposeUIViewController {
    MaterialTheme {
        Greeting("iOS")
    }
}
```

```swift
// iOS App
import SwiftUI
import shared

struct ComposeView: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> UIViewController {
        MainViewControllerKt.MainViewController()
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
}

@main
struct iOSApp: App {
    var body: some Scene {
        WindowGroup {
            ComposeView().ignoresSafeArea()
        }
    }
}
```

## Desktop

```kotlin
// jvmMain
fun main() = application {
    Window(title = "Compose Desktop", state = rememberWindowState()) {
        MaterialTheme {
            Greeting("Desktop")
        }
    }
}
```

## Дополнительная информация

- [Getting Started — официальное руководство](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-getting-started.html)
- [Compose Multiplatform — Tutorials](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials)
- [Настройка iOS в Compose Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-ios.html)
