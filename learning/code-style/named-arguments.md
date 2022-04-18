---
sidebar_position: 2
---

# Именованные аргументы функций и методов

1. В вызовах методов с несколькими аргументами следует использовать именованные аргументы. Это позволит избежать ошибок при рефакторинге (при смене порядка следования аргументов) и улучшит понятность кода.

   **Как не надо делать:**
   ```kotlin
   constructor(response: EventResponse) : this(
     response.eventId,
     response.eventCode,
     response.eventName
   )
   ```

   **Как лучше сделать:**
   ```kotlin
   constructor(response: EventResponse) : this(
      eventId = response.eventId,
      eventCode = response.eventCode,
      eventName = response.eventName
   )
   ```
   