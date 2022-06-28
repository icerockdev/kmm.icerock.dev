---
sidebar_position: 2
---

# expect/actual

expect/actual - это механизм, позволяющий использовать в общем коде платформенную реализацию класса, функции или переменной. 
Изучите [раздел](https://kotlinlang.org/docs/mpp-connect-to-apis.html) на официальном сайте.  

В качестве практического задания, предлагаем вам:
1. Создать новый KMM проект по [инструкции](https://kotlinlang.org/docs/kmm-create-first-app.html)
   - используйте `CocoaPods dependency manager` в качестве iOS Framework distribution
   - прочитайте о [CocoaPods dependency manager](https://kotlinlang.org/docs/native-cocoapods.html#use-a-kotlin-gradle-project-as-a-cocoapods-dependency) и [Regular framework](https://kotlinlang.org/docs/multiplatform-mobile-understand-project-structure.html#ios-application)
2. Добавить в общий код `expect` функцию `log()`
3. Добавить `actual` реализацию функции `log` для Android, используя функцию `Log.d(String tag, String msg)` из пакета `android.util`
4. Добавить `actual` реализацию функции `log` для iOS, используя `NSLog()`
5. Протестировать на обеих платформах

## Добавление зависимостей

Как вы уже знаете из раздела [Основы Kotlin Multiplatform Mobile](kmm), подключить библиотеку можно напрямую к таргету, а с помощью `expect` и `actual` использовать ее в общем коде.

Для практики, выполните следующее задание. Используйте проект, который вы изменяли ранее:
- Подключите [moshi](https://github.com/square/moshi) к Android таргету
- Подключите pod [NSTEasyJSON](https://github.com/bernikovich/NSTEasyJSON) к shared блоку
    - Добавьте в Podfile строку `pod 'NSTEasyJSON'` 
    - В gradle этого блока в разделе `cocoapods` добавить эту библиотеку: pod("NSTEasyJSON"). [Инструкция](https://kotlinlang.org/docs/native-cocoapods.html).  
    ```kotlin
    cocoapods {
      summary = "Some description for the Shared Module"
      homepage = "Link to the Shared Module homepage"
      ios.deploymentTarget = "14.1"
      podfile = project.file("../iosApp/Podfile")
      framework {
        baseName = "shared"
      }
      pod("NSTEasyJSON")
    }
    ```
- Добавьте expect функцию `getValueByKeyFromJsonString(jsonString: String, key: String): String` в блок `shared/src/commonMain/kotlin`
- Добавьте в блок `shared/src/commonMain/kotlin` константу `jsonStringConst`, проинициализируйте ее любым Json-ом, [сервис для генерации](https://json-generator.com/)
- Для каждой платформы выведите на экран значение какого-нибудь поля
    - Добавьте `actual` реализацию функции `getValueByKeyFromJsonString` в блок `shared/src/androidMain/kotlin` используя библиотеку moshi
    - Добавьте `actual` реализацию функции `getValueByKeyFromJsonString` в блок `shared/src/iosMain/kotlin` используя библиотеку NSTEasyJSON
      - Для получения доступа к библиотеке NSTEasyJSON, добавьте `import cocoapods.NSTEasyJSON.NSTEasyJSON`
      - Как использовать функцию из файла в iOS проекте: во время компиляции компилятор складывает все top level декларации (функции и свойства вне класса) в синтетический класс Kt, поэтому функция, находящаяся в файле `shared/src/iosMain/kotlin/getValueByKeyFromJsonString.kt` будет доступна на iOS вот так: `GetValueByKeyFromJsonStringKt.getValueByKeyFromJsonString(jsonString:, key:)`
      
    
## typealias 

Чтобы узнать, как можно упросить использование механизма expect/actual, [прочитайте](https://kotlinlang.org/docs/mpp-connect-to-apis.html#rules-for-expected-and-actual-declarations) о возможностях `typealias` и выполните следующие действия, используя проект, который вы изменяли ранее: 

- Создайте `expect class AtomicRef`
- Добавьте `actual` реализацию используя `typealias` и класс `java.util.concurrent.atomic.AtomicReference`
- Добавьте `actual` реализацию для iOS
- Убедитесь в успешной компиляции приложения
