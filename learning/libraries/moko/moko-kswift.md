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
При подключении плагина `moko-kswift` он добавит следующие такски в gradle: 
- `mpp-library/Tasks/cocoapods/kSwiftMultiplatformLibraryPodspec` - если подключен наш плагин [dev.icerock.mobile.multiplatform.ios-framework](https://github.com/icerockdev/mobile-multiplatform-gradle-plugin)
- `mpp-library-pods/Tasks/cocoapods/kSwiftmpp_library_podsPodspec` - если подключен плагин [cocoapods](https://kotlinlang.org/docs/native-cocoapods.html) от JetBrains

Обе эти таски генерируют `mpp-library/MultiplatformLibrarySwift.podspec` файл.  
После этого нужно просто подключить его `pod MultiplatformLibrarySwift` в `iosApp/Podfile`.

Чтобы использовать - просто подключить `import MultiplatformLibrarySwift` в нужном файле   

***Этот вариант более предпочтителен к использованию, потому что***
- Меньше конфликтов с именами, файл доступен только там, где мы его подключили
- Лучше воспроизводимость - `buildPhase` на сборку Kotlin-кода всегда происходит при компиляции пода

### Напрямую
Если фреймворк общего кода подключен к iOS-проекту напрямую, то сгенерированные файлы подключить при помощи `cocoapods` не получится, потому что `pod MultiplatformLibrarySwift` внутри себя имеет зависимость от основного фреймворка - `MultiplatformLibrary`.  
Поэтому, единственным вариантом остается подключать сгенерированные файлы к проекту - добавить их вручную (находятся по пути `../shared/build/cocoapods/framework/sharedSwift/..`).

При самой первой сборке iOS проекта, без предварительной сборки Kotlin, Xcode будет ругаться, что у него нет сгенерированных файлов.

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
