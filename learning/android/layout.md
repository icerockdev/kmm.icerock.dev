# Верстка

## Jetpack Compose

Для верстки Android приложений мы используем [Jetpack Compose](https://developer.android.com/compose) — декларативный UI toolkit от Google. Compose позволяет описывать UI на Kotlin без XML.

### Layouts

- [Компоненты Material 3](https://developer.android.com/develop/ui/compose/components) — готовые компоненты (Buttons, Cards, Dialogs, etc.)
- [Основы layout'ов](https://developer.android.com/develop/ui/compose/layouts/basics) — `Column`, `Row`, `Box`
- [Модификаторы](https://developer.android.com/develop/ui/compose/modifiers) — порядок модификаторов имеет значение
- [Scaffold](https://developer.android.com/develop/ui/compose/layouts/material/scaffold) — базовый каркас экрана с top bar, bottom bar, FAB, snackbar
- [ConstraintLayout](https://developer.android.com/develop/ui/compose/layouts/constraintlayout) — для сложных layout'ов с зависимостями между элементами
- [Custom layouts](https://developer.android.com/develop/ui/compose/layouts/custom) — создание собственных layout'ов через `Layout` composable

### Списки и ленивая загрузка

- [Lazy lists](https://developer.android.com/develop/ui/compose/lists) — `LazyColumn`, `LazyRow`, `LazyVerticalGrid` с эффективной прокруткой и переиспользованием элементов
- Ключи для элементов: всегда указывайте `key { }` для стабильной идентификации элементов списка

### Предпросмотр

- [`@Preview`](https://developer.android.com/develop/ui/compose/previews) — предпросмотр composables прямо в Android Studio без запуска приложения
- [Preview parameters](https://developer.android.com/develop/ui/compose/previews/preview-parameters) — передача тестовых данных в превью через `PreviewParameterProvider`

### Взаимодействие с View

- [Interop: Compose в View](https://developer.android.com/develop/ui/compose/migrate/interoperability-views/compose-in-views) — `ComposeView` для встраивания Compose в существующий View-based экран
- [Interop: View в Compose](https://developer.android.com/develop/ui/compose/migrate/interoperability-views/views-in-compose) — `AndroidView` для встраивания View-компонентов в Compose
