---
sidebar_position: 1
---

# Kotlin Multiplatform с нуля

## Материалы для изучения Kotlin Multiplatform

1. [Портал Kotlin Multiplatform Mobile](https://kotlinlang.org/lp/mobile/) - общее описание технологии, кейсы использования, информация о сообществе;
2. [Документация по Kotlin Multiplatform Mobile](https://kotlinlang.org/docs/mobile/home.html) - гайды по выполнению типовых задач, примеры, туториалы;
3. [Видео для начинающих от JetBrains](https://www.youtube.com/playlist?list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C);
4. [Codelabs от IceRock](https://codelabs.kmp.icerock.dev/) - пошаговые уроки работы с Kotlin Multiplatform (часть материалов могла устареть). Стоит ознакомиться с:
    1. [MOKO contribution guide](https://codelabs.kmp.icerock.dev/codelabs/moko-contribution/index.html) - для понимания как дорабатывать [moko либы](http://moko.icerock.dev/) при необходимости;
    2. [Append Shared library to Android, iOS projects](https://codelabs.kmp.icerock.dev/codelabs/kmp-mobile-from-zero/index.html) - гайд как добавить мультиплатформу в простые нативные android и ios приложения;
    3. [GiphyApp #1](https://codelabs.kmp.icerock.dev/codelabs/giphy-app-1/index.html), [GiphyApp #2](https://codelabs.kmp.icerock.dev/codelabs/giphy-app-2/index.html) - разработка приложения показывающего список gif изображений на базе [moko-template](https://github.com/icerockdev/moko-template).
5. [Книга Kotlin Multiplatform Mobile with Ktor](https://michaelstromer.nyc/books/kotlin-multiplatform-mobile/introduction) - текстовый материал курса обучения по [KMM на Udemy](https://www.udemy.com/course/kotlin-multiplatform-mobile/)

## Погружение в KMM

1.  Посмотреть информацию о технологии на <https://kotlinlang.org/lp/mobile/> - там краткими тезисами указано в чем суть технологии
2.  [Скачать](https://kotlinlang.org/lp/mobile/ecosystem/) Android Studio, Xcode и плагин Kotlin Multiplatform Mobile - [Настройка окружения для разработки с KMM](/docs/setup)
3.  Hello World
    1.  Создать в Android Studio KMM проект с нуля через мастер создания проектов - <https://kotlinlang.org/docs/mobile/create-first-app.html>
    2.  Запустить это приложение на android, поставить брейкпоинты в common коде, посмотреть что выводится при срабатывании
    3.  Запустить это приложение на iOS (из Android Studio), поставить брейкпоинты в common коде, посмотреть что выводится при срабатывании, понять разницу с андроидом
    4.  Разобраться что указано в build.gradle - что и откуда вызывается, какие конструкции используются и для чего. Поможет документация - <https://kotlinlang.org/docs/reference/mpp-dsl-reference.html>
    5.  Запустить iOS приложение из Xcode, научиться ставить брейкпоинты в kotlin коде [используя xcode-kotlin](https://github.com/touchlab/xcode-kotlin), <https://medium.com/hackernoon/kotlin-xcode-plugin-64f52ff8dc2a>. Директорию с Kotlin исходниками в Xcode проект добавляем используя folder reference (чтоб была синей папкой и просто отражала всю структуру файлов в xcode)
4.  Вкопаться дальше в source set'ы
    1.  Настроить iosMain через иерархическую настройку проекта <https://kotlinlang.org/docs/reference/mpp-share-on-platforms.html#share-code-on-similar-platforms>
    2.  Попробовать настройку каждого варианта сорссетов из статьи <https://habr.com/ru/post/536480/>
    3.  Настроить иерархию сорссетов описанную ниже и включить коммонайзер, посмотреть что IDE может видеть на каждом из уровней
        1.  commonMain
            1.  androidMain
            2.  appleMain
                1.  iosMain
                    1.  iosArm64Main
                    2.  iosX64Main
                2.  macosX64Main
5.  Работа с платформенным api 
    1.  Разобрать статью <https://kotlinlang.org/docs/mobile/connect-to-platform-specific-apis.html>
        1.  Реализовать примеры из статьи в своем Hello World проекте
    2.  Самостоятельно сделать expect/actual функции для генерации Base64 из строки и из изображения
6.  CocoaPods
    1.  Изменить настройки проекта так, чтобы интеграция с Xcode проектом была через cocoapods, без кастомных таргетов и модификации самого xcode проекта.
        1.  <https://kotlinlang.org/docs/reference/native/cocoapods.html>
    2.  Настроить альтернативную интеграцию через <https://github.com/icerockdev/mobile-multiplatform-gradle-plugin> в отдельной ветке (чтобы дальше сравнивать эти два подхода между собой)
        1.  Пример - moko-template
        2.  Статья (пока не опубликованная) - <https://docs.google.com/document/d/1rV_0Bh5hd1BxvwKFYDtEbcJvZgcTOScSZbE58mpNOYE/edit#heading=h.a9ha2i5rx7cj>
    3.  И еще альтернативу через <https://github.com/touchlab/KotlinCocoapods> для сравнения
    4.  Добавить CocoaPod AFNetworking с помощью обоих плагинов
    5.  Вынести работу с AFNetworking в отдельный gradle модуль, чтобы было shared (этот модуль сам компилируется в framework, но не использует внутри AFNetworking) → network (тут AFNetworking)

## MOKO

1.  читаем для начала <http://moko.icerock.dev/> и ридми всех указанных либ там
2.  смотрим <https://www.youtube.com/watch?v=-JjQJG-xkRE&feature=youtu.be>

## Kotlin Multiplatform

1.  expect/actual - <https://kotlinlang.org/docs/mpp-connect-to-apis.html>
    1.  <https://kotlinlang.org/docs/mobile/connect-to-platform-specific-apis.html>
    2.  <https://youtu.be/5QPPZV04-50> - запись с Kotlin 1.4 online event про мпп детали
