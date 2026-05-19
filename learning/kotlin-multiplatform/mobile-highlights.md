---
sidebar_position: 2
---

# Особенности KMP

Что следует учитывать при разработке с использованием Kotlin Multiplatform:
- `inline`/`value` классы в iOS попадают в виде тех типов, которые оборачивают. то есть `inline class DateTime(val date: String)` в iOS будет просто `String`
- Начиная с Kotlin 2.0 используется **K2 компилятор**, который даёт двукратное ускорение сборки, улучшенный smart-cast и единый компилятор для всех платформ
- **SKIE** — плагин компилятора от Touchlab, автоматически конвертирует Kotlin Flow в Swift AsyncSequence, а suspend-функции — в async/await, без ручного кода на iOS-стороне

## Kotlin vs Swift — в чем разница

1. В котлине есть [анонимные](https://kotlinlang.org/docs/nested-classes.html#anonymous-inner-classes) классы, которые позволяют без создания отдельного именованного класса реализовать интерфейс или абстрактный класс;
2. [Kotlin for Swift developers](https://kotlinlang.org/docs/swift-overview.html) — официальное руководство по различиям в типах, конструкторах, extension, протоколах и т.д.;
3. Разница extensions — [раз](../kotlin-native/swift-extensions), [два](https://kotlinlang.org/docs/swift-overview.html#extensions);
4. [Sealed class vs Swift enum](https://kotlinlang.org/docs/swift-overview.html#sealed-classes).

## Конфликты имен на iOS

- В iOS у всех объектов есть поле `description` (работает как Kotlin `toString`) и поэтому при использовании в Kotlin свойств с таким названием в iOS будет появляться дополнительное поле `_description` - которое и будет свойством от Kotlin

Следующий набор имен на iOS будет конфликтовать либо между собой, либо с iOS сигнатурами:
- State (в SwiftUI используется)
- ключевые слова swift'а

(!) Если у объекта есть функция и переменная с одинаковым именованием, то Swift будет видеть только последнюю из объявленных.

> SKIE частично решает эти проблемы, генерируя Swift-обёртки с корректными именами.

## SKIE — Swift-friendly API из коробки

[SKIE](https://skie.touchlab.co/) — плагин компилятора Kotlin/Native, который модифицирует экспортируемый Xcode Framework, добавляя Swift-обёртки:

- **Flow → AsyncSequence**: любой `Flow<T>` автоматически доступен в Swift как `AsyncSequence` с сохранением типа `T`
- **suspend → async/await**: suspend-функции вызываются из Swift как нативные async-функции с двухсторонней отменой
- **Combine Publisher** (preview): `toPublisher()` для интеграции с Combine
- **Default arguments**: bridge default-значений аргументов в отдельные Swift-функции
- **Enum cases**: Kotlin enum-ы экспортируются как Swift enum-ы, а не как class-ы

Подключение — добавление плагина в `build.gradle.kts`:

```kotlin
plugins {
    id("co.touchlab.skie") version "0.10.10"
}
```

## Compose Multiplatform

[Compose Multiplatform](https://github.com/JetBrains/compose-multiplatform) — UI-фреймворк от JetBrains на основе Jetpack Compose:

- **iOS — Stable** с версии 1.8.0 (май 2025). Текущая версия — 1.11.0 (май 2026)
- Поддержка всех платформ: Android, iOS, Desktop (macOS/Windows/Linux), Web (Wasm, Beta)
- **Compose Hot Reload** — мгновенное обновление UI при изменении кода без потери состояния (стабильно с 1.10.0)
- Навигация, Material 3, lifecycle, saved state — всё доступно в commonMain
- Размер приложения для iOS: + ~9 МБ относительно чистого SwiftUI

## K2 компилятор

Kotlin 2.0 (май 2024) представил новый [K2 компилятор](https://kotlinlang.org/docs/k2-compiler-migration-guide.html):

- Ускоряет компиляцию KMP-проектов до 2×
- Улучшает smart-cast и inference типов
- Единый compiler plugin API для всех платформ
- Compose compiler встроен в Kotlin — не требует отдельной версии

С IntelliJ IDEA 2025.1 K2 mode включён по умолчанию.

## Инструменты

- **KMP plugin** — новый плагин для IntelliJ IDEA и Android Studio (Beta, с мая 2025). Упрощает создание KMP-модулей, запуск на iOS, Compose Previews в commonMain
- **Swift Export** (экспериментальный) — экспорт Kotlin напрямую в Swift, минуя Objective-C. Первый публичный релиз ожидается в Kotlin 2.2.20
- **KMP Wizard** — встроенный в IDE мастер создания KMP-проекта

## Ключевые библиотеки

| Библиотека | Назначение |
|---|---|
| [Ktor](https://ktor.io/) | HTTP-клиент и сервер |
| [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) | Мультиплатформенная сериализация (JSON, ProtoBuf, CBOR) |
| [kotlinx.coroutines](https://github.com/Kotlin/kotlinx.coroutines) | Асинхронность, Flow, каналы |
| [SKIE](https://skie.touchlab.co/) | Swift-friendly API |
| [SQLDelight](https://cashapp.github.io/sqldelight/) | Мультиплатформенная БД |
| [moko libraries](https://github.com/icerockdev?q=moko) | MVVM, ресурсы, alerts, networking от IceRock |

## Текущие ограничения

Несмотря на зрелость, у KMP остаются проблемы, которые ещё не решены:

- **Swift Export** (экспериментальный) — сейчас Kotlin экспортируется в Swift через Objective-C, что теряет многие возможности языка (enum как class, нет async/await из коробки, нет поддержки Swift-only API). Прямой экспорт в Swift решит эти проблемы, но пока не стабилен. Ожидание: стабильный релиз в Kotlin 2.2+
- **Скорость сборки iOS** — Kotlin/Native компилируется медленнее JVM. JetBrains активно оптимизирует это, но для больших проектов сборка iOS-таргета остаётся узким местом
- **Отладка shared code на iOS** — брейкпоинты в общем коде не работают из Xcode. iOS-разработчикам приходится открывать IntelliJ IDEA для отладки shared-модуля
- **Только ObjC interop** — из Kotlin нельзя вызвать Swift-only API (SwiftUI, protocol extensions, замыкания). Приходится писать ObjC-прослойки вручную
- **Один framework на приложение** — Kotlin/Native генерирует единый framework для iOS, что мешает модульной архитектуре. Решение — в Swift Export и кастомной конфигурации
- **Compose для Web — только Beta** — Kotlin/Wasm в стадии Beta, не готов к production для большинства сценариев
