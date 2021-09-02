# Configurations

Каждая зависимость, объявленная для проекта Gradle, применяется к определенной области. Например, некоторые зависимости должны использоваться для компиляции исходного кода, в то время как другие должны быть доступны только во время выполнения. 

:::important

Gradle представляет область зависимости с помощью конфигураций!

:::

Подробнее о конфигурации зависимостей в Gradle можете прочитать [тут](https://docs.gradle.org/current/userguide/declaring_dependencies.html).

Для работы же с мультифплатформой мы будет использовать `Kotlin Gradle Plugin` и `kotlin-miltiplatform` plugin.

Посмотрим как устроены зависимости на примере [boilerplate-проекта](https://gitlab.icerockdev.com/scl/boilerplate/mobile-moko-boilerplate).

В корневом `build.gradle.kts` объявлены пути до исходного кода зависимостей:

```kotlin
buildscript {
    // ...
    dependencies {
        classpath("dev.icerock.moko:resources-generator:0.16.1")
        classpath("dev.icerock.moko:network-generator:0.16.0")
        classpath("dev.icerock.moko:units-generator:0.6.1")
        classpath("org.jetbrains.kotlin:kotlin-serialization:1.5.20")
        classpath("com.google.firebase:firebase-crashlytics-gradle:2.7.1")
        classpath("com.google.gms:google-services:4.3.8")
        classpath("com.google.dagger:hilt-android-gradle-plugin:2.35")
        // тут нет группы т.к этот проект подключен композитным билдом
        classpath(":build-logic")
    }
}
```

Теперь посмотрим на `build.gradle.kts` лежащий в проекте `build-logic`:

```kotlin
dependencies {
    api("dev.icerock:mobile-multiplatform:0.12.0")
    api("org.jetbrains.kotlin:kotlin-gradle-plugin:1.5.21")
    api("com.android.tools.build:gradle:4.2.1")
    api("io.gitlab.arturbosch.detekt:detekt-gradle-plugin:1.15.0")
}
```

Тут используется корфигурация `api`, т.к в общедоступном API добавляемых в зависимость модулей используется какой-либо тип зависимости. 

:::note

Тип зависимости `api` используется как во время компиляции, так и во время выполнения и экспортируется пользователям библиотек.

:::

Теперь же посмотрим как устроены зависимости в `build.gradle.kts` нашей общей библиотеки `mpp-library`:

```kotlin
dependencies {
    // зависмотсти, нужные для внутренней логики модуля
    commonMainImplementation(libs.coroutines)
    commonMainImplementation(libs.kotlinSerialization)
    commonMainImplementation(libs.ktorClient)
    commonMainImplementation(libs.ktorClientLogging)

    // зависимости, нужные для внутренней логики модуля в android source-set'е
    androidMainImplementation(libs.lifecycleViewModel)

    // зависимсоти нужные для самого модуля и для тех, кто его использует
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

    // зависимости, нужные для внутренней логики модуля в тестовом source-set'е
    commonTestImplementation(libs.mokoTestCore)
    commonTestImplementation(libs.mokoMvvmTest)
    commonTestImplementation(libs.mokoUnitsTest)
    commonTestImplementation(libs.multiplatformSettingsTest)
    commonTestImplementation(libs.ktorClientMock)
}
```

:::note

Зависимость с типом `implementation` используется во время компиляции и во время выполнения для текущего модуля, но не предоставляется для компиляции других модулей, которые находятся в зависимости `implementation`.

:::

:::info

Кроме того, вы можете указать зависимости на верхнем уровне с именем конфигураций используя следующий шаблон: `<sourceSetName><dependencyType>(...)`

Подробнее [тут](https://kotlinlang.org/docs/gradle.html#dependency-types).

::: 


