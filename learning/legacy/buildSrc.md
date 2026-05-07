---
sidebar_position: 1
---

# buildSrc

:::caution

Директория упразднена!

На новых проектах IceRock вместо `buildSrc` используется `build-logic`.

:::

`buildSrc` - [специальная директория Gradle](https://docs.gradle.org/current/userguide/organizing_gradle_projects.html#sec:build_sources). Она предназначена для реализации логики сборки, не привязанной к конкретному gradle модулю. По сути это исходники библиотеки, которая автоматически будет подгружена в gradle и все классы, объявленные в этой библиотеке, будут доступны в любом месте Gradle конфигурации (в `build.gradle.kts`).

В этой директории можно увидеть собственный `build.gradle.kts` и исходный код библиотеки. `build.gradle.kts` определяет, как будет собираться данная библиотека и какие зависимости ей требуются. Исходный код библиотеки в нашем проекте содержит только один объект `Deps`, содержащий константы и зависимости, необходимые нашему проекту.

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
    // сначала перечисляются константами версии каждой из использующихся зависимостей,
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
        // мы можем объявить gradle плагин, используя только id, в таком случае будет недоступно
        // подключение артефакта с данным плагином (для этого нужно указание свойства module),
        // такой подход используется для плагинов, которые подключаются с gradlePluginPortal либо
        // содержатся в зависимостях, которые указаны в buildSrc/build.gradle.kts
        val androidApplication = GradlePlugin(id = "com.android.application")
        // для плагинов, которые требуют подключения дополнительных артефактов, нужно указать свойство
        // module и в build.gradle.kts подключить в buildscript.dependencies
        val kotlinSerialization = GradlePlugin(
            id = "org.jetbrains.kotlin.plugin.serialization",
            module = "org.jetbrains.kotlin:kotlin-serialization:$kotlinxSerializationPluginVersion"
        )
        // ...
    }

    // вложенный объект Libs содержит объявления каждой внешней библиотеки
    object Libs {
        // в Android содержатся библиотеки, относящиеся только к android,
        // они используются в android-app либо как зависимости androidMain sourceSet'а
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

        // в MultiPlatform объекте содержатся объявления всех мультиплатформенных библиотек,
        // они используется в mpp-library и вложенных в нее модулях
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
            // в name указывается путь до gradle проекта, а в exported  - флаг, нужно ли экспортировать 
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
