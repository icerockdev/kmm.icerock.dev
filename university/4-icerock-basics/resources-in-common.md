---
sidebar_position: 7
---
# Ресурсы в общем коде

## Введение
Разберем задачу: допустим, мы получаем от сервера `enum` - тип транспорта, и хотим отобразить локализированную строку с его названием.

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
Далее, на платформах нам нужно сделать маппинг - определить какие строки из ресурсов соответствуют каждому типу транспорта, чтобы использовать локализованные строки на `UI`.

`Android`:
```kotlin
val vehicleTitle = when (viewModel.vehicleType) {
    VehicleType.BOAT -> R.string.boatTitle
    VehicleType.CAR -> R.string.carTitle
    VehicleType.PLANE -> R.string.planeTitle
  }
```

`iOS`:
```swift
let vehicleTitle: String
switch(viewModel.vehicleType) {
case VehicleType.boat:
  vehicleTitle = NSLocalizedString("boatTitle", comment: "")
  break
case VehicleType.car:
  vehicleTitle = NSLocalizedString("carTitle", comment: "")
  break
case VehicleType.plane:
  vehicleTitle = NSLocalizedString("planeTitle", comment: "")
  break
}
```
Писать такой маппинг на обеих платформах для всех строк - рутина, еще и обновлять строки нужно будет на обеих платформах, что может приводить к багам из-за невнимательности.

## Библиотека moko-resources

### Описание
Эта библиотека позволяет хранить и использовать общие для платформ ресурсы (строки локализации, плюралы, шрифты, изображения, цвета) в `common` коде.  

Используя `moko-resources` мы можем сделать маппинг из примера выше в самой вьюмодели, а на платформу будет предоставляться объекты `StringDesc`, из которого каждая платформа сможет получить необходимый ей ресурс:
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

Ознакомьтесь детальнее с ней по материалам на странице [moko-resources](../../learning/libraries/moko/moko-resources).

### Подключение и настройка:

Выполните следующие шаги, ориентируясь на [README](https://github.com/icerockdev/moko-resources#installation) библиотеки:  
- Настройте `root build.gradle`:
  - подключите `resources-generator` плагин
- Настройте `build.gradle` для каждого модуля:
  - подключите плагин `"dev.icerock.mobile.multiplatform-resources"`
  - подключите зависимость `"dev.icerock.moko:resources:$MOKO_RESOURCES_VERSION"`
  - добавьте и настройте блок `multiplatformResources`
- Настройка `iOS`:
  - добавьте и настройте `Localizations` в `infoPlist`
  - добавьте [Build Phase](https://github.com/icerockdev/moko-resources#static-kotlin-frameworks-support), не забудьте изменить `yourframeworkproject`
- [пример](https://github.com/icerockdev/moko-resources#usage) добавления строк 

## Использование Google Sheets для генерации строк
Для строк локализации мы используем интеграцию с [Google Sheets](https://www.google.com/intl/ru_ru/sheets/about/). 
Строки локализации описываются в таблицах и на их основе генерируются в проект. Делается это при помощи плагина [sheets-localizations-generator](https://gitlab.icerockdev.com/scl/sheets-localizations-generator).

В проектах, созданных на основе [шаблона](https://gitlab.icerockdev.com/scl/boilerplate/mobile-moko-boilerplate) есть файл [master.sh](https://gitlab.icerockdev.com/scl/boilerplate/mobile-moko-boilerplate/-/blob/master/master.sh), в нем находится скрипт `localize`, который и генерирует строки на основе таблицы. 
Для использования скрипта, в нем необходимо заменить `GSHEET_ID_HERE` на `ID` реальной таблицы. После добавления строк в таблицу, выполните скрипт `localize` в терминале: `./master.sh localize` и строки добавятся в проект.

## Практическое задание
  - склонируйте `moko-resources`
  - запустите `sample-app` на `Android` и `iOS`, посмотрите на возможности библиотеки
  - создайте проект по [шаблону](https://kotlinlang.org/docs/multiplatform-mobile-create-first-app.html)
  - подключите `moko-resources`
  - добавьте строк, убедитесь что все работает на `Android` и `iOS`
