---
sidebar_position: 11
---

# Мокирование данных

Мок - это заглушка, т.е. данные, которые заменяют реальные. Нужно это как правило для тестов, отладки или работы без внешней зависимости, например сервера. 

# Работа с MockEngine

Бывают случаи, когда мобильное приложение делается одновременно с сервером, с которым оно будет работать. Из-за этого приходится делать заглушки для данных, чтобы имитировать работу сервера.  

Делаем это мы с помощью возможности, предоставляемой [Ktor Client](https://ktor.io/docs/client.html)-ом, под названием `MockEngine`. Движки нужны `Ktor Client` для выполнения запросов, с полным списком движков можете ознакомиться [здесь](https://ktor.io/docs/http-client-engines.html). `MockEngine` - это тоже движок, но для тестов, который по-настоящему не отправляет никакие запросы, а просто возвращает заглушки. Он позволяет полностью воссоздать работу с настоящим сервером.  

Это позволяет нам:
- не хардкодить "тестовые" данные в репозитории или во вьюмодели 
- использовать структуры и `api` будущего сервера, если они уже утверждены 
- проверять, как приложение отрабатывает при разных ошибках (их тоже можно имитировать)
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

Результат, который получим:
```text
Exception in thread "main" java.nio.channels.UnresolvedAddressException
	at java.base/sun.nio.ch.Net.checkAddress(Net.java:130)
	at java.base/sun.nio.ch.SocketChannelImpl.connect(SocketChannelImpl.java:675)
	at io.ktor.network.sockets.SocketImpl.connect$ktor_network(SocketImpl.kt:32)
	at io.ktor.network.sockets.ConnectUtilsJvmKt.connect(ConnectUtilsJvm.kt:19)
	...
```
Очевидно, получили ошибку, потому что такого сервера еще нет.

Чтобы протестировать логику нашего приложения, создадим тестовый `mock`-движок, и будем имитировать работу сервера:
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

Результат:
```text
Test server info

Process finished with exit code 0
```

# Реализация моков в репозитории

Если наше приложение будет работать с сервером, но мы еще не знаем ни его api, ни модели данных, которые там будут использоваться, нам следует отказаться от использования `MockEngine`, потому что 
- придется менять запросы, после утверждения api сервера
- придется менять структуры данных, которые получаем от сервера

Чтобы избавить себя от этих проблем, просто возвращайте необходимые данные прямо из репозитория, без работы с сетью. Это также будет счиаться моком.
