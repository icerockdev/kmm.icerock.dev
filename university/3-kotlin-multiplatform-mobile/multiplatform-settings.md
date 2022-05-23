---
sidebar_position: 3
---

# Multiplatform Settings 

Ознакомьтесь с [multiplatform-settings](https://github.com/russhwolf/multiplatform-settings) - библиотекой, позволяющей сохранять key-value данные в параметры устройства из общего кода, используя `SharedPreferences` для Android и `NSUserDefaults` для iOS  
Разберем варианты ее подключения к проекту.

:::info
Если вы используете [0.8.1](https://github.com/russhwolf/multiplatform-settings/releases/tag/v0.8.1) версию библиотеки, и [Kotlin 1.6.20](https://github.com/JetBrains/kotlin/releases/tag/v1.6.20), то, при выполнении таска `:linkDebugFrameworkIos` у вас произойдет ошибка:
```text
e: The symbol of unexpected type encountered during IR deserialization: IrSimpleFunctionPublicSymbolImpl, com.russhwolf.settings/Settings|-62081702699614493[0]. IrClassifierSymbol is expected.

This could happen if there are two libraries, where one library was compiled against the different version of the other library than the one currently used in the project. Please check that the project configuration is correct and has consistent versions of dependencies.
```

Чтобы ее избежать, добавьте в `commonMain/build.gradle` следующее:
```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xlazy-ir-for-caches=disable"
        }
    }
}
```
Более подробно о проблеме можете прочитать [здесь](https://githubhot.com/repo/russhwolf/multiplatform-settings/issues/106).
:::

## Подключение, используя expect/actual
Создайте expect/actual функцию, для получения `settings` на платформах
  - получение `settings` для Android  
    `androidMain:`
    ```kotlin
    var appContext: Context? = null
    
    actual fun getSettings(): Settings {
        val delegate = appContext!!.getSharedPreferences("app", Context.MODE_PRIVATE)
        val settings = AndroidSettings(delegate)
        return settings
    }
    ```
    Перед тем, как обращаться к функции `getSettings`, проинициализируйте переменную `appContext`.
    
  - получение `settings` для iOS  
    `iosMain:`
    ```kotlin
    actual fun getSettings(): Settings {
        val delegate = NSUserDefaults.standardUserDefaults
        val settings: Settings = AppleSettings(delegate)
        return settings
    }
    ```

## Подключение no-arg библиотеки
Если вся работа с multiplatform-settings будет происходить в общем коде, вы можете использовать [no-arg-module](https://github.com/russhwolf/multiplatform-settings#no-arg-module).  
Используя его, вам не придется инициализировать `Settings` на платформе, для `Android`, в качестве делегата будет использоваться `PreferenceManager.getDefaultSharedPreferences()`, а для iOS - `NSUserDefaults.standardUserDefaults`. 
- подключите `no-arg` библиотеку к commonMain модулю: `implementation("com.russhwolf:multiplatform-settings-no-arg:0.8.1")`
- создайте `settings`, сохраните значение, а затем прочитайте
- протестируйте на обеих платформах

## Подключение напрямую к платформе
Нам необходимо подключить библиотеку как `api`, чтобы ее классы были доступны за пределами общего модуля. Подробнее о разнице между `api` и `implementation` можете почитать [здесь](../../learning/gradle/configuration).  
Добавьте подключение библиотеки к общему модулю:
```kotlin
commonMain {
    dependencies {
        // ...
        api("com.russhwolf:multiplatform-settings:0.8.1")
    }
}
```
Убедитесь, что класс `AndroidSettings` стал доступен в Android-проекте.  

Однако, этого не достаточно, чтобы библиотека стала доступна и на iOS. Чтобы это сделать, необходимо добавить классы библиотеки в header iOS фреймворка, чтобы они стали видны из swift.
По умолчанию, для `api`-зависимостей этого не происходит, потому что тогда бы бинарник фреймворка был бы огромный (кому интересно, почитайте об этом [тут](../../learning/kotlin-native/size_impact)).  
Но, при желании, добавить классы в хидер можно, для этого добавьте следующие строчки в раздел `cocoapods/framework` в `shared/build.gradle` файле: 
```kotlin
export("com.russhwolf:multiplatform-settings:0.8.1")
```
Как должно получиться:
```kotlin
cocoapods {
    summary = "Some description for the Shared Module"
    homepage = "Link to the Shared Module homepage"
    ios.deploymentTarget = "14.1"
    podfile = project.file("../iosApp/Podfile")
    framework {
        baseName = "shared"
        export("com.russhwolf:multiplatform-settings:0.8.1")
    }
}
```
Более подробно о настройке фреймворка вы можете прочитать [тут](https://kotlinlang.org/docs/multiplatform-build-native-binaries.html#export-dependencies-to-binaries).

Наконец, выполните команду `pod install` и классы библиотеки mutliplatform-settings станут доступны на iOS, попробуйте создать `AppleSettings`.

## KeyValueStorage

В работе мы делегируем работу с хранилищем устройства классу `KeyValueStorage`.

Это позволяет нам:
- Не создавать константу-ключ для каждой переменной в хранилище
- Не беспокоиться о том, что в переменной окажется что-то не то, потому что мы задали тип

```kotlin
class KeyValueStorage(settings: Settings) {
    var platformName: String? by settings.nullableString("platform_name_key")
    var language: String? by settings.nullableString("language_key")
}
```

## Практическое задание
1. Откройте проект, который вы изменяли в разделе [expect/actual](expect-actual) или создайте новый по [инструкции](https://kotlinlang.org/docs/kmm-create-first-app.html)
1. Подключите multiplatform-settings, используя no-arg модуль библиотеки, убедитесь, что все работает
1. Подключите multiplatform-settings напрямую к платформам, убедитесь, что все работает
1. Подключите multiplatform-settings, используя expect/actual, убедитесь, что все работает
1. Сохраните название платформы в хранилище устройства в общем коде
1. Для iOS и Android выведите на экран значение, которое сохранили в общем коде используя библиотеку
