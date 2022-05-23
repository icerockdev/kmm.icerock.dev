---
sidebar_position: 3
---

# moko-paging

## moko-paging
Изучите [страницу](/learning/libraries/moko/moko-paging) библиотеки в базе знаний.

## moko-mvvm-state

`moko-paging` использует `ResourceState` - реализацию [состояния](/learning/android/states-events#единый-стейт-экрана) из [moko-mvvm](https://github.com/icerockdev/moko-mvvm/tree/master/mvvm-state), поэтому стоит разобраться с ней поподробнее.  

Рассмотрим класс [ResourceState<out T, out E>](https://github.com/icerockdev/moko-mvvm/blob/master/mvvm-state/src/commonMain/kotlin/dev/icerock/moko/mvvm/ResourceState.kt), он содержит четыре состояния:  
- `Loading` - загрузка
- `Success` - успешная загрузка
- `Failed` - ошибка загрузки
- `Empty` - пустота

Дженерики `T` и `E` отвечают за типы данных и ошибки, которые могут содержаться в объекте стейта.  

Состояние `Empty` - самое спорное:
- оно есть у списков
- его нет у единичных элементов, которые либо загрузятся, либо нет

Из-за этого мы обычно делаем свою реализацию класса `State` для каждого конкретного экрана, полностью соответствующую статусной модели этого экрана, чтобы не обрабатывать состояние `Empty`, которого просто нет. Однако, `ResourceState` все также удобно использовать для экранов-списков.  

В `moko-mvvm-state`, также, содержится и набор [extensions](https://github.com/icerockdev/moko-mvvm/tree/master/mvvm-state/src/commonMain/kotlin/dev/icerock/moko/mvvm/livedata) для более удобной работы с `ResourceState`, например:
- [asState()](https://github.com/icerockdev/moko-mvvm/blob/master/mvvm-state/src/commonMain/kotlin/dev/icerock/moko/mvvm/StateExt.kt) - получить стейт из данных
- [data()](https://github.com/icerockdev/moko-mvvm/blob/master/mvvm-state/src/commonMain/kotlin/dev/icerock/moko/mvvm/livedata/StateLiveDataExt.kt) - получить `LiveData` со значением из стейта
- [concatData()](https://github.com/icerockdev/moko-mvvm/blob/master/mvvm-state/src/commonMain/kotlin/dev/icerock/moko/mvvm/livedata/StateLiveDataMerges.kt) - объединение двух стейтов
- [dataTransform()](https://github.com/icerockdev/moko-mvvm/blob/master/mvvm-state/src/commonMain/kotlin/dev/icerock/moko/mvvm/livedata/StateLiveDataTransforms.kt) - преобразование полученных данных к другому типу. Например, `NewsItem` в `NewsUnitItem` - объект новости в объект для списка новостей
- [errorTransform()](https://github.com/icerockdev/moko-mvvm/blob/master/mvvm-state/src/commonMain/kotlin/dev/icerock/moko/mvvm/livedata/StateLiveDataTransforms.kt) - преобразование полученной ошибки к другому типу, например `Throwable` в `StringDesc`
- и т.д.

## Практическое задание
Примените `moko-paging` на экране списка репозиториев.
