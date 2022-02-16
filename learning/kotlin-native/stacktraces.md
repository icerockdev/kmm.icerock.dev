---
sidebar_position: 6
---

# Stacktrace

При возникновении критической ошибки в kotlin коде в лог будет выброшен stacktrace исключения (exception).
Например:
```
Function doesn't have or inherit @Throws annotation and thus exception isn't propagated from Kotlin to Objective-C/Swift as NSError.
It is considered unexpected and unhandled instead. Program will be terminated.
Uncaught Kotlin exception: kotlin.NullPointerException
    at 0   MultiPlatformLibrary                0x00000001063132f3 kfun:kotlin.Throwable#<init>(){} + 67 (/Users/teamcity1/teamcity_work/11ac87a349af04d5/runtime/src/main/kotlin/kotlin/Throwable.kt:27:21)
    at 1   MultiPlatformLibrary                0x000000010630b7dc kfun:kotlin.Exception#<init>(){} + 60 (/Users/teamcity1/teamcity_work/11ac87a349af04d5/runtime/src/main/kotlin/kotlin/Exceptions.kt:21:28)
    at 2   MultiPlatformLibrary                0x000000010630ba4c kfun:kotlin.RuntimeException#<init>(){} + 60 (/Users/teamcity1/teamcity_work/11ac87a349af04d5/runtime/src/main/kotlin/kotlin/Exceptions.kt:32:28)
    at 3   MultiPlatformLibrary                0x000000010630bcbc kfun:kotlin.NullPointerException#<init>(){} + 60 (/Users/teamcity1/teamcity_work/11ac87a349af04d5/runtime/src/main/kotlin/kotlin/Exceptions.kt:43:28)
    at 4   MultiPlatformLibrary                0x000000010636714c ThrowNullPointerException + 124 (/Users/teamcity1/teamcity_work/11ac87a349af04d5/runtime/src/main/kotlin/kotlin/native/internal/RuntimeUtils.kt:13:11)
    at 5   MultiPlatformLibrary                0x00000001059a4d1e kfun:dev.icerock.library.feature.information.presentation.InformationFilterViewModel.<init>$lambda-2#internal + 382 (/Developer/app-mobile/mpp-library/feature/information/src/commonMain/kotlin/ru/app/library/feature/information/presentation/InformationFilterViewModel.kt:36:86)
    at 6   MultiPlatformLibrary                0x00000001059a5bb5 kfun:dev.icerock.library.feature.information.presentation.InformationFilterViewModel.$<init>$lambda-2$FUNCTION_REFERENCE$435.invoke#internal + 181 (/Developer/app-mobile/mpp-library/feature/information/src/commonMain/kotlin/ru/app/library/feature/information/presentation/InformationFilterViewModel.kt:36:62)
    at 7   MultiPlatformLibrary                0x000000010659c5b8 kfun:dev.icerock.moko.mvvm.livedata#map@dev.icerock.moko.mvvm.livedata.LiveData<0:0>(kotlin.Function1<0:0,0:1>){0§<kotlin.Any?>;1§<kotlin.Any?>}dev.icerock.moko.mvvm.livedata.LiveData<0:1> + 424 (/Users/runner/work/moko-mvvm/moko-mvvm/mvvm-livedata/src/commonMain/kotlin/dev/icerock/moko/mvvm/livedata/LiveDataTransforms.kt:8:43)
    at 8   MultiPlatformLibrary                0x00000001059a3767 kfun:dev.icerock.library.feature.information.presentation.InformationFilterViewModel#<init>(dev.icerock.moko.mvvm.dispatcher.EventsDispatcher<dev.icerock.library.feature.information.presentation.InformationFilterViewModel.EventsListener>;dev.icerock.components.filter.FilterViewModel.FilterRepository;dev.icerock.library.feature.information.di.Strings){} + 3047 (/Developer/app-mobile/mpp-library/feature/information/src/commonMain/kotlin/ru/app/library/feature/information/presentation/InformationFilterViewModel.kt:36:58)
    at 9   MultiPlatformLibrary                0x000000010599b8fd kfun:dev.icerock.library.feature.information.di.InformationFactory#createInformationFilterViewModel(dev.icerock.moko.mvvm.dispatcher.EventsDispatcher<dev.icerock.library.feature.information.presentation.InformationFilterViewModel.EventsListener>){}dev.icerock.library.feature.information.presentation.InformationFilterViewModel + 493 (/Developer/app-mobile/mpp-library/feature/information/src/commonMain/kotlin/ru/app/library/feature/information/di/InformationFactory.kt:87:37)
    at 10  MultiPlatformLibrary                0x0000000105cfc865 objc2kotlin.1086 + 277 (/<compiler-generated>:1:0)
    at 11  mokoApp                             0x00000001045f2af8 $s7mokoApp22InformationCoordinatorC14routeToFiltersyyFTo + 24
    at 12  MultiPlatformLibrary                0x0000000105cf8e3f objc2kotlin.1031 + 911
    at 13  MultiPlatformLibrary                0x00000001059ab9f8 kfun:dev.icerock.library.feature.information.presentation.InformationViewModel.$onFilterTap$lambda-2$FUNCTION_REFERENCE$442.invoke#internal + 72 (/Developer/app-mobile/mpp-library/feature/information/src/commonMain/kotlin/ru/app/library/feature/information/presentation/InformationViewModel.kt:66:40)
    at 14  MultiPlatformLibrary                0x00000001059aba71 kfun:dev.icerock.library.feature.information.presentation.InformationViewModel.$onFilterTap$lambda-2$FUNCTION_REFERENCE$442.$<bridge-UNNN>invoke(-1:0){}#internal + 97 (/Developer/app-mobile/mpp-library/feature/information/src/commonMain/kotlin/ru/app/library/feature/information/presentation/InformationViewModel.kt:66:40)
    at 15  MultiPlatformLibrary                0x0000000106588939 kfun:dev.icerock.moko.mvvm.dispatcher.EventsDispatcher.dispatchEvent$lambda-0#internal + 233 (/Users/runner/work/moko-mvvm/moko-mvvm/mvvm-core/src/iosMain/kotlin/dev/icerock/moko/mvvm/dispatcher/EventsDispatcher.kt:48:13)
    at 16  MultiPlatformLibrary                0x0000000106588ae4 kfun:dev.icerock.moko.mvvm.dispatcher.EventsDispatcher.$dispatchEvent$lambda-0$FUNCTION_REFERENCE$0.invoke#internal + 68 (/Users/runner/work/moko-mvvm/moko-mvvm/mvvm-core/src/iosMain/kotlin/dev/icerock/moko/mvvm/dispatcher/EventsDispatcher.kt:47:31)
    at 17  MultiPlatformLibrary                0x0000000106588b40 kfun:dev.icerock.moko.mvvm.dispatcher.EventsDispatcher.$dispatchEvent$lambda-0$FUNCTION_REFERENCE$0.$<bridge-UNN>invoke(){}#internal + 64 (/Users/runner/work/moko-mvvm/moko-mvvm/mvvm-core/src/iosMain/kotlin/dev/icerock/moko/mvvm/dispatcher/EventsDispatcher.kt:47:31)
    at 18  MultiPlatformLibrary                0x0000000106588c29 _6465762e696365726f636b2e6d6f6b6f3a6d76766d2d636f7265_knbridge4 + 185 (/Users/runner/work/moko-mvvm/moko-mvvm/mvvm-core/src/iosMain/kotlin/dev/icerock/moko/mvvm/dispatcher/EventsDispatcher.kt:47:31)
    at 19  libdispatch.dylib                   0x000000010aa2b7ec _dispatch_call_block_and_release + 12
    at 20  libdispatch.dylib                   0x000000010aa2c9c8 _dispatch_client_callout + 8
    at 21  libdispatch.dylib                   0x000000010aa3ae75 _dispatch_main_queue_callback_4CF + 1152
    at 22  CoreFoundation                      0x00007fff2038fdbb __CFRUNLOOP_IS_SERVICING_THE_MAIN_DISPATCH_QUEUE__ + 9
    at 23  CoreFoundation                      0x00007fff2038a63e __CFRunLoopRun + 2685
    at 24  CoreFoundation                      0x00007fff203896d6 CFRunLoopRunSpecific + 567
    at 25  GraphicsServices                    0x00007fff2c257db3 GSEventRunModal + 139
    at 26  UIKitCore                           0x00007fff24696cf7 -[UIApplication _run] + 912
    at 27  UIKitCore                           0x00007fff2469bba8 UIApplicationMain + 101
    at 28  mokoApp                             0x00000001045bf758 main + 56 (/Developer/app-mobile/ios-app/src/AppDelegate.swift:<unknown>)
    at 29  libdyld.dylib                       0x00007fff2025a3e9 start + 1
CoreSimulator 732.18.6 - Device: iPhone 12 mini (D5DBD7AE-E94F-4FAE-9B07-C00C4B32F504) - Runtime: iOS 14.4 (18D46) - DeviceType: iPhone 12 mini
```

