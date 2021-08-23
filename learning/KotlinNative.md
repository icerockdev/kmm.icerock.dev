---
sidebar_position: 4
---

# Kotlin Native

## Cocoapods

### [Официальная интеграция от JetBrains](https://kotlinlang.org/docs/native-cocoapods.html#add-a-dependency-on-a-pod-library-from-the-cocoapods-repository)

#### Использование

- generated gradle-task `podspec`
- `pod install`

### [Плагин от IceRock](https://github.com/icerockdev/mobile-multiplatform-gradle-plugin)

#### Использование
- Если есть зависисмости в Kotlin от cocoapods, то сначала вызвать `pod install`
- `./gradlew syncMultiPlatformLibraryDebugFrameworkIosX64`
- `pod install`
