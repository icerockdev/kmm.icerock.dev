---
sidebar_position: 3
---

# moko-paging

## moko-paging
посмотрите ***видео*** и изучите [страницу](/learning/libraries/moko/moko-paging) библиотеки в базе знаний

## moko-mvvm-state

Вы уже знаете, что такое Состояние или State из [статьи](/learning/android/states-events).

Сейчас мы рассмотрим реализацию такого же стейта, но из библиотеки [moko-mvvm](https://github.com/icerockdev/moko-mvvm/tree/master/mvvm-state)  

Вам следует о нем знать, потому что его можно встретить на старых проектах, а также он подходит для использования экранов-списков

подключение: 
```kotlin
commonMainApi("dev.icerock.moko:mvvm-state:0.13.0") 
```

Класс [ResourceState](https://github.com/icerockdev/moko-mvvm/blob/master/mvvm-state/src/commonMain/kotlin/dev/icerock/moko/mvvm/ResourceState.kt) представляет из себя стейт с четырьмя состояниями:
- Success
- Failed
- Loading
- Empty

Этот стейт находит свое применение на экранах-списках, потому что такие экраны содержат именно те состояния, которые представленны в ResourceState

Проблема с использованием такого стейта на обычных экранах в том, что они, как правило, не имеют состояния Empty. Например, экран деталньной информации о репозитории - пустым может быть само содержимое репозитория, но не его состояние

Также, библиотека содержет набор [extensions](https://github.com/icerockdev/moko-mvvm/tree/master/mvvm-state/src/commonMain/kotlin/dev/icerock/moko/mvvm/livedata) для более удобной работы со стейтом
