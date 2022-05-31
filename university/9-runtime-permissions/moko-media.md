---
sidebar_position: 4
---

# moko-media
Изучите [страницу](../../learning/libraries/moko/moko-media) библиотеки в базе знаний.

## Android
Работа с файлами на Android в библиотеке сделана стандартными средствами Android:
- [Intent.ACTION_PICK](https://developer.android.com/reference/android/content/Intent#ACTION_PICK) и [Intent.ACTION_GET_CONTENT](https://developer.android.com/reference/android/content/Intent#ACTION_GET_CONTENT) [Intent(MediaStore.ACTION_IMAGE_CAPTURE)](https://developer.android.com/reference/kotlin/android/provider/MediaStore#action_image_capture) для выбора фото и видео из галереи или с камеры
- [MaterialFilePicker](https://github.com/nbsp-team/MaterialFilePicker) - для доступа и отображения файловой системы
- [MediaStore](https://developer.android.com/reference/android/provider/MediaStore) - предоставляет доступ к коллекции файлов
- [MediaPlayer](https://developer.android.com/reference/android/media/MediaPlayer) - для воспроизведения аудио/видео файлов
- [MediaMetadataRetriever](https://developer.android.com/reference/android/media/MediaMetadataRetriever) - предоставляет интерфейс для получения кадров из мультимедиа файла
- и тд.

## iOS
Для реализации iOS библиотека использует следующие 
- [UIKit.UIGraphicsBeginImageContextWithOptions](https://developer.apple.com/documentation/uikit/1623912-uigraphicsbeginimagecontextwitho) - для создания битмапа на основе графического контента
- [UIKit.UIGraphicsGetImageFromCurrentImageContext](https://developer.apple.com/documentation/uikit/1623924-uigraphicsgetimagefromcurrentima) - получение Image на основе битмапа
- и тд
