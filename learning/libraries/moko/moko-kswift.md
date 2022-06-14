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

### Проблема
Начиная с [moko-mvvm-0.13.0](https://github.com/icerockdev/moko-mvvm/releases/tag/release%2F0.13.0) появилась поддержка декларативного UI - `Jetpack Compose` и `SwiftUI`. Она основана на `mvvm-flow`, без `mvvm-livedata`.  

Однако, на момент написания, часть библиотек еще использовала модуль `mvvm-livedata`
- `moko-paging-0.7.1`
- `moko-fields-0.9.0`
- ...

Поэтому, пока все библиотеки не обновятся до поддержки и `mvvm-flow` и `mvvm-livedata`, нам иногда придется подключать оба этих модуля. В этом случае возникает проблема с генерацией `extensions` для `iOS`.  

В `mvvm-livedata` и в `mvvm-flow` есть экстеншены с одинаковыми именами, для биндинга UI элемента к `State`.
Компилятор `Kotlin/Native` видит конфликты имен, чтобы их избежать он создаст эти экстеншены с `_`.  
Однако, плагин `moko-kswift` ничего не знает про новые измененные названия `extensions` c `_`, он ожидает экстеншены с такими же именами, какие были в `Kotlin`, поэтому ничего сгенерировать не сможет.

### Решение 
В `mpp-library/src/iosMain/...` создаем файл со всеми экстеншенами из `mvvm-flow` или `mvvm-livedata`, которые понадобятся нам на платформах, например:
```kotlin
import dev.icerock.moko.mvvm.livedata.bindTextTwoWay
import dev.icerock.moko.mvvm.flow.bindTextTwoWay
...

fun UITextField.bindTextTwoWay(livedata: MutableLiveData<String>) = bindTextTwoWay(livedata)

fun UITextField.bindTextTwoWay(flow: CStateFlow<String>) = bindTextTwoWay(flow)
```
Оригинальные модули библиотек нужно будет добавить в [исключения](https://github.com/icerockdev/moko-kswift#how-to-exclude-generation-of-entries-from-some-libraries) для `moko-kswift`, чтобы генерация происходила только на основе файла из `iosMain`.
```kotlin
kswift {
    excludeLibrary("mvvm-livedata")
    excludeLibrary("mvvm-flow") 
}
```
На основе этого `moko-kswift` успешно сгенерирует файл, где будут все эти экстеншены, но с нормальными именами. 
