---
sidebar_position: 3
---

# Практическое задание
Подключите и протестируйте `Firebase Cloud Messaging` на iOS и Android.  

Во время работы над практическим заданием настоятельно рекомендуем обращаться к разделу [Памятки для разработчика](../../university/memos/best-practices)

Порядок действий:
- создайте новое приложение используя `Kotlin Multiplatform Mobile plugin`
- подключите Android-приложение к Firebase
- подключите iOS-приложение к Firebase. Firebase подключайте используя [cocoapods](https://firebase.google.com/docs/ios/installation-methods#cocoapods)
- настройте FCM в Android-приложении
- настройте FCM в iOS-приложении
- протеструйте приложения используя
  - Firebase Console
  - Postman

## Функциональные требования
- iOS и Android приложения должны отображать пуши, даже если приложение свернуто

## Материалы
- [новое KMM приложение](https://kotlinlang.org/docs/multiplatform-mobile-create-first-app.html)  
- [подключение](https://firebase.google.com/docs/android/setup) Android приложения к Firebase
- [подключение](https://firebase.google.com/docs/ios/setup) iOS приложения к Firebase
- [настройка](https://firebase.google.com/docs/cloud-messaging/android/client) FCM в Android приложении
- [настройка](https://firebase.google.com/docs/cloud-messaging/ios/client) FCM в iOS приложении
  - [APNs key](https://drive.google.com/file/d/1PetTvRcQguLAFBYz07to-Bh43nr7K0ok/view?usp=sharing) (доступено для IceRock Development)
