---
sidebar_position: 4
---

# Kotlin Serialization

Kotlin Serialization - это библиотека, предназначенная для удобной cериализации классов. Например, для преобразования строки в JSON объект и обратно. Помимо JSON поддерживаются и другие форматы, например protobuf.

Основное ее преимущество - совместимость с Kotlin Multiplatform. Преобразование в общем коде в JSON и обратно, используя Kotlin Serialization, будет работать на iOS, Android и всех остальных платформах, поддерживаемых Kotlin.

Познакомиться с библиотекой можно на [официальном сайте](https://kotlinlang.org/docs/serialization.html#libraries). Полная информация о библиотеке доступна в [гайде](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md) на GitHub. Для дальнейшего прохождения курса советуем ознакомиться с первой и второй главами. За поиском информации о возможностях библиотеки советуем в первую очередь обращаться к этому гайду.  

Также, прочитайте об [ignoreUnknownKeys](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/json.md#ignoring-unknown-keys). За более детальной информацией о работе с JSON обращайтесь к [пятой главе](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/json.md).

После изучения, для закрепления материала, советуем пройти [кодлабу](https://www.raywenderlich.com/26883403-android-data-serialization-tutorial-with-the-kotlin-serialization-library).
Вы узнаете о возможностях библиотеки и потренируетесь на практике.
Как довести starter project кодлабы до рабочего состояния:
1. В Gradle build поднять Java, jvm -> 17, в Gradle wrapper версию -> 7.2
2. Сделать Upgrade AGP, рекомендуемый Android Studio (7.0.2-> 7.5)
3. Поднять Compile SDK -> 31
4. В Манифесте внести исправления: 1) android:exported="true" под tag <activity, 2) package="com.raywenderlich.android.borednomore" под tag <manifest следующей строкой под xmlns:tools=…

## Вопросы для самопроверки
- Для чего нужны аннотации `@Serializable`, `@Transient`, `@Required`, `@SerialName`?
- Как получить сериализатор `List` или `Map`? 
- Как настроить `JsonSerializer` чтобы он игнорировал неизвестные ключи?
- Как сделать так, чтобы ключ не отправлялся на сервер?
