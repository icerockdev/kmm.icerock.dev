---
sidebar_position: 9
---

# Version catalogs

Version catalog (каталог версий) — файл `gradle/libs.versions.toml`, в котором централизованно
объявляются версии, библиотеки, плагины и их группы (bundles). Gradle генерирует по нему typesafe
accessors — вместо строковых координат вы пишете `libs.coroutines` или `libs.ktorClient`.

## Структура TOML

```toml
[versions]
kotlinVersion = "2.1.10"
coroutinesVersion = "1.10.2"
ktorClientVersion = "2.3.12"

[libraries]
coroutines = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "coroutinesVersion" }
ktorClient = { module = "io.ktor:ktor-client-core", version.ref = "ktorClientVersion" }
ktorClientOkHttp = { module = "io.ktor:ktor-client-okhttp", version.ref = "ktorClientVersion" }
ktorClientIos = { module = "io.ktor:ktor-client-darwin", version.ref = "ktorClientVersion" }

[bundles]
koin = [
    "koin-core",
    "koin-annotations",
    "koin-compose"
]
moko-resources = [
    "moko-resources",
    "moko-resources-compose"
]

[plugins]
kotlinMultiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlinVersion" }
androidLibrary = { id = "com.android.library", version.ref = "androidGradleVersion" }
```

## Как использовать

В `build.gradle.kts` подключение через accessors:

```kotlin
plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.androidLibrary)
}

dependencies {
    commonMainImplementation(libs.coroutines)
    commonMainApi(libs.ktorClient)
    androidMainImplementation(libs.ktorClientOkHttp)

    // bundles — группа зависимостей
    commonMainApi(libs.bundles.koin)
    commonMainApi(libs.bundles.moko.resources)
}
```

Accessors сохраняют регистр и меняют `-` на точки: `moko-resources` становится `libs.bundles.moko.resources`,
`ktorClientOkHttp` — `libs.ktorClientOkHttp`.

## Project accessors

Помимо библиотек, Gradle генерирует accessors для модулей проекта через `projects.`:

```kotlin
dependencies {
    commonMainApi(projects.mppLibrary.utils)
    commonMainImplementation(projects.mppLibrary.feature.example)
}
```

Для этого нужно включить флаг в `settings.gradle.kts`:

```kotlin
enableFeaturePreview("TYPESAFE_PROJECT_ACCESSORS")
```

## Импорт в build-logic

Чтобы convention plugins могли использовать тот же каталог, в `build-logic/settings.gradle.kts`
нужно импортировать его из корня проекта:

```kotlin
dependencyResolutionManagement {
    versionCatalogs {
        create("libs") {
            from(files("../gradle/libs.versions.toml"))
        }
    }
}
```

## Материалы

<iframe src="//www.youtube.com/embed/yz3yvgWPobg?list=PL6yFiPOVXVUi90sQ66dtmuXP-1-TeHwl5" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
<br/>

- [Gradle docs — Version catalogs](https://docs.gradle.org/current/userguide/platforms.html#sub:central-declaration-of-dependencies)
- [Gradle docs — Typesafe project accessors](https://docs.gradle.org/current/userguide/declaring_dependencies.html#sec:type-safe-project-accessors)
- [Gradle docs — Centralized repository declaration](https://docs.gradle.org/current/userguide/declaring_repositories.html#sub:centralized-repository-declaration)
