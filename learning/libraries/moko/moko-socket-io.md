---
sidebar_position: 8
---

# moko-socket-io

Библиотека [moko-socket-io](https://github.com/icerockdev/moko-socket-io) предоставляет реализацию Socket.IO для Kotlin Multiplatform, используя нативные клиенты [socket.io-client-java](https://github.com/socketio/socket.io-client-java) и [socket.io-client-swift](https://github.com/socketio/socket.io-client-swift).

## Создание сокета

Для подключения к серверу создаётся экземпляр `Socket` с указанием endpoint и конфигурации:

```kotlin
val socket = Socket(
    endpoint = "wss://my-super-server:8080",
    config = SocketOptions(
        queryParams = mapOf("token" to "MySuperToken"),
        transport = SocketOptions.Transport.WEBSOCKET
    )
) {
    on(SocketEvent.Connect) {
        println("connect")
    }

    on(SocketEvent.Connecting) {
        println("connecting")
    }

    on(SocketEvent.Disconnect) {
        println("disconnect")
    }

    on(SocketEvent.Error) {
        println("error $it")
    }

    on(SocketEvent.Reconnect) {
        println("reconnect")
    }

    on(SocketEvent.ReconnectAttempt) {
        println("reconnect attempt $it")
    }

    on(SocketEvent.Ping) {
        println("ping")
    }

    on(SocketEvent.Pong) {
        println("pong")
    }

    on("employee.connected") { data ->
        val serializer = DeliveryCar.serializer()
        val json = JSON.nonstrict
        val deliveryCar: DeliveryCar = json.parse(serializer, data)
    }
}
```

## SocketOptions

Основные параметры конфигурации:

- `queryParams` — query-параметры, передаваемые при подключении (например, токен авторизации);
- `transport` — тип транспорта: `WEBSOCKET` или `POLLING`.

## Обработка событий

Библиотека поддерживает как встроенные события (`SocketEvent.Connect`, `Disconnect`, `Error` и т.д.), так и кастомные события сервера. Для подписки используется метод `on` внутри блока создания сокета. В кастомных событиях вторым аргументом приходит строка `data`, которую можно распарсить в модель с помощью `kotlinx.serialization`.

## Подключение для iOS

Для работы на iOS необходима интеграция через CocoaPods:

```ruby
pod 'mokoSocketIo', :git => 'https://github.com/icerockdev/moko-socket-io.git', :tag => 'release/0.6.0'
```

В `build.gradle.kts` проекта настройте pod-зависимость в соответствии с используемым плагином (JetBrains Native CocoaPods или IceRock CocoaPods).
