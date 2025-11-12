---
sidebar_position: 3
---

# Kotlin/Swift interop

## Top-level функции в Kotlin Multiplatform и их вызов из Swift

В Kotlin мы можем объявлять глобальные функции (top-level functions), то есть функции вне классов и объектов:
```kotlin
fun log(message: String) {
    println(message)
}
```

На Android такие функции вызываются напрямую. Но при интеграции с iOS возникает ощущение, что это функция не видна в Swift коде.
Дело в том, что Swift получает доступ к Kotlin-функциям через Objective-C. В Objective-C глобальных функций нет, поэтому компилятор Kotlin при экспорте в iOS “упаковывает” top-level функции в специальные классы.
Имя этого класса формируется из названия файла, где функция была определена. Если, например, функция log находится в Logger.kt, то в Swift её нужно вызвать так:
```swift
LoggerKt.log("Hello from iOS")
```
То есть доступ к функции осуществляется не напрямую, а через сгенерированный класс LoggerKt.

## Полезные ссылки:

- [Interoperability with Swift/Objective-C](https://kotlinlang.org/docs/native-objc-interop.html)
- [Russell Wolf - The Kotlin/Swift boundary](https://vimeo.com/625847664)
- [Реализация ObjectiveC протоколов в Kotlin](objc_protocol.md)
- [Kotlin/Swift interopedia](https://github.com/hhru/kotlin-swift-interopedia)
