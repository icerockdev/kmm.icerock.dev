---
sidebar_position: 6
---

# Практическое задание

Нужно разработать android приложение для просмотра GitHub репозиториев.

<iframe width="360" height="800" src="//www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FMh3ga5XAzyJNCY87NBp01G%2FGit_test%3Fnode-id%3D4%253A600%26scaling%3Dmin-zoom%26page-id%3D0%253A1%26starting-point-node-id%3D4%253A645" allowfullscreen></iframe>

Во время работы над практическим заданием настоятельно рекомендуем обращаться к разделу Памятки для разработчика <!--[Памятки для разработчика](kmm.icerock.dev/university/memos/function)-->

Функциональные возможности:
1. Авторизация пользователя (username + personal access token)
1. Просмотр списка репозиториев пользователя (первые 10)
1. Просмотр детальной информации выбранного репозитория
   1. описание
   1. статистика (forks, stars, watchers)
   1. ссылка на web страницу репозитория
   1. лицензия

Технические требования:
1. Реализация на Kotlin
1. Использовать XML Layouts для UI
1. Использовать Kotlin Gradle DSL
1. Использовать Retrofit для работы с REST API
1. Использовать RecyclerView для отображения списка
1. Использовать ConstraintLayout для экрана детальной информации
1. Использовать Android Navigation Component для переходов между экранами
1. Экраны делать с помощью Fragment (подход Single Activity)
1. Использовать Coroutines для асинхронности и многопоточности
1. Использовать [Kotlinx.Serialization](https://github.com/Kotlin/kotlinx.serialization) для парсинга json
1. Использовать ViewModel для реализации логики экранов
1. Использовать LiveData / StateFlow для обновления данных на UI
1. Корректно обрабатывать ситуации "загрузка данных", "ошибка загрузки", "пустой список"
1. Корректно обрабатывать смену конфигурации 

Материалы:
1. [GitHub REST API](https://docs.github.com/en/rest)
1. [GitHub Basic Authorization](https://docs.github.com/en/rest/overview/other-authentication-methods#basic-authentication)
1. [GitHub user repositories](https://docs.github.com/en/rest/reference/repos#list-repositories-for-a-user)
1. [Kotlinx.Serialization guide](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/basic-serialization.md#json-decoding)
1. [Интеграция Kotlinx.Serialization и Retrofit](https://github.com/JakeWharton/retrofit2-kotlinx-serialization-converter)
1. [Дизайн](https://www.figma.com/file/Mh3ga5XAzyJNCY87NBp01G/Git_test)
