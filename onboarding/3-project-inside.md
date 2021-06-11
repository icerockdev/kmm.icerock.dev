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
buildSrc/
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

- `buildSrc` - директория с логикой для системы сборки gradle;
- `android-app` - исходный код android приложения;
- `ios-app` - исходный код iOS приложения;
- `mpp-library` - исходный код общей библиотеки на KMM;
- `gradle` - специальная директория системы сборки gradle, в которой лежит Gradle Wrapper;
- `build.gradle.kts` - файл конфигурации сборки корневого gradle проекта;
- `gradle.properties` - файл с опциями, которые передаются в gradle проект при запуске;
- `gradlew` и `gradlew.bat` - скрипты для unix и windows соответственно, которые запускают Gradle используя Gradle Wrapper;
- `settings.gradle.kts` - файл настроек gradle проекта;
- `README.md` - краткое описание содержимого репозитория и инструкция как собирать проект.

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
- `buildSrc` - библиотека с логикой сборки;
- `gradle.properties` - опции запуска gradle проекта;
- `settings.gradle.kts` - файл настроек;
- `build.gradle.kts` - файл конфигурации сборки.

Больше файлов относящихся непосредственно к коревому gradle проекту в репозитории нет.

### buildSrc
`buildSrc` - [специальная директория Gradle](https://docs.gradle.org/current/userguide/organizing_gradle_projects.html#sec:build_sources). Она предназначена для реализации логики сборки, не привязанной к конкретному gradle модулю. По сути это исходники библиотеки, которая автоматически будет подгружена в gradle и все классы объявленные в этой библиотеке будут доступны в любом месте Gradle конфигурации (в `build.gradle.kts`).

В этой директории можно увидеть собственный `build.gradle.kts` и исходный код библиотеки. `build.gradle.kts` определяет как будет собираться данная библиотека и какие зависимости ей требуются. Исходный код библиотеки в нашем проекте содержит только один объект `Deps`, содержащий константы с зависимостями, необходимые нашему проекту.

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

### gradle.properties

Данный файл состоит из пар ключ-значение параметров настройки запуска gradle.
Использование `gradle.properties` это альтернатива использованию флагов командной строки для конфигурации проекта.

```
// максимально доступная модулю gradle память равнв 4гб
org.gradle.jvmargs=-Xmx4096m
// не распространять конфигурацию на все проекты
org.gradle.configureondemand=false
// включаем режим параллельного выполнения
org.gradle.parallel=true
// для последующих сборок будут использоваться кеши предыдущих сборок
org.gradle.caching=true
// использовать официальный стандарт кода
kotlin.code.style=official

// плагин Android будет использовать библиотеку AndroidX вместо стандартной библиотеки
android.useAndroidX=true

// отключить предупреждения о том, что технология mpp являестя эксперементальной
kotlin.mpp.stability.nowarn=true

// отключить предупреждения об используемых таргетах ios
mobile.multiplatform.iosTargetWarning=false

VERSION_NAME=0.1.0
VERSION_CODE=1

xcodeproj=ios-app/ios-app.xcworkspace
```

### settings.gradle.kts

Этот файл необходим для сборки с несколькими проектами, в нашем случае это `android-app`, `mpp-library` и `mpp-library:feature:auth`

### build.gradle.kts

Эти зависимости будут также автоматически подключены и к самому Gradle проекту, поэтому плагины из этих зависимостей мы можем применять без добавления артефактов в `classpath`.

## mpp-library

> Есть где то видос или хорошая статья о SharedFactory и DomainFactory

Ага , просто столкнулся с тем что ранее я их не трогал но сейчас для того что бы идти дальше мне нужно сделать  authRepository, но сделать его в SharedFactory

иммет ли значение где делать factory initializers ?

Где еще нужно добавить для DomainFactory import что бы заработал , generated - горит красным .

Оба приложения зависят от `mpp-library`, которая предоставляет доступ к ViewModel'и к каждой фиче через SharedFactory. Библиотека отвечает за установку соединений между фичей и `domain` modules.
`mpp-library` содержит следующие модули:
- `domen` ( отказались от использования ) - содержит объекты домена, репозитории, классы API сервера и DomainFactory, который создает экземпляры для всех из них;
- `feature` - каждая фича содержит соответствующие ViewModel, Factory, модели и интерфейсы, которые ожидаются от родительского модуля;
    Пример фичей:
    - `config` содержит функции конфигурации ViewModel, интерфейс хранилища данных и ConfigFactory, которая создают экземпляры ViewModel;
    - `list` содержит функции элементов списка ViewModel, интерфейс источника данных, интерфейс фабрики элементов списка и ListFactory, которая создают экземпляры ViewModel.
    - `auth`
`SharedFactory` - входная точка для Native, как для ios, так и для android. В ней создаются Factory для всех фичей
Фичи между собой никак не связанны,
    ## android-app
## android-app

`android-app` - gradle проект с android приложением.

В нем подключен gradle плагин `com.android.application` (через константу `Deps.Plugins.androidApplication`) и описана вся конфигурация для сборки android приложения.

### Навигация в Android

## ios-app

`ios-app` - директория, в которой лежит Xcode проект ios приложения.

### Навигация в iOS

Прежде чем идти дальше немного остановимся на том, как построена навигация в iOS приложение и какие
подходы при работе с ней мы используем.

В основе навигации лежат координаторы. Каждый координатор покрывает логически связанный блок
функционала, который чаще всего состоит из нескольких экранов. При этом между собой они независимы и
отвечают только за цепочку переходов только внутри себя. Также имеют возможность получать настройку
действия, которое должно быть выполнено после завершения блока ответственности координатора.

Например.

Предположим, что у нас есть приложение с авторизацией и списком новостей, с которого
можно перейти к детальному просмотру каждой новости и в раздел настроек для конфигурации отображения новостей.

Это разобьётся на 4 координатора:

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
остальные. Добавим его к нашему проекту.

Создадим в ios-проекте папку src/Coordinators и в ней файлик BaseCoordinator. Для начала докинем
туда пару протоколов:

```swift
protocol ChildCoordinable {
    var childCoordinators: [Coordinator] { get set }

    func addDependency(_ coordinator: Coordinator)
    func removeDependency(_ coordinator: Coordinator?)
}
```

ChildCoordinable - необходим для корректной работы с зависимостями от дочерних координаторов.
Необходимо не забывать добавлять зависимости на новые координаторы, удалять зависимость на
конкретный координатор и запоминать список тех координаторов, которые являются дочерними к текущему.

```swift
protocol Coordinator: class {
    var completionHandler: (() -> Void)? { get set }

    func start()
}
```

Coordinator - сам протокол координатора. По сути он должен иметь ровно две вещи - completionHandler,
который вызовется при завершении его логической зоны ответственности. И функцию start. При её вызове
он начинает запускать свой флоу таким образом, каким считает нужным.

И далее сам класс базового координатора, который реализует оба этих протокола:

```swift
class BaseCoordinator: NSObject, Coordinator, ChildCoordinable, UINavigationControllerDelegate {
    var childCoordinators: [Coordinator] = []
    var completionHandler: (() -> Void)?

    let window: UIWindow

    weak var navigationController: UINavigationController?

    init(window: UIWindow) {
        self.window = window
    }

    func start() {
    }

    func addDependency(_ coordinator: Coordinator) {
        for element in childCoordinators where element === coordinator {
            return
        }
        childCoordinators.append(coordinator)
    }

    func removeDependency(_ coordinator: Coordinator?) {
        guard
            childCoordinators.isEmpty == false,
            let coordinator = coordinator
        else { return }
        
        for (index, element) in childCoordinators.enumerated() where element === coordinator {
            
            childCoordinators.remove(at: index)
            break
            
        }
    }

    func currentViewController() -> UIViewController? {
        return self.navigationController?.topViewController?.presentedViewController ?? self.navigationController?.topViewController ?? self.navigationController
    }

    func popBack() {
        self.navigationController?.popViewController(animated: true)
    }
}
```

Для инициализации необходим только window. Также можно указать NavigationController с предыдущего
координатора, для сохранения общей навигации.

Добавление и удаление зависимостей нужны для корректной очистки связей и памяти при построении
цепочек координаторов.

Также есть вспомогательные методы, которые позволяют получить текущий контроллер -
currentViewController и совершить переход назад - popBack.

От проекта к проекту базовый координатор может изменяться, обеспечивая дополнительные нужды проекта.

Теперь, когда у нас есть базовый координатор, создадим на его основе стартовый координатор
приложения. Создаём рядом с AppDelegate файл для него, называем AppCoordinator:

```swift
import Foundation
import UIKit

class AppCoordinator: BaseCoordinator {
    // MARK:** - Overrides**
    override func start() {
        let vc = UIViewController()
        vc.view.backgroundColor = UIColor.green
        self.window.rootViewController = vc
    }
}
```

Пусть он пока будет совсем простой, создающий контроллер зелёного цвета и делает его главным экраном
window.

Теперь нам надо познакомить AddDelegate с его координатором. Идём в AppDelegate.swift

Добавим ему ссылку на координатор приложения:

```
private (set) var coordinator: AppCoordinator!
```

А в didFinishLaunchingWithOptions после создания SharedFactory добавим создание координатора и вызов
старта:

```swift
self.coordinator = AppCoordinator(
    window: self.window!
)
self.coordinator.start()
```

Готово. Собираем, запускаем и видим наш зелёный контроллер:

Теперь дальнейшая логика переходов зависит от текущего контроллера и действий юзера на нём. Но
зелёным прямоугольником мир не спасёшь и юзера не авторизуешь. Поэтому пора переходить к созданию
нашей первой фичи.
