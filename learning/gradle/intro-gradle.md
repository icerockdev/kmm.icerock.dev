---
sidebar_position: 0
---

# Введение в Gradle

Работая с Kotlin Multiplatform Mobile, для iOS разработчика главным испытанием становится не изучение
Kotlin, а изучение билд-системы Gradle, которая собирает мультиплатформенную библиотеку. В данном
разделе разобрано, что из себя представляет Gradle с точки зрения iOS разработчиков.

## Gradle

[Gradle](https://gradle.org/) — это система сборки, имеющая гибкую систему конфигурации через плагины
и позволяющая описывать конфигурацию сборки в виде kotlin файлов.

Задача Gradle, как и любой системы сборки, скомпилировать исходный код в исполняемое приложение
или подключаемую библиотеку. Благодаря ему разработчику не требуется писать команды вызова
компилятора kotlin и передавать ему список исполняемых файлов, подключенных библиотек и прочее.

Также Gradle имеет управление зависимостями (подключение внешних библиотек или разных модулей одного проекта).
Зависимости скачиваются с Maven репозиториев, например [mavenCentral](https://maven.apache.org/repository/index.html)
(хоть сам Maven тоже является билд-системой, но Gradle использует от него только репозитории, на которых хранятся
скомпилированные опубликованные зависимости).

Gradle написан на Java и является JVM (Java Virtual Machine) приложением, то есть для его
использования требуется установленная на исполняемой машине JDK (Java Development Kit).
Наиболее стабильная версия JDK — JDK 17 или новее (минимальная версия для Gradle 8.x). JDK можно скачать
на сайте [Adoptium](https://adoptium.net/) (Temurin) или использовать версию, встроенную в Android Studio.

Gradle имеет обширную, подробную документацию, доступную [тут](https://docs.gradle.org/current/userguide/userguide.html).

## Gradle Daemon

Это долгоживущий фоновый процесс, который запускается на выбранной JVM при первой сборке. Он помогает избежать
затратного процесса начальной загрузки JVM, при этом кешируя данные о ваших предыдущих билдах в память,
что заметно ускоряет скорость сборки проекта.

Подробнее о Gradle Daemon и его подключении к проекту вы можете прочитать
[тут](https://docs.gradle.org/current/userguide/gradle_daemon.html) и [тут](https://docs.gradle.org/current/userguide/command_line_interface.html#gradle_daemon_options).

## Контекст для понимания дальнейших разделов

1. Gradle при каждом запуске проходит по нескольким фазам - инициализация, конфигурация, выполнение.
2. Файлы gradle во всех новых проектах написаны на Kotlin Script, расширение файла `.gradle.kts`.
   При использовании Kotlin Script IDE предоставляет полноценный анализ с подсказками.
   На старых проектах могут встретиться файлы gradle на Groovy (тогда расширение просто `.gradle`).

## Составляющие конфигурации проекта

Проект, использующий Gradle в качестве системы сборки, содержит:

1. `settings.gradle.kts` - настройки проекта, например подключение модулей проекта;
2. `build.gradle.kts` - конфигурация конкретного gradle модуля;
3. `gradle.properties` - файл, содержащий набор пар ключ+значение, передаваемых в Gradle.

### settings.gradle

Файл с настройками всего проекта (данные настройки влияют на все модули).  
Во всех новых проектах на Kotlin - `settings.gradle.kts`, в старых может быть написан на Groovy (тогда имя `settings.gradle`).
Подробная информация в [документации](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:settings_file).

Код в данном файле выполняется в момент инициализации проекта (при каждом запуске Gradle происходит
по стадиям: инициализация, конфигурация, выполнение).

Пример содержимого с пояснениями:

```
// Блок pluginManagement позволяет настроить работу с плагинами билдсистемы
pluginManagement {
    // Определяем список maven репозиториев, в которых нужно искать подключаемые плагины.
    // Если данный блок не объявлять, то будет использоваться gradlePluginPortal - https://plugins.gradle.org/
    repositories {
        mavenCentral()
        google()
    }
}

// Данный блок позволяет настроить для всех модулей проекта работу с зависимостями
dependencyResolutionManagement {
    // Определяем список maven репозиториев, в которых нужно искать подключаемые библиотеки.
    repositories {
        mavenCentral()
        google()
    }
}

// Подключение composite build - является темой для продвинутого погружения, обычно на проектах это не встречается.
// Если кратко - это подключение другого самостоятельного gradle проекта к сборке нашего проекта,
// с возможностью подключать модули подключенного проекта как внешние зависимости в нашем проекте.
// https://docs.gradle.org/current/userguide/composite_builds.html
includeBuild("network-generator")

// Подключение модулей проекта, каждый из них будет определяться как gradle модуль и будет читаться его build.gradle файл.
// Двоеточие в пути обозначает уровень иерархии в файловой структуре.
include(":network")
include(":sample:mpp-library")
```

_Является упрощенным вариантом
с [moko-network](https://github.com/icerockdev/moko-network/blob/master/settings.gradle.kts)_.

(!) Основной сценарий, когда iOS разработчику нужно работать с файлом `settings.gradle.kts` - разработчик
сам создает новый gradle модуль, и нужно подключить его к билдсистеме (то есть добавляет `include(":mymodule")`).

### build.gradle

Файл с конфигурацией модуля gradle проекта. Определяет всю логику сборки данного модуля (что собираем, как собираем).
В новых проектах на Kotlin - `build.gradle.kts`, в старых может быть написан на Groovy (тогда имя `build.gradle`).
Подробная информация в [документации](https://docs.gradle.org/current/userguide/tutorial_using_tasks.html).

Пример содержимого с пояснениями:

```
// Подключение плагинов, которые и содержат всю основую логику сборки
plugins {
    // Плагин для сборки android библиотек. Требуется у нас в проектах, так как мы собираем из мультиплатформы android код, помимо ios.
    // Подробнее - https://developer.android.com/studio/build/index.html
    id("com.android.library")
    // Плагин мультиплатформы, дает возможность собирать kotlin код разными компиляторами - Kotlin/JVM, Kotlin/JS, Kotlin/Native.
    // Подробнее - https://kotlinlang.org/docs/multiplatform-dsl-reference.html
    id("org.jetbrains.kotlin.multiplatform")
    // Наш плагин мобильной мультиплатформы, упрощает настройку градл проектов для mobile использования (android, ios).
    // Подробнее - https://github.com/icerockdev/mobile-multiplatform-gradle-plugin
    id("dev.icerock.mobile.multiplatform")
    // Плагин для генерации кода сериализации в момент компиляции, от библиотеки kotlinx.serialization.
    // Подробнее - https://github.com/Kotlin/kotlinx.serialization
    id("org.jetbrains.kotlin.plugin.serialization")
}

// Объявление зависимостей данного модуля. Чем меньше зависимостей объявлено, тем быстрее будет производиться компиляция модуля.
// Зависимости ищутся в репозиториях, которые могут быть указаны как в самом build.gradle, так и в settings.gradle централизованно
dependencies {
    // Подключение зависимости к common коду, в виде реализации (implementation).
    // Это означает, что классы данной зависимости не будут видны вне данного модуля без явного ее подключения.
    commonMainImplementation(libs.coroutines)

    // Подключение зависимости к common коду, транзитивно (api).
    // Это означает, что классы данной зависимости будут видны вне данного модуля при подключении нашего модуля.
    commonMainApi(libs.kotlinSerialization)
    commonMainApi(libs.ktorClient)

    // Подключение зависимости к android таргету, транзитивно. Классы данной зависимости видны только в androidMain сорссете.
    androidMainApi(libs.ktorClient.okHttp)

    // Подключение зависимости к ios таргету, транзитивно. Классы данной зависимости видны только в iosMain сорссете.
    iosMainApi(libs.ktorClient.ios)

    // Подключение другого модуля нашего проекта, в виде реализации.
    commonMainImplementation(project(":network"))

    // Подключение зависимостей к общему коду тестов, в виде реализации.
    commonTestImplementation(libs.ktorClient.mock)
    commonTestImplementation(libs.kotlinTest)
    commonTestImplementation(libs.kotlinTestAnnotations)

    // Подключение зависимостей к android таргету тестов, в виде реализации.
    androidTestImplementation(libs.kotlinTestJUnit)
}
```

_Является упрощенным вариантом
с [moko-network](https://github.com/icerockdev/moko-network/blob/master/network/build.gradle.kts)_.

Основные сценарии, когда iOS разработчику нужно работать с файлом `build.gradle`:

1. Подключение новой зависимости к модулю
2. Подключение плагина с дополнительным функционалом (
   например [moko-resources](https://github.com/icerockdev/moko-resources)
   / [moko-network](https://github.com/icerockdev/moko-network))

## gradle.properties

Файл с опциями выполнения gradle.  
Подробнее в [документации](https://docs.gradle.org/current/userguide/build_environment.html).

Пример содержимого с пояснениями:

```
# сколько максимум оперативной памяти gradle может использовать
org.gradle.jvmargs=-Xmx4096m
# выключение опции "конфигурация налету", так как многомодульные проекты с ней ломаются часто
org.gradle.configureondemand=false
# включение параллельной сборки - разные gradle модули могут выполнять свои задачи параллельно
org.gradle.parallel=true

# какой вариант кодстайла kotlin используется в проекте — используется IDE для включения верного кодстайла
kotlin.code.style=official

# использование androidX библиотек для андроида, нужно android gradle plugin'у
android.useAndroidX=true

# формат директорий android source set (version=2 значит src/androidMain/kotlin, а не src/main/kotlin)
kotlin.mpp.androidSourceSetLayoutVersion=2
# отключение предупреждений о нестабильности мультиплатформы (KMP стабилен с 2023 года)
kotlin.mpp.stability.nowarn=true

# отключение статического framework warning moko-resources
moko.resources.disableStaticFrameworkWarning=true

# отключение предупреждения о том, что используется iOS-шорткат для настройки таргетов iOS
mobile.multiplatform.iosTargetWarning=false

# путь до Xcode проекта или workspace,
# используется Kotlin Multiplatform Mobile плагином для Android Studio, чтобы запускать iOS приложение с отладчиком
# Подробнее https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile
xcodeproj=./sample/ios-app
```

_Является упрощенным вариантом
с [moko-network](https://github.com/icerockdev/moko-network/blob/master/gradle.properties)_.

# Gradle Sync

Система сборки Gradle не связана напрямую с IDE и рассчитана в первую очередь на работу без UI, через
консоль. Но в IDEA и Android Studio реализована полная интеграция с Gradle, позволяющая запускать
команды Gradle, видеть модули Gradle и прочее. Чтобы IDE могла считать конфигурацию проекта,
используется импорт проекта, действие называется Gradle Sync.

Кнопка для запуска Gradle Sync в Android Studio:
![gradle sync in android studio](/assets/gradle-sync-android-studio.png)

После успешного завершения импорта проекта, через Gradle Sync, мы получаем проиндексированный
проект, в котором каждый gradle модуль обработан и считаны подключенные зависимости и настройки
проекта (используется ли котлин, мультиплатформа и прочее):

![project panel](/assets/idea-gradle-project-modules.png)

Также после импорта проекта в IDE доступна панель работы с Gradle - в ней можно посмотреть все
Gradle-модули и все задачи, которые доступны в каждом модуле:

![gradle tasks panel](/assets/idea-gradle-tasks.png)

Самая полезная и часто используемая для iOS разработчиков задача - скомпилировать iOS фреймворк и
перенести в директорию для Cocoapods.

Если используется плагин [mobile-multiplatform](https://github.com/icerockdev/mobile-multiplatform-gradle-plugin),
таска называется `syncMultiPlatformLibraryDebugFrameworkIosX64`, где:

- MultiPlatformLibrary - имя фреймворка
- Debug - конфигурация сборки
- IosX64 - таргет (симулятор на Intel Mac)

Если используется официальный CocoaPods плагин (`org.jetbrains.kotlin.native.cocoapods`), фреймворк
собирается и подключается через CocoaPods автоматически. Xcode вызывает задачу
`embedAndSignAppleFrameworkForXcode` перед сборкой — отдельно запускать её не нужно.

Для отладки на Apple Silicon (M1/M2/M3) используйте таргет `iosSimulatorArm64` вместо `iosX64`.

![gradle cocoapods task](/assets/idea-gradle-cocoapods.png)

# Convention plugins (build-logic)

Когда в проекте несколько модулей с повторяющейся Gradle-конфигурацией, дублировать её в каждом
`build.gradle.kts` неудобно. Решение — вынести общую логику в convention plugins, которые
подключаются как includeBuild в `settings.gradle.kts`:

```
// settings.gradle.kts
includeBuild("build-logic")
```

Внутри `build-logic` лежат precompiled script plugins — обычные `.gradle.kts` файлы в
`src/main/kotlin`, которые подключаются по имени:

```kotlin
// mpp-library/build.gradle.kts
plugins {
    id("multiplatform-library-convention")
    id("detekt-convention")
}
```

Plugin'ы могут настраивать таргеты, зависимости, компилятор — всё, что обычно пишется в
`build.gradle.kts`. Подробнее в [документации](https://docs.gradle.org/current/userguide/custom_plugins.html).

# Внесение изменений в конфигурацию

Какие блоки конфигурации можно использовать в конкретном `build.gradle`, зависит от подключенных к
данному проекту плагинов. Каждый плагин может добавлять свои блоки конфигурации и свои задачи.

Например, плагин `org.jetbrains.kotlin.multiplatform` добавляет блок `kotlin` и множество задач
типа `compileKotlinIosX64` (если в блоке `kotlin` включен таргет `iosX64`).

Детальная информация о том, какие настройки доступны в блоке `kotlin`, доступна
на [сайте документации](https://kotlinlang.org/docs/multiplatform-dsl-reference.html).
Начиная с Kotlin 2.0 опции компилятора задаются через блок `compilerOptions { }` внутри `kotlin { }`.

Помимо документации узнать доступный функционал, предоставляемый плагином, можно, используя подсказки
IDEA, когда используется Gradle Kotlin DSL, а не Groovy. В таком случае при успешно завершенной
индексации (после клика на Gradle Sync) можно использовать автозавершение кода и переход к объявлению.

Использование автодополнения (либо подождать при наборе кода, либо нажать `Cmd + space`)
![gradle kotlin dsl autocomplete](/assets/kotin-script-autocomplete.png)

Использование перехода к объявлению типа (`Cmd + left click`):
![gradle kotlin dsl definition](/assets/go-to-definition.gif)
