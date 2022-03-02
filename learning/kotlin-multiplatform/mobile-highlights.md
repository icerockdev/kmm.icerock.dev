---
sidebar_position: 2
---

# Особенности KMM

Что следует учитывать при разработке с использованием Kotlin Multiplatform Mobile:
- `inline`/`value` классы в iOS попадают в виде тех типов, которые оборачивают. то есть `inline class DateTime(val date: String)` в iOS будет просто `String`

## Kotlin vs Swift - в чем разница

1.  В котлине есть [анонимные](https://kotlinlang.org/docs/nested-classes.html#anonymous-inner-classes) классы, которые позволяют без создания отдельного именованного класса реализовать интерфейс например;
    1.  анонимные классы пришли из Java и подробнее разобраны [тут](https://javarush.ru/groups/posts/2193-anonimnihe-klassih) в контексте Java.
2.  Сравнение языков на примерах:
    1.  <https://habr.com/ru/post/350746/>;
    2.  <https://www.raywenderlich.com/6754-a-comparison-of-swift-and-kotlin-languages>;
    3.  <https://levelup.gitconnected.com/swift-vs-kotlin-which-is-better-696222a49a34>;
    4.  <https://medium.com/@anios4991/swift-vs-kotlin-the-differences-that-matter-80a46090d9c6>.
3.  [Разница конструкторов классов](https://medium.com/mobile-app-development-publication/kotlin-vs-swift-the-init-construction-f82224a24664);
4.  Разница extensions - [раз](../kotlin-native/swift-extensions), [два](https://medium.com/mobile-app-development-publication/kotlin-vs-swift-the-extension-5462b531260b);
5.  [Абстрактные классы](https://medium.com/mobile-app-development-publication/kotlin-vs-swift-the-abstract-class-f8817e5e54f).

## Kotlin + Swift IDE

AppCode позволяет разрабатывать и Kotlin и Swift код одновременно. [Видео с демонстрацией](https://www.youtube.com/watch?v=ELfcPdWP_CY)

## Конфликты имен на iOS

- В iOS у всех объектов есть поле `description` (работает также как Kotlin `toString`) и поэтому при использовании в Kotlin свойств с таким названием будет появляться в iOS дополнительное поле `_description` - которое и будет свойством от Kotlin

Следующий набор имен на iOS будет конфликтовать либо между собой либо с iOS сигнатурами:
- State (в SwiftUI используется)
- ключевые слова swift'а

(!) Если у объекта есть функция и переменная с одинаковым именованием, то Swift будет видеть только последнюю из объявленных.

## Полезные вопросы на подумать из kotlinlang.slack

- How can I transform from a flow to a publisher?
  - https://johnoreilly.dev/posts/kotlinmultiplatform-swift-combine_publisher-flow/
- What strategy do we have to marry the reactive code that android devs write with the imperative code the iOS devs write?
- Which layers do we move to shared and which don't we?
- How do we expose our shared lib to iOS and Android?

<https://youtu.be/5QPPZV04-50> - запись с Kotlin 1.4 online event про мпп детали
