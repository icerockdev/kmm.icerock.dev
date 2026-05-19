---
sidebar_position: 8
---

# Convention plugins

<iframe src="//www.youtube.com/embed/4Dmyc00Jlzc?list=PL6yFiPOVXVUi90sQ66dtmuXP-1-TeHwl5" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
<br/>

<iframe src="//www.youtube.com/embed/hpT0VutO5xk" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
<br/>

Convention plugins (precompiled script plugins) — это Gradle-плагины, которые подключаются по короткому
имени и содержат переиспользуемую конфигурацию. Они — современная замена `buildSrc`.

## Как устроены

В отдельном Gradle-проекте (`build-logic`) в директории `src/main/kotlin` лежат файлы
`*.gradle.kts`. Имя файла становится ID плагина.

```
build-logic/
├── build.gradle.kts          # подключает `kotlin-dsl` plugin
├── settings.gradle.kts       # импортирует version catalog из корня проекта
└── src/main/kotlin/
    ├── base-convention.gradle.kts
    ├── multiplatform-library-convention.gradle.kts
    └── android-app-convention.gradle.kts
```

Пример плагина из boilerplate:

```kotlin
// build-logic/src/main/kotlin/multiplatform-library-convention.gradle.kts
plugins {
    id("base-convention")
    id("com.android.library")
    id("android-base-convention")
    id("org.jetbrains.kotlin.multiplatform")
}

kotlin {
    androidTarget()
    iosX64()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        applyDefaultHierarchyTemplate()
    }
}
```

Подключение в модуле:

```kotlin
// mpp-library/build.gradle.kts
plugins {
    id("multiplatform-library-convention")
    id("detekt-convention")
    id("org.jetbrains.kotlin.native.cocoapods")
}
```

## Как подключить build-logic к проекту

В `settings.gradle.kts` корня проекта:

```kotlin
includeBuild("build-logic")
```

А в `build-logic/settings.gradle.kts` — импорт version catalog из основного проекта:

```kotlin
dependencyResolutionManagement {
    versionCatalogs {
        create("libs") {
            from(files("../gradle/libs.versions.toml"))
        }
    }
}
```

Это позволяет convention plugins использовать те же версии зависимостей, что и весь проект.

## Convention plugins vs buildSrc

Convention plugins решают главную проблему buildSrc: изменения в них **не инвалидируют build cache**
основного проекта. Подробное сравнение — в разделе [buildSrc](./buildSrc).

## Материалы

- [Gradle docs — Convention plugins](https://docs.gradle.org/current/userguide/sharing_build_logic_between_subprojects.html#sec:convention_plugins)
