---
sidebar_position: 5
---

# Основы работы с expect/actual

expect/actual - это механизм, позволяющий использовать в общем коде платформенную реализацию класса, функции или переменной
Изучите [раздел](https://kotlinlang.org/docs/mpp-connect-to-apis.html) на официальном сайте.  
В качестве практического задания, предлагаем вам изменить проект, который вы создавали по [инструкции](https://kotlinlang.org/docs/kmm-create-first-app.html) в разделе [Multiplatform Settings](multiplatform-settings):
- Добавьте в общий код suspend-функцию greeting
- Добавьте actual-реализацию функции greeting для Android
- Добавьте actual-реализацию функции greeting для iOS

## Добавление зависимостей

Представим ситуацию, вы хотите использовать [Material Buttons](https://material.io/components/buttons) для верстки кнопок Android и iOS приложений. В Android эта библиотека доступна по умолчанию, а для iOS придется подключить
Как вы уже знаете из раздела [Основы Kotlin Multiplatform Mobile](kmm), подключить библиотеку можно напрямую к таргету, а с помощью expect/actual использовать ее в общем коде.

Для практики, выполните следующее задание. Используйте проект, который вы изменяли ранее:
- Подключите [moshi](https://github.com/square/moshi) к Android таргету
- Подключите под [SwiftyJSON](https://github.com/SwiftyJSON/SwiftyJSON) к iOS приложению
- Добавьте expect функцию getValueByKeyFromJsonString(jsonString: String, key: String): String
- Добавьте в общий код константу jsonStringConst, проинициализируйте ее любым Json-ом, [сервис для генерации](https://json-generator.com/)
- Для каждой платформы выведите на экран значение какого-нибудь поля
    - Добавьте actual-реализацию функции getValueByKeyFromJsonString для Android используя библиотеку moshi
    - Добавьте actual-реализацию функции getValueByKeyFromJsonString для iOS используя библиотеку SwiftyJSON
    
## typealias 

Чтобы узнать, как можно упросить использование механизма expect/actual, [прочитайте о возможностях typealias](https://kotlinlang.org/docs/mpp-connect-to-apis.html#rules-for-expected-and-actual-declarations)

Для практики, повторите проделанное в разделе `Rules for expected and actual declarations`
- Создайте expect class AtomicRef
- Добавьте actual-реализацию используя typealias и класс java.util.concurrent.atomic.AtomicReference
- Добавьте actual-реализацию для iOS
- Убедитесь в успешной компиляции приложения