В stacktrace доступно несколько важных вещей:
1. `Uncaught Kotlin exception: kotlin.NullPointerException` - какая ошибка произошла. Здесь мы видим что не был обработан (не отловлен try catch блоком) эксепшен `kotlin.NullPointerException`. Он означает что там, где не должно быть null, при работе приложения оказался null.
2. В стектрейсе на 4 позиции находится `ThrowNullPointerException` - это автоматическая проверка, которую компилятор ставит во все места чтения переменных, которые помечены как не нуллабл. Именно в этом методе происходит проверка в рантайме является ли указатель null или же там объект. В случае если там null - происходит выброс исключения `kotlin.NullPointerException`.
3. Все что выше `ThrowNullPointerException` - конструкторы всей иерархии классов exception'ов (выбрасывается `kotlin.NullPointerException`, а значит создается объект этого класса и вызываются все конструкторы суперклассов).
4. Прямо под `ThrowNullPointerException` находится место, где в действительности произошла ошибка - именно туда нужно идти и исправлять. Там же указан и файл и строка - `InformationFilterViewModel.kt:36`

В данном кейсе по этой строке находился код:
```
val categoryField: LiveData<FilterField> = fieldsMap.map { it[CATEGORY_FIELD_KEY]!! }
```

В данном коде используется force-cast (`!!`) - то есть разработчик намеренно указывал компилятору что тут точно не будет null. Но при выполнении программы в данном объекте по этому ключу оказался все таки null и произошел вылет.
