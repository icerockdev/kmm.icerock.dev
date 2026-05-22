---
sidebar_position: 9
---

# moko-network

Библиотека [moko-network](https://github.com/icerockdev/moko-network) предоставляет компоненты для работы с сетью в Kotlin Multiplatform: генерацию сущностей и API-классов из OpenAPI (Swagger) спецификаций, а также набор Ktor-плагинов для типовых задач.

## Состав библиотеки

Библиотека состоит из нескольких модулей:
- `network` — базовый модуль с Ktor-плагинами (`ExceptionFeature`, `TokenFeature`, `RefreshTokenFeature`, `LanguageFeature`);
- `network-generator` — Gradle-плагин для генерации кода из OpenAPI;
- `network-errors` — интеграция с `moko-errors` для обработки сетевых ошибок;
- `network-engine` — предварительно сконфигурированный `HttpClientEngine`;
- `network-bignum` — сериализатор для `BigInteger`/`BigDecimal`.

## OpenAPI code generation

Для генерации кода подключите плагин и укажите путь к OpenAPI спецификации.

### Подключение плагина

```groovy
buildscript {
    dependencies {
        classpath "dev.icerock.moko:network-generator:0.23.0"
    }
}

apply plugin: "dev.icerock.mobile.multiplatform-network-generator"
```

### Конфигурация спецификации

```groovy
mokoNetwork {
    spec("pets") {
        inputSpec = file("src/swagger.json")
    }
    spec("news") {
        inputSpec = file("src/newsApi.yaml")
        packageName = "news"
        isInternal = false
        isOpen = true
        enumFallbackNull = false
    }
}
```

После запуска Gradle-задачи `openApiGenerate` сгенерированные классы появятся в `build/generated/moko-network`.

### Использование в коде

```kotlin
import dev.icerock.moko.network.generated.models.*
import dev.icerock.moko.network.generated.apis.*

class TestViewModel : ViewModel() {
    private val petApi = PetApi(
        basePath = "https://petstore.swagger.io/v2/",
        httpClient = ktorHttpClient,
        json = kotlinxJsonParser
    )

    fun apiRequest() {
        viewModelScope.launch {
            val pet = petApi.findPetsByStatus(listOf("available"))
        }
    }
}
```

Флаг `enumFallbackNull = true` включает генерацию обёртки `Safeable` для enum-свойств — при неожиданном значении вернётся `null`.

## Features (Ktor-плагины)

Плагины `moko-network` реализуют интерфейс `HttpClientFeature` (Ktor 2.x — `HttpClientPlugin`).

### ExceptionFeature

Проверяет статус ответа сервера. Если статус неуспешный — генерирует исключение на основе тела ответа.

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

Добавляет заголовок с языком к каждому запросу, чтобы сервер мог вернуть ответ на нужном языке.

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

Добавляет токен авторизации к каждому запросу. Для использования необходимо реализовать `getToken()`.

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

Обрабатывает ответ `401 Unauthorized`: обновляет токен через `updateTokenHandler` и повторяет запрос. Если несколько запросов получили `401` одновременно — проверяется актуальность токена через `isCredentialsActual`, и лишние обновления не выполняются.

```kotlin
if (!feature.isCredentialsActual(context.request)) {
    val requestBuilder = HttpRequestBuilder().takeFrom(context.request)
    val result: HttpResponse = context.client!!.request(requestBuilder)
    proceedWith(result)
    return@intercept
}

if (feature.updateTokenHandler.invoke()) {
    val requestBuilder = HttpRequestBuilder().takeFrom(context.request)
    val result: HttpResponse = context.client!!.request(requestBuilder)
    proceedWith(result)
} else {
    proceedWith(subject)
}
```

## moko-network-errors

Модуль `network-errors` предоставляет встроенные мапперы для преобразования исключений moko-network в `StringDesc` (тексты на русском и английском).

## Дополнительные материалы

<iframe src="//www.youtube.com/embed/98r5muoeO7U" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
