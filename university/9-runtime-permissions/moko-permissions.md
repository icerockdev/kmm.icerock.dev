---
sidebar_position: 2
---

# moko-permissions

**moko-permissions** - библиотека для работы с разрешениями из общего кода.  
Прежде чем мы перейдем к ее изучению, разберем то, как получать разрешения на каждой платформе по отдельности.

## Получение разрешений на Android
Изучите раздел [Permissions](https://developer.android.com/guide/topics/permissions/overview) из документации, вы узнаете: 
- Какие бывают типы разрешений
- Как объявлять необходимые приложению разрешения
- Как запрашивать разрешения 
- Что такое one-time разрешения

## Получение разрешений на iOS
Для начала, изучите раздел [Accessing User Data and Resources](https://developer.apple.com/design/human-interface-guidelines/ios/app-architecture/accessing-user-data/).

На iOS доступ к разрешениям не так структурирован, как на Android. Получение конкретного разрешения связано, как правило, с конкретным классом, например: 
- [Notifications](https://developer.apple.com/documentation/usernotifications/asking_permission_to_use_notifications)
- [Media Capture](https://developer.apple.com/documentation/avfoundation/cameras_and_media_capture/requesting_authorization_for_media_capture_on_ios)
- [Location Services](https://developer.apple.com/documentation/corelocation/requesting_authorization_for_location_services)

## Получение разрешений c moko-permissions
Теперь, когда вы знакомы с тем, как работать с разрешениями на каждой платформе, разберем библиотеку [moko-permissions](https://github.com/icerockdev/moko-permissions), которая упростит получение и работу с разрешениями в общем коде.  
Для начала, ознакомьтесь с [Readme](https://github.com/icerockdev/moko-permissions#readme) библиотеки.  
[Список разрешений](https://github.com/icerockdev/moko-permissions#list-of-supported-permissions), которые позволяет получить библиотека.  

Изучите [страницу](../../learning/libraries/moko/moko-permissions) библиотеки в базе знаний.
