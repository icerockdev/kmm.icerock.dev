---
sidebar_position: 0
---

# Введение в Gradle

Работая с Kotlin Multiplatform Mobile для iOS разработчика главным испытанием становится не изучение
Kotlin, а изучение билд системы Gradle, которая собирает мультиплатформенную библиотеку. В данном
разделе разобрано что есть Gradle с перспективы iOS разработчиков.

## Gradle

[Gradle](https://gradle.org/) это система сборки, имеющая гибкую систему конфигурации через плагины
и позволяющая описывать конфигурацию сборки в виде groovy / kotlin файлов.

Задача Gradle, как и любой системы сборки, скомпилировать исходный код в исполняемое приложение,
либо подключаемую библиотеку. Благодаря ему разработчику не требуется писать команды вызова
компилятора kotlin и передавать ему список исполняемых файлов, подключенных библиотек и прочее.

Также Gradle имеет управление зависимостями (подключение внешних библиотек или разных модулей одного
проекта). Зависимости скачиваются с Maven репозиториев,
например [mavenCentral](https://maven.apache.org/repository/index.html) (хоть сам Maven тоже
является билдсистемой, но Gradle использует от него только репозитории, на которых хранятся
скомпилированные опубликованные зависимости).

Gradle написан на java и является JVM (Java Virtual Machine) приложением, то есть для его
использования требуется установленная на исполняемой машине JDK (Java Development Kit). Наиболее
стабильная версия JDK - Oracle JDK (рекомендуется к
скачиванию [Oracle JDK 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) для
работы с KMM).

Gradle имеет обширную, подробную документацию,
доступную [тут](https://docs.gradle.org/current/userguide/userguide.html).

## Gradle Daemon

Это долгоживущий фоновый процесс, который запускается на выбранной JVM при первой сборке. Он помогает избежать затратного процесса начальной загрузки JVM, при этом кешируя данные о ваших предыдущих билдах в память, что заметно ускоряет скорость сборки проекта.

Подробнее о Gradle Daemon и как его подключать к проекту вы можете прочитать [тут](https://docs.gradle.org/current/userguide/gradle_daemon.html) и [тут](https://docs.gradle.org/current/userguide/command_line_interface.html#gradle_daemon_options).

## Контекст для понимания дальнейших разделов

1. Gradle при каждом запуске проходит по нескольким фазам - инициализация, конфигурация, выполнение.
2. Файлы gradle могут быть написаны как на groovy (тогда расширение просто `.gradle`, так и на
   Kotlin Script `.gradle.kts`). При использовании Kotlin Script IDE предоставляет полноценный
   анализ с подсказками, поэтому мы используем только Kotlin Script вариант.

## Составляющие конфигурации проекта

Проект, использующий Gradle в качестве системы сборки, содержит:

1. `settings.gradle` / `settings.gradle.kts` - настройки проекта, например подключение модулей
   проекта;
2. `build.gradle` / `build.gradle.kts` - конфигурация конкретного gradle модуля;
3. `gradle.properties` - файл содержащий набор ключ+значение передаваемыми в gradle.

### settings.gradle

Файл с настройками всего проекта (данные настройки влияют на все модули).  
Может быть написан на groovy (тогда имя `settings.gradle`) либо на kotlin - `settings.gradle.kts`.  
Подробная информация
в [документации](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:settings_file)
.  
Код в данном файле выполняется в момент инициализации проекта (при каждом запуске градл происходит
по стадиям инициализация, конфигурация, выполнение).

Пример содержимого с пояснениями:

```
// блок pluginManagement позволяет настроить работу с плагинами билдсистемы
pluginManagement {
    // определяем список maven репозиториев, в которых нужно искать подключаемые плагины.
    // Если данный блок не объявлять то будет использоваться gradlePluginPortal - https://plugins.gradle.org/
    repositories {
        mavenCentral()
        google()
    }
}

// данный блок позволяет настроить для всех модулей проекта работу с зависимостями
dependencyResolutionManagement {
    // определяем список maven репозиториев, в которых нужно искать подключаемые библиотеки.
    repositories {
        mavenCentral()
        google()
    }
}

// подключение composite build - является темой для продвинутого погружения, обычно на проектах это не встретить
// если кратко - это подключение другого самостоятельного gradle проекта к сборке нашего проекта, с возможностью подключать модули подключенного проекта как внешние зависимости в нашем проекте
// https://docs.gradle.org/current/userguide/composite_builds.html
includeBuild("network-generator")

// подключение модулей проекта, каждый из них будет определяться как gradle модуль и будет читаться его build.gradle файл
// двоеточие в пути обозначает уровень иерархии в файловой структуре.
include(":network")
include(":sample:mpp-library")
```

_Является упрощенным вариантом
с [moko-network](https://github.com/icerockdev/moko-network/blob/master/settings.gradle.kts)_.

(!) Основной сценарий когда iOS разработчику нужно работать с файлом `settings.gradle` - разработчик
сам создает новый gradle модуль и нужно подключить его к билдсистеме. То есть
добавляет `include(":mymodule")`.

### build.gradle

Файл с конфигурацией модуля gradle проекта. Определяет всю логику сборки данного модуля (что
собираем, как собираем).  
Может быть написан на groovy (тогда имя `build.gradle`) либо на kotlin - `build.gradle.kts`.  
Подробная информация
в [документации](https://docs.gradle.org/current/userguide/tutorial_using_tasks.html).

Пример содержимого с пояснениями:

```
// подключение плагинов, которые и содержат всю основую логику сборки
plugins {
    // плагин для сборки android библиотек. Требуется у нас в проектах так как мы собираем из мультиплатформы android код, помимо ios
    // подробнее - https://developer.android.com/studio/build/index.html
    id("com.android.library")
    // плагин мультиплатформы. дает возможность собирать kotlin код разными компиляторами - Kotlin/JVM, Kotlin/JS, Kotlin/Native.
    // подробнее - https://kotlinlang.org/docs/mpp-dsl-reference.html
    id("org.jetbrains.kotlin.multiplatform")
    // наш плагин мобильной мультиплатформы, упрощает настройку градл проектов для mobile использования (android, ios)
    // подробнее - https://github.com/icerockdev/mobile-multiplatform-gradle-plugin
    id("dev.icerock.mobile.multiplatform")
    // плагин для генерации кода сериализации в момент компиляции, от библиотеки kotlinx.serialization
    // подробнее - https://github.com/Kotlin/kotlinx.serialization
    id("org.jetbrains.kotlin.plugin.serialization")
}

// объявление зависимостей данного модуля. Чем меньше зависимостей объявлено, тем быстрее будет производиться компиляция модуля.
// зависимости ищутся в репозиториях, которые могут быть указаны как в самом build.gradle, так и в settings.gradle централизованно
dependencies {
    // подключение зависимости к common коду, в виде реализации (implementation). Это означает что классы данной зависимости не будут видны вне данного модуля, без явного ее подключения.
    commonMainImplementation(Deps.Libs.MultiPlatform.coroutines)

    // подключение зависимости к common коду, транзитивно (api). Это означает что классы данной зависимости будут видны вне данного модуля при подключении нашего модуля.
    commonMainApi(Deps.Libs.MultiPlatform.kotlinSerialization)
    commonMainApi(Deps.Libs.MultiPlatform.ktorClient)

    // подключение зависимости к андроид таргету, транзитивно. Классы данной зависимости видны только в androidMain сорссете.
    androidMainApi(Deps.Libs.Android.ktorClientOkHttp)

    // подключение зависимости к ios таргету, транзитивно. Классы данной зависимости видны только в iosMain сорссете.
    iosMainApi(Deps.Libs.Ios.ktorClientIos)

    // подключение другого модуля нашего проекта, в виде реализации
    commonMainImplementation(project(":network"))

    // подключение зависимостей к общему коду тестов, в виде реализации.
    commonTestImplementation(Deps.Libs.MultiPlatform.ktorClientMock)
    commonTestImplementation(Deps.Libs.MultiPlatform.Tests.kotlinTest)
    commonTestImplementation(Deps.Libs.MultiPlatform.Tests.kotlinTestAnnotations)

    // подключение зависимостей к андроид таргету тестов, в виде реализации.
    androidTestImplementation(Deps.Libs.Android.Tests.kotlinTestJUnit)
}
```

_Является упрощенным вариантом
с [moko-network](https://github.com/icerockdev/moko-network/blob/master/network/build.gradle.kts)_.

Основные сценарий когда iOS разработчику нужно работать с файлом `build.gradle`:

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

# какой вариант кодстайла котлина используеся в проекте - используется IDE для включения верного кодстайла
kotlin.code.style=official

# специальные флаги для активации Commonizer чтобы в iosMain видно было методы ios, а не только в iosArm64 и iosX64
# подробнее тут - https://www.youtube.com/watch?v=Q99HvynwjtY 
# https://kotlinlang.org/docs/migrating-multiplatform-project-to-14.html#try-the-hierarchical-project-structure
kotlin.native.enableDependencyPropagation=false
kotlin.mpp.enableGranularSourceSetsMetadata=true
kotlin.mpp.enableCompatibilityMetadataVariant=true

# использование androidX библиотек для андроида, нужно android gradle plugin
android.useAndroidX=true

# отключение предупреждения о том что используется ios шорткат для настройки таргетов ios
mobile.multiplatform.iosTargetWarning=false

# путь до xcode проекта или воркспейса, используется Kotlin Multiplatform Mobile плагином для Android Studio чтобы запускать ios приложение с отладчиком
# Подробнее https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile
xcodeproj=./sample/ios-app
```

_Является упрощенным вариантом
с [moko-network](https://github.com/icerockdev/moko-network/blob/master/gradle.properties)_.

# Gradle Sync

Система сборки Gradle не связана напрямую с IDE и расчитана в первую очередь на работу без UI, через
консоль. Но в IDEA и Android Studio реализована полная интеграция с Gradle, позволяющая запускать
команды Gradle, видеть модули Gradle и прочее. Чтобы IDE могла считать конфигурацию проекта
используется импорт проекта, называется действие Gradle Sync.

Кнопка для запуска Gradle Sync в Android Studio:
![gradle sync in android studio](/assets/gradle-sync-android-studio.png)

После успешного завершения импорта проекта, через Gradle Sync, мы получаем проиндексированный
проект, в котором каждый gradle модуль обработан и считаны подключенные зависимости, настройки
проекта (используется ли котлин, мультиплатформа и прочее):

![project panel](/assets/idea-gradle-project-modules.png)

Также после импорта проекта в IDE доступна панель работы с Gradle - в ней можно посмотреть все
Gradle модули и все задачи, которые доступны в каждом модуле:

![gradle tasks panel](/assets/idea-gradle-tasks.png)

Самая полезная, и часто используемая для iOS разработчиков задача - скомпилировать iOS фреймворк и
перенести в директорию для Cocoapods.

Зовется она `syncMultiPlatformLibraryDebugFrameworkIosX64` (добавляется
плагином [mobile-multiplatform](https://github.com/icerockdev/mobile-multiplatform-gradle-plugin)).
Где:

- MultiPlatformLibrary - имя фреймворка, который будет получен на выходе
- Debug - конфигурация сборки (для разработки собираем дебаг с отладочной инфой, Release делает CI)
- IosX64 - таргет, который должен быть собран (то есть iOS для запуска в симуляторе на x64 машине)

Для разработки используем именно Debug + IosX64, так как этот вариант имеет оптимизацию на уровне
Kotlin/Native компилятора с множеством кешей. Работает быстрее всех остальных вариантов сборки
фреймворка.

![gradle cocoapods task](/assets/idea-gradle-cocoapods.png)

# Внесение изменений в конфигурацию

Какие блоки конфигурации можно использовать в конкретном `build.gradle` зависит от подключенных к
данному проекту плагинов. Каждый плагин может добавлять свои блоки конфигурации и свои задачи.

Например, плагин `org.jetbrains.kotlin.multiplatform` добавляет блок `kotlin` и множество задач
типа `compileKotlinIosX64` (если в блоке `kotlin` включен таргет `iosX64`).

Детальная информация о том какие настройки доступны в блоке `kotlin` доступна
на [сайте документации](https://kotlinlang.org/docs/mpp-dsl-reference.html).

Помимо документации узнать досутпный функционал предоставляемый плагином можно используя подсказки
IDEA, когда используется Gradle Kotlin DSL, вместо Groovy. В таком случае, при успешно завершенной
индексации (после клика на Gradle Sync) можно использовать автозавершение кода и переход к
объявлению.

Использование автодополнения (либо подождать при наборе кода, либо нажать `ctrl + space`)
![gradle kotlin dsl autocomplete](/assets/kotin-script-autocomplete.png)

Использование перехода к объявлению типа (`Cmd + left click`):
![gradle kotlin dsl definition](/assets/go-to-definition.gif)
