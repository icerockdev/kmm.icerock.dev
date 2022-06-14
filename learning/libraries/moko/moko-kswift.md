---
sidebar_position: 10
---

# moko-kswift

## moko-kswift

[moko-kswift](https://github.com/icerockdev/moko-kswift) - этот плагин, позволяет автоматически генерировать Swift-friendly API из общего кода:
- `enum`-ы, соответствующие `sealed-interface`-ам из общего кода, чтобы работать их в `switch` без ветки `default`
- `extensions`, объявленные в общем коде

Детали подключения плагина вы можете узнать из его [README](https://github.com/icerockdev/moko-kswift#readme) и [стати](https://medium.com/icerock/how-to-implement-swift-friendly-api-with-kotlin-multiplatform-mobile-e68521a63b6d).

## Способы подключения
### Cocapods

Это более предпочтительный вариант, потому что сразу видно, что есть импорты, в них можно заглянуть и тд

Вызвав специальную gradle-таску сгенерируется podfile, который также подключаем в основном podfile, таким образом, все сгенеренные файлы будут доступны в swift через import.

после подключения плагина и сборки проекта необходимо просто подключить сгенерированные файлы (находятся по пути `../shared/build/cocoapods/framework/sharedSwift/..`) к iOS проекту.

### Project integration

Если фреймворк подключен напрямую к проекту, то вариант с cocoapods не сработает, потому что там под зависит от пода фреймворка. Поэтому единственным вариантом остается подключать файлики к проекту

## mvvm-livedata, mvvm-flow и moko-kswift в одном проекте 

Начиная с [moko-mvvm-0.13.0](https://github.com/icerockdev/moko-mvvm/releases/tag/release%2F0.13.0) появилась поддержка деклоративного UI - Jetpack Compose и Swift UI. Но деклоративный UI полностью использует mvvm-flow модуль, нету EventDispatcher, о событиях сообщаем через Flow, а для iOS используем CFlow  
Однако, часть библиотек все еще использует livedata
- пагинация
- филды 
- и тд

Поэтому, пока все библиотеки не обновятся до поддержки и филдов и лайвдат, нам надо микосовать и то и то. 

на Android все норм, а на iOS есть проблемаL=% 
- в mvvm-livedata и в mvvm-flow есть экстеншены и биндинги к вьюхам, с одинаковыми именами
- компилятор kotlin-native, чтобы избежать конфликтов с одинаковыми именами, создаст эти экстеншены с поджопниками. А moko-kswift, в свою очередь, ничего не знает про этим поджопники, он ожидает экстеншены без поджопников, и ничего нагенерить не сможет

Решение проблемы:
делаем файлик `mpp-library/src/iosMain/UIKitBindings.kt`

Там объявляем все экстеншены, которые нам нужны на свифт из модулей mvvm-flow или mvvm-livedata
например:

```
import dev.icerock.moko.mvvm.livedata.mutableLiveData
import dev.icerock.moko.mvvm.livedata.bindTextTwoWay

import dev.icerock.moko.mvvm.flow.bindTextTwoWay

fun UITextField.bindTextTwoWay(livedata: MutableLiveData<String>) = bindTextTwoWay(livedata)

fun UITextField.bindTextTwoWay(flow: CStateFlow<String>) = bindTextTwoWay(flow)
```


moko-kswift сгеренит один файлик, где будут все экстегшены, но каждый будет обращаться туда, куда ему надо

Оригинальные модули библиотек нужно будет добавить в исключения для moko-kswift,

excludeLibrary("mvvm-livedata")
excludeLibrary("mvvm-flow")























