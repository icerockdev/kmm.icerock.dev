# Kotlin/Native objects interop in memory

В [задачке на YouTrack](https://youtrack.jetbrains.com/issue/KT-59202) есть интересная информация про то, когда нативные объекты ObjC копируются для работы в Kotlin, а когда остаются оригинальными.

Кратко:

>For NSNumber, the object is copied, and the reference is not held.
>For NSString, the object is copied (with CFStringCreateCopy, which should return the same object if the string is immutable), and the reference is held.
>
>For all other cases, no copy is performed, and the Kotlin counterpart simply holds a reference to the Objective-C object.

Само копирование в коде можно посмотреть [тут](https://github.com/JetBrains/kotlin/blob/583aad23506ef235a6136cab5c540a4d620dd60f/kotlin-native/runtime/src/main/cpp/ObjCInteropUtils.mm#L57)
