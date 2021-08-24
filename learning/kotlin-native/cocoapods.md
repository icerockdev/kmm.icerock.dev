---
sidebar_position: 4
---

# CocoaPods integration

## [Официальная интеграция от JetBrains](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.native.cocoapods)

- [Документация](https://kotlinlang.org/docs/native-cocoapods.html#add-a-dependency-on-a-pod-library-from-the-cocoapods-repository)

### Особенности
- Создает задачу `podspec`, которая генерирует [Podspec](https://guides.cocoapods.org/syntax/podspec.html) файл для проекта и создает фрэймворк-заглушку, чтобы при выполнении `pod install` фрэймворк уже был и поды заинтегрировались
- Позволяет создавать только статический фреймворк
- Позволяет подлкючать поды внутрь Kotlin-кода, но только к проекту-фреймворку
- Позволяет автоматически скомпилировать различные архитектуры, в зависимости от текущей платформы 
- Библиотека интегрируется в Xcode проект единожды, во время установки pod-зависимостей

### Использование в проекте
- Запустить для фрэймворка сгенерированную задачу `podspec`
- Запустить `pod install` для проектов, использующих сгенерированный фреймворк

## [Плагин от IceRock](https://plugins.gradle.org/plugin/dev.icerock.mobile.multiplatform.cocoapods)

- [Документация](https://github.com/icerockdev/mobile-multiplatform-gradle-plugin#setup-cocoapods-interop)

### Особенности 
- Позволит создавать статический или динамический фреймворк
- Позволяет использовать зависимости от нативных cocoapods внутри отдельных градл модулей
- Позволяет автоматически скомпилировать различные архитектуры, в зависимости от текущей платформы 
- Библиотека интегрируется в Xcode проект единожды, во время установки pod-зависимостей
- [Podspec](https://guides.cocoapods.org/syntax/podspec.html) файл необходимо создавать вручную

### Использование в проекте
- Если в Kotlin коде есть зависимости от cocoapods: блок `cocoapods {...}`, то сначала запустить `pod install` в проекте, куда подключаются поды 
- В корневом проекте запустить `./gradlew syncMultiPlatformLibraryDebugFrameworkIosX64`
- В проекте, куда подключаются поды `pod install`
