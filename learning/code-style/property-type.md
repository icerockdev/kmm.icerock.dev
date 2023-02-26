---
sidebar_position: 3
---

# Указание типов переменных и свойств класса

1. В случаях, когда свойство класса получает свой тип на основании вызова функции или каких-то других вычислений, а не созданием конкретного объекта класса, следует явно указать тип свойства сразу в объявлении - это позволяет понимать какой именно тип данных имеет свойство, не вспоминая что делает функция и какой тип данных она возвращает:  
    
    **Как не надо делать:**
    ```kotlin
    val isFollowed = followRepository.isFollow(participantOrTeamId)
    ```
    
    **Как лучше сделать:**
    ```kotlin
    val isFollowed: LiveData<Boolean> = followRepository.isFollow(participantOrTeamId)
    ```

1. Имеет смысл явно указывать тип при объявлении переменной внутри функций и методов, которой присваивается результат крупного выражения:

   **Как не надо делать:**
   ```kotlin
   val currentUserStatus = usersList.asSequence()
      .filter { it.status == Online }
      .map(::handleUser)
      .find { it.name == UserName }
      ?.run(::getUserStatus)
   ```

   **Как лучше сделать:**
   ```kotlin
   val currentUserStatus: UserStatus = usersList.asSequence()
      .filter { it.status == Online }
      .map(::handleUser)
      .find { it.name == UserName }
      ?.run(::getUserStatus)
   ```

1. Не нужно явно прописывать тип везде, особенно в местах где явно очевиден тип переменной или это понятно из контекста. Лишнее указание типа только загромождает код программы, ухудшает читаемость.

   **Как не надо делать:**
   ```kotlin
   val usersList: List<User> = listOf<User>()
   val count: Int = 100
   val productList: List<Product> = domainProducts.map(::domainToProduct)
   val messageText: String = message.text
   ```

   **Как лучше сделать:**
   ```kotlin
   val usersList = listOf<User>()
   val count = 100
   val productList = domainProducts.map(::domainToProduct)
   val messageText = message.text
   ```
