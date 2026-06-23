---
sidebar_position: 7
---
# Ресурсы в общем коде

## Введение

Разберем задачу: допустим, мы получаем от сервера `enum` — тип транспорта, и хотим отобразить локализованную строку с его названием.

```kotlin
enum class VehicleType {
    BOAT,
    CAR,
    PLANE
}

class MainViewModel : ViewModel() {
    val vehicleType: VehicleType
        get() = ...
}
```

Без инструментов общего кода маппинг на каждую платформу пришлось бы писать отдельно:

**Android:**
```kotlin
val vehicleTitle = when (viewModel.vehicleType) {
    VehicleType.BOAT -> R.string.boatTitle
    VehicleType.CAR -> R.string.carTitle
    VehicleType.PLANE -> R.string.planeTitle
}
```

**iOS:**
```swift
let vehicleTitle: String
switch(viewModel.vehicleType) {
case VehicleType.boat:
    vehicleTitle = NSLocalizedString("boatTitle", comment: "")
case VehicleType.car:
    vehicleTitle = NSLocalizedString("carTitle", comment: "")
case VehicleType.plane:
    vehicleTitle = NSLocalizedString("planeTitle", comment: "")
}
```

Такой дублированный маппинг на обеих платформах — рутина, а синхронизировать изменения легко забыть, что приводит к багам.

## Библиотека moko-resources

Библиотека [moko-resources](https://github.com/icerockdev/moko-resources) позволяет хранить и использовать общие ресурсы (строки локализации, плюралы, шрифты, изображения, цвета) в `common` коде.

Базовый тип для работы со строками — **`StringDesc`**. Это контейнер, который хранит ссылку на ресурс, но не преобразует его в строку до момента, когда доступен platform context. Преобразование происходит на платформе — через `toString(context)` на Android или `.localized()` на iOS.

Благодаря `StringDesc` маппинг из примера выше можно сделать прямо во ViewModel:

```kotlin
class MainViewModel : ViewModel() {
    private val vehicleType: VehicleType get() = ...
    val vehicleTypeString: StringDesc
        get() = when (vehicleType) {
            VehicleType.BOAT -> MR.strings.boatTitle.desc()
            VehicleType.CAR -> MR.strings.carTitle.desc()
            VehicleType.PLANE -> MR.strings.planeTitle.desc()
        }
}
```

На платформу приходит уже готовая ссылка на ресурс — остаётся только получить строку.

:::info Важно!

В общем коде должны находиться только те ресурсы, которые им и управляются, как в примере выше.  
Все остальные ресурсы должны оставаться на платформе. Не нужно с платформы обращаться к ресурсам из `MR`.

:::

Подробное описание подключения и API — на странице [moko-resources](../../learning/libraries/moko/moko-resources) в базе знаний.

## Получение строки на платформе из StringDesc

**Android (Compose):**
```kotlin
import dev.icerock.moko.resources.compose.localized

Text(text = viewModel.vehicleTypeString.localized())
```

**iOS (SwiftUI):**
```swift
Text(viewModel.vehicleTypeString.localized())
```

:::info

На iOS `.localized()` — это extension из `moko-resources`, доступный для `StringDesc`. В связке с `moko-mvvm` можно автоматически преобразовывать `CStateFlow<StringDesc>` в `String` через расширение `state()`, и `.localized()` будет вызываться в маппере автоматически.

:::

## Compose Multiplatform

Если подключен модуль `resources-compose`, ресурсы доступны напрямую в `commonMain` без `StringDesc`:

```kotlin
// Строки
Text(text = stringResource(MR.strings.hello_world))

// Плюралы
Text(text = pluralStringResource(MR.plurals.chars_count, counter, counter))

// Цвета
Text(color = colorResource(MR.colors.textColor), text = "Привет")

// Изображения
Image(painter = painterResource(MR.images.moko_logo), contentDescription = null)

// Шрифты
Text(fontFamily = fontFamilyResource(MR.fonts.cormorant_italic), text = "Привет")

// Файлы
val content: String? by MR.files.some_file_txt.readTextAsState()
```

## Изображения

`ImageResource` из `moko-resources` можно использовать в общем коде (например, для иконок ошибок):

```kotlin
data class ErrorBundle(
    val title: StringDesc,
    val message: StringDesc,
    val icon: ImageResource,
)
```

На платформе изображение преобразуется в зависимости от UI-фреймворка:

**Android (Compose):**
```kotlin
Icon(painter = painterResource(error.icon), contentDescription = null)
```

**iOS (SwiftUI):**
```swift
Image(error.icon.assetImageName, bundle: error.icon.bundle)
```

## Google Sheets для генерации строк

Для строк локализации мы используем интеграцию с [Google Sheets](https://www.google.com/intl/ru_ru/sheets/about/). Строки описываются в таблицах и на их основе генерируются в проект через плагин [sheets-localizations-generator](https://gitlab.icerockdev.com/scl/sheets-localizations-generator).

В проектах, созданных на основе [шаблона](https://gitlab.icerockdev.com/scl/boilerplate/mobile-moko-boilerplate), есть файл [master.sh](https://gitlab.icerockdev.com/scl/boilerplate/mobile-moko-boilerplate/-/blob/master/master.sh), в нём находится скрипт `localize`, который генерирует строки на основе таблицы.  
Для использования замените `GSHEET_ID_HERE` на `ID` реальной таблицы и выполните: `./master.sh localize`.

## Практическое задание

- Используйте проект, готовый после раздела [MVVM](./mvvm#практическое-задание)
- Подключите `moko-resources` (настройка описана в [базе знаний](../../learning/libraries/moko/moko-resources))
- `MR` подключайте к `mpp-library`
- Вынесите в `MR` только те ресурсы, управление которыми происходит из общего кода
- Используйте `sheets-localizations-generator` для доступа к строкам локализации из `Google Sheets`
- Настройте проброс ресурсов из `mpp-library` во вьюмодели фичей
- Обеспечьте поддержку русского и английского языков
