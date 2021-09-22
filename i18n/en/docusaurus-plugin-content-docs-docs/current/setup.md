---
sidebar_position: 2
---

# Настройка окружения

[Скачать](https://kotlinlang.org/lp/mobile/ecosystem/) Android Studio, Xcode и плагин Kotlin Multiplatform Mobile

## Установить JDK

Используя [Homebrew](https://brew.sh/) - самый простой способ, без регистраций всяких

```
brew tap adoptopenjdk/openjdk && brew cask install adoptopenjdk8
```

НО!  
есть вероятность что в Android Studio будет ломаться синтаксический анализ и часть кода станет красной, хотя все будет корректно компилироваться.
В таком случае нужно [установить Oracle JDK](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) (на момент написания статьи корректная работа компилятора подтверждена на версиях JDK по 11ую включительно, не старше)

## Установить Android Studio

Скачиваем с [оффсайта](https://developer.android.com/studio) и при запуске устанавливаем android sdk. 

## Установить Xcode

Скачиваем с AppStore.

Делаем установку command line tools
```
xcode-select --install
```

В настройках Xcode должны они появиться (последний пункт)

![setup xcode cli](/assets/2-setup-xcode-cli.png)

Детальное [описание настройки окружения от Touchlab](https://github.com/touchlab/KaMPKit/blob/master/docs/DETAILED_DEV_SETUP.md)
