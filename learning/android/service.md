# Сераисы

## Android Service Component (in progress)

[Services overview](https://developer.android.com/guide/components/services).

### Виды сервисов

Сервисы - один из компонентов андроида. Все сервисы деляться на два вида: [Foreground](https://developer.android.com/guide/components/foreground-services) и Background.

Foreground - сервис выполняет функционал заметный для пользователя, и может продолжать работу даже если пользователь свернул приложение. Например проигрывать музыку, или отображать плавающее окошко с видео. Сервис обязан показать плашку уведомления о том, что он работает, это уведомление нельзя убрать пока сервис запущен.
Для использования Foreground сервиса требуется специальный пермишен

```xml
<uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
```

И foreground и Background сервисы запускается на main потоке

Background - сервис выполняет функционал скрытый от пользователя. Начиная с API-26 фоновые сервисы имеют некоторые ограничения при свернутом приложении, например они не могут получить геолокацию

Хотя [IntentService](https://developer.android.com/reference/android/app/IntentService.html) и запускается на главном потоке, но для обработки onHandleIntent он запускает отдельный поток. Аналогично [JobIntentService](https://developer.android.com/reference/androidx/core/app/JobIntentService.html) обрабатывает enqueueWork на отдельном потоке

Не зависимо от вида сервиса он должен быть объявлен в манифесте приложения

### Запуск сервиса

Сервис можно запустить двумя способами: через startService() или через bindService()

Разница состоит в том, что при запуске через bindService() сервис будет жить до тех пор пока у него есть хотябы один подписчик, после того как от сервиса отпишутся все подписчики он будет уничтожен. При запуске через startService() сервис будет жить не зависимо от количества подписчиков, пока не будет вызвана команда для его остановки.
Жизненный цикл сервиса не зависит от жизненного цикла компонента который его запустил.
Если сервис был запущен через startService(), на него все равно можно [подписаться](https://developer.android.com/guide/components/bound-services)

### Обращение к сервису из другого процесса

Обращение к сервису из другого процесса возможно, для этого следует использовать [Android Interface Definition Language ](https://developer.android.com/guide/components/aidl)

### Примеры использования сервисов

[Сервис для скачивания файлов](https://gitlab.icerockdev.com/marmalato/marmalato-android/-/blob/develop/app/src/main/java/com/icerockdev/marmalato/feature/loader/LoaderService.kt)
Сервис в своем потоке скачивает файлы, может сообщать процент скачивания для отображения прогресса в активити

[Стартовый сервис helga](https://gitlab.icerockdev.com/helga/helga-client/-/blob/dev/client-service/src/main/java/com/icerockdev/helga/client/service/HelgaService.kt)
Сервис проверяет авторизацию пользователя, запускает остальные сервисы приложения(ожидание звонков, сервис для нотификаций календаря и др.)

[Сервис для приема входящих звонков](https://gitlab.icerockdev.com/helga/helga-client/-/blob/dev/client-contacts/src/main/java/com/icerockdev/helga/client/contacts/feature/invitation/CallInvitationService.kt)
При входящем звонке показывает плавающее окно-уведомление

[Сервис для мониторинга геолокации](https://gitlab.icerockdev.com/crossway/crossway-mobile/-/blob/develop/mpp-library/feature/map/src/androidMain/kotlin/ru/crossway/feature/map/LocationMonitoringService.kt)
Foreground сервис для отслежтвания геолокации