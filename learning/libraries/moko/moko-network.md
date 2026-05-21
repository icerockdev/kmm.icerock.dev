---
sidebar_position: 9
---

# moko-network

## moko-network
Библиотека [moko-network](https://github.com/icerockdev/moko-network) - позволяет генерировать сущности и API классы из OpenAPI (Swagger) файлов. 

<iframe src="//www.youtube.com/embed/98r5muoeO7U" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
<br/>

## moko-network-errors
Библиотека `moko-network` содержит внутри себя модуль `moko-network-errors` - интеграцию с `moko-errors`, чтобы удобно обрабатывать ошибки сети. 
Для начала, ознакомьтесь с этим модулем по [README](https://github.com/icerockdev/moko-network#moko-network-errors).

Для использования этого модуля, проделайте следующие действия:
1. Подключить его в project.build.gradle: `commonMainApi("dev.icerock.moko:network-errors:$mokoNetworkVersion")`
2. Вызвать метод для регистрации основных ошибок сети: `ExceptionMappersStorage.registerAllNetworkMappers()`, его реализацию можете посмотреть [тут](https://github.com/icerockdev/moko-network/blob/0f8459ff2d51c6b7cade0cadd6d11066b7a55d60/network-errors/src/commonMain/kotlin/dev/icerock/moko/network/errors/NetworkExceptionMappers.kt#L27). 
    - Если вы хотите изменить текст при основных ошибках сети - переопределите параметр `errorsTexts` метода `registerAllNetworkMappers`.
    - Если вы хотите добавить обработку другого класса ошибок, используйте `ExceptionMappersStorage.register` - [метод](https://github.com/icerockdev/moko-errors/blob/8bfccf376ccbbcf1b87a7522d08df182143f0cf3/errors/src/commonMain/kotlin/dev/icerock/moko/errors/mappers/ExceptionMappersStorage.kt#L31) из `moko-errors`.
3. Используйте `exceptionHandler` для автоматической обработки ошибок сети:
   ```kotlin
   viewModelScope.launch {
      exceptionHandler.handle {
         api.mareTestRequest()
         // ...
      }.execute()
   }
   ```

## Features
Библиотека `moko-network` содержит в себе фичи - классы, реализующие интерфейс `HttpClientFeature` из Ktor.  
В версии `Ktor 2.0.0` интерфейс `HttpClientFeature` [переименовали](https://ktor.io/docs/migrating-2.html#feature-plugin-client) в `HttpClientPlugin`.

`Ktor` содержит уже готовые плагины, вот, например, для чего их можно использовать:
- [Cache](https://github.com/ktorio/ktor/tree/main/ktor-client/ktor-client-core/common/src/io/ktor/client/plugins/cache) - включить кеширование для каждого запроса, чтобы они отрабатывали быстрее
- [DefaultRequest](https://ktor.io/docs/default-request.html) добавлять для всех запросов какие-нибудь хидеры по умолчанию
- [Logging](https://ktor.io/docs/client-logging.html) - плагин для логгирования запросов
- [BodyProgress](https://github.com/ktorio/ktor/blob/main/ktor-client/ktor-client-core/common/src/io/ktor/client/plugins/BodyProgress.kt) - плагин для получения `observable` прогресса загрузки и скачивания
- [HttpTimeout](https://github.com/ktorio/ktor/blob/main/ktor-client/ktor-client-core/common/src/io/ktor/client/plugins/HttpTimeout.kt) - плагин для настройки таймаутов

С полным списком плагинов, доступных в Ktor вы можете ознакомиться по [ссылке](https://github.com/ktorio/ktor/tree/main/ktor-client/ktor-client-core/common/src/io/ktor/client/plugins).  

Также, примеры использования стандартных плагинов можно посмотреть в статье [Kotlin Multiplatform Mobile: Intercepting Network Request and Response](https://yusufabd.medium.com/kotlin-multiplatform-mobile-intercepting-network-request-and-response-6805a79b4699).

Плагин выполняет свою задачу, как правило, для каждого запроса или ответа сервера. Чтобы понять, что делает каждый плагин, смотрите реализацию метода
- `handle`, для плагинов из Ktor
- `install` в `companion object`, для плагинов из `moko-network`

### Подключение
[Пример](https://github.com/icerockdev/moko-network/blob/0f8459ff2d51c6b7cade0cadd6d11066b7a55d60/sample/mpp-library/src/commonMain/kotlin/com/icerockdev/library/TestViewModel.kt#L40) создания `httpClient`, в котором происходит подключение и настройка плагинов.

Теперь рассмотрим те [плагины](https://github.com/icerockdev/moko-network/tree/master/network/src/commonMain/kotlin/dev/icerock/moko/network/features), которые есть в `moko-network`.

### ExceptionFeature
Эта фича просто кидает ошибку, если `status` ответа сервера неудачный. 
```kotlin
override fun install(feature: ExceptionFeature, scope: HttpClient) {
    scope.responsePipeline.intercept(HttpResponsePipeline.Receive) { (_, body) ->
        if (body !is ByteReadChannel) return@intercept

        val response = context.response
        if (!response.status.isSuccess()) {
            val packet = body.readRemaining()
            val responseString = packet.readText(charset = Charset.forName("UTF-8"))
            throw feature.exceptionFactory.createException(
                request = context.request,
                response = context.response,
                responseBody = responseString
            )
        }
        proceedWith(subject)
    }
}
```

### LanguageFeature
Эта фича позволяет добавить язык к каждому запросу, чтобы уведомить сервер, на каком языке мы хотим получить ответ.
```kotlin
override fun install(feature: LanguageFeature, scope: HttpClient) {
    scope.requestPipeline.intercept(HttpRequestPipeline.State) {
        feature.languageProvider.getLanguageCode()?.apply {
            context.header(feature.languageHeaderName, this)
        }
    }
}
```

### TokenFeature
Эта фича к каждому запросу добавляет токен, например для авторизации, по ключу, которое вы укажите в `tokenHeaderName`, при настройке фичи. (обычно - authorization)    
Для использования фичи необходимо реализовать метод получения токена - `getToken()`.
```kotlin
override fun install(feature: TokenFeature, scope: HttpClient) {
    scope.requestPipeline.intercept(HttpRequestPipeline.State) {
        feature.tokenProvider.getToken()?.apply {
            context.headers.remove(feature.tokenHeaderName)
            context.header(feature.tokenHeaderName, this)
        }
    }
}
```

### RefreshTokenFeature
Бывают ситуации, когда у токена есть время жизни, по истечении которого токен становится недействителен. В этом случае необходимо как-то его обновить.  
За правила обновления и сохранения нового токена отвечает метод `feature.updateTokenHandler.invoke()`.  

Этот блок кода отвечает за создание реквеста, подставления туда текущего использующегося токена и выполнения запроса.
```kotlin
val requestBuilder = HttpRequestBuilder().takeFrom(context.request)
val result: HttpResponse = context.client!!.request(requestBuilder)
proceedWith(result)
```

Что может произойти?  
Отправили запрос - получили ответ - 401 ошибка авторизации. После этого мы обновили токен и повторили запрос - все ок.

Но, может получиться так, что мы успели отправить несколько запросов с неправильным токеном, и каждому из них придет ответ - ошибка авторизации. 

Первое, что нам нужно сделать в этом случае - проверить, отличается ли тот токен, который мы отправили от того, который находится у нас в хранилище. За эту проверку отвечает метод `feature.isCredentialsActual()`.  
Если токены отличаются, значит какой-то запрос до нас его уже обновил, и нам нужно просто повторно отправить наш запрос, но уже с новым токеном.
```kotlin
if (!feature.isCredentialsActual(context.request)) {
    refreshTokenHttpFeatureMutex.unlock()
    val requestBuilder = HttpRequestBuilder().takeFrom(context.request)
    val result: HttpResponse = context.client!!.request(requestBuilder)
    proceedWith(result)
    return@intercept
}
```
В случае, если мы получили ошибку 401, но токен который мы отправили не отличается от того, который находится у нас в хранилище - просто обновляем токен методом `feature.updateTokenHandler.invoke()`.  
Если обновление токена прошло успешно - повторяем запрос с новым токеном. Если обновить не удалось - отправляем результат дальше, чтобы показать проблему юзеру.
```kotlin
if (feature.updateTokenHandler.invoke()) {
    // Если обновление токена прошел успешно, пробуем повторить запрос
    refreshTokenHttpFeatureMutex.unlock()
    val requestBuilder = HttpRequestBuilder().takeFrom(context.request)
    val result: HttpResponse = context.client!!.request(requestBuilder)
    proceedWith(result)
} else {
    // Если не удалось обновить токен - 
    refreshTokenHttpFeatureMutex.unlock()
    proceedWith(subject)
}
```
