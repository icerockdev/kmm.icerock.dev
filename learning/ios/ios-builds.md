# Simulator Builds

В этой статье показано, как запускать сборки симуляторов через командную строку, что позволяет отправлять сборки на другие устройства для тестирования. Такой подход используется в проверке приложений, использующих [Facebook IOS SDK](https://developers.facebook.com/docs/ios/advanced)

## Сборка приложения на симуляторе

Запустите свое приложение в симуляторе iPhone Xcode. Это автоматически создает сборку симулятора в кэше данных Xcode.

Сборка проекта будет находится по адресу: `~/Library/Developer/Xcode/DerivedData/[ProjectName]-[BuildHash]/Build/Products/[BuildType]-iphonesimulator/[ProjectName].app`

Директорию с билдами Xcode можно найти через панель управления: Xcode->Preferences->Locations.

## Проверка сборки

Вы можете проверить сборку симулятора с помощью утилиты запуска приложений командной строки [ios-sim](https://github.com/ios-control/ios-sim?fbclid=IwAR0juLhj5VeqTfL-h8_YlD3U81lwU47N6iDVEhc4dLCk9w5mrSGpzsAFXNs) для симулятора. Он используется для запуска приложения по указанному пути в симуляторе iOS. Сначала нужно установить его в вашей системе.

Запустите команду: `npm install -g ios-sim`

:::important

Установка ios-sim требует наличие Node.js на вашем компьютере. За инструкцией по установке обратитесь на [официальный сайт](https://nodejs.org/en/download/)

:::

После установки запустить приложение на симуляторе можно командой:

```shell
ios-sim -d [deviceName] launch [source]
```

где **[deviceName]** - имя девайса, на котором мы хотим протестировать сборку, **[source]** - путь до файла .app

Список доступных девайсов можно увидеть командой `ios-sim showdevicetypes`

:::important

Сборки на устройствах с процессорами M1 и Intel могут отличаться

:::
