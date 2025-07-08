---
sidebar_position: 9
---

# Version catalogs

<iframe src="//www.youtube.com/embed/yz3yvgWPobg?list=PL6yFiPOVXVUi90sQ66dtmuXP-1-TeHwl5" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
<br/>

Сейчас в наших проектах используются и bundles, о которых упоминается в видео.
Например, ниже часть блоков [libraries] и [bundles] в каталоге версий нашего mobile-compose-boilerplate, с помощью которого стартуем ComposeMultiplatform проекты:
```kotlin
[libraries]
...
# Koin
koin-bom = { module = "io.insert-koin:koin-bom", version.ref = "koinBom" }
koin-core = { module = "io.insert-koin:koin-core" }
koin-annotations = { module = "io.insert-koin:koin-annotations", version.ref = "koinKsp" }
koin-compose = { module = "io.insert-koin:koin-compose" }
...
# moko
moko-resources = { module = "dev.icerock.moko:resources", version.ref = "mokoResources" }
moko-resources-compose = { module = "dev.icerock.moko:resources-compose", version.ref = "mokoResources" }
...

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
```
Использование bundles в buld.gradle фичи в общем коде mpp-library:
```kotlin
dependencies {
    ...
    commonMainImplementation(platform(libs.koin.bom))
    commonMainApi(libs.bundles.koin)

    commonMainApi(libs.bundles.moko.resources)
    ...
 }
```

- [Gradle docs - Version catalogs](https://docs.gradle.org/7.2/userguide/platforms.html#sub:central-declaration-of-dependencies )
- [Gradle docs - Project accessors](https://docs.gradle.org/7.2/userguide/declaring_dependencies.html#sec:type-safe-project-accessors )
- [Gradle docs - Centralized repository declaration](https://docs.gradle.org/7.2/userguide/declaring_repositories.html#sub:centralized-repository-declaration )
