---
title: 3. Погружение в Kotlin Multiplatform Mobile
author: Aleksey Mikhailov
layout: post
---

# Материалы для изучения Kotlin Multiplatform

1. [Портал Kotlin Multiplatform Mobile](https://kotlinlang.org/lp/mobile/) - общее описание технологии, кейсы использования, информация о сообществе;
2. [Документация по Kotlin Multiplatform Mobile](https://kotlinlang.org/docs/mobile/home.html) - гайды по выполнению типовых задач, примеры, туториалы;
3. [Видео для начинающих от JetBrains](https://www.youtube.com/playlist?list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C);
4. [Codelabs от IceRock](https://codelabs.kmp.icerock.dev/) - пошаговые уроки работы с Kotlin Multiplatform (часть материалов могла устареть). Стоит ознакомиться с:
    1. [MOKO contribution guide](https://codelabs.kmp.icerock.dev/codelabs/moko-contribution/index.html) - для понимания как дорабатывать [moko либы](http://moko.icerock.dev/) при необходимости;
    2. [Append Shared library to Android, iOS projects](https://codelabs.kmp.icerock.dev/codelabs/kmp-mobile-from-zero/index.html) - гайд как добавить мультиплатформу в простые нативные android и ios приложения;
    3. [GiphyApp #1](https://codelabs.kmp.icerock.dev/codelabs/giphy-app-1/index.html), [GiphyApp #2](https://codelabs.kmp.icerock.dev/codelabs/giphy-app-2/index.html) - разработка приложения показывающего список gif изображений на базе [moko-template](https://github.com/icerockdev/moko-template).

# Погружение в KMM

1.  Посмотреть информацию о технологии на <https://kotlinlang.org/lp/mobile/> - там краткими тезисами указано в чем суть технологии
2.  [Скачать](https://kotlinlang.org/lp/mobile/ecosystem/) Android Studio, Xcode и плагин Kotlin Multiplatform Mobile - [Настройка окружения для разработки с KMM](/pages/2-setup)
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

# MOKO

1.  читаем для начала <http://moko.icerock.dev/> и ридми всех указанных либ там
2.  смотрим <https://www.youtube.com/watch?v=-JjQJG-xkRE&feature=youtu.be>

# Kotlin Multiplatform

1.  expect/actual - <https://kotlinlang.org/docs/mpp-connect-to-apis.html>
    1.  <https://kotlinlang.org/docs/mobile/connect-to-platform-specific-apis.html>
    2.  <https://youtu.be/5QPPZV04-50> - запись с Kotlin 1.4 online event про мпп детали

# Kotlin/Native

Общее описание "что это такое" - <https://kotlinlang.org/docs/native-overview.html>

Выступление Иготти про внутрянку K/N - <https://youtu.be/DqsYo_4QWSg>

# runtime

1.  Интероп Kotlin и ObjectiveC - <https://kotlinlang.org/docs/native-objc-interop.html> тут вся важная информация о стыке iOS мира и Kotlin. Очень важный раздел для хорошего понимания какой код из common как будет виден в ios нативном мире из swift
2.  Иммутабельность объектов в многопоточной среде - <https://kotlinlang.org/docs/native-immutability.html> это важный на данный момент аспект K/N сильно влияющий на общий код, если в проекте используется многопоточность. По ссылке указана идея заложенная в фундамент memory management'а K/N рантайма.
3.  Сборщик мусора
    1.  Кратко про него сказано тут - <https://kotlinlang.org/docs/native-faq.html#what-is-kotlin-native-memory-management-model>
    2.  Заявлена его переработка - <https://blog.jetbrains.com/kotlin/2020/07/kotlin-native-memory-management-roadmap/>
    3.  <https://youtu.be/f-e-SdAugOs> - выступление Иготти про сборщик
    4.  <https://kotlinlang.org/docs/apple-framework.html#garbage-collection-and-reference-counting> - про сборщик в котлин на айосе. коротко.
    5.  <https://discuss.kotlinlang.org/t/kotlin-native-1-3-50-relaxed-mode/13586> - немного про relaxed режим памяти K/N, но новый сборщик мусора не на нем основан, это просто альтернативная опция про которую мало что известно и я даже не уверен что этот режим до конца доделали.
4.  Многопоточность - <https://kotlinlang.org/docs/native-concurrency.html> тесно связанная с пунктом про иммутабельность тема - многопоточность. Какие возможности предоставляются и как их использовать.
    1.  <https://www.youtube.com/watch?v=nw6YTfEyfO0> - выступление Иготти о том как устроена многопоточность и иммутабельность в K/N
    2.  <https://www.youtube.com/watch?v=oxQ6e1VeH4M> - выступление Галлигана с разжевыванием темы многопоточнсоти
    3.  <https://dev.to/touchlab/practical-kotlin-native-concurrency-ac7> - три статьи от Галлигана с хорошим разобором темы
    4.  <https://kotlinlang.org/docs/mobile/concurrent-mutability.html> - раздел Working with concurrency в документации KMM тоже с хорошим разобром от Галлигана
    5.  Колдовская штука-хак <https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker-bound-reference/> которая позволяет шарить что-либо без заморозки.
    6.  Touchlab гайд по многопоточности + видео - <https://touchlab.co/kotlin-native-concurrency/>
5.  Отладка K/N - <https://kotlinlang.org/docs/native-debugging.html>
    1.  Для простоты есть <https://github.com/touchlab/xcode-kotlin>
    2.  Также позволяет дебажить <https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile>
    3.  И AppCode - <https://blog.jetbrains.com/kotlin/2019/04/kotlinnative-support-for-appcode-2019-1/>
6.  Coroutines - <https://github.com/Kotlin/kotlinx.coroutines/blob/native-mt/kotlin-native-sharing.md> про native-mt ветку и ограничения корутин из-за иммутабельности

# compilation

1.  Про градл плагин K/N - <https://github.com/JetBrains/kotlin-native/blob/master/GRADLE_PLUGIN.md>
2.  Подробный референс градл плагина - <https://kotlinlang.org/docs/mpp-dsl-reference.html>
3.  Про сборку итоговых бинарников K/N - <https://kotlinlang.org/docs/mpp-build-native-binaries.html> для айоса важен бинарь framework и экспорт зависимостей, а также универсальные фреймворки (но мы их не юзаем)
4.  Гибкая настройка компиляции, детали про cinterop - <https://kotlinlang.org/docs/mpp-configure-compilations.html>
5.  <https://youtu.be/5QPPZV04-50> - запись с Kotlin 1.4 online event про мпп детали
6.  Интеграция через cocoapods (официальный плагин) - <https://kotlinlang.org/docs/native-cocoapods.html>
7.  Дебажные символы для крешрепортов осмысленных - <https://kotlinlang.org/docs/native-ios-symbolication.html>
8.  Про внутрянку klib'ов и K/N lib - <https://kotlinlang.org/docs/native-libraries.html>
9.  Про размер бинарника на iOS - <https://youtu.be/hrRqX7NYg3Q?t=1895>
10.  Некоторые хаки компиляции - <https://github.com/JetBrains/kotlin-native/blob/master/HACKING.md> (очень специфичная история)
11. советы по ускорению компиляции от лида K/N - <https://youtrack.jetbrains.com/issue/KT-42294#focus=Comments-27-4752249.0-0>
    1.  Gradle-specific:

        -   Note that first compilation with Gradle usually takes more time than subsequent ones, sometimes significantly (e.g. due to dependencies downloading and missing caches).
        -   Don't use `--no-daemon` when running Gradle, at least for local development.
        -   Try [increasing Gradle's heap](https://docs.gradle.org/current/userguide/build_environment.html#sec:configuring_jvm_memory), e.g. by adding `org.gradle.jvmargs=-Xmx3g` to `gradle.properties`. If you use parallel build, you might need to make the heap even larger or choose the right number of threads with `org.gradle.parallel.threads`.
        -   If you have `kotlin.native.disableCompilerDaemon=true` or `kotlin.native.cacheKind=none` project properties (in `gradle.properties` or Gradle arguments), try to remove them. It is possible that one of these properties was used to workaround a bug that is already fixed.
        -   (Starting from 1.5.0) `linuxX64` and `iosArm64` have an experimental support opt-in support for compiler caches that greatly improves compilation time for debug builds. Try it by adding `kotlin.native.cacheKind.linuxX64=static` or `kotlin.native.cacheKind.iosArm64=static` to `gradle.properties`.
        -   When you need to run the code as soon as possible, don't run Gradle tasks that build everything, like `build` or `assemble`. By using one of those you probably build the same code many times, which increases compilation time for no reason. In some typical cases (like running tests from IDE or starting the app from Xcode) we already avoid unnecessary tasks, but if you have a non-typical case or build configuration you might need to do this yourself.
            -   To run your code during development, you usually need only one binary, so running a single `linkDebug*` task should be enough. Note that compiling a release binary (`linkRelease*`) takes much more time than a debug one (`linkDebug*`).
        -   (Starting from 1.4.30) enable [build cache](https://docs.gradle.org/current/userguide/build_cache.html) in Gradle.

        General:

        -   Use the latest Kotlin version
        -   Try to avoid creating or generating huge classes with a great amount of methods especially if the common use case of such class is calling a small percent of its methods.
