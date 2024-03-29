---
sidebar_position: 2
---

# Тестирование

## Firebase Console
Тестировать отправку запросов можно используя [Firebase Console](https://console.firebase.google.com/u/0/?hl=ru)
![img.png](media/send-first-message.png)
![img.png](media/setup-push.png)
![img.png](media/send-test-push.png)

Однако пуши, отправленные через Firebase Console, по неизвестной причине не всегда доходят, поэтому тестировать пуши лучше не через консоль, а отправляя POST-запросы на [Firebase API](https://firebase.google.com/docs/reference/fcm/rest). Сделать это можно, например, через Postman.

## Cloud Messaging API (Legacy)
Чтобы посылать запросы на `https://fcm.googleapis.com`, нам необходимо как-то авторизоваться. Это можно сделать при помощи токена, который можно получить подключив `Cloud Messaging API (Legacy)`
![img.png](media/legacy-api.png)
![img.png](media/enable-api.png)

Теперь, у нас есть токен, который мы можем использовать для авторизации в запросах:
![img.png](media/server-key.png)

## Postman
[Postman](https://www.postman.com/downloads/) - это приложение, позволяющие посылать различные запросы. C его помощью мы будем тестировать отправку пушей. 

Создадим новый запрос типа `POST` с `URL = https://fcm.googleapis.com/fcm/send`
![img.png](media/postman-request-example.png)

Далее, добавим `JSON body` запроса:
```json
{
 "to" : "FCM Registration token",
 "notification" : {
     "body" : "Body of Your Notification",
     "title": "Title of Your Notification"
 },
 "data" : {
     "something_key" : "Something value from server"
 }
}
```
Поле `data` - отвечает за различные параметры для пуша, которые может отправить сервер. Например, пуш о публикации какой-нибудь новости может содержать `id` этой новости:
```json
"data" : {
     "news_id" : "123"
 }
```

:::info
Не забудьте заменить `FCM Registration token` на реальный токен устройства.
:::

![img.png](media/postman-request-body-example.png)

Теперь добавим `header` авторизации со значением `Server key` из `Cloud Messaging API (Legacy)`
![img.png](media/authorization-header-example.png)

Результат запроса:
![img.png](media/response-example.png)

:::info
Пуши на Android можно протестировать на эмуляторе.  
Пуши на iOS протестировать на эмуляторе не получится, только на реальном девайсе.
:::

![img.jpg](media/response-example-phone.png)
