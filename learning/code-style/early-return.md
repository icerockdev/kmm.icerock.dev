---
sidebar_position: 5
---

# Ранний возврат вместо вложенности условий

1. Выполняйте все возможные проверки с ранним возвратом в начале функции. Это сократит вложенность и улучшит читаемость кода.

   **Как не надо делать:**
   ```kotlin
   fun handleItemForIndex(index: Int, item: String?) {
      if (item != null && index > 0) {
         val newIndex = handleIndex(index)
         item.handleData(newIndex)
      }
   }
   ```
    
   **Как лучше сделать:**
   ```kotlin
   fun handleItemForIndex(index: Int, item: String?) {
      if (item == null || index <= 0) return
   
      val newIndex = handleIndex(index)
      item.handleData(newIndex)
   }
   ```
