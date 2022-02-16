---
sidebar_position: 2
---

# Особенности KMM

Что следует учитывать при разработке с использованием Kotlin Multiplatform Mobile:
- `inline`/`value` классы в iOS попадают в виде тех типов, которые оборачивают. то есть `inline class DateTime(val date: String)` в iOS будет просто `String`


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
