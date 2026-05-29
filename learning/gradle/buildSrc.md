---
sidebar_position: 6
---

# buildSrc

`buildSrc` — это специальная директория в корне Gradle-проекта. Всё, что лежит в `buildSrc/src/main/kotlin`,
автоматически компилируется и становится доступным в `build.gradle.kts` всех модулей проекта.

Раньше buildSrc был популярным способом вынести общие версии зависимостей:

```kotlin
// buildSrc/src/main/kotlin/Deps.kt
object Deps {
    const val coroutines = "org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.2"
}
```

## Недостатки buildSrc

- Любое изменение в buildSrc **инвалидирует весь build cache** проекта — Gradle пересобирает всё с нуля
- buildSrc не поддерживает номера версий и не публикуется — это часть проекта
- С ростом проекта сборка buildSrc замедляется, так как не закеширована

## Альтернатива: convention plugins (рекомендуется)

Современный подход — выносить общую логику в convention plugins через `includeBuild` (отдельный
Gradle-проект `build-logic`). Подробнее — в разделе [Convention plugins](./intro-gradle#convention-plugins-build-logic).

Преимущества:
- Изменения в convention plugins **не трогают build cache** основного проекта
- Convention plugins можно версионировать и публиковать
- Поддерживаются плагином `kotlin-dsl`, дающим автодополнение в IDE

## Материалы

<iframe src="//www.youtube.com/embed/QqqYzaOzq3A?list=PL6yFiPOVXVUi90sQ66dtmuXP-1-TeHwl5" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
<br/>

- [Gradle docs - Use buildSrc to abstract imperative logic](https://docs.gradle.org/current/userguide/organizing_gradle_projects.html#sec:build_sources)
- [Using BuildSrc for Custom Logic in Gradle Builds](https://www.jrebel.com/blog/using-buildsrc-custom-logic-gradle-builds)
- [Gradle Dependency Management With BuildSrc and Kotlin DSL](https://betterprogramming.pub/gradle-dependency-management-with-buildsrc-and-kotlin-dsl-1de958eab166)
