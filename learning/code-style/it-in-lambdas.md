---
sidebar_position: 4
---

# Использование it в лямбдах

1. Использовать аргумент по умолчанию **it** следует только в однострочных лямбдах, где сразу видно контекст и понятно что содержит **it**.

   **Как не надо делать:**
   ```kotlin
   results
    .map { result ->
        result as LiveResults
    }.map { liveResult ->
        liveResult.toResultsWithRaceInfo()
    }.flatten()
   ```

   **Как лучше сделать:**
   ```kotlin
   results
   .map { it as LiveResults }
   .map { it.toResultsWithRaceInfo() }
   .flatten()
   ```

1. В многострочных лямбдах следует давать имя аргументу и использовать доступ по имени - это позволяет в коде лямбды явно видеть что это за аргумент.  
   Код с именованным аргументом лямбды защищен от ошибки с использованием переопределенного **it**, когда внутри вложенной лямбды используется повторно тоже самое имя аргумента - **it**, но уже с другим значением и контекстом.

   **Как не надо делать:**
   ```kotlin
   val lastCheckpoint = results
    .mapNotNull { it.subStages }
    .map { it.indexOfLast { it?.checkPointTime != null } }
   ```

   **Как лучше сделать:**
   ```kotlin
   val lastCheckpoint = results
    .mapNotNull { it.subStages }
    .map { subStages ->
        subStages.indexOfLast { it?.checkPointTime != null }
    }
   ```