# Firebase Cloud Messaging

Здесь находится гайд по подключению и локализации пуш-уведомлений с помощью Firebase.
Гайд написан со стороны iOS разработчика, поэтому некоторые ссылки могут вести на специализированные ресурсы для Apple.


## Добавляем Firebase в проект

Вы можете получать уведомления (push notifications) и полезные данные размером до 4000 байт через интерфейс APN Firebase Cloud Messaging.

Инструкция: 

1. <a href="https://firebase.google.com/docs/ios/setup">Добавьте Firebase</a></div> в свой проект
    - <a href="https://firebase.google.com/docs/ios/setup#create-firebase-project">Создайте</a></div> проект Firebase
    - <a href="https://firebase.google.com/docs/ios/setup#register-app">Зарегистрируйте</a></div> свое приложение в Firebase
    - <a href="https://firebase.google.com/docs/ios/setup#add-config-file">Добавьте</a></div> файл конфигурации (Google plist) в проект
    - <a href="https://firebase.google.com/docs/ios/setup#add-sdks">Добавьте</a></div> SDK Firebase в свое приложение
    - <a href="https://firebase.google.com/docs/ios/setup#initialize-firebase">Инициализируйте</a></div> Firebase в своем приложении

2. <a href="https://firebase.google.com/docs/cloud-messaging/ios/client#upload_your_apns_authentication_key">Загрузите</a></div> ключ аутентификации APNs в Firebase. Если у вас нет ключа, создайте его в своем <a href="https://developer.apple.com/membercenter/index.action">Apple Developer Member Center</a></div>. Будьте осторожны, скачать созданную версию APNs ключа разрешается только один раз (замена - только через перегенерацию ключа). 


## Базовая настройка внутри проекта 

1. Запустите конфигурацию Firebase на старте проекта (внутри вашего AppDelegate)
Можете сразу установить ваш сервис как делегата обмена сообщениями (Messaging). 
Например: PushService, реализованный через Singleton.
 
```shell
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
Не забудьте унаследовать сервис от UNUserNotificationCenterDelegate и внутри установить делегат.

```shell
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
Например: MainViewController, в который мы попадаем после любой успешной авторизации в приложении. 

```shell
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
- Ваш сервер должен отправлять не title_key, body_key, а body_loc_key, title_loc_key 
- После этого локализация title (заголовок) и body (сообщение) подтягивается из файла локализации Localizable English / Russian
- Для автоматизации вам нужно согласовать с бэком ключи для ваших уведомлений (Например: BeforeStart, RemoveEvent и т.д.)

```shell
body_loc_key - string
The key to the body string in the app's string resources to use to localize the body text to the user's current localization.
```

```shell
title_loc_key - string
The key to the title string in the app's string resources to use to localize the title text to the user's current localization. 
```

Ознакомьтесь <a href="https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages">с развернутой информацией</a></div> по возможным действиям с контентом ваших пуш-уведомлений.


## Возможные дальнейшие действия:

- Статья про <a href="https://kmm.icerock.dev/learning/ios/forced_fcm_invalidation">принудительный сброс FCM токена</a></div>
- <a href="https://firebase.google.com/docs/cloud-messaging/ios/first-message#send_a_notification_message">Отправка</a></div> тестового уведомления
- <a href="https://firebase.google.com/docs/cloud-messaging/ios/send-image">Отправка изображений</a></div> в уведомлениях
- <a href="https://firebase.google.com/docs/cloud-messaging/ios/receive">Получение сообщений и их обработка</a></div>


## Полезные ресурсы

Документация Apple по <a href="https://developer.apple.com/documentation/usernotifications>User Notifications</a></div>
<a href="https://firebase.google.com/docs/samples">Примеры приложений</a></div>
<a href="https://firebase.google.com/support/guides/launch-checklist">Контрольный чеклист запуска Firebase</a></div>
FAQ по неполадкам <a href="https://firebase.google.com/docs/ios/troubleshooting-faq">для iOS</a></div>
FAQ по неполадкам <a href="https://firebase.google.com/docs/android/troubleshooting-faq">для Android</a></div>
Тестирование пушей <a href="https://medium.com/android-school/test-fcm-notification-with-postman-f91ba08aacc3">через Postman</a></div>

<div style={{textAlign:"right"}}>Автор: <a href="https://github.com/EvelDevel">@EvelDevel</a></div>
