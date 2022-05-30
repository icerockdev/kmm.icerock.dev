---
sidebar_position: 4
---

# moko-media
Изучите [страницу](../../learning/libraries/moko/moko-media) библиотеки в базе знаний.

## Android
Работа с файлами на Android в библиотеке сделана стандартными средствами Android:
- [MediaStore](https://developer.android.com/reference/android/provider/MediaStore) - предоставляет достууп к коллекции файлов
- [MediaPlayer](https://developer.android.com/reference/android/media/MediaPlayer) - для воспроизведения аудио/видео файлов
- [MediaMetadataRetriever](https://developer.android.com/reference/android/media/MediaMetadataRetriever) - предоставляет интерфейс для получения кадров из мультимедиа файла
- и тд.

## iOS
Для реализации iOS библиотека использует следующие 
- [Core Graphics](https://developer.apple.com/documentation/coregraphics) - для рендеринга
- [UIKit.UIGraphicsBeginImageContextWithOptions](https://developer.apple.com/documentation/uikit/1623912-uigraphicsbeginimagecontextwitho) - для создания битмапа на основе графического контента
- [UIKit.UIGraphicsGetImageFromCurrentImageContext](https://developer.apple.com/documentation/uikit/1623924-uigraphicsgetimagefromcurrentima) - получение Image на основе битмапа
- и тд

## Практическое задание
Логику получения картинок в общем коде вы переделаете в финальном практическом задании, а пока:
- подключите к вашему проекту библиотеку moko-geo
- дополните viewModel, которая отвечает за работу с файлами устройства
- настройте iOS и Android приложения, убедитесь, что поведение приложения не изменилось

