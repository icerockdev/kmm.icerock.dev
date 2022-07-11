---
sidebar_position: 3
---

# Практическое задание
Подключите и протестируйте `Firebase Cloud Messaging` к вашему приложению. 

Во время работы над практическим заданием настоятельно рекомендуем обращаться к разделу [Памятки для разработчика](../../university/memos/best-practices)

Порядок действий:
- настройте FCM в Android-приложении
- настройте FCM в iOS-приложении
- протестируйте приложения используя
  - Firebase Console
  - Postman

## Функциональные требования
- iOS и Android приложения должны отображать пуши, даже если приложение свернуто

## Материалы
- [подключение](https://firebase.google.com/docs/cloud-messaging/android/client) FCM в Android приложение
- [подключение](https://firebase.google.com/docs/cloud-messaging/ios/client) FCM в iOS приложение
  - [APNs key](https://drive.google.com/file/d/1PetTvRcQguLAFBYz07to-Bh43nr7K0ok/view?usp=sharing) (доступен для IceRock Development)
    - Название файла APNs содержит KeyID и TeamID: AuthKey_mobiledevelopment_KeyID(TeamID) 
  - Если у вас нет ключа, создайте его в своем [Apple Developer Member Center](https://developer.apple.com/membercenter/index.action) 