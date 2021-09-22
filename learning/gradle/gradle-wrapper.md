---
sidebar_position: 3
---

# Gradle Wrapper

[Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html) (или короче говоря, просто "Wrapper") - это специальный скрипт (а также несколько дополнительных файлов), который вызывает объявленную версию Gradle, при необходимости загружая ее заранее.
:::important
Рекомендуемый способ выполнения любой сборки Gradle - это с помощью Gradle Wrapper'а.
:::

## Содержимое

К его файлам относятся:

- `gradlew` и `gradlew.bat` - сами скрипты для запуска gradle через wrapper;
- `gradle/wrapper/gradle-wrapper.jar` - сам wrapper, небольшая java программа;
- `gradle/wrapper/gradle-wrapper.properties` - настройки gradle wrapper'а в которых указывается версия gradle для всего проекта.

## Запуск

Взаимодействие с Gradle Wrapper происходит при любой сборке gradle проекта. При запуске gradle задач через IDE автоматически происходит обращение к Gradle Wrapper, а когда работа идет через терминал - нужно вызывать `gradlew`/`gradlew.bat` (в зависимости от ОС).

На Windows:

```bash
gradlew.bat <props>
```

На Mac/Linux:
```bash
./gradlew <props>
```

Вся логика работы Gradle Wrapper'а заключается в следующем:

1. скрипт проверяет наличие JDK, если ее нет - выводит соответствующее понятное сообщение;
2. считывается конфигурация из `gradle-wrapper.properties`, а именно - `distributionUrl`, в котором определено какую версию gradle нам нужно скачать;
3. если данная версия gradle уже скачивалась, то она доступна в кешах в директории `~/.gradle` и будет использоваться. Иначе же Gradle Wrapper скачает gradle нужной версии и сохранит в указанную выше кеш директорию;
4. запускает gradle нужной версии, передавая ему все опции запуска которые были переданы в Gradle Wrapper.

Таким образом, несколько небольших файлов, лежащих в git репозитории, позволяют разработчику не вспоминать о необходимости скачать нужную для проекта версию gradle и использовать ее - автоматика все сделает сама.

:::info

Gradle Wrapper автоматически сохраняет скачиваемые версии gradle в кеш в `GRADLE_HOME` - `~/.gradle`. Поэтому данная директория со временем начинает раздуваться в размерах, так как на разных проектах может требоваться разная версия gradle, а также на проектах периодически производят обновление версии gradle. 

Удалять содержимое директории `~/.gradle`, при раздувшихся размерах, можно, но нужно понимать, что следующая сборка gradle потребует значительно больше времени, так как будет скачиваться нужная версия gradle, а также все зависимости, которые нужны проекту (кеш зависимостей также лежит в `GRADLE_HOME`).

:::

## Параметры


```bash
#   PROJECT_DIR/gradle/gradle-wrapper.properties

# определяет, следует ли хранить распакованный дистрибутив-оболочку в проекте 
# или в домашнем каталоге пользователя gradle.
distributionBase=GRADLE_USER_HOME

# путь, по которому распаковываются дистрибутивы gradle, необходимые для оболочки
# он указан относительно каталога distributionBase
distributionPath=wrapper/dists

# URL-адрес для загрузки дистрибутива gradle
distributionUrl=https\://services.gradle.org/distributions/gradle-7.2-bin.zip

# указание путей для распаковки
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```

Про обновление версий Gradle вы можете прочитать [тут](/learning/gradle/updating-versions#gradle).

## Материалы

- [Документация - Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html)
- [Документация - Wrapper API](https://docs.gradle.org/current/dsl/org.gradle.api.tasks.wrapper.Wrapper.html)