# Android SDK migration

## Android 16 (API 36)

- Официальная дока по релизу: https://developer.android.com/about/versions/16
- Изменения для приложений, у которых targetSdk - Android 16: https://developer.android.com/about/versions/16/behavior-changes-16

Изменения | Что делать? (миграция)
------------ | -------------
**Adaptive apps** — для приложений с targetSdk API 36 на экранах шириной >600dp запрещено ограничивать ориентацию и resizability. Приложения обязаны быть адаптивными. В 2026 году (API 37) opt-out будет удалён. | Проверить layouts на больших экранах, обеспечить корректную работу в любой ориентации. https://developer.android.com/about/versions/16/behavior-changes-16#adaptive-apps
**Live Updates** — новый класс уведомлений с шаблоном `ProgressStyle` для отслеживания прогресса (доставка, навигация, поездки). Поддерживает кастомные иконки, сегменты, состояния прогресса. | Использовать `ProgressStyle` notification template для уведомлений с прогрессом. https://developer.android.com/about/versions/16/features#live-updates
**Photo picker с облачными сервисами** — встроенный photo picker теперь поддерживает облачные источники (Google Photos), поиск по фото и видео, а также улучшенную интеграцию через embedded picker. | Обновить интеграцию с photo picker, использовать новые API для embedded picker. https://developer.android.com/about/versions/16/features#photo-picker
**Health records API** — Health Connect теперь поддерживает чтение/запись медицинских данных в формате FHIR (иммунизация, лабораторные результаты). Требует разрешения `READ_MEDICAL_DATA_*` и `WRITE_MEDICAL_DATA` с явным согласием пользователя. | Добавить новые permissions в манифест при работе с Health Connect. https://developer.android.com/about/versions/16/features#health-records
**Notification cooldown** — при массовом поступлении уведомлений система автоматически снижает громкость и приоритет до 2 минут (кроме звонков и будильников). | Учитывать при тестировании массовых push-уведомлений. https://developer.android.com/about/versions/16/features#notification-cooldown

## Android 15 (API 35)

- Официальная дока по релизу: https://developer.android.com/about/versions/15
- Изменения для приложений, у которых targetSdk - Android 15: https://developer.android.com/about/versions/15/behavior-changes-15

Изменения | Что делать? (миграция)
------------ | -------------
**Edge-to-edge enforcement** — приложения с targetSdk 15 отображаются edge-to-edge по умолчанию, контент рисуется за translucent system bars (статусбар и навбар). | Необходимо обработать insets через `WindowCompat` / `enableEdgeToEdge()` и убедиться, что контент не перекрывается системными элементами. https://developer.android.com/about/versions/15/behavior-changes-15#edge-to-edge
**Partial screen sharing** — пользователи могут шарить/записывать отдельное приложение вместо всего экрана через `MediaProjection`. | Обновить `MediaProjection` запросы — использовать новый intent `MediaProjectionManager.createScreenCaptureIntent()` с поддержкой выбора приложения. https://developer.android.com/about/versions/15/behavior-changes-15#screen-sharing
**App archiving** — поддержка архивирования/разархивирования приложений на уровне ОС, в том числе для сторонних сторов. Архивированные приложения освобождают место, но сохраняют данные. | Поддержать восстановление состояния после unarchive, проверить корректность работы после reinstall. https://developer.android.com/about/versions/15/behavior-changes-15#app-archiving
**Private Space** — новый режим для изоляции чувствительных приложений в отдельном пространстве с отдельным profile. | Учитывать при работе с intents и content providers — приложение может быть запущено в private space с ограниченным доступом. https://developer.android.com/about/versions/15/features#private-space
**Sensitive notifications** — система скрывает содержимое уведомлений с одноразовыми кодами (OTP) на lockscreen для повышения безопасности. | Проверить отображение OTP-уведомлений, при необходимости использовать `Notification.Builder` с корректной настройкой visibility. https://developer.android.com/about/versions/15/behavior-changes-15#sensitive-notifications

## Android 14 (API 34)

- Официальная дока по релизу: https://developer.android.com/about/versions/14
- Изменения для приложений, у которых targetSdk - Android 14: https://developer.android.com/about/versions/14/behavior-changes-14

Изменения | Что делать? (миграция)
------------ | -------------
**Блокировка старых приложений** — Android 14 блокирует установку приложений, у которых targetSdk ниже Android 6.0 (API 23). Обойти можно только через ADB флаг. | Убедиться, что `targetSdk` >= 23 (для sideloading). Google Play уже требует более высокий targetSdk. https://developer.android.com/about/versions/14/behavior-changes-14#minimum-target-api-level
**Photo picker** — пользователь может выбрать конкретные фото для доступа приложению через системный photo picker, вместо выдачи доступа ко всей галерее. | Использовать `PickVisualMedia` contract вместо `READ_MEDIA_IMAGES` где возможно. https://developer.android.com/about/versions/14/changes/photo-picker
**Non-linear font scaling** — максимальный размер шрифта увеличен до 200% (было 130%), с нелинейным масштабированием, чтобы крупные элементы не увеличивались слишком сильно. | Проверить UI с максимальным масштабированием шрифтов, использовать `maxFontSize` в sp. https://developer.android.com/about/versions/14/features#non-linear-font-scaling
**Frontend-foreground service types** — для foreground services с targetSdk 14 необходимо явно указывать тип через `foregroundServiceType` в манифесте для: camera, connectedDevice, health, location, mediaPlayback, mediaProjection, microphone, phoneCall. | Добавить соответствующие `foregroundServiceType` в манифест для всех foreground services. https://developer.android.com/about/versions/14/changes/fgs-types-required
**Grammatical Inflection API** — новый API для грамматического рода пользователя (`GrammaticalInflectionManager`), расширяет per-app language settings. | Поддержать в локализации, использовать `GrammaticalInflectionManager.setApplicationGrammaticalGender()`. https://developer.android.com/about/versions/14/features#grammatical-inflection-api

## Android 13 (API 33)

- Официальная дока по релизу: https://developer.android.com/about/versions/13
- Изменения для приложений, у которых targetSdk - Android 13: https://developer.android.com/about/versions/13/behavior-changes-13

Изменения | Что делать? (миграция)
------------ | -------------
**Notification runtime permission** — новое runtime разрешение `POST_NOTIFICATIONS` обязательно для показа уведомлений в Android 13. Без него уведомления блокируются. | Запрашивать `Manifest.permission.POST_NOTIFICATIONS` перед отправкой уведомлений. https://developer.android.com/about/versions/13/changes/notification-permission
**Photo picker** — новый системный photo picker для выбора фото и видео без необходимости запрашивать `READ_EXTERNAL_STORAGE` или `READ_MEDIA_IMAGES`. | Использовать `ActivityResultContracts.PickVisualMedia()` и `PickMultipleVisualMedia()`. https://developer.android.com/about/versions/13/features/photopicker
**Nearby WiFi devices** — новый permission `NEARBY_WIFI_DEVICES` заменяет `ACCESS_FINE_LOCATION` для операций с WiFi (поиск, подключение). `ACCESS_FINE_LOCATION` больше не нужен для WiFi. | Декларировать `NEARBY_WIFI_DEVICES` вместо `ACCESS_FINE_LOCATION` для WiFi-операций. Указать `neverForLocation` в манифесте, если локация не нужна. https://developer.android.com/about/versions/13/features/nearby-wifi-devices-permission
**Per-app language** — возможность задать язык для каждого приложения отдельно без изменения системного языка через `LocaleManager`. | Использовать `LocaleManager.setApplicationLocales()` и добавить `android:localeConfig` в манифест. https://developer.android.com/about/versions/13/features/app-languages
**Foreground service types** — для foreground services с targetSdk 13, использующих location, camera или microphone, обязательно указывать `foregroundServiceType` в манифесте. | Добавить `foregroundServiceType` в декларацию сервиса в манифесте: `location`, `camera`, `microphone` и т.д. https://developer.android.com/about/versions/13/changes/fgs-manager-params

## Android 12 (API 31)

- Официальная дока по релизу: https://developer.android.com/about/versions/12
- Изменения для приложений, у которых targetSdk - Android 12: https://developer.android.com/about/versions/12/behavior-changes-12


Изменения | Что делать? (миграция)
------------ | -------------
**Approximate location** добавлена возможность для пользователя давать разрешение на получение "приблизительной" информации о местоположении. Android target 12. | При запросе runtime разрешения `ACCESS_FINE_LOCATION` необходимо также автоматически запрашивать `ACCESS_COARSE_LOCATION` (приблизительная локация) в рамках одного запроса разрешения. https://developer.android.com/about/versions/12/approximate-location
**App hibernation** - target Android 12, если пользователь напрямую не взаимодействует с приложением "несколько" месяцев, система автоматически отменяет выданные разрешения и помещает приложение в "hibernation state", в котором приложение не может запускать jobs и alerts в фоне, не может получать нотификации, включая высокоприоритетные, и система оптимизирует память - автоматически очищается файловый кэш приложения. | Миграция не нужна, но нужно учитывать возможное наличие такого состояния приложения. Также можно избежать переход в состояние спячки, для этого необходимо послать пользователю запрос `Intent.ACTION_APPLICATION_DETAILS_SETTINGS`. https://developer.android.com/about/versions/12/behavior-changes-12#app-hibernation
**Motion sensors are rate-limited** - появились ограничения на частоту запроса данных сенсоров движения: акселерометра, гироскопа и геомагнитного датчика | Для получения доступа к датчикам с более высокой частотой необходимо декларировать разрешение `HIGH_SAMPLING_RATE_SENSORS`. https://developer.android.com/about/versions/12/behavior-changes-12#motion-sensor-rate-limiting

