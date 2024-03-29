# Forced FCM-token invalidation

Если ваше приложение использует Firebase токены (FCM) для отправки пуш уведомлений пользователям
В случае, когда в нем есть личный кабинет, и требуется авторизация

## Наш кейс
Пользователь, авторизуясь через нативный аккаунт, заходил к себе в личный кабинет. Если пользователь при этом выходил из этого нативного аккаунта (созданного с помощью регистрации внутри приложения) и авторизовывался через Apple-Sign-In, или Google Auth - ему создавался еще один или несколько аккаунтов (на каждую почту, которой нет на сервере - создается новый). Это приводило к тому, что у пользователя может быть несколько разных аккаунтов на одном девайсе для одного приложения. 

## Проблема
При переключении пользователем между аккаунтами - FCM токен генерировался один и тот-же, на девайс, в котором запускается приложение. При попытке отправить его на сервер - обратно возвращалась ошибка, что данный токен уже используется (без привязки к тому, что используется он другим аккаунтом). 

## Задача
Во время логаута - принудительно сбрасывать токен, и каждый раз при авторизации создавать новый и отправлять его на сервер.


## Как реализовать 
В вашем сервисе, отвечающем за авторизацию, необходимо добавить следующий метод:

```shell
func invalidateFCMToken() {
    Messaging.messaging().deleteToken() { error in
        if let error = error {
            Logger.log("#push \(error.localizedDescription)")
        }

        let _ = Messaging.messaging().fcmToken
        Logger.log("#push We are deleting the token with no errors")
    }
}
```

Метод необходимо будет вызвать в тот момент, когда нужно сбросить токен. Например при логауте.
 
```shell
func logout() {
    PushService.shared.invalidateFCMToken()
}
```

<div style={{textAlign:"right"}}>Автор: <a href="https://github.com/EvelDevel">@EvelDevel</a></div>
