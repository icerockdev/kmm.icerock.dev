# ObjectiveC interop annotations

В [kotlinlang.slack.com](https://kotlinlang.slack.com/archives/C3SGXARS6/p1627430386468200) Кевин Галлиган описал свой опыт работы с аннотациями ObjC интеропа.

> Curious about "encoding" in `@ObjCMethod` annotation. We've been doing some experiments with cinterop and can successfully link and call to objc methods. As a concrete example, on iOS the objc class for Crashlytics is `FIRCrashlytics`. We only care about getting the global instance and logging a string, so after seeing what cinterop does, we just made this Kotlin class. It'll successfully link to the objc, and calls the methods as we expect.

```kotlin
@ExternalObjCClass
open class FIRCrashlytics : NSObject() {
    @ExternalObjCClass
    companion object : NSObjectMeta(), ObjCClassOf<FIRCrashlytics> {
        @ObjCMethod("crashlytics", "@16@0:8")
        external fun crashlytics(): FIRCrashlytics
    }

    @ObjCMethod(selector = "log:", encoding = "v24@0:8@16")
    open external fun log(msg: String)
}
```

> The encoding is a little cryptic, but you can find some references that describe it. We just copied directly from what cinterop generates. However, the encoding will be different depending on if the platform is 32 or 64 bit, with the numbers in the encoding differing by a factor of 2. If I just change the encodings to nonsense values, the calls still work, as (I'm told) if they're empty strings. Before we go on a crazy deep dive, I'm just wondering if the value has any impact in the way we're using it?

Приведенный пример описывает возможность написать вручную только тот код, который действительно
нужен в Kotlin части, для взаимодействия с нативной ObjectiveC библиотекой. Это альтернатива
настройке cInterop интеграции, не требуется вызывать прогон cInterop инструмента. Но важно не
забывать указывать линковку с самим бинарником, так как для компиляции данного кода потребуется
линковка с самим бинарником. 
