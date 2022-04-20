---
sidebar_position: 1
---

# Имена свойств и переменных

1. Не используйте [венгерскую нотацию](https://ru.wikipedia.org/wiki/%D0%92%D0%B5%D0%BD%D0%B3%D0%B5%D1%80%D1%81%D0%BA%D0%B0%D1%8F_%D0%BD%D0%BE%D1%82%D0%B0%D1%86%D0%B8%D1%8F) в названиях свойств и переменных. Например, не добавляйте префикс **m** (как принято, например, в AOSP):

    **Как не надо делать:**
    ```kotlin
    val mDelegate = Delegate()
    val mUserMessageText = getUserMessageTextString()
    var mThreads_counter = 0
    ```

    **Как лучше сделать:**
    ```kotlin
    val delegate = Delegate()
    val userMessageText = getUserMessageTextString()
    var threadsCounter = 0
    ```

1. Для названий свойств с булевым типом (или для **LiveData(Boolean)**) имеет смысл добавлять префикс **is**:
   ```kotlin
   val isLoading: LiveData<Boolean> = _isLoading.readOnly()
   val isButtonEnabled = false
   ```
