# Firebase Cloud Messaging

Здесь находится гайд по подключению и локализации пуш-уведомлений с помощью Firebase.
Гайд написан со стороны iOS разработчика, поэтому некоторые ссылки могут вести на специализированные ресурсы для Apple.


## Добавляем Firebase в проект

Вы можете получать уведомления (push notifications) и полезные данные размером до 4000 байт через интерфейс APN Firebase Cloud Messaging.

Инструкция: 

1. [Создайте](https://firebase.google.com/docs/ios/setup#create-firebase-project) проект Firebase
1. [Зарегистрируйте](https://firebase.google.com/docs/ios/setup#register-app) свое приложение в Firebase
1. [Добавьте](https://firebase.google.com/docs/ios/setup#add-config-file) файл конфигурации (Google plist) в проект
1. [Добавьте](https://firebase.google.com/docs/ios/setup#add-sdks) SDK Firebase в свое приложение
1. [Инициализируйте](https://firebase.google.com/docs/ios/setup#initialize-firebase) Firebase в своем приложении
1. [Загрузите](https://firebase.google.com/docs/cloud-messaging/ios/client#upload_your_apns_authentication_key) ключ аутентификации APNs в Firebase. Если у вас нет ключа, создайте его в своем [Apple Developer Member Center](https://developer.apple.com/membercenter/index.action). Будьте осторожны, скачать созданную версию APNs ключа разрешается только один раз (замена - только через перегенерацию ключа). 


## Базовая настройка внутри проекта 

1. Запустите конфигурацию Firebase на старте проекта (внутри вашего `AppDelegate`)
Можете сразу установить ваш сервис как делегата обмена сообщениями (`Messaging`). 
Например: `PushService`, реализованный через `Singleton`.
 
```swift
import UIKit
import Firebase
import FirebaseMessaging

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, MessagingDelegate {
    let pushService = PushService.shared
    
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        setupFirebase()
        return true
    }
    
    ...
    
    private func setupFirebase() {
        FirebaseApp.configure()
        Messaging.messaging().delegate = pushService
    }
}
```

2. Зарегистрируйтесь для получения уведомлений (внутри сервиса, где вы с ними работаете). 
Не забудьте унаследовать сервис от `UNUserNotificationCenterDelegate` и внутри установить делегат.

```swift
import UIKit
import FirebaseMessaging
import Firebase

class PushService: NSObject, UNUserNotificationCenterDelegate {

    func setup(
        for application: UIApplication
    ) {
        UNUserNotificationCenter.current().delegate = self
        let authOptions: UNAuthorizationOptions = [.alert, .badge, .sound]
        
        UNUserNotificationCenter.current().requestAuthorization(
            options: authOptions,
            completionHandler: { _,_ in })
        
        application.registerForRemoteNotifications()
    }
}
```

3. Вызовите установку сервиса после авторизации пользователя.  
Например: `MainViewController`, в который мы попадаем после любой успешной авторизации в приложении. 

```swift
class MainViewController: UIViewController {
    ... 
    override func viewDidLoad() {
        super.viewDidLoad()
        setupFirebase()
    }
    
    ...
    
    private func setupFirebase() {
        pushService.setup(for: UIApplication.shared.self)
        pushService.sendPushToken() // Отправка свежего токена на backend
    }
}
```


## Локализация пушей 

Для того, чтобы локализовать Firebase пуши: 
- Ваш сервер должен отправлять не `title_key`, `body_key`, а `body_loc_key`, `title_loc_key` 
- После этого локализация title (заголовок) и body (сообщение) подтягивается из файла локализации Localizable English / Russian
- Для автоматизации вам нужно согласовать с бэком ключи для ваших уведомлений (Например: BeforeStart, RemoveEvent и т.д.)

```
body_loc_key - string
The key to the body string in the app's string resources to use to localize the body text to the user's current localization.
```

```
title_loc_key - string
The key to the title string in the app's string resources to use to localize the title text to the user's current localization. 
```

Ознакомьтесь с [развернутой информацией](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages) по возможным действиям с контентом ваших пуш-уведомлений.

## Полезные ресурсы

- Статья про [принудительный сброс FCM токена](./forced_fcm_invalidation)
- [Отправка](https://firebase.google.com/docs/cloud-messaging/ios/first-message#send_a_notification_message) тестового уведомления
- [Отправка изображений](https://firebase.google.com/docs/cloud-messaging/ios/send-image) в уведомлениях
- [Получение сообщений и их обработка](https://firebase.google.com/docs/cloud-messaging/ios/receive)
- Документация Apple по [User Notifications](https://developer.apple.com/documentation/usernotifications)
- [Примеры приложений](https://firebase.google.com/docs/samples)
- [Контрольный чеклист запуска Firebase](https://firebase.google.com/support/guides/launch-checklist)
- FAQ по неполадкам [для iOS](https://firebase.google.com/docs/ios/troubleshooting-faq)
- FAQ по неполадкам [для Android](https://firebase.google.com/docs/android/troubleshooting-faq)
- Тестирование пушей [через Postman](https://medium.com/android-school/test-fcm-notification-with-postman-f91ba08aacc3)

<div style={{textAlign:"right"}}>Автор: <a href="https://github.com/EvelDevel">@EvelDevel</a></div>
