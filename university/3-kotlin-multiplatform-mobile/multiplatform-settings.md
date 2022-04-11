---
sidebar_position: 3
---

# Multiplatform Settings 

Ознакомьтесь с [multiplatform-settings](https://github.com/russhwolf/multiplatform-settings) - библиотекой, позволяющей сохранять key-value данные в параметры устройства из общего кода используя `SharedPreferences` для Android и `NSUserDefaults` для iOS  
Чтобы попрактиковаться, выполните следующее задание
1. Откройте проект, который вы изменяли в разделе [expect/actual](expect-actual) или создайте новый по [инструкции](https://kotlinlang.org/docs/kmm-create-first-app.html)
1. Подключите multiplatform-settings
    - Вариант 1, создайте expect/actual функцию, для получения `settings` на платформах
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
    - Вариант 2, используем плагин [mobile-multiplatform-gradle-plugin](https://github.com/icerockdev/mobile-multiplatform-gradle-plugin), подробнее о нём вы узнаете в блоке №4.
    
1. Сохраните название платформы в хранилище устройства в общем коде
1. Для iOS и Android выведите на экран значение, которое сохранили в общем коде используя библиотеку

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