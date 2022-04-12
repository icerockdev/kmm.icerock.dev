---
sidebar_position: 4
---

# Kotlin Serialization

Kotlin Serialization - это библиотека, предназначенная для удобной cериализации классов. Например, для преобразования строки в JSON объект и обратно. Помимо JSON поддерживаются и другие форматы, например protobuf.

Основное ее преимущество - совместимость с Kotlin Multiplatform. Преобразование в общем коде в JSON и обратно, используя Kotlin Serialization, будет работать на iOS, Android и всех остальных платформах, поддерживаемых Kotlin.

Познакомиться с библиотекой можно на [официальном сайте](https://kotlinlang.org/docs/serialization.html#libraries). Полная информация о библиотеке доступна в [гайде](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md) на GitHub. Для дальнейшего прохождения курса советуем ознакомиться с первой, второй и третьей главой.

После изучения, для закрепления материала, советуем пройти [кодлабу](https://www.raywenderlich.com/26883403-android-data-serialization-tutorial-with-the-kotlin-serialization-library).
Вы узнаете о возможностях библиотеки и потренируетесь на практике.

## Вопросы для самопроверки
- Для чего нужны аннотации `@Serializable`, `@Transient`, `@Optional`, `@Required`, `@SerialName`?
- Как получить сериализатор `List` или `Map`? 
- Как настроить `JsonSerializer` чтобы он игнорировал неизвестные ключи?
- Как сделать так, чтобы ключ не отправлялся на сервер?