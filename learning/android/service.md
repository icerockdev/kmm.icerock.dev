# Сервисы

## Android Service Component
[Services overview](https://developer.android.com/guide/components/services)

### Что такое Service
Сервис — один из компонентов Android для выполнения длительных операций без UI.

❗ Важно:
- Сервис **не создаёт отдельный поток**
- Все lifecycle-методы вызываются на **main thread**
- Долгую работу нужно выполнять в отдельном потоке (Coroutine, Executor и т.д.)

Сервис является точкой входа в приложение.

При нехватке памяти система в первую очередь избавляется от процессов с более низким приоритетом. Подробнее про приоритеты процессов:  
[Who lives and who dies — process priorities on Android](https://medium.com/androiddevelopers/who-lives-and-who-dies-process-priorities-on-android-cb151f39044f)

## Виды сервисов

Сервисы делятся на два основных типа:

### Foreground Service
[Foreground services](https://developer.android.com/guide/components/foreground-services)

Foreground — сервис выполняет функционал, заметный пользователю, и может продолжать работу, даже если приложение свернуто.

Примеры:
- проигрывание музыки
- навигация
- трекинг геолокации
- VoIP-звонки
- запись аудио/видео
- плавающее окно с видео

Обязательные требования:

- Сервис обязан показать уведомление
- Уведомление нельзя убрать, пока сервис работает
- Необходимо разрешение:

```xml
<uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
```

Начиная с Android 10+ необходимо указывать тип сервиса:

```xml
<service
    android:name=".LocationService"
    android:foregroundServiceType="location"
    android:exported="false" />
```

В Android 14+ для некоторых типов требуется отдельное разрешение, например:

```xml
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION"/>
```

Примеры типов:
- location
- mediaPlayback
- camera
- microphone
- dataSync
- connectedDevice
- phoneCall

Начиная с Android 12 действуют ограничения на запуск Foreground Service из background — система может запретить запуск.

### Background Service

Background — сервис выполняет функционал, скрытый от пользователя.

⚠ Начиная с API 26 (Android 8.0) действуют ограничения:
- Приложение не может свободно запускать background service, если находится в background
- Возможен `IllegalStateException`

В большинстве случаев вместо background service рекомендуется использовать:
- ✅ [WorkManager](https://developer.android.com/topic/libraries/architecture/workmanager)
- ✅ JobScheduler
- ✅ AlarmManager (ограниченно)

Background Service в современных приложениях используется редко.

## Потоки

И Foreground, и Background сервисы запускаются на main потоке.

❗ Если выполнять долгую операцию внутри `onStartCommand()`, можно получить ANR.

Правильный подход:
- Coroutine + Dispatchers.IO
- Thread / Executor
- WorkManager

## IntentService и JobIntentService

[IntentService](https://developer.android.com/reference/android/app/IntentService.html) — **deprecated**  
[JobIntentService](https://developer.android.com/reference/androidx/core/app/JobIntentService.html) — **deprecated**

Ранее они автоматически выполняли работу в отдельном потоке.  
Сейчас рекомендуется использовать:
- WorkManager
- Foreground Service + coroutine

## Объявление в манифесте

Независимо от типа сервис должен быть объявлен в манифесте:

```xml
<service
    android:name=".MyService"
    android:exported="false"/>
```

Начиная с Android 12 (targetSdk 31+) необходимо явно указывать `android:exported`, если есть `intent-filter`.

- exported="true" — сервис доступен другим приложениям
- exported="false" — только внутри приложения

## Запуск сервиса

Сервис можно запустить двумя способами:

### startService()

```kotlin
startService(intent)
```

Если приложение в background (API 26+), необходимо использовать:

```kotlin
ContextCompat.startForegroundService(...)
```

После этого нужно вызвать `startForeground()` в течение ~5 секунд.

Жизненный цикл started service:

- onCreate()
- onStartCommand()
- onDestroy()

Возвращаемое значение `onStartCommand()` влияет на перезапуск сервиса:
- START_NOT_STICKY
- START_STICKY
- START_REDELIVER_INTENT

Сервис будет жить, пока не вызван:
- stopSelf()
- stopService()

### bindService()

```kotlin
bindService(...)
```

При запуске через bindService() сервис будет жить, пока у него есть хотя бы один клиент.  
Когда все клиенты отпишутся — сервис будет уничтожен.

Жизненный цикл у bound service:

- onCreate()
- onBind()
- onUnbind()
- onRebind()
- onDestroy()

Если сервис был запущен через startService(), на него всё равно можно подписаться:  
[Bound services](https://developer.android.com/guide/components/bound-services)

Сервис может быть одновременно started и bound.  
Он уничтожится, только когда:
- вызван stopSelf()
- и нет активных bind-подключений

Жизненный цикл сервиса не зависит от жизненного цикла компонента, который его запустил.

## Обращение к сервису из другого процесса

Для взаимодействия с сервисом из другого процесса используется:
- [AIDL](https://developer.android.com/guide/components/aidl)
- Messenger
- Binder

## Когда стоит использовать Service

✅ Foreground Service — если:
- работа длительная
- пользователь понимает, что она выполняется
- требуется повышенный приоритет процесса

✅ WorkManager — если:
- задача должна гарантированно выполниться
- задача может быть отложенной
- нужна работа после перезапуска устройства

В большинстве фоновых задач предпочтительнее WorkManager.

## Главное помнить

- Service не создаёт поток
- IntentService устарел
- Background Service сильно ограничены с Android 8+
- Foreground Service строго регулируется на Android 12+
- В большинстве случаев для фоновой работы лучше использовать WorkManager

### Примеры использования сервисов

[Сервис для скачивания файлов](https://gitlab.icerockdev.com/marmalato/marmalato-android/-/blob/develop/app/src/main/java/com/icerockdev/marmalato/feature/loader/LoaderService.kt)
Сервис в своем потоке скачивает файлы, может сообщать процент скачивания для отображения прогресса в активити

[Стартовый сервис helga](https://gitlab.icerockdev.com/helga/helga-client/-/blob/dev/client-service/src/main/java/com/icerockdev/helga/client/service/HelgaService.kt)
Сервис проверяет авторизацию пользователя, запускает остальные сервисы приложения (ожидание звонков, сервис для нотификаций календаря и др.)

[Сервис для приема входящих звонков](https://gitlab.icerockdev.com/helga/helga-client/-/blob/dev/client-contacts/src/main/java/com/icerockdev/helga/client/contacts/feature/invitation/CallInvitationService.kt)
При входящем звонке показывает плавающее окно-уведомление

[Сервис для мониторинга геолокации](https://gitlab.icerockdev.com/crossway/crossway-mobile/-/blob/develop/mpp-library/feature/map/src/androidMain/kotlin/ru/crossway/feature/map/LocationMonitoringService.kt)
Foreground сервис для отслеживания геолокации
