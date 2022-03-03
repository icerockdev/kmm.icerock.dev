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
1. При перезапуске приложения авторизация должна сохраняться

## Структуры приложения 

Чтобы использовать `suspend` функции в общем коде, необходимо добавить аннотацию `@Throws`. Благодаря этой аннотации, компилятор Kotlin Native сгенерирует функцию с completion для iOS

```kotlin
   
   // Классы common кода 
   
   class GitHubRepoRepository {
      
      @Throws(Exception::class)
      suspend fun getRepositories(): List<RepoEntity> {
         // TODO:
      }

      @Throws(Exception::class)
      suspend fun getRepository(repoId: String): RepoDetailsEntity {
         // TODO:
      }

      @Throws(Exception::class)
      suspend fun getRepositoryReadme(
         ownerName: String,
         repositoryName: String,
         branchName: String
      ): RepoReadme {
         // TODO:
      }

      @Throws(Exception::class)
      suspend fun signIn(token: String): UserInfo {
         // TODO:
      }

      // TODO:
   }
   
   class KeyValueStorage {
      var authToken: String?
      var userName: String?
   }
   
   // Классы Android-приложения


   class MainActivity: AppCompatActivity() {
      // TODO:
   }

   class AuthFragment: Fragment(R.id.auth_framgent) {
      // TODO:
   }

   class RepositoriesListFragment: Fragment(R.id.repo_list_framgent) {
      // TODO:
   }

   class DetailInfoFragment: Fragment(R.id.repo_info_framgent) {
      // TODO:
   }

   class AuthViewModel {
      val token: MutableLiveData<String>
      val state: LiveData<AuthState>
      val actions: Flow<AuthAction>
      fun onSignButtonPressed() {
         // TODO:
      }

      sealed interface AuthState {
         object Idle : AuthState
         object Loading : AuthState
         object InvalidInput : AuthState
      }

      sealed interface AuthAction {
         object ShowError : AuthAction
         object RouteToMain : AuthAction
      }

      // TODO:
   }

   class RepositoryInfoViewModel {
      val state: LiveData<State>

      sealed interface State {
         object Loading : State
         object Error : State

         data class DataAvailable(
            val githubRepo: RepoEntity,
            val readmeState: ReadmeState
         ) : State

         sealed interface ReadmeState {
            object Loading : ReadmeState
            object Empty : ReadmeState
            data class Error(val error: String) : ReadmeState
            data class Loaded(val markdown: String) : ReadmeState
         }
      }

      // TODO:
   }

   class RepositoriesListViewModel {
      val state: LiveData<State>

      sealed interface State {
         object Loading : State
         object ListLoaded : State
         object Error : State
         object Empty : State
      }

      // TODO:
   }

   // классы iOS-приложения 

   class RepositoriesListViewController: UIViewController {
      // TODO:
   }

   class RepositoryDetailInfoViewController: UIViewController {
      // TODO:
   }

   class AuthViewController: UIViewController {
      // TODO:
   }

```


## Граф зависимостей KMM приложения:

На графе отображена зависимость компонентов KMM приложения друг от друга, цветами выделены подграфы:  
Фиолетовый - Common, Зеленый - Android, Синий - iOS

```mermaid
   classDiagram
   
   class GitHubRepoRepository:::common
   class KeyValueStorage:::common
   
   class MainActivity:::android
   class AuthFragment:::android
   class RepositoriesListFragment:::android
   class DetailInfoFragment:::android
   
   class AuthViewModel:::android
   class AuthState:::android
   class AuthAction:::android
   
   class RepositoryInfoViewModel:::android
   class InfoState:::android
   class RepositoriesListViewModel:::android
   class ListState:::android
   class KeyValueStorage:::android
   
   MainActivity --> AuthFragment
   MainActivity --> RepositoriesListFragment
   MainActivity --> DetailInfoFragment
   
   AuthFragment --> AuthViewModel
   RepositoriesListFragment --> RepositoriesListViewModel
   DetailInfoFragment --> RepositoryInfoViewModel
   
   RepositoryInfoViewModel --> GitHubRepoRepository
   AuthViewModel --> GitHubRepoRepository
   RepositoriesListViewModel --> GitHubRepoRepository
   
   GitHubRepoRepository --> KeyValueStorage
   
   AuthViewModel -- AuthAction
   AuthViewModel -- AuthState
  
   RepositoryInfoViewModel -- InfoState
   RepositoriesListViewModel -- ListState
   
   class RepositoriesListViewController:::ios
   class RepositoryDetailInfoViewController:::ios
   class AuthViewController:::ios
   
   RepositoriesListViewController --> GitHubRepoRepository
   RepositoryDetailInfoViewController --> GitHubRepoRepository
   AuthViewController --> GitHubRepoRepository
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