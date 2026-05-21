---
sidebar_position: 1
---

# Compose Multiplatform — обзор

**Compose Multiplatform** (CMP) — фреймворк от JetBrains для декларативного создания пользовательских интерфейсов на Kotlin, работающий на нескольких платформах.

## Поддерживаемые платформы

- **Android** — полноценная поддержка, идентична Jetpack Compose;
- **iOS** — рендеринг через Skia, UI выводится через `ComposeUIViewController`;
- **Desktop (JVM)** — нативные окна через compose-desktop;
- **Web** — экспериментальная поддержка через Canvas.

## Преимущества

- Единый код UI для всех платформ;
- Декларативный реактивный подход (как Jetpack Compose);
- Доступ к платформенным API через `AndroidView` / `UIKitView`;
- Полная совместимость с существующими Kotlin Multiplatform проектами;
- Богатая экосистема: Material3, навигация, анимации.

## Требования

- Kotlin 1.9.0+
- Gradle 6.8+
- Android API 21+
- iOS 12.0+

## Дополнительная информация

- [Официальный сайт](https://www.jetbrains.com/lp/compose-multiplatform/)
- [GitHub репозиторий](https://github.com/JetBrains/compose-multiplatform)
- [Документация JetBrains](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-getting-started.html)
- [Compose Multiplatform Resources](https://jetbrains.github.io/compose-multiplatform/)
- [Compose Multiplatform — статься на kotlinlang.org](https://kotlinlang.org/docs/compose-multiplatform.html)
