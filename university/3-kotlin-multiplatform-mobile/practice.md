---
sidebar_position: 6
---

# Практическое задание

Нужно объединить ранее сделанные Android и iOS приложения в единый репозиторий, добавить модуль общего кода и перенести из Android и iOS логику работы с сетью и хранением токена в общий код

Во время работы над практическим заданием настоятельно рекомендуем обращаться к разделу [Памятки для разработчика](/university/memos/function)

Функциональные возможности остаются те же самые
1. Авторизация пользователя (personal access token)
1. Просмотр списка репозиториев пользователя (первые 10)
1. Просмотр детальной информации выбранного репозитория
    1. описание
    1. статистика (forks, stars, watchers)
    1. ссылка на web страницу репозитория
    1. лицензия

Технические требования:
1. Использовать multiplatform-settings для работы с хранилищем устройства
1. Логика хранения данных должна находиться в common коде
1. Логика работы с сетью должна находиться в common коде
1. Для работы с сетью использовать Ktor Client

## Граф зависимостей KMM приложения:

На графе отображена зависимость компонентов KMM приложения друг от друга, цветами выделены подграфы:  
Фиолетовый - Common, Зеленый - Android, Синий - iOS

```mermaid
classDiagram

class AuthViewModel:::android{
   isLoading: LiveData~Boolean~
   authResponseCode: LiveData~Int~
   onSignButtonPressed(token: String)
}
   
class RepositoryInfoViewModel:::android{
   repositoryInfo: LiveData~RepoInfo?~
   isLoading: LiveData~Boolean~
}
   
class RepositoriesListViewModel:::android {
   isLoading: LiveData~Boolean~
   repositories: LiveData:List~RepoEntity?~
}
   
class GitHubRepoRepository:::common {
   repositories(username: String): Flow:List~RepoEntity?~
   repositoryInfo(ownerName: String, repositoryName: String, branchName: String) RepoInfo?
   signIn(token: String)
}

class KeyValueStorage:::common{
  authToken: String?
}

class MainActivity:::android
class RepositoriesListFragment:::android
class DetailInfoFragment:::android
class AuthFragment:::android

class RepositoriesListViewController:::ios
class RepositoryDetailInfoViewController:::ios
class AuthViewController:::ios

MainActivity --> AuthFragment
MainActivity --> RepositoriesListFragment
MainActivity --> DetailInfoFragment

RepositoriesListFragment --> RepositoriesListViewModel
DetailInfoFragment --> RepositoryInfoViewModel
AuthFragment --> AuthViewModel
   
RepositoriesListViewModel --> GitHubRepoRepository
AuthViewModel --> GitHubRepoRepository
RepositoryInfoViewModel --> GitHubRepoRepository
       
RepositoriesListViewController --> GitHubRepoRepository
RepositoryDetailInfoViewController --> GitHubRepoRepository
AuthViewController --> GitHubRepoRepository

GitHubRepoRepository --> KeyValueStorage
```

Материалы:
1. [GitHub REST API](https://docs.github.com/en/rest)
1. [GitHub Basic Authorization](https://docs.github.com/en/rest/overview/other-authentication-methods#basic-authentication)
1. [GitHub user repositories](https://docs.github.com/en/rest/reference/repos#list-repositories-for-a-user)
1. [Kotlinx.Serialization guide](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/basic-serialization.md#json-decoding)
1. [Подключение Ktor Client](https://ktor.io/docs/gradle.html)
1. [Настройке запросов в Ktor Client](https://ktor.io/docs/request.html)
1. [multiplatform-settings](https://github.com/russhwolf/multiplatform-settings)
1. [Android Дизайн](https://www.figma.com/file/Mh3ga5XAzyJNCY87NBp01G/Git_test)
1. [iOS Дизайн](https://www.figma.com/file/XmpoCqkdWTGb2NGdR2bgiQ/Git_test-iOS)