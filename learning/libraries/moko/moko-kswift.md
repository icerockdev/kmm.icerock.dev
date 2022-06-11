---
sidebar_position: 10
---

# moko-kswift

## moko-kswift

[moko-kswift](https://github.com/icerockdev/moko-kswift) - этот плагин, позволяет автоматически генерировать Swift-friendly API из общего кода:
- `enum`-ы, соответствующие `sealed-interface`-ам из общего кода, чтобы работать их в `switch` без ветки `default`
- `extensions`, объявленные в общем коде

Детали подключения плагина вы можете узнать из его [README](https://github.com/icerockdev/moko-kswift#readme) и [стати](https://medium.com/icerock/how-to-implement-swift-friendly-api-with-kotlin-multiplatform-mobile-e68521a63b6d).

## Детали подключения
после подключения плагина и сборки проекта необходимо просто добавить сгенерированные файлы (находятся по пути `../shared/build/cocoapods/framework/sharedSwift/..`) в iOS проект.

## mvvm-livedata, mvvm-flow и moko-kswift в одном проекте 
