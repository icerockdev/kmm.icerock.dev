# 3. Устройство проекта

:::caution

Страница находится в разработке.

:::

## Вводная

В данной статье разобран типовой KMM проект на базе [mobile-moko-boilerplate](https://gitlab.icerockdev.com/scl/boilerplate/mobile-moko-boilerplate). Внимание уделено каждому файлу и директории в проекте, дано пояснение ко всему - для чего используется, в каких случаях нужно вносить изменения, как работает.

После ознакомления с материалом вы узнаете:

1. Из каких частей состоит проект
1. Где находится конфигурация мультиплатформенного модуля
1. Как реализована интеграция мультиплатформенного модуля в iOS
1. Какие настройки применены к текущему проекту для мультиплатформенного модуля
1. Как устроена многомодульность на проекте
1. Как объявляются внешние зависимости (библиотеки)
1. Как настроен экспорт зависимостей в iOS фреймворк
1. Как реализован DI (Dependency Injection)
1. Как реализована навигация на android и iOS 

## Конфигурация сборки

Проект хранится в моно-репозитории, то есть в одном репозитории содержится и android и ios приложения, а также общая библиотека на Kotlin Multiplatform.

Проект использует несколько систем сборки:

1. [Gradle](https://gradle.org/) - система сборки для Android приложения и Kotlin библиотеки;
1. [Xcode](https://developer.apple.com/xcode/) - система сборки (и IDE) для iOS приложения.

Давайте разберемся с тем, как происходит сборка обеих платформ.

### Сборка Android приложения

Для сборки Android приложения нам достаточно Gradle системы сборки.

Когда мы нажимаем на кнопку Run в Android Studio по сути мы запускаем gradle задачу `assembleDevDebug` в gradle-проекте `android-app`. Это можно увидеть по логу, который отображается во вкладке `Build` при запуске.

![android studio build task](project-inside/android-studio-build-task.png)

Задача `assembleDevDebug` производит компиляцию только Debug типа сборки и только Dev [product flavour](https://developer.android.com/studio/build/build-variants). Для выполнения этой задачи требуется выполнить множество других задач, от которых данная задача зависит. Поэтому в логе сборки мы видим выполнение множества задач. При компиляции android приложения будет автоматически скомпилирован и модуль с общим Kotlin Multiplatform кодом (gradle проект `mpp-library`). Это происходит потому, что в `android-app` указана зависимость на проект `mpp-library` (будет разобрано подробнее позже).

### Сборка iOS приложения

Для сборки iOS приложения используются сразу обе системы - Xcode и Gradle, что, разумеется, увеличивает время сборки. Это также осложняет и анализ ошибок сборки, ведь ошибки могут быть как в разных системах сборки по отдельности, так и на стыке двух систем.

Когда мы нажимаем на кнопку Run в Xcode, начинается процесс сборки как и у любого другого iOS приложения через сам Xcode. Наш Xcode проект имеет зависимость на CocoaPod `MultiPlatformLibrary`, поэтому при компиляции приложения начнется и компиляция `MultiPlatformLibrary`. Данный CocoaPod имеет особенную реализацию - он не содержит исходного кода, а вместо фазы компиляции Source файлов он имеет фазу запуска shell команды. Именно в этой фазе происходит запуск Gradle для компиляции `MultiPlatformLibrary.framework` из Kotlin кода. Когда скрипт завершится, Xcode продолжит сборку iOS проекта уже с использованием готового скомпилированного фреймворка от Kotlin библиотеки.

Рассмотрим процесс детальнее. Для начала посмотрим, что происходит после установки зависимостей через [CocoaPods](https://cocoapods.org/): помимо файла проекта -  `ios-app.xcodeproj` мы получаем еще один файл - `ios-app.xcworkspace`.
Разберемся в разнице между ними:

- `ios-app.xcodeproj` - файл нашего ios проекта, содержит все настройки проекта, список файлов проекта, фазы сборки и прочее. В нем также указано, что наш iOS проект теперь зависит от `Pods_ios_app.framework` - фреймворка подключающего все CocoaPods зависимости.
  ![xcode xcodeproj](project-inside/xcode-xcodeproj.png)
  При попытке скомпилировать проект через `ios-app.xcodeproj` мы получим ошибку о том что фрейворки, от которых зависит проект, не найдены.
- `ios-app.xcworkspace` - файл с объединением нескольких Xcode проектов вместе. Если открыть его в Xcode, то в левой панели мы увидим не только `ios-app` проект, но и `Pods`, в котором находятся все необходимые для проекта зависимости. При работе через `xcworkspace` мы можем успешно скомпилировать проект, так как зависимость `ios-app` проекта будет найдена в `Pods` проекте. Необходимые зависимости для `ios-app` будут автоматически скомплированы также в `Pods`.
  ![xcode xcworkspace](project-inside/xcode-xcworkspace.png)

Теперь, понимая как `ios-app` связан с зависимостями, установленными CocoaPods, посмотрим детальнее на `MultiPlatformLibrary` CocoaPod. Находится данный Pod в `Pods/Development Pods/MultiPlatformLibrary`.

Только этот CocoaPod находится в `Development Pods` так как он единственный в `Podfile`, который подключен по локальному пути (`:path =>`). Все CocoaPod'ы, подключенные по локальному пути, будут находиться в `Development Pods` разделе, вместо `Pods`.

![xcode podfile](project-inside/xcode-podfile.png)

Из чего устроена данная зависимость:
![xcode multiplatformlibrary podspec](project-inside/xcode-multiplatformlibrary-podspec.png)

Во-первых, в директории `Frameworks` отражается сам скомпилированный фреймворк - `MultiPlatformLibrary.framework`.

Во-вторых - `MultiPlatformLibrary.podspec`, который как раз и ищет CocoaPods при подключении через `:path =>` по пути `mpp-library/MultiPlatformLibrary.podspec`.

`Podspec` файл является описанием зависиомости для CocoaPods. В нем мы определяем имя, версию и прочую метаинформацию о нашем пакете, исходные файлы и прочие настройки таргета, которые будет сгенерирован в проекте `Pods` при `pod install`. В нашем `podspec` мы определили несколько важных моментов:

1. `spec.vendored_frameworks` - путь до заранее скомпилированного framework'а, который и будет предоставляться как зависимость `ios-app` проекту. Именно по этому пути Gradle складывает итоговый фреймворк при запуске любой из `syncMultiPlatformLibrary**` задач;
1. `spec.pod_target_xcconfig` - настройки конфигурации, которые определяют переменные окружения, доступные нам во время выполнения сборки данного таргета. Мы определили имя библиотеки, без каких либо условий, а также указали переменную `GRADLE_TASK`, которая имеет разные значения при разных условиях. Например: `GRADLE_TASK[sdk=iphonesimulator*][config=*ebug]` означает, что указанное в правом блоке значение будет назначено в переменную окружения `GRADLE_TASK` в том случае, если мы производим сборку при использовании sdk начинающегося на `iphonesimulator`, а также при конфигурации, заканчивающейся на `ebug`: `Debug`, `dev-debug`, `prod-debug` и так далее;
1. `spec.script_phases` - определяем специальную фазу сборки с запуском shell скрипта, в котором мы запускаем Gradle задачу, сохраненную в переменной окружения `GRADLE_TASK`. Правильный подбор варианта компиляции мы получаем основываясь на схеме ios приложения, которую мы собираем, и на условиях, обозначенных в `xcconfig`. Именно этот скрипт позволяет делать сборку общего модуля автоматически, не требуя от разработчика дополнительнх действий перед комплияцией ios проекта.

При выполнении `pod install` данный podspec файл считывается и на основе этой информации создается Target в проекте `Pods`:

![xcode multiplatformlibrary script](project-inside/xcode-multiplatformlibrary-script.png)

Видно, что таргет `MultiPlatformLibrary` отличается от всех остальных иконкой - это потому, что он не содержит исходного кода, а вместо этого содержит кастомный скрипт.

По настройкам Xcode также видно, что `ios-app` не имеет прямой зависимости от `MultiPlatformLibrary`. Зависимость есть от `Pods-ios-app`. Это оптимизация количества изменений в файле основного проекта, сделанная CocoaPods. Все легко объясняется когда посмотрим на сам таргет `Pods-ios-app`.

![xcode pods dependencies](project-inside/xcode-pods-dependencies.png)

Данный таргет содержит в зависимостях все CocoaPods, а значит когда `ios-app` запрашивает сборку `Pods-ios-app`, тот затребует сборку всех этих зависимостей и в результате мы получим сборку всего что нам нужно.

После данного разбора у вас должно сформироваться представление о том как происходит компиляция ios приложения использующего Kotlin библиотеку с интеграцией через CocoaPods.

## Структура проекта

Ознакомимся с содержимым в корне репозитория. 

`ls -lp`:
```bash
build-logic/
android-app/
ios-app/
mpp-library/
gradle/
build.gradle.kts
gradle.properties
gradlew
gradlew.bat
settings.gradle.kts
README.md
```

Кратко про каждый элемент, для понимания общей картины:

- `android-app/` - директория с исходным кодом Android приложения;
- `ios-app/` - директория с исходным кодом iOS приложения;
- `build-logic/` - директория с логикой для системы сборки Gradle;
- `mpp-library/` - директория с исходным кодом общей библиотеки на KMM;
- `gradle/` - специальная директория системы сборки Gradle, в которой лежит Gradle Wrapper;
- `build.gradle.kts` - файл конфигурации сборки корневого gradle проекта;
- `gradle.properties` - файл с опциями, которые передаются в Gradle проект при запуске;
- `gradlew` и `gradlew.bat` - скрипты для Unix и Windows соответственно, которые запускают Gradle используя Gradle Wrapper;
- `settings.gradle.kts` - файл настроек Gradle проекта;
- `README.md` - краткое описание содержимого репозитория и инструкция как собирать проект;

Далее разберем все блоки более детально.

## Gradle Wrapper

[Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html) - специальный скрипт (и несколько дополнительных файлов), который автоматизирует процесс установки нужной версии gradle.

К его файлам относятся:

- `gradlew` и `gradlew.bat` - сами скрипты для запуска gradle через wrapper;
- `gradle/wrapper/gradle-wrapper.jar` - сам wrapper, небольшая java программа;
- `gradle/wrapper/gradle-wrapper.properties` - настройки gradle wrapper'а в которых указывается версия gradle для всего проекта.

Взаимодействие с Gradle Wrapper происходит при любой сборке gradle проекта. При запуске gradle задач через IDE автоматически происходит обращение к Gradle Wrapper, а когда работа идет через терминал - нужно вызывать `gradlew`/`gradlew.bat` (в зависимости от ОС).

Вся логика работы Gradle Wrapper'а заключается в следующем:

1. скрипт проверяет наличие JDK, если ее нет - выводит соответствующее понятное сообщение;
1. считывается конфигурация из `gradle-wrapper.properties`, а именно - `distributionUrl`, в котором определено какую версию gradle нам нужно скачать;
1. если данная версия gradle уже скачивалась, то она доступна в кешах в директории `~/.gradle` и будет использоваться. Иначе же Gradle Wrapper скачает gradle нужной версии и сохранит в указанную выше кеш директорию;
1. запускает gradle нужной версии, передавая ему все опции запуска которые были переданы в Gradle Wrapper.

Таким образом, несколько небольших файлов, лежащих в git репозитории, позволяют разработчику не вспоминать о необходимости скачать нужную для проекта версию gradle и использовать ее - автоматика все сделает сама.

:::info

Gradle Wrapper автоматически сохраняет скачиваемые версии gradle в кеш в `GRADLE_HOME` - `~/.gradle`. Поэтому данная директория со временем начинает раздуваться в размерах, так как на разных проектах может требоваться разная версия gradle, а также на проектах периодически производят обновление версии gradle. 

Удалять содержимое директории `~/.gradle`, при раздувшихся размерах, можно, но нужно понимать, что следующая сборка gradle потребует значительно больше времени, так как будет скачиваться нужная версия gradle, а также все зависимости, которые нужны проекту (кеш зависимостей также лежит в `GRADLE_HOME`).

:::

## Root Gradle project

Следующая важная составляющая нашего проекта - корневой gradle проект. Как было сказано ранее - для сборки обеих платформ используется gradle. Для android только он, а для ios gradle является одной из билдсистем. Корневая директория нашего проекта по сути и является корневым gradle проектом. `android-app` и `mpp-library` подключаются к этому коревому проекту как подпроекты.

К коревому gradle проекту относятся:
- `build-logic` - подпроект, подключе;
- `gradle.properties` - опции запуска gradle проекта;
- `settings.gradle.kts` - файл настроек;
- `build.gradle.kts` - файл конфигурации сборки.

Больше файлов относящихся непосредственно к коревому gradle проекту в репозитории нет.

### buildSrc (устарело)
`buildSrc` - [специальная директория Gradle](https://docs.gradle.org/current/userguide/organizing_gradle_projects.html#sec:build_sources). Она предназначена для реализации логики сборки, не привязанной к конкретному gradle модулю. По сути это исходники библиотеки, которая автоматически будет подгружена в gradle и все классы объявленные в этой библиотеке будут доступны в любом месте Gradle конфигурации (в `build.gradle.kts`).

В этой директории можно увидеть собственный `build.gradle.kts` и исходный код библиотеки. `build.gradle.kts` определяет как будет собираться данная библиотека и какие зависимости ей требуются. Исходный код библиотеки в нашем проекте содержит только один объект `Deps`, содержащий константы и зависимости, необходимые нашему проекту.

В `build.gradle.kts` можно увидеть подключение нескольких зависимостей:

```kotlin
dependencies {
    implementation("dev.icerock:mobile-multiplatform:0.9.2")
    implementation("org.jetbrains.kotlin:kotlin-gradle-plugin:1.4.32")
    implementation("com.android.tools.build:gradle:4.1.3")
}
```

В `Deps.kt` объявлен объект `Deps` с перечислением версий зависимостей и самих зависимостей в виде констант, для удобного обращения к ним в gradle конфигурации.

Ниже приведено пояснение ко всем составляющим данного объекта:

```kotlin
object Deps {
    // в начале перечисляются константами версии каждой из использующихся зависимостей. 
    // они приватные, так как используются данные константы только внутри самого Deps
    private const val materialVersion = "1.2.1"
    // ...

    // во вложенном объекте Android описываются версии используемых android sdk
    object Android {
        const val compileSdk = 30
        const val targetSdk = 30
        const val minSdk = 21
    }

    // во вложенном объекте Plugins содержатся объявления каждого используемого нами gradle плагина,
    // в специальном контейнере GradlePlugin (данный класс приходит от зависимости mobile-multiplatform-gradle-plugin)
    // https://github.com/icerockdev/mobile-multiplatform-gradle-plugin/blob/master/src/main/kotlin/GradlePlugin.kt#L10
    object Plugins {
        // мы можем объявить gradle плагин используя только id, в таком случае будет недоступно
        // подключение артефакта с данным плагином (для этого нужно указание свойства module)
        // такой подход используется для плагинов, которые подключаются с gradlePluginPortal, либо
        // содержатся в зависимостях, которые указаны в buildSrc/build.gradle.kts
        val androidApplication = GradlePlugin(id = "com.android.application")
        // для плагинов, которые требуют подключения дополнительных артефактов нужно указать свойство
        // module и в build.gradle.kts подключить в buildscript.dependencies
        val kotlinSerialization = GradlePlugin(
            id = "org.jetbrains.kotlin.plugin.serialization",
            module = "org.jetbrains.kotlin:kotlin-serialization:$kotlinxSerializationPluginVersion"
        )
        // ...
    }

    // вложенный объект Libs содержит объявления каждой внешней библиотеки
    object Libs {
        // в Android содержатся библиотеки относящиеся только к android, используются в android-app 
        // либо как зависимости androidMain sourceSet'а
        object Android {
            // объявление зависимости происходит в виде обычной строки
            const val appCompat = "androidx.appcompat:appcompat:$androidAppCompatVersion"
            // ...
            
            // в Tests указываются зависимости для тестов в android-app либо androidTest sourceSet'а
            object Tests {
                // объявление также происходит в виде обычной строки
                const val espressoCore = "androidx.test.espresso:espresso-core:$espressoCoreVersion"
                // ...
            }
        }

        // в MultiPlatform объекте содержатся объявления всех мультиплатформенных библиотек
        // используется в mpp-library и вложенных в нее модулях
        object MultiPlatform {
            // те зависимости, которые не предполагается использовать в Kotlin/Native export, 
            // указываются в виде простой строки. Указывается артефакт метаданных, по которому 
            // gradle найдет все артефакты для нужных таргетов  
            const val kotlinSerialization = 
                "org.jetbrains.kotlinx:kotlinx-serialization-core:$kotlinxSerializationVersion"
            // ...

            // те зависимости, которые будут экспортироваться в iOS framework, объявляются в виде
            // MultiPlatformLibrary контейнера (из mobile-multiplatform-gradle-plugin)
            // https://github.com/icerockdev/mobile-multiplatform-gradle-plugin/blob/master/src/main/kotlin/MultiPlatformLibrary.kt#L10
            // для простоты чаще всего используется преобразование из строки с путем до артефакта 
            // метаданных, через метод defaultMPL, с указанием в аргументах тех таргетов, которые 
            // нужно автоматически заполнить (заполнение идет согласно именованию стандартной 
            // публикации мультиплатформенных библиотек) 
            val mokoResources = "dev.icerock.moko:resources:$mokoResourcesVersion"
                .defaultMPL(ios = true)
            // ...

            // в Tests указываются зависимости для тестов в mpp-library и вложенных модулях
            object Tests {
                // зависимости указываются в виде строк
                const val kotlinTest = "org.jetbrains.kotlin:kotlin-test-common:$kotlinTestVersion"
                // ...
            }
        }

        // в Detekt указываются специфичные для detekt плагина зависимости
        object Detekt {
            // зависимости указываются в виде строк
            const val detektFormatting = "io.gitlab.arturbosch.detekt:detekt-formatting:$detektVersion"
        }
    }

    // в Modules указываются gradle модули нашего проекта
    object Modules {
        object Feature {
            // объявляются модули в виде контейнера MultiPlatformModule (из mobile-multiplatform-gradle-plugin)
            // https://github.com/icerockdev/mobile-multiplatform-gradle-plugin/blob/master/src/main/kotlin/MultiPlatformModule.kt#L10
            // в name указывается путь до gradle проекта, а в exported флаг нужно ли экспортировать 
            // классы данного модуля в iOS framework
            val auth = MultiPlatformModule(
                name = ":mpp-library:feature:auth",
                exported = true
            )
        }
    }
}
```

Данный класс определяет константы, которые мы будем использовать в `build.gradle.kts` всех gradle модулей, что сокращает вероятность ошибки и позволяет менять версии/пути до библиотек в одном месте.

:::caution

Директория упразнена! 

На новых проектах вместо `buildSrc` используется `Version Catalogs`.

:::

### Version Catalogs

На новых проектах внутри директории `gradle` есть файл `libs.versions.toml`. Это список зависимостей, представленных в виде координат зависимостей, из которых пользователь может выбрать при объявлении зависимостей в сценарии сборки.

Давайте посмотрим на этот файл:

```bash
# версии 
[versions]
materialVersion = "1.4.0"
recyclerViewVersion = "1.2.1"
swipeRefreshLayoutVersion = "1.1.0"
constraintLayoutVersion = "2.0.4"
lifecycleVersion = "2.3.1"
glideVersion = "4.12.0"
hiltVersion = "2.35"

# ...

# библиотеки с ссылками на версии
[libraries]
material = { module = "com.google.android.material:material", version.ref = "materialVersion" }
recyclerView = { module = "androidx.recyclerview:recyclerview", version.ref = "recyclerViewVersion" }
swipeRefreshLayout = { module = "androidx.swiperefreshlayout:swiperefreshlayout", version.ref = "swipeRefreshLayoutVersion" }
constraintLayout = { module = "androidx.constraintlayout:constraintlayout", version.ref = "constraintLayoutVersion" }
glide = { module = "com.github.bumptech.glide:glide", version.ref = "glideVersion" }
lifecycleViewModel = { module = "androidx.lifecycle:lifecycle-viewmodel-ktx", version.ref = "lifecycleVersion" }
lifecycleLivedata = { module = "androidx.lifecycle:lifecycle-livedata-ktx", version.ref = "lifecycleVersion" }
lifecycleRuntime = { module = "androidx.lifecycle:lifecycle-runtime-ktx", version.ref = "lifecycleVersion" }
lifecycleViewModelSavedState = { module = "androidx.lifecycle:lifecycle-viewmodel-savedstate", version.ref = "lifecycleVersion" }
lifecycleCommonJava8 = { module = "androidx.lifecycle:lifecycle-common-java8", version.ref = "lifecycleVersion" }
lifecycleServices = { module = "androidx.lifecycle:lifecycle-service", version.ref = "lifecycleVersion" }
lifecycleProcess = { module = "androidx.lifecycle:lifecycle-process", version.ref = "lifecycleVersion" }
lifecycleReactiveStreams = { module = "androidx.lifecycle:lifecycle-reactivestreams-ktx", version.ref = "lifecycleVersion" }
hilt = { module = "com.google.dagger:hilt-android", version.ref = "hiltVersion" }
hiltCompiler = { module = "com.google.dagger:hilt-android-compiler", version.ref = "hiltVersion" }

# ...
```

Это фича пришла с вместе с Gradle 7.0. Активация этой фичи происходит в файле `settings.gradle.kts`:

```kotlin
enableFeaturePreview("VERSION_CATALOGS")
```

Больше информации о Version Catalogs можете найти [тут](https://kmm.icerock.dev/learning/gradle/version-catalogs/).


:::note

Для сравнения можете посмотреть файл `Deps.kt` из директории `buildSrc/`, о которой мы говорили выше.

:::

### build-logic

`build-logic` - [композитный](https://kmm.icerock.dev/learning/gradle/composite-build) проект. Он предназначен для реализации логики сборки, не привязанной к конкретному gradle модулю.

В этой директории можно увидеть собственный `build.gradle.kts` и исходный код библиотеки. `build.gradle.kts` определяет как будет собираться данная библиотека и какие зависимости ей требуются. Исходный код библиотеки в нашем композитном билде содержит convention plugins, нужные для сборки основного Gradle проекта.

Внутри `build.gradle.kts` объявлены нужные зависимости:

```kotlin
dependencies {
    api("dev.icerock:mobile-multiplatform:0.12.0")
    api("org.jetbrains.kotlin:kotlin-gradle-plugin:1.5.21")
    api("com.android.tools.build:gradle:4.2.1")
    api("io.gitlab.arturbosch.detekt:detekt-gradle-plugin:1.15.0")
}
```

Он подключается внутри файла `settings.gradle.kts` командой:
```kotlin
includeBuild("build-logic")
```

### gradle.properties

Данный файл состоит из пар ключ-значение параметров настройки запуска gradle.
Использование `gradle.properties` это альтернатива использованию флагов командной строки для конфигурации проекта.

```properties
# максимально доступная модулю gradle память равнв 4гб
org.gradle.jvmargs=-Xmx4096m
# не распространять конфигурацию на все проекты
org.gradle.configureondemand=false
# включаем режим параллельного выполнения
org.gradle.parallel=true
# для последующих сборок будут использоваться кеши предыдущих сборок
org.gradle.caching=true
# использовать официальный стандарт кода
kotlin.code.style=official

# плагин Android будет использовать библиотеку AndroidX вместо стандартной библиотеки
android.useAndroidX=true

# отключить предупреждения о том, что технология mpp являестя эксперементальной
kotlin.mpp.stability.nowarn=true

# отключить предупреждения об используемых таргетах ios
mobile.multiplatform.iosTargetWarning=false

VERSION_NAME=0.1.0
VERSION_CODE=1

xcodeproj=ios-app/ios-app.xcworkspace
```

### settings.gradle.kts

Этот файл необходим для сборки с несколькими проектами, в нашем случае это `android-app`, `mpp-library` и `mpp-library:feature:auth`, `build-logic`.

Исходный код:
```kotlin
// подключение фичей (начиная с Gradle 7.0)
enableFeaturePreview("VERSION_CATALOGS")
enableFeaturePreview("TYPESAFE_PROJECT_ACCESSORS")

dependencyResolutionManagement {
    // репозитории, из которых будут загружаться зависимости проекта
    repositories {
        mavenCentral()
        google()

        jcenter {
            content {
                includeGroup("org.jetbrains.kotlinx")
            }
        }
    }
}

// подключение плагинов
plugins {
    id("dev.icerock.gradle.talaiot") version("3.+")
}

// подключение composite-build
includeBuild("build-logic")

// подключение подпроектов
include(":android-app")
include(":mpp-library")
include(":mpp-library:feature:auth")
```

Именно `settings.gradle.kts` иллюстрирует многомодульность нашего основного проекта.

### build.gradle.kts

Эти зависимости будут также автоматически подключены и к самому Gradle проекту, поэтому плагины из этих зависимостей мы можем применять без добавления артефактов в `classpath`.

```kotlin
buildscript {
    // репозитории, из которых будут загружаться зависимости проекта
    repositories {
        mavenCentral()
        google()
        gradlePluginPortal()
    }
    // зависимости, используемые системой сборки
    dependencies {
        classpath("dev.icerock.moko:resources-generator:0.16.1")
        classpath("dev.icerock.moko:network-generator:0.16.0")
        classpath("dev.icerock.moko:units-generator:0.6.1")
        classpath("org.jetbrains.kotlin:kotlin-serialization:1.5.20")
        classpath("com.google.firebase:firebase-crashlytics-gradle:2.7.1")
        classpath("com.google.gms:google-services:4.3.8")
        classpath("com.google.dagger:hilt-android-gradle-plugin:2.35")
        classpath(":build-logic")
    }
}

allprojects {
    // принудительно исползовать coroutines-native-mt версию ( необходима для многопоточности )
    configurations.configureEach {
        resolutionStrategy {
            val coroutines: MinimalExternalModuleDependency = rootProject.libs.coroutines.get()
            val forcedCoroutines: ModuleVersionSelector = DefaultModuleVersionSelector.newSelector(
                coroutines.module,
                coroutines.versionConstraint.requiredVersion
            )
            force(forcedCoroutines)
        }
    }
}

// таска на очистку билдов
tasks.register("clean", Delete::class).configure {
    group = "build"
    delete(rootProject.buildDir)
}
```

## mpp-library

![mpp library folder](project-inside/project-inside-mpp-lib.png)

Оба приложения зависят от mpp-library, которая предоставляет доступ к ViewModel’и каждой фичи через SharedFactory.

### build.gradle.kts

Тут объявляются все зависимости и конфигурации нашей общей библиотеки. Давайте посмотрим что внутри.

```kotlin
// подключение плагинов
plugins {
    id("multiplatform-library-convention")
    id("detekt-convention")
    id("dev.icerock.mobile.multiplatform-resources")
    id("dev.icerock.mobile.multiplatform.ios-framework")
    id("dev.icerock.mobile.multiplatform-network-generator")
    id("kotlinx-serialization")
    id("kotlin-parcelize")
    id("dev.icerock.mobile.multiplatform.cocoapods")
}

// объявление зависимостей
dependencies {
    commonMainImplementation(libs.coroutines)

    commonMainImplementation(libs.kotlinSerialization)
    commonMainImplementation(libs.ktorClient)
    commonMainImplementation(libs.ktorClientLogging)

    androidMainImplementation(libs.lifecycleViewModel)

    commonMainApi(projects.mppLibrary.feature.auth)

    commonMainApi(libs.multiplatformSettings)
    commonMainApi(libs.napier)
    commonMainApi(libs.mokoParcelize)
    commonMainApi(libs.mokoResources)
    commonMainApi(libs.mokoMvvmCore)
    commonMainApi(libs.mokoMvvmLiveData)
    commonMainApi(libs.mokoMvvmState)
    commonMainApi(libs.mokoUnits)
    commonMainApi(libs.mokoFields)
    commonMainApi(libs.mokoNetwork)
    commonMainApi(libs.mokoErrors)
    commonMainApi(libs.mokoNetworkErrors)
    commonMainApi(libs.mokoCrashReportingCore)
    commonMainApi(libs.mokoCrashReportingCrashlytics)
    commonMainApi(libs.mokoCrashReportingNapier)

    commonTestImplementation(libs.mokoTestCore)
    commonTestImplementation(libs.mokoMvvmTest)
    commonTestImplementation(libs.mokoUnitsTest)
    commonTestImplementation(libs.multiplatformSettingsTest)
    commonTestImplementation(libs.ktorClientMock)
}

// идентификатор пакета ресурсов
multiplatformResources {
    multiplatformResourcesPackage = "org.example.library"
}

framework {
    // подключение фичей
    export(projects.mppLibrary.feature.auth)

    // подключение остальных фреймворков
    export(libs.multiplatformSettings)
    export(libs.napier)
    export(libs.mokoParcelize)
    export(libs.mokoResources)
    export(libs.mokoMvvmCore)
    export(libs.mokoMvvmLiveData)
    export(libs.mokoMvvmState)
    export(libs.mokoUnits)
    export(libs.mokoFields)
    export(libs.mokoNetwork)
    export(libs.mokoErrors)
    export(libs.mokoNetworkErrors)
    export(libs.mokoCrashReportingCore)
    export(libs.mokoCrashReportingCrashlytics)
    export(libs.mokoCrashReportingNapier)
}

// путь для подключения общей библиотеки 
// посредством Cocoa Pods
cocoaPods {
    podsProject = file("../ios-app/Pods/Pods.xcodeproj")
    pod("MCRCDynamicProxy", onlyLink = true)
}

// mokoNetwork
// подключение yml файла для генерации api
mokoNetwork {
    spec("news") {
        inputSpec = file("src/api/openapi.yml")
    }
}
```

### MultiplatformLibrary.podscpec


Более подробно об этом файле мы уже говорили в разделе [сборка iOS приложения](https://kmm.icerock.dev/onboarding/project-inside/#сборка-ios-приложения).

### src
В папке `srs/` находится исходный код общей библиотеки.

![mpp-library-](project-inside/project-inside-mpp-lib-src.png)

 - `androidMain` - директория, содержащая файл `AndroidManifest.xml`, в котором объявляется имя пакета `mpp-library` для Android-приложения;
 - `api` - директория, содержащая файл для генерации методов взаимодействия с API;
 - директория `commonMain` содержит директорию `kotlin`, в которой как раз и пишется вся бизнес-логика приложения; в директории `resources` находится MR-класс для взаимодействия со строками, изображениями и прочими ресурсами, которые используются в проекте; 
 - `commonTest` - директория, в которой находится исходный код тестов для общей библиотеки;

### feature's
Как мы видим mpp-library содержит в себе подпроект feature. 
Каждая фича в котором является Gradle-библиоткой, несущей в себе соответствующие модели, view-модели, фабрики и интерфейсы, которые ожидаются от родительского модуля.

![mpp-library-one-feature](project-inside/project-inside-mpp-lib-feature.png)

Каждая фича имеет однотипную структуру. Внутри `commonMain/kotlin/…` обычно находятся директории:
- `di` - директория, содержащая фабрику для создания View-модели и все, что связано с инъекцией зависимостей;
- `model` - директория, содержащая все сущности (в основном data-классы и enum’ы) нужные в рамках данной view-модели.
- `presentation` - директория, содержащая саму view-model и, возможно, фабрику юнитов (об этом поговорим дальше).

Пример фичей:
* Auth
* Settings
* List
и т.п

В файле `build.gradle.kts`, который находится в директории каждой фичи указаны все зависимости, нужные для данной фичи.

Посмотрим: 
```kotlin
// подключение плагинов
plugins {
    id("detekt-convention")
    id("multiplatform-library-convention")
}
// объявление зависимостей
dependencies {
    commonMainImplementation(libs.coroutines)

    androidMainImplementation(libs.lifecycleViewModel)

    // moko-mvvm & moko-resources
    commonMainImplementation(libs.mokoMvvmLiveData)
    commonMainImplementation(libs.mokoResources)
}
```

Т.к каждая фича является отдельной Gradle-библиотекой, то она обязана содержать файл `AndroidManifest.xml`, в котором объявляется уникальное имя для Android-приложения.



### Shared & Domain Factory

> Чтобы понять что такое *Shared* и *Domain* Factory, нужно будет немного разобраться с подходом разделения ответственности и проброса необходимых зависимостей в проектах.

Мы стараемся делать фичи максимально независящими от контекста проекта. Иными словами — фича должна знать ровно тот набор информации, который ей нужен для корректной работы в рамках самой себя. При этом важно сократить до минимума её зависимости от каких либо других модулей. Наиболее критично такое сказывается на времени компиляции под iOS, когда проект уже разросся. Например, если 3 разных разных фичи имеют зависимость на какой-то один общий вспомогательный модуль, назовём его shared, то при любом изменении shared мы получим полную пересборку всех этих трёх модулей при сборке под iOS, в то время как на Android такого не будет.

> А как быть тогда с моделями, общими для всего проекта? 
> Как устроить работу с сетью, ведь она же должна быть общей для разных фичей?
> Как использовать вспомогательные расширения, они же могут быть общие для разных фичей?

Сейчас постараемся ответить на эти вопросы.

#### Как было раньше?
Унас были такие модули как *domain* и *shared*, а также фабрики *DomainFactory* и *SharedFactory*.

![project-inside-shared-domain](project-inside/project-inside-shared-domain.png)

Модуль *domain* включал в себя описания доменных сущностей, описание классов для работы с сервером, логику преобразования серверных ответов в те самые доменные сущности, с которыми могло работать приложение. Также в нём содержалась и доменная фабрика *DomainFactory*, которая создавала классы для работы с сетью, репозитории, управляющие данными и производила настройку http-клиента. А также именно расширениями к *DomainFactory* реализовывались создания всех остальных фабрик для фичей.

![domain-module](project-inside/project-inside-domain.png)

Модуль *shared* содержал большое количество полезных расширений, вспомогательных методов, упрощений и прочих переиспользуемых между модулями вещей.

А внутри модуля *mpp-library* располагалась и *SharedFactory* (либо просто *Factory*, на разных старых проектах навание может быть разным). Её предназначение было получить с натива все данные, необходимые для реализации *DomainFactory* и, соответственно, *DomainFactory* на основе этих же данных могла реализовывать свои внутренние компоненты. Плюс *mpp-library* служила прослойкой для маппинга всех доменных сущностей в сущности фичей. Например модель юзера могла быть и в модуле авторизации и в модуле профилей. Но auth:User и profile:User - это были разные модели и преобразование от доменной сущности domain:User (который мы получали после преобразования ответа сервера) требовалось для каждой из них.

![shared-and-src](project-inside/project-inside-shared-src.png)

И чтобы в фичах мы могли спокойно кидать запросы, использовать модели данных и применять вспомогательные методы из *shared*, приходилось добавлять практически во всех фичах зависимости на *shared*.

> По началу всё шло неплохо. Производительность не сильно страдала. Проблемы начались тогда, когда мы имеем уже объёмный проект, состоящий из 10-15 модулей с фичами. И в какой-то момент нам для одной из фичей надо в *shared* добавить небольшой код или поправить реализацию уже имеющегося. Это приводило к тому, что на iOS начинают пересобираться абсолютно все зависящие на shared модули, а разработчик, поменявший одну строчку, мог ждать сборки iOS по 10 с лишним минут.

>И вторая большая проблема заключалась в том, что мы вынуждены были плодить множество сущностей. На примере всё того же юзера у нас была сетевая сущность юзера, которую присылал бэк, доменная сущность юзера, в которую мы преобразовывали сетевую, а далее для фичей авторизации и профиля — ещё по одной сущности, которые относятся уже к самим фичам, а они, в свою очередь, должны преобразовываться из доменных. Самый банальный пример — если на сервере добавляют новое поле в сущности, которое нам нужно использовать, то его приходилось пробрасывать через все эти круги ада и тратить время.

#### К чему мы пришли?

Из-за всего вышесказанного, от данного подхода было принято отказываться в сторону более нового - с учётом независимости фичи и проброса в неё внешних зависимостей.

> Если в рамках работы над проектом вам встречается модуль *domain*, *shared* или *DomainFactory*, то это проект, построенный на старом варианте архитектуры.
>  
> Этот подход не актуален!
> 
>  В рамках поддержки существующих фичей, при невозможности изменения добавления зависимости от модуля на проброс зависимостей через интерфейсы, придётся использовать старый способ. 
> При создании же новых фичей, даже с учётом старой архитектуры в этом проекте, их нужно реализовывать актуальным способом.

:::note

На текущий момент наиболее актуальным архитектурным подходом является тот, что представлен в рамках boilerplate-проекта, с которого мы начали разработку.

:::

**Что изменилось:**
- Модуль *domain* упразднён! 

  Сущность и модели у каждой фичи свои, в рамках модуля этой фичи. И они содержат достаточный набор данных для её работы. Но в случаях, когда одни и те же сущности должны использоваться между несколькими фичами, для того, чтобы избежать дублирования, такие сущности выносятся в отдельный модуль и в зависимость добавляется именно он.
- *DomainFactory* упразднена. 

  Её роль забирает *SharedFactory*, которая доступна с натива и находится в *mpp-library*. Через неё же можно с нативной стороны достучаться до всех необходимых фабрик фичей. Фабрики фичей всё также реализовываются как расширения, но уже к *SharedFactory*, а не к *DomainFactory*. Инициализация классов работы с API также происходит в SharedFactory.
- Модуль *shared* упразднён.

  Подобные общие компоненты реализовываются внутри модуля *mpp-library*.
- Для реализации логики работы с данными, либо с сервером используются репозитории. Каждая ViewModel описывает у себя интерфейс репозитория, покрывающий её нужды. Либо бывают случаи общего интерфейса репозитория на несколько ViewModel, но в рамках одной фичи. Реализация этого репозитория должна передаваться при создании ViewModel. Сами реализации создаются в модуле *mpp-library*, а он, как мы знаем, имеет информацию и о view-моделях (т.к. *mpp-library* знает о других модулях) и о сетевом слое. Соответственно в его рамках без проблем можно описать реализации этих интерфейсов и пробросить их в фабрику фичи, которая, в свою очередь, передаст реализацию во ViewModel. Это же помогает избежать пачки мапперов из сетевой сущности в доменную, из доменной в фичёвую.
## android-app

`android-app` - gradle проект с android приложением.

В нем подключен gradle плагин `com.android.application` (через константу `Deps.Plugins.androidApplication`) и описана вся конфигурация для сборки android приложения.

### Навигация в Android

## ios-app

`ios-app` - директория, в которой лежит Xcode проект iOS приложения.

### Устройство проекта

![ios-app-dirs](project-inside/project-inside-ios-app.png)

Как мы видим, к iOS проекту подключена директория `mpp-library` - это наша общая бизнес логика.
В директории `src/` находится исходные код нашего приложения:
- `Firebase` - директория с plist файлом для настройки сервисов Firebase;
- `Extensions` - директория с расширениями классов;
-  `Common` - директория с общими UI/Logic элементами для всего iOS приложения;
-  `Resources` - директория с ресурсами (например, R.swift и прочее);
-  `Feature` - директория с фичами (еще не создана);

### Входная точка приложения

Посмотрим на файл `AppDelegate.swift`:

```swift
// импорт UI библиотеки
import UIKit
// импорт нашей мультиплатформенной библиотеки
import MultiPlatformLibrary
// импорт сервисов
import MCRCStaticReporter
import FirebaseCore

@UIApplicationMain
class AppDelegate: NSObject, UIApplicationDelegate {
    
    // создание окна приложения
    var window: UIWindow?

    // переменная координатора
    private (set) var coordinator: AppCoordinator!

    func application(_ application: UIApplication, 
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        
        // настройка сервисов
        FirebaseApp.configure()
        MokoFirebaseCrashlytics.setup()


        // Инициализация нашей SharedFactory, через синглтон AppComponent
        AppComponent.factory = SharedFactory(
            settings: AppleSettings(delegate: UserDefaults.standard),
            antilog: DebugAntilog(defaultTag: "MPP"),
            baseUrl: "https://newsapi.org/v2/"
        )

        // работа с координатором, об этом чуть позже
        coordinator = AppCoordinator.init(
            window: self.window!,
            factory: AppComponent.factory
        )
        coordinator.start()

        return true
    }
}
```
Файл `AppComponent.swift`:
```swift
import Foundation
import MultiPlatformLibrary

class AppComponent {
    static var factory: SharedFactory!
}
```

Класс AppDelegate является стартовой точкой приложения, это можно понять по атрибуту `@UIApplicationMain` перед классом. Именно в нем происходит настройка всех сторонних сервисов и создание экземпляра нашей SharedFactory, для последующего доступа к фабрикам фичей.

### Навигация в iOS

Мы поняли что является отправной точкой нашего приложения, а теперь нам нужно понять как построена навигация в iOS приложение и какие подходы при работе с ней мы используем.

В основе навигации лежат координаторы. Каждый координатор покрывает логически связанный блок
функционала, который чаще всего состоит из нескольких экранов. При этом между собой они независимы и
отвечают только за цепочку переходов только внутри себя. Также имеют возможность получать настройку
действия, которое должно быть выполнено после завершения блока ответственности координатора.

**Пример.**

Предположим, что у нас есть приложение с авторизацией и списком новостей, с которого
можно перейти к детальному просмотру каждой новости и в раздел настроек для конфигурации отображения новостей.

Это разобьётся на 4 координатора:

![coordinator example](project-inside/project-inside-coordinator-ex.png)

- AppCoordinator
  - Стартовый координатор. Всегда является первой входной точкой, определяет, куда должен выполниться дальнейший переход при запуске приложения
  - Если юзер не авторизован - запустит координатор авторизации и в качестве completionHandler-а укажет ему переход на список новостей в случае успешной авторизации
  - Если юзер уже авторизован - запустит координатор просмотра списка новостей
- AuthCoordinator
  - Запустит процесс авторизации
  - Будет совершать переходы по всем требуемым шагам - например ввод логина/пароля, смс-кода, установки никнейма и т.п.
  - По итогу успешной авторизации вызовет переданный ему на вход completionHandler.
- NewsCoordinator
  - Отвечает за показ списка новостей
  - Реализовывает переход в детали конкретной новости внутри этого же координатора
  - При переходе в настройки создаёт координатор настроек, в качестве completionHandler-а может передать ему логику обновления своего списка новостей. Если в настройках изменились параметры - обновляет список
- SettingsCoordinator
  - Отвечает за работу с экраном настроек
  - При завершении работы и применении настроек вызывает completion, чтобы новости обновились

Именно координаторы реализуют интерфейс EventListener-ов вьюмоделей, о которых будет чуть ниже. Так
как вызов переходов завязан на бизнес-логику приложения, то инициатором этих переходов являются
именно вьюмодели. Поэтому координаторы выполняют связующую роль между тем, что происходит в логике
приложений и тем, как это должно отображаться пользователю.

Чтобы работать с координаторами было проще, используется базовый класс, от которого наследуются
остальные. В директории `Common/Coordinator` вы найдете файлы `CoordinatorProtocol.swift` и `BaseCoordinator.swift`. Первый несет в себе протокол, под который подписан `BaseCoordinator` и описывает обязательные методы и поля:

```swift
protocol Coordinator: AnyObject {
    var completionHandler: (()->())? { get }
    func start()
    func clear()
}
```

По сути он должен иметь ровно три вещи - completionHandler, который вызовется при завершении его логической зоны ответственности. Функцию start, при вызове которой он начинает запускать свой флоу таким образом, каким считает нужным, и функцию clear, которая чистит сам координатор и все дочерние.

Ну а второй несет сам класс базового координатора, который реализует этот протокол:

```swift
class BaseCoordinator: NSObject, Coordinator, UINavigationControllerDelegate {
    var childCoordinators: [Coordinator] = []
    var completionHandler: (() -> ())?
    fileprivate var clearHandler: (() -> ())? = nil
    
    let window: UIWindow
    let factory: SharedFactory
    
    var navigationController: UINavigationController?
    
    init(window: UIWindow, factory: SharedFactory) {
        self.window = window
        self.factory = factory
    }
    
    func addDependency<Child>(_ coordinator: Child, completion: (() -> Void)? = nil) -> Child where Child : BaseCoordinator {
        for element in childCoordinators.compactMap({ $0 as? Child }) {
            if element === coordinator { return element }
        }
        coordinator.completionHandler = { [weak self, weak coordinator] in
            self?.removeDependency(coordinator)
            completion?()
        }
        childCoordinators.append(coordinator)
        return coordinator
    }
    
    func clear() {
        clearHandler?()
        childCoordinators.forEach {
            $0.clear()
        }
        childCoordinators.removeAll()
    }
    
    private func removeDependency(_ coordinator: Coordinator?) {
        clearHandler?()
        guard
            childCoordinators.isEmpty == false,
            let coordinator = coordinator
        else { return }
        
        for (index, element) in childCoordinators.enumerated() {
            if element === coordinator {
                childCoordinators.remove(at: index)
                break
            }
        }
    }
    
    //Cases
    //1. Initial with window - create NV, etc..
    //2. Exists navcontroller,
    
    func start() {
        //
    }
    
    func beginInNewNavigation(_ controller: UIViewController) -> UINavigationController {
        let newNavigationController = UINavigationController()
        self.navigationController = newNavigationController

        newNavigationController.setViewControllers([controller], animated: false)

        self.window.rootViewController = newNavigationController
        
        self.clearHandler = { [weak self] in
            //get controllers and view models, clear them
            self?.popToRoot()
        }
        
        return newNavigationController
    }
    
    func beginInExistNavigation(_ controller: UIViewController) {
        let prevController = self.navigationController?.topViewController
        self.clearHandler = { [weak self, weak prevController] in
            //get controllers and view models, clear them
            if let prev = prevController {
                self?.popToViewController(controller: prev)
            }
        }
        navigationController?.pushViewController(controller, animated: true)
    }
    
    
    private func popBack() {
        let popVC = self.navigationController?.popViewController(animated: true)
        if let nVC = popVC {
            clearViewModels(forControllers: [nVC])
        } else {
            navigationController?.dismiss(animated: true, completion: nil)
        }
    }
    
    private func clearViewModels(forControllers controllers: [UIViewController]?) {
        let holders = (controllers ?? []).compactMap({ $0 as? ViewModelHolder })
        holders.forEach({ $0.baseViewModel?.onCleared() })
    }
    
    private func dismissModal() {
        let controllers = navigationController?.viewControllers
        navigationController?.dismiss(animated: true, completion: nil)
        clearViewModels(forControllers: controllers)
    }
    
    private func popToViewController(controller vc: UIViewController, animated: Bool = true) {
        let controllers = navigationController?.popToViewController(vc, animated: animated)
        clearViewModels(forControllers: controllers)
    }
    
    private func popToViewController(ofClass: AnyClass, animated: Bool = true) {
        if let vc = navigationController?.viewControllers.last(where: { $0.isKind(of: ofClass) }) {
            let controllers = navigationController?.popToViewController(vc, animated: animated)
            clearViewModels(forControllers: controllers)
        }
    }
    
    private func popToRoot() {
        let controllers = navigationController?.popToRootViewController(animated: true)
        clearViewModels(forControllers: controllers)
    }
    
    func currentViewController() -> UIViewController {
        guard let navController = self.navigationController else { return UIViewController() }
        return navController.topViewController ?? navController.topPresentedViewController() ?? navController
    }
}

```

Для инициализации необходим window и factory. Также можно указать NavigationController с предыдущего
координатора, для сохранения общей навигации.

:::note

Координаторам нужен factory для доступа к фабрикам фичей из общей библиотеки.

:::

Добавление и удаление зависимостей нужны для корректной очистки связей и памяти при построении
цепочек координаторов.

Также есть вспомогательные методы, которые позволяют получить текущий контроллер -
currentViewController и совершить переход назад - popBack.

От проекта к проекту базовый координатор может изменяться, обеспечивая дополнительные нужды проекта.

Теперь когда мы поняли принцип работы координаторов, посмотрим на класс `AppCoordinator`:

```swift
class AppCoordinator: BaseCoordinator {
    override func start() {
        let vc = UIViewController()
        vc.view.backgroundColor = .green
        self.window.rootViewController = vc
    }
}
```

Он пока совсем простой - создает контроллер зелёного цвета и делает его главным экраном
window.

Теперь посмотрим где происходит создание главного координатора. Идём в AppDelegate.swift: 

```swift    
    // ....

    // переменная координатора
    private (set) var coordinator: AppCoordinator!

    func application(_ application: UIApplication, 
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {

        //...

        // его инициализация
        coordinator = AppCoordinator.init(
            window: self.window!,
            factory: AppComponent.factory
        )
        // запуск коррдинатора
        coordinator.start()

        // ....
    }
```

Теперь дальнейшая логика переходов зависит от текущего контроллера и действий юзера на нём. Но
зелёным прямоугольником мир не спасёшь и юзера не авторизуешь. Поэтому после прочтения пора переходить к созданию
нашей первой фичи.


## Генерация строк локализации

В файле master.sh в функции cmdLocalize:

```bash
function cmdLocalize() {
    # ...

    npm start android strings "GSHEET_ID_HERE" 'platform!A1:C' ../mpp-library/shared/src/androidMain/res/
    npm start mpp strings "GSHEET_ID_HERE" 'mpp!A1:C' ../mpp-library/src/commonMain/resources/MR/
    npm start mpp plurals "GSHEET_ID_HERE" 'mpp-plurals!A1:D' ../mpp-library/src/commonMain/resources/MR/
    npm start ios strings "GSHEET_ID_HERE" 'platform!A1:C' ../ios-app/src/Resources/
}
```

Вместо GSHEET_ID_HERE должен стоять Google Sheet Id файла локализации.
Далее, чтобы обновить строки локализации в проекте необходимо вызвать команду ./master.sh localize

Для корректной работы скрипта у вас должен быть установлен npm.

Узнать больше информации мы можете [тут](https://gitlab.icerockdev.com/scl/sheets-localizations-generator).