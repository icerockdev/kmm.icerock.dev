---
sidebar_position: 7
---

# Composite builds

Composite build (композитная сборка) — это подключение одного самостоятельного Gradle-проекта к сборке
другого. В `settings.gradle.kts` это выглядит так:

```kotlin
includeBuild("build-logic")
```

В отличие от `buildSrc`, composite build — это полноценный Gradle-проект со своим `settings.gradle.kts`,
`build.gradle.kts` и версиями. Его можно даже опубликовать и переиспользовать между разными проектами.

## Зачем нужен

Composite build — основа для **convention plugins** (см. раздел [Convention plugins](./intro-gradle#convention-plugins-build-logic)).
Вместо того чтобы дублировать настройки Gradle в каждом модуле, вы выносите общую логику в `build-logic`
и подключаете его через `includeBuild`.

## Composite build vs buildSrc

| | buildSrc | Composite build |
|---|---|---|
| Инвалидация cache | Любое изменение сбрасывает весь кеш проекта | Кеш проекта не трогается |
| Версионирование | Нет | Можно публиковать |
| Скорость | Замедляется на больших проектах | Работает как обычный Gradle-проект с кешированием |

## Материалы

<iframe src="//www.youtube.com/embed/iQt0qkS0sLQ?list=PL6yFiPOVXVUi90sQ66dtmuXP-1-TeHwl5" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
<br/>

- [Gradle docs — Composing builds](https://docs.gradle.org/current/userguide/composite_builds.html)
- [How to use Composite builds as a replacement of buildSrc in Gradle](https://medium.com/bumble-tech/how-to-use-composite-builds-as-a-replacement-of-buildsrc-in-gradle-64ff99344b58)
