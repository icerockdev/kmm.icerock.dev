---
sidebar_position: 2
---

# moko-resources

Библиотека [moko-resources](https://github.com/icerockdev/moko-resources) — это решение для доступа к ресурсам (строки, изображения, цвета, шрифты, файлы) из общего Kotlin Multiplatform кода. Поддерживает Android, iOS, macOS, JVM, JS/Wasm и Compose Multiplatform.

## Возможности

- **Строки и плюралы** с поддержкой локализации — общий код для всех платформ
- **StringDesc** — lifecycle-safe контейнер для строк, позволяющий отложить получение строки до момента, когда доступен platform context
- **Цвета** с поддержкой light/dark темы
- **Изображения** (SVG, PNG, JPG) с light/dark режимом
- **Шрифты** (TTF, OTF)
- **Файлы** (raw/assets) для Android
- **Compose Multiplatform** — все ресурсы доступны как `painterResource`, `stringResource`, `colorResource` и т.д.

## Подключение

```kotlin
// root build.gradle.kts
buildscript {
    dependencies {
        classpath("dev.icerock.moko:resources-generator:0.26.4")
    }
}
```

```kotlin
// shared/build.gradle.kts
plugins {
    kotlin("multiplatform")
    id("dev.icerock.mobile.multiplatform-resources")
}

dependencies {
    commonMainApi("dev.icerock.moko:resources:0.26.4")
    // для Compose Multiplatform:
    commonMainApi("dev.icerock.moko:resources-compose:0.26.4")
    commonTestImplementation("dev.icerock.moko:resources-test:0.26.4")
}

multiplatformResources {
    resourcesPackage.set("com.example.app") // обязательный package
    resourcesClassName.set("SharedRes")     // опционально, по умолчанию MR
    resourcesVisibility.set(MRVisibility.Internal)
}
```

## Использование

Вот несколько примеров, подробнее смотрите в [moko-resources](https://github.com/icerockdev/moko-resources)

### Строки (strings.xml)

```xml
<!-- base/strings.xml -->
<resources>
    <string name="hello">Hello</string>
    <string name="format">Test data %d</string>
    <string name="positional">second string %2$s first decimal %1$d</string>
</resources>
```

```kotlin
// commonMain — получение StringDesc
val hello: StringDesc = MR.strings.hello.desc()
val formatted: StringDesc = MR.strings.format.format(9)
val positional: StringDesc = MR.strings.positional.format(9, "str")
```

```kotlin
// Android — преобразование в String
val text: String = hello.toString(context = this)

// iOS
let text: String = hello.localized()
```

### Изображения

PNG/JPG имена файлов должны содержать суффикс плотности (`@1x`, `@2x`, `@3x`, `@4x`).

```kotlin
val image: ImageResource = MR.images.home_black_18
val vector: ImageResource = MR.images.car_black // SVG

// Android
imageView.setImageResource(image.drawableResId)

// iOS
imageView.image = image.toUIImage()

// Compose
Image(painter = painterResource(MR.images.car_black), contentDescription = null)
```

Поддержка Dark Mode: добавьте `-dark` к имени файла:

- `car.svg`
- `car-dark.svg`

### Файлы и ассеты

```kotlin
// Чтение текстового файла
val text: String = MR.files.test_txt.readText()         // common
val text: String = MR.files.test_txt.getText(context)   // Android

// Compose — реактивное чтение
val content: String? by MR.files.test_txt.readTextAsState()
```

## Compose Multiplatform

Если подключён модуль `resources-compose`, все ресурсы доступны напрямую в `commonMain`:

```kotlin
// Строки
Text(text = stringResource(MR.strings.hello_world))

// Плюралы
Text(text = pluralStringResource(MR.plurals.chars_count, counter, counter))

// Цвета
Text(color = colorResource(MR.colors.textColor), text = "Hello")

// Изображения
Image(painter = painterResource(MR.images.moko_logo), contentDescription = null)

// Шрифты
Text(fontFamily = fontFamilyResource(MR.fonts.cormorant_italic), text = "Hello")

// Файлы
val fileContent: String? by MR.files.some_file_txt.readTextAsState()
```

## Multi-module проекты

Если ресурсы лежат в отдельном модуле, плагин нужно применить и в модуле с ресурсами, и в модуле, который собирается в framework.

Для вложенного модуля можно задать кастомное имя класса:

```kotlin
multiplatformResources {
    resourcesPackage.set("com.example.nested")
    resourcesClassName.set("NestedMR")
}
```

---

## Почему StringDesc не Parcelable

StringDesc не может быть Parcelable, так как у нас есть ResourceFormattedStringDesc:

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

Так как его аргументы типа `Any`, класс `ResourceFormattedStringDesc` не может быть Parcelable, а значит и `StringDesc` не может быть Parcelable.
