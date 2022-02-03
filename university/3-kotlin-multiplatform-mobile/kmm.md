---
sidebar_position: 1
---

# Основы Kotlin Multiplatform Mobile

Для начала, чтобы разобраться, что из себя представляет технология Kotlin Multiplatform Mobile, советуем изучить [официальный сайт](https://kotlinlang.org/lp/mobile/).
Также, для лучшего понимания, как Kotlin Multiplatform помогает сократить время разработки, советуем прочитать нашу небольшую [статью](https://vc.ru/services/167078-kak-kotlin-multiplatform-pomogaet-sokratit-vremya-razrabotki-prilozheniy)

Далее, можете переходить к изучению технологии на [официальном сайте](https://kotlinlang.org/docs/mpp-intro.html)

1. Знакомство с KMM начните с официальных [видео](https://www.youtube.com/playlist?list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C) для начинающих 
1. Создайте свое первое мультиплатформенное приложение по [инструкции](https://kotlinlang.org/docs/kmm-create-first-app.html)
1. Разберитесь со структурой KMM приложения по [ссылке](https://kotlinlang.org/docs/kmm-understand-project-structure.html)
1. [Кодлаба](https://kotlinlang.org/docs/kmm-integrate-in-existing-app.html) про изменение готового Android-приложения для работы с iOS
1. [Инструкция](https://kotlinlang.org/docs/kmm-add-dependencies.html) по добавлению зависимостей к KMM модулю

## Мультиплатформенные библиотеки
 
Мультиплатформенная библиотека - это библиотека, адаптированная для использования на разных платформах. Функционал такой библиотеки можно использовать в общем коде, он будет работать для всех таргетов, которые поддерживает библиотека.
Таргеты мультиплатформенной библиотеки - целевая платформа, на которой будет выполняться скомпилированная библиотека. Со списком всех таргетов, поддерживаемых Kotlin Multiplatform можете ознакомиться по [ссылке](https://kotlinlang.org/docs/mpp-supported-platforms.html)  
В работе нас будут интересовать библиотеки поддерживающие следующие таргеты:
- jvm - для работы приложений на Java Virtual Machine (jvm библиотеки поддерживаются на android)
- androidJvm - для работы приложения на Android устройствах
- ios_arm64 - для работы приложения на симуляторах iOS устройств
- ios_x64 - для работы приложения на реальных iOS устройствах
- simulator_x64 - для симуляторов iOS на M1

Чтобы понять, какие таргеты поддерживает библиотека, следует проанализировать её репозиторий на наличие следующих признаков
1. Наличие информации в README о поддержке различных платформ, например, описание [moko-mvvm](https://github.com/icerockdev/moko-mvvm#mobile-kotlin-model-view-viewmodel-architecture-components)
1. Наличие shared-модуля, включенный плагин мультиплатформы и установка таргетов и сурсетов
```kotlin
plugins {
    kotlin("multiplatform") version "*.*.*"
    // ..
}

kotlin {
    android()
    ios()
}
```

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting
        val androidMain by getting {
            dependencies {
                // ...
            }
        }
        val iosMain by getting
        // ...
    }
}
```

Также, определить таргеты мулитиплатформенной библиотеки можно изучив ее артефакты на [Maven Central](https://search.maven.org/)
Например, рассмотрим библиотеку [moko-fields](https://search.maven.org/search?q=g:dev.icerock.moko%20fields)

Выводы, которые можно сделать увидев артефакты библиотеки:
- fields - это common-модуль
- библиотека поддерживает Android устройства
- библиотека поддерживает симуляторы и устройства iOS, но не на M1

При выборе библиотеки обязательно обращайте внимание на наличие таргетов `jvm`, `androidJvm` `ios_arm64` `ios_x64`, `simulator_x64`. Не забывайте проверить дату последнего релиза, чтобы удостовериться, поддерживает ли разработчик свою библиотеку.  
Для поиска мультиплатформенной библиотеки, подходящей для решения вашей задачи, советуем сначала поискать на следующих ресурсах:
- [kmm-awesome](https://github.com/terrakok/kmm-awesome)
- [libs.kmp.icerock.dev](https://libs.kmp.icerock.dev) - библиотеки, представленные на сайте, поддерживают минимум три таргета, необходимые нам для разработки
- [kamp.petuska.dev](https://kamp.petuska.dev/)

В заключение, можете посмотреть [видео](https://youtu.be/jAIuy91YWfU) про создание мультиплатформенных библиотек на примере [mutliplatform-settings](https://github.com/russhwolf/multiplatform-settings)  

## Настройка gradle

[Официальная документация](https://kotlinlang.org/docs/mpp-dsl-reference.html) по настройке gradle для работы с KMM
Из [видео](https://youtu.be/23BJW4w0gkY) вы узнаете, как создать и настроить gradle-проект до состояния, с которого стартует разработка нового проекта в IceRock

## Совместимость со Swift/Objective-C

Прочитайте [статью](https://kotlinlang.org/docs/native-objc-interop.html) про совместимость Kotlin со Swift и Objective-C

Рекомендуем ознакомиться со следующими разделами
- [Маппер](https://kotlinlang.org/docs/native-objc-interop.html#mappings) типов Kotlin со Swift и Objective-C 
- [Преобразование методов throwable-методов](https://kotlinlang.org/docs/native-objc-interop.html#errors-and-exceptions)

## Вопросы для самопроверки
- Объясните в двух словах, что такое KMM, какие проблемы решает?
- Что такое Shared-модуль?  
- Что такое таргеты и сурсеты? какие они бывают? чем отличаются?
- Можно ли подключить библиотеку только для одного сурсета? Будет ли она доступна для других сурсетов?
- Расскажите, что такое мультиплатформенная библиотека, чем она отличается от других?
- Можно ли в KMM использовать не мультиплатформенную библиотеку? Если да, то как? 
- Как определить, что библиотека мультиплатформенная? 
- Что будет, если не пометить suspend функцию из общего кода аннотацией @Throws? 