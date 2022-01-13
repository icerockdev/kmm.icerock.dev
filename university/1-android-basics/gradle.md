---
sidebar_position: 3
---

# Gradle

## Обзорно про Gradle

Следующее видео расскажет о том что такое система сборки, зачем она нужна и что предоставляет Gradle (местами есть уход в излишнее на данный момент детали, поэтому не страшно если что-то из видео будет не совсем понятно сразу).

<iframe src="//www.youtube.com/embed/WOBok2u-SL8" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
<br/>

## Gradle и Kotlin DSL

В следующем видео можно увидеть как происходит перевод groovy скриптов на kotlin для большей помощи IDE в написании билд скриптов.

<iframe src="//www.youtube.com/embed/bhUy6JrSSr8" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
<br/>

При возникновении сложностей на практике - пользуйтесь [документацией Gradle о поддержке Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html).

## Gradle детальнее

<iframe src="//www.youtube.com/embed/Yft6h7JkWo0" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
<br/>

## Время практики

1. Создать Android проект по шаблону "No activity" в Android Studio.
1. Установить минимально требуемую версию Android - KitKat (4.4)
1. Установить стабильную (не бета/альфа) версию Android Gradle Plugin
1. Установить идентификатор приложения `dev.icerock.education.gradle`
1. Подключить Hilt - https://developer.android.com/training/dependency-injection/hilt-android#setup
1. Перевести gradle-groovy скрипты на gradle-kotlin-dsl

В результате команда `./gradlew build` должна успешно выполняться.

## Важные ссылки

- Официальная документация Gradle - [docs.gradle.org](https://docs.gradle.org/current/userguide/userguide.html)
- Текущие версии Gradle - [gradle.org](https://gradle.org/releases/)
- Текущие версии Android Gradle Plugin - [developer.android.com](https://developer.android.com/reference/tools/gradle-api)
- Официальная документация Android Gradle Plugin - [developer.android.com](https://developer.android.com/studio/build)
