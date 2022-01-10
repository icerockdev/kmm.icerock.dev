---
sidebar_position: 5
---

# Логика приложения

Помимо пользовательского интерфейса любое мобильное приложение содержит логику работы (еще называют бизнес логикой), например:

- Обращения к серверу для получения данных
- Локальное хранение данных
- Валидация форм ввода
- Обращение к системным API для интеграции - получение фото, видео и подобное
- Алгоритмы расчитывающие некие данные на основе ввода пользователя
- ...

Логику приложения принято отделять от пользовательского интерфейса, чтобы была понятная зона ответственности каждого блока кода. Для разделения логики и UI требуется решение для их взаимодействия, ведь совсем независимо они не могут быть. В android сейчас это решается подходом под названием MVVM - Model View ViewModel.

https://developer.android.com/jetpack/guide

https://developer.android.com/jetpack/guide/ui-layer



AndroidX
ViewModel, lifecycle
LiveData
Retrofit
Kotlinx Serialization
Hilt
Log
Exceptions


https://developer.android.com/courses/kotlin-android-fundamentals/overview

https://developer.android.com/courses/android-basics-kotlin/course

https://developer.android.com/codelabs/basic-android-kotlin-training-getting-data-internet

https://developer.android.com/training/dependency-injection
https://developer.android.com/codelabs/android-hilt

https://developer.android.com/codelabs/android-lifecycles

https://developer.android.com/codelabs/kotlin-android-training-view-model

https://developer.android.com/codelabs/android-app-permissions


https://material.io/design/platform-guidance/cross-platform-adaptation.html#cross-platform-guidelines