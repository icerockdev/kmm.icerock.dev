---
sidebar_position: 5
---

# Логика приложения

Помимо пользовательского интерфейса любое мобильное приложение содержит логику работы (еще называют бизнес логикой), например:

- Обращения к серверу для получения данных
- Локальное хранение данных
- Валидация форм ввода
- Обращение к системным API для интеграции - получение фото, видео и подобное
- Алгоритмы рассчитывающие некие данные на основе ввода пользователя
- ...

Логику приложения принято отделять от пользовательского интерфейса, чтобы была понятная зона ответственности каждого блока кода. Для разделения логики и UI требуется решение для их взаимодействия, ведь совсем независимо они не могут быть. 

Ознакомимся с современными подходами построения логики приложений по [материалам Google](https://developer.android.com/courses/pathways/android-architecture). Обязательно в конце проверь себя пройдя небольшой тест.

## ViewModel

Ознакомиться детальнее с ViewModel и LiveData помогут следующие кодлабы:

- [Android Kotlin Fundamentals: 5.1 ViewModel](https://developer.android.com/codelabs/kotlin-android-training-view-model) - не пропуская Summary и тест в Homework
- [Android Kotlin Fundamentals: LiveData and LiveData observers](https://developer.android.com/codelabs/kotlin-android-training-live-data) - не пропуская Summary и тест в Homework
- [Incorporate Lifecycle-Aware Components](https://developer.android.com/codelabs/android-lifecycles) - для закрепления связей жизненного цикла android компонентов и ViewModel, LiveData

## Retrofit

Практически все приложения выполняют работу с сетью. Основной способ выполнения сетевых запросов в Android это библиотека [Retrofit](https://square.github.io/retrofit/).

CodeLab [Get data from the internet](https://developer.android.com/codelabs/basic-android-kotlin-training-getting-data-internet) даст более детальное представление о библиотеке и как её использовать.

## Coroutines

В CodeLab [Get data from the internet](https://developer.android.com/codelabs/basic-android-kotlin-training-getting-data-internet) для выполнения асинхронной задачи (обращения к серверу) использовались [kotlinx.coroutines](https://github.com/Kotlin/kotlinx.coroutines). Это популярная библиотека для выполнения асинхронных и многопоточных задач.

Ознакомимся с библиотекой детальнее используя Hands On [Introduction to Coroutines and Channels](https://play.kotlinlang.org/hands-on/Introduction%20to%20Coroutines%20and%20Channels/).

В дальнейшем (вне текущего курса) для изучения coroutines используй подборку материалов из [раздела Learning](../../learning/libraries/kotlinx/coroutines).

## Dependency Injection

Разные классы приложения должны между собой связываться. Чтобы связанность классов не стала слишком жесткой, что усложнит поддержку кода, используют паттерн Dependency Injection.

Подробнее позволит разобраться статья [Dependency Injection](https://developer.android.com/training/dependency-injection) и CodeLab [Using Hilt in your Android app](https://developer.android.com/codelabs/android-hilt).
