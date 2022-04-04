---
sidebar_position: 5
---

# Работа с MockEngine

Бывают случаи, когда мобильное приложение делается одновременно с сервером, с которым оно будет работать. Из-за этого приходится делать заглушки для данных, чтобы имитировать работу сервера.  
Делаем это мы с помощью `MockEngine`. Он позволяет полностью воссоздать работу с настоящим сервером, что позволит нам:
- не хардкодить "тестовые" данные в репозитории или во вьюмодели 
- использовать структуры и `api` будущего сервера, если они уже утверждены 
- проверять, как приложение отрабатывает при разных ошибках (их тоже можо имитировать)
- переключение между реальным сервером и тестовым осуществляется изменением всего одной строчки кода!

Детали подключения и использования можете узнать по [ссылке](https://ktor.io/docs/http-client-testing.html).

Рассмотрим простой пример:

Допустим, что мы уже утвердили один запрос серверу: `/info`, по которому можно будет получить объект с одним единственным полем `info` - информация о сервере.    
Значит, мы уже сейчас можем создать подходящую структуру данных для этого объекта, а также создать класс сервера, в который мы в последствии будем добавлять новые запросы: 
```kotlin
@Serializable
data class ServerInfo(val info: String)

class Server(engine: HttpClientEngine) {
    private val httpClient = HttpClient(engine) {
        install(JsonFeature) {
            serializer = KotlinxSerializer()
        }
    }

    suspend fun getInfo(): ServerInfo = httpClient.get("https://myAppServer/?format=json")
}
```

Создаем сервер и пытаемся получить информацию о нем:
```kotlin
fun main() {
    runBlocking {
        val server = Server(CIO.create())
        val response = server.getInfo()
        println(response.info)
    }
}
```

Поскольку сервер еще не запущен, создадим тестовый `mock`-движок, и будем имитировать работу сервера:
```kotlin
val mockEngine = MockEngine { request ->
    respond(
        content = ByteReadChannel("""{"info":"Test server info"}"""),
        status = HttpStatusCode.OK,
        headers = headersOf(HttpHeaders.ContentType, "application/json")
    )
}
```
Теперь, создавать сервер мы будем с помощью нашего мока, а когда запустится боевой сервер - просто заменим движок. 
```kotlin
fun main() {
    runBlocking {
        val server = Server(mockEngine)
        val response = server.getInfo()
        println(response.info)
    }
}
```