## Android 11 (API 30)

С августа 2021 все новые приложения и с ноября 2021 все обновления существующих приложений должны использовать 
**targetSdk 30**.

- Официальная дока по релизу: https://developer.android.com/about/versions/11

- Официальный видео-гайд с миграцией на targetSdk 30: https://www.youtube.com/watch?v=vaD-DPI6sgU

- Короткий текстовый гайд про миграцию: https://proandroiddev.com/the-quick-developers-guide-to-migrate-their-apps-to-android-11-e4ca2b011176


Изменения | Что делать? (миграция)
------------ | -------------
**Scoped storage enforcement** влияет на приложения с target Android 11 или выше и на target Android 10 без `requestLegacyExternalStorage = true` в манифесте приложения (флаг `android:requestLegacyExternalStorage` будет игнорироваться). Принудительное использование Scoped Storage. | https://developer.android.com/about/versions/11/privacy/storage , https://nuancesprog.ru/p/10404/ (ru)
**One-time permissions**: с target Android 11 и выше, которые используют геоданные (локация), микрофон, камеру. Юзер может выдать временное (одноразовое) разрешение к ресурсу |
**Permissions auto-reset** с target Android 11 и выше. Если юзер не взаимодействовал с приложением несколько месяцев (в доке не указано сколько!), то ОС автоматически обнуляет ранее выданные runtime разрешения (sensitive runtime permissions). | Миграция не нужна, если в приложении корректно реализован код с запросом runtime разрешений
**Background location access** с target Android 11 и выше для приложений, для которых нужен доступ к фоновой геолокации (android.permission.ACCESS_BACKGROUND_LOCATION) | Гайды, как запрашивать доступ к фоновой геолокации https://developer.android.com/training/location/permissions#request-background-location, https://developer.android.com/training/location/background
**Package visibility**: Для всех приложений с targetSdk Android 11 (API level 30) и выше - теперь нельзя получить доступ к информации обо всех приложениях. Теперь надо явно указать, какие приложения должны быть доступны, или объявить специальное разрешение `QUERY_ALL_PACKAGES` и проходить процедуру одобрения в Google Play. | Подробности https://developer.android.com/training/package-visibility , https://medium.com/androiddevelopers/package-visibility-in-android-11-cc857f221cd9
**Foreground services**: с targetSdk Android 11 и выше теперь для foreground сервисов, которые используют ресурсы камеры, микрофона или локации - в манифесте обязательно нужно указывать, какой ресурс используется в сервисе, через флаг `android:foregroundServiceType` | Изменения по foreground-services https://developer.android.com/about/versions/11/privacy/foreground-services
**Custom Toast** запрещены кастомные toasts | -

## Android 10 (API 29)

Изменения с миграцией: https://buffer.com/resources/getting-buffer-publish-ready-for-android-10/

Официальная дока: https://developer.android.com/about/versions/10

Изменения | Что делать? (миграция)
------------ | -------------
**Scoped storage** влияет на приложения, которые получают доступ и шарят файлы в external storage. Для чтения медиафайлов через `MediaStore` нужно разрешение `READ_EXTERNAL_STORAGE` (если нужен доступ к файлам других приложений) | Информация про scoped storage https://developer.android.com/about/versions/10/privacy/changes#scoped-storage
**More user control over location permissions**: для приложений, которые получают доступ к локации в background, нужно разрешение в манифесте `ACCESS_BACKGROUND_LOCATION`.  | https://developer.android.com/about/versions/10/privacy/changes#app-access-device-location
**Background activity starts** ограничения на запуск активити в background. Теперь активити можно запускать только непосредственно в результате взаимодействия с пользователем (автоматически в фоне запускать активити не получится)  | https://developer.android.com/about/versions/10/privacy/changes#background-activity-starts
**Non-resettable hardware identifiers** Ограничения на доступ к серийному номеру устройства и IMEI, которые теперь нельзя получить | У сторонних приложений доступ к данной информации теперь ограничен https://developer.android.com/about/versions/10/privacy/changes#non-resettable-device-ids
**Permission for wireless scanning**: Доступ к некоторым методам сканирования на основе Wi-Fi или Bluetooth теперь требует получения разрешения `ACCESS_FINE_LOCATION` | https://developer.android.com/about/versions/10/privacy/changes#location-telephony-bluetooth-wifi
