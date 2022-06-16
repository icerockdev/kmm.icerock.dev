---
sidebar_position: 22
---

# Socket

Про сокет в [Википедии](https://ru.wikipedia.org/wiki/%D0%A1%D0%BE%D0%BA%D0%B5%D1%82_(%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%BD%D1%8B%D0%B9_%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D1%84%D0%B5%D0%B9%D1%81)).

Кейсы, когда нужны именно сокеты, когда сервер должен мочь в любой момент что-то сообщить:
- обновление положения такси на карте
- обновление статуса выполнения заказа
- чаты
- биржи
- и тд.

Http запросы также построены на базе сокетного соединения:
- открывается сокетное соединение
- отправляются какие-то данные
- в ответ также что-то отправляется
- соединение прерывается

Если сокет открыт вручную - то такое соединение можно долго держать открытым, оно не закроется после одного запроса.  
Push Notifications также работают на базе сокетного соединения. Как только сервер узнает, что пользователей нужно о чем-то уведомить - отправляет в этот сокет сообщение с информацией.

Также, для удобной работы с сокетами необходима обработка ситуации потери связи - реконнект.

[Пример](https://android-tools.ru/coding/sokety-v-android/) реализации сокета на Android.

## WebSocket
[В чем разница](https://ru.stackoverflow.com/questions/507746/%D0%92-%D1%87%D0%B5%D0%BC-%D1%80%D0%B0%D0%B7%D0%BD%D0%B8%D1%86%D0%B0-%D0%BC%D0%B5%D0%B6%D0%B4%D1%83-socket%D0%BE%D0%BC-%D0%B8-websocket%D0%BE%D0%BC) между Socket и WebSocket.  
WebSocket [простыми словами](https://www.youtube.com/watch?v=SxMvxIHBahU).  
Web Socket. Что это такое? Как с этим жить? - [видео](https://www.youtube.com/watch?v=bTxax4k-b8o) от [Mad Brains](https://madbrains.ru/).  

[Видео](https://www.youtube.com/watch?v=tF0-p4FDepk) про работу с сетью через WebSocket + [OkHttp](https://square.github.io/okhttp/).
[Статья](https://apptractor.ru/info/articles/websockets-ios.html) о том, как использовать WebSocket на iOS 13.
[Статья](https://ssaurel.medium.com/learn-to-use-websockets-on-android-with-okhttp-ba5f00aea988) про WebSocket на Android с OKHttp
[WebSocket](https://ktor.io/docs/websocket-client.html) в Ktor.  
[Гайд](https://ktor.io/docs/getting-started-ktor-client-chat.html) от Ktor, как сделать чат используя WebSocket и KMM.

## SocketIO

[Официальный сайт](https://socket.io/) библиотеки  
[Статья](https://coderlessons.com/tutorials/kompiuternoe-programmirovanie/uznaite-socket-io/socket-io-kratkoe-rukovodstvo)  
[Еще описание](https://brander.ua/ru/technologies/socketio)  

Если кратко, то `SocketIO` это тот же WebSocket, но с другим протоколом обмена данными внутри. Т.е. не удастся на одной из сторон клиент/сервер использовать `SocketIO`, а на другой просто WebSocket.   

Прочитайте статью про [разницу между веб-сокетами и Socket.IO](https://habr.com/ru/post/498996/) там будут примеры на JS, не пугайтесь :)  

[Использование](https://socket.io/blog/native-socket-io-and-android/) SocketIO на Android.

Если ваш сервер использует SocketIO, то вы также можете использовать библиотеку [moko-soсket-io](../learning/libraries/moko/moko-socket-io) на стороне клиента.  

[Страница](https://myrusakov.ru/long-polling-websockets-sse-and-comet.html) про запросы, с картинками.

## LongPooling-запросы

Также, следует знать про еще один тип запросов - LongPooling-запросы

Это более простая и "ленивая" замена сокетам. Как правило, подходит в том случае, если нам не нужно реализовывать систему реального времени. 
Как это выглядит:
- клиент отправляет запрос на сервер, у этого запроса очень большое время ожидания ответа
- сервер ответит только тогда, когда у него появится что-то новое по запросу клиента, что-то, что он еще не отправлял
- если ничего нового нет, сервер просто ждет, когда появится что-то новое
- если время ожидания ответа истекло, клиент тут же повторит запрос
- как только клиент получит ответ на запрос, он сразу же его продублирует

Для работы таких запросов эту механику необходимо реализовать на сервере. В добавок, для поддержки такого соединения трафика требуется больше, чем для поддержки сокетного.
