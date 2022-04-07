---
sidebar_position: 1
---

# Шаблон для новых проектов

Все наши проекты имеют одинаковую структуру, во всех есть:
- `mpp-library` - модуль с общим для Android и iOS кодом
- `android-app` - Android-приложение 
- `ios-app` - iOS-приложение  

Чтобы для каждого нового проекта не создавать все это вручную, мы создали [проект-шаблон](https://gitlab.icerockdev.com/scl/boilerplate/mobile-moko-boilerplate), который содержит в себе стартовую архитектуру и требует лишь небольшой настройки.  
В данном разделе вы разберетесь со структурой всех наших проектов на примере проекта-шаблона.

## CI/CD
Каждый новый реквест в репозитории автоматически проверяется с помощью инструмента [CI/CD](https://docs.gitlab.com/ee/ci/): как бы вливается в ветку, куда направлен реквест и пытается выполнить различные таски, прописанные в файле `.gitlab-ci.yml`.
Вот как выглядит этот [файл](https://gitlab.icerockdev.com/scl/boilerplate/mobile-moko-boilerplate/-/blob/master/.gitlab-ci.yml) в `mobile-moko-boilerplate`.

Например, для всех `Android dev` сборок, для всех тегов, подходящих под маску `/^build/android/dev/[0-9]*$/` будут выполнены таски `:android-app:assembleDevRelease` и `:android-app:bundleDevRelease`:
```yaml
build android dev:
  extends: .build_android
  variables:
    ASSEMBLE_TASK: :android-app:assembleDevRelease :android-app:bundleDevRelease
    ARTIFACT_APK: android-app/build/outputs/apk/dev/release/android-app-dev-release.apk
    ARTIFACT_AAB: android-app/build/outputs/bundle/devRelease/android-app-dev-release.aab
  except:
    - branches
  only:
    - /^build/android/dev/[0-9]*$/
```

Блок `tests` - то, что сразу запустится для всех `pipelines`, перед полной сборкой проекта:
```yaml
tests:
  stage: check
  script:
    - (cd ios-app && pod install)
    - ./fastcheck.sh
    - cd ios-app
    - pod install
    - set -o pipefail && xcodebuild -scheme ${IOS_SCHEME_DEV} -workspace ios-app.xcworkspace -configuration dev-debug -sdk iphonesimulator -arch x86_64 build CODE_SIGNING_REQUIRED=NO CODE_SIGNING_ALLOWED=NO | xcpretty
  artifacts:
    when: always
    reports:
      junit: "**/test-results/**/TEST-*.xml"
  only:
    - merge_requests
  tags:
    - gradle
    - android
    - osx
    - xcode
```
Нас здесь интересует один скрипт - `fastcheck.sh`.  

Этот скрипт также [находится](https://gitlab.icerockdev.com/scl/boilerplate/mobile-moko-boilerplate/-/blob/master/fastcheck.sh) в `mobile-moko-boilerplate`, разберем таски, которые он вызывает, а также их порядок:
- `detektWithoutTests` - проверяет форматирование и кодстайл `Kotlin` кода, используя плагин [detekt](https://github.com/detekt/detekt), выполняется очень быстро
- `assembleDevDebug` и `testDevDebugUnitTest` - сборка `Android` приложения и запуск тестов. По результатам выполнения можем судить еще и о том, успешно ли собирается `common` код, поскольку на его основе работает `Android` приложение. В добавок, `Android` проект собирается быстрее, чем `iOS`
- `compileKotlinIosX64` и `iosX64Test` - сборка `iOS` приложения и запуск тестов. Если дошли до выполнения этой таски - значит `common` модуль собирается успешно, поэтому в случае ошибки искать ее будем именно в `iOS` проекте
- `syncMultiPlatformLibraryDebugFrameworkIosX64` - сборка `iOS` фреймворка

Выполнение скрипта занимает гораздо меньше времени, чем полная сборка проекта, которую `CI` будет выполнять далее, поэтому информацию об ошибках мы получим быстрее, чем получили бы без использования скрипта.

***Совет:*** проверяйте свои изменения в коде вызывая скрипт `./fastcheck.sh`.

## Практическое задание
- Изучите [статью](https://kmm.icerock.dev/onboarding/project-inside) об устройстве типового `KMM`-проекта на базе `mobile-moko-boilerplate`
- Разверните проект-шаблон по инструкции [IceRock KMM onboarding #1 - разворачивание проекта](https://codelabs.kmp.icerock.dev/codelabs/kmm-icerock-onboarding-1-ru/index.html)
