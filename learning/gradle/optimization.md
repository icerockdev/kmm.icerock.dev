---
sidebar_position: 10
---

# Оптимизация Gradle

<iframe src="//www.youtube.com/embed/630x5j1OdZM" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
<br/>

## Память и параллелизм

Эти параметры задаются в `gradle.properties` (глобально или в проекте):

```bash
# выделить достаточно памяти JVM
org.gradle.jvmargs=-Xmx4096m
# параллельная сборка модулей
org.gradle.parallel=true
```

Подробнее — в разделе [Build Environment](./build-environment).

## Build cache

Кеширует результаты сборок. Повторная сборка без изменений берёт результат из кеша, а не компилирует заново:

```bash
org.gradle.caching=true
```

## Configuration cache (рекомендуется)

Сохраняет результат фазы конфигурации между запусками. На больших проектах даёт наибольший прирост
скорости — фаза конфигурации выполняется только один раз и загружается из кеша при повторных запусках.

Доступен с Gradle 8.1:

```bash
org.gradle.configuration-cache=true
```

Если плагин не поддерживает configuration cache, Gradle сообщит об ошибке с указанием проблемного плагина.
В таких случаях можно оставить `false` и попробовать снова после обновления плагинов.

## Dependency resolution

- Используйте version catalog (`libs.versions.toml`) — это ускоряет разрешение зависимостей за счёт typesafe accessors
- Не объявляйте зависимости, которые не используются — Gradle всё равно будет их резолвить
- Подключайте зависимости в **самом узком** source set (`commonMainImplementation`, а не `commonMainApi`, если зависимость не должна быть видна наружу)

## Работа с iOS

- Для разработки используйте `iosSimulatorArm64` (Apple Silicon) или `iosX64` (Intel), но не все таргеты сразу — сборка всех архитектур (`iosArm64` + `iosSimulatorArm64` + `iosX64`) дольше
- `embedAndSignAppleFrameworkForXcode` (CocoaPods плагин KGP) кеширует собранный framework, не пересобирая его при каждом запуске из Xcode

## Полезные ссылки

- [Improving dependency sync speeds for your Gradle project](https://msfjarvis.dev/posts/improving-dependency-sync-speeds-for-your-gradle-project/)
