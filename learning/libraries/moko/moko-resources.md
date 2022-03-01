---
sidebar_position: 2
---

# moko-resources

## Почему StringDesc не Parcelable 

StringDesc не может быть Parcelable так как у нас есть ResourceFormattedStringDesc

```kotlin
actual data class ResourceFormattedStringDesc actual constructor(
    val stringRes: StringResource,
    val args: List<Any>
) : StringDesc {
    override fun toString(context: Context): String {
        @Suppress("SpreadOperator")
        return Utils.resourcesForContext(context).getString(
            stringRes.resourceId,
            *Utils.processArgs(args, context)
        )
    }
}
```

Так как его аргументы типа Any, значит класс ResourceFormattedStringDesc не может быть parcelable, а значит и StringDesc не может быть Parcelable