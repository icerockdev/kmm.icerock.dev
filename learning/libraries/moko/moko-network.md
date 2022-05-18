---
sidebar_position: 9
---

# moko-network

Библиотека [moko-network](https://github.com/icerockdev/moko-network) - позволяет генерировать сущности и API классы из OpenAPI (Swagger) файлов. 

***ВИДОСИК***

## Features
moko-network содержет в себе фичи - это реализация интерфейса `HttpClientFeature` ( с версии ktor 2.0.0 интерфейс [переименовали](https://ktor.io/docs/migrating-2.html#feature-plugin-client) в HttpClientPlugin)

Пример готовых плагинов можете посмотреть [тут](https://github.com/ktorio/ktor/tree/main/ktor-client/ktor-client-core/common/src/io/ktor/client/plugins)

Вся прелесть плагинов в том, что их нужно только [заинсталить](https://github.com/icerockdev/moko-network/blob/0f8459ff2d51c6b7cade0cadd6d11066b7a55d60/sample/mpp-library/src/commonMain/kotlin/com/icerockdev/library/TestViewModel.kt#L41) в httpClient и настроить

Плагин выполняет свою задачу, как правило, для каждого запроса или респонса. Чтобы понять, что делает каждый плагин, смотрите реализацию метода `install` в `companion object` конкеретного плагина.

Теперь рассмотрим те плагины, которые есть в moko-network

## Подключение

Подключение и настройка плагина происходят при содании httpClient  

[Пример](https://github.com/icerockdev/moko-network/blob/0f8459ff2d51c6b7cade0cadd6d11066b7a55d60/sample/mpp-library/src/commonMain/kotlin/com/icerockdev/library/TestViewModel.kt#L40)

### ExceptionFeature

Как видим из текущей реализации, если статус код ответа сервера неудачный, значит нужно кинуть ошибку, что и делат фича 
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

К каждому реквесту мы будем добавлять язык, на котором хотим получать сообщения от сервера 

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
***Назначение токена не очень чет понимаю***
Каждлму запросу устанавливаем по ключу `feature.tokenHeaderName` устанавливаем ключ, устанавливаем при реализации метода getKey()

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

Если токен реквеста отличается от текущего, который используем, значит его уже обновили и можно попробовать повторить запрос

```kotlin
if (!feature.isCredentialsActual(context.request)) {
    refreshTokenHttpFeatureMutex.unlock()
    val requestBuilder = HttpRequestBuilder().takeFrom(context.request)
    val result: HttpResponse = context.client!!.request(requestBuilder)
    proceedWith(result)
    return@intercept
}
```

Если токен реквеста совпадает с текущим, значин надо обновить

```kotlin
if (feature.updateTokenHandler.invoke()) {
    // Если реквест обновления токена прошел успещно, пробуем повторить первый реквест
    refreshTokenHttpFeatureMutex.unlock()
    val requestBuilder = HttpRequestBuilder().takeFrom(context.request)
    val result: HttpResponse = context.client!!.request(requestBuilder)
    proceedWith(result)
}else {
    // Если не удалось обновить токен
    refreshTokenHttpFeatureMutex.unlock()
    proceedWith(subject)
}
```




intercept - почитать
