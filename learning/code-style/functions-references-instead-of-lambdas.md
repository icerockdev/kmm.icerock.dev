---
sidebar_position: 6
---

# Замена лямбд ссылками на функции

1. Старайтесь не создавать лишний раз лямбду, когда можно использовать ссылку на саму функцию. Это улучшит чистоту кода, уменьшит число строк, а также не будет создаваться лишний объект для анонимной функции.

   **Как не надо делать:**
   ```kotlin
   nameList.forEach {
      println(it)
   }
   
   val upperCaseNames = nameList.map {
      it.toUpperCase()
   }
   
   objectsList.asSequence()
      .filter { it.isOnline() }
      .map { handleAndTransform(it) }
      .toList()
   ```

   **Как лучше сделать:**
   ```kotlin
   nameList.forEach(::println)
   
   val upperCaseNames = nameList.map(String::toUpperCase)
   
   objectsList.asSequence()
      .filter(Any::isOnline)
      .map(::handleAndTransform)
      .toList()
   ```

1. В лямбдах допускается максимум 10 строк кода и максимум 1 уровень вложенности (условие, цикл, другая лямбда и др.). Иначе код лямбды нужно выносить в отдельные функции или методы класса.

   **Как не надо делать:**
   
      ```kotlin
      val listPaginator = Pagination(
         parentScope = viewModelScope,
         dataSource = LambdaPagedListDataSource<ChatMessage> {
            val offset = (it?.size ?: 0)
            chatController.loadPage(offset, pageSize)
         },
         comparator = MessageComparator(),
         nextPageListener = { result ->
            if (result.isFailure) {
               eventsDispatcher.dispatchEvent {
                  showToastMessage(errorsMapper(result.exceptionOrNull()))
               }
            }
         },
         refreshListener = { result ->
            if (result.isFailure) {
               eventsDispatcher.dispatchEvent {
                  showToastMessage(errorsMapper(result.exceptionOrNull()))
               }
            }
         },
         initValue = listOf()
      )
      ```
   
      **Как лучше сделать:**
      ```kotlin
      val listPaginator = Pagination(
         parentScope = viewModelScope,
         dataSource = LambdaPagedListDataSource<ChatMessage> { dataSource ->
            val offset = (dataSource?.size ?: 0)
            chatController.loadPage(offset, pageSize)
         },
         comparator = MessageComparator(),
         nextPageListener = ::onListNextPageLoadFinished,
         refreshListener = ::onListRefreshFinished,
         initValue = listOf()
      )
      
      private fun onListNextPageLoadFinished(result: Result<List<ChatMessage>>) {
         if (result.isFailure) {
            eventsDispatcher.dispatchEvent {
               showToastMessage(errorsMapper(result.exceptionOrNull()))
            }
         }
      }
      
      private fun onListRefreshFinished(result: Result<List<ChatMessage>>) {
         if (result.isFailure) {
            eventsDispatcher.dispatchEvent {
               showToastMessage(errorsMapper(result.exceptionOrNull()))
            }
         }
      }
      ```
