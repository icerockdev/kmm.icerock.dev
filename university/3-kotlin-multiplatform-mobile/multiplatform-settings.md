---
sidebar_position: 3
---

# Multiplatform Settings 

Ознакомьтесь с [multiplatform-settings](https://github.com/russhwolf/multiplatform-settings) - библиотекой, позволяющей сохранять key-value данные в параметры устройства из общего кода, используя `SharedPreferences` для Android и `NSUserDefaults` для iOS  
Разберем варианты ее подключения к проекту.

## Подключение, используя expect/actual
Создайте expect/actual функцию, для получения `settings` на платформах
  - получение `settings` для Android
    ```kotlin
    val delegate: SharedPreferences // ...
    val settings: Settings = AndroidSettings(delegate)
    ```
  - получение `settings` для iOS
    ```kotlin
    val delegate: NSUserDefaults // ...
    val settings: Settings = AppleSettings(delegate)
    ```
## Подключение напрямую к платформе
Нам необходимо подключить библиотеку как `api`, чтобы ее классы были доступны за пределами общего модуля. Подробнее о разнице между `api` и `implementation` можете почитать [здесь](/learning/gradle/configuration).  
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

Однако, этого не достаточно, чтобы библиотека стала доступна и на iOS. Чтобы это сделать, необходимо добавить бинарники классов библиотеки к iOS фреймворку, в который собирается общий код.
По умолчанию, для `api`-зависимостей этого не происходит, потому что тогда бы бинарник фреймворка был бы огромный (кому интересно, почитайте об этом [тут](learning/kotlin-native/size_impact)).  
Но, при желании, подключить бинарники библиотеки можно, для этого добавьте следующие строчки в раздел `cocoapods/framework` в `shared/build.gradle` файле: 
```kotlin
export("com.russhwolf:multiplatform-settings:0.8.1")
transitiveExport = true
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
        export("dev.icerock.moko:fields:0.9.0")
        transitiveExport = true
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
1. Подключите multiplatform-settings напрямую к платформам, убедитесь, что все работает
1. Подключите multiplatform-settings, используя expect/actual, убедитесь, что все работает
1. Сохраните название платформы в хранилище устройства в общем коде
1. Для iOS и Android выведите на экран значение, которое сохранили в общем коде используя библиотеку
