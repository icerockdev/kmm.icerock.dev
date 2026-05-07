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

Ознакомиться детальнее с ViewModel и Kotlin flows помогут следующие материалы:

- [Единый стейт экрана](../../learning/state) - статья о состояних и событиях
- [Kotlin Flows on Android](https://developer.android.com/kotlin/flow)
- [StateFlow and SharedFlow](https://developer.android.com/kotlin/flow/stateflow-and-sharedflow)
- [Android Basics Compose: 5. ViewModel and State in Compose](https://developer.android.com/codelabs/basic-android-kotlin-compose-viewmodel-and-state) - для закрепления связей жизненного цикла android компонентов и ViewModel, StateFlow. Не пропуская Conclusion и ссылки в нем

## Network client

Практически все приложения выполняют работу с сетью. Классический способ выполнения сетевых запросов в Android это библиотека [Retrofit](https://square.github.io/retrofit/).
Альтернативный современный клиент - [Ktor](https://ktor.io/docs/client-create-new-application.html)

CodeLab [Get data from the internet](https://developer.android.com/codelabs/basic-android-kotlin-training-getting-data-internet) даст более детальное представление о библиотеке Retrofit и как её использовать.

## Coroutines

В CodeLab [Get data from the internet](https://developer.android.com/codelabs/basic-android-kotlin-training-getting-data-internet) для выполнения асинхронной задачи (обращения к серверу) использовались [kotlinx.coroutines](https://github.com/Kotlin/kotlinx.coroutines). Это популярная библиотека для выполнения асинхронных и многопоточных задач.

Свое знакомство с Coroutines начните с изучения раздела документации [coroutines basics](https://kotlinlang.org/docs/coroutines-basics.html), а затем выполните Hands On [Introduction to Coroutines and Channels](https://play.kotlinlang.org/hands-on/Introduction%20to%20Coroutines%20and%20Channels/).

В дальнейшем (вне текущего курса) для изучения coroutines используйте подборку материалов из [базы знаний](../../learning/libraries/kotlinx/coroutines).

## Dependency Injection

Разные классы приложения должны между собой связываться. Чтобы связанность классов не стала слишком жесткой, что усложнит поддержку кода, используют паттерн Dependency Injection.

Подробнее позволит разобраться статья [Dependency Injection](https://developer.android.com/training/dependency-injection) и [Koin in Android app tutorial](https://insert-koin.io/docs/quickstart/android/).
