# Падение Gradle daemon

Бывают ситуации, что при компиляции KMM проекта Gradle daemon неожиданно завершается (крешится). Причины такого поведения могут быть разные и их сложно разбирать, поэтому в данной статье описано как можно анализировать данную проблему на нескольких ситуациях, с которыми мы столкнулись в своей работе.

```
FAILURE: Build failed with an exception.
* What went wrong:
Gradle build daemon disappeared unexpectedly (it may have been killed or may have crashed)
```

## Ошибка из-за дублирования cinterop

В нашем случае причиной креша демона было дублирование cinterop классов одного и того же CocoaPod в двух разных модулях. Проявлялся креш только при компиляции iOS Arm64, а при компиляции X64 все было нормально (скорее всего из-за использования X64 таргетом статических кешей). Версия kotlin у нас на тот момент была 1.4.32.

Увидев ошибку с крешем в первую очередь нужно проанализировать лог, в нашем случае он был следующий:
```
> Task :buildSrc:compileKotlin UP-TO-DATE
> Task :buildSrc:compileJava NO-SOURCE
> Task :buildSrc:compileGroovy NO-SOURCE
> Task :buildSrc:pluginDescriptors UP-TO-DATE
> Task :buildSrc:processResources NO-SOURCE
> Task :buildSrc:classes UP-TO-DATE
> Task :buildSrc:inspectClassesForKotlinIC UP-TO-DATE
> Task :buildSrc:jar UP-TO-DATE
> Task :buildSrc:assemble UP-TO-DATE
> Task :buildSrc:compileTestKotlin NO-SOURCE
> Task :buildSrc:pluginUnderTestMetadata UP-TO-DATE
> Task :buildSrc:compileTestJava NO-SOURCE
> Task :buildSrc:compileTestGroovy NO-SOURCE
> Task :buildSrc:processTestResources NO-SOURCE
> Task :buildSrc:testClasses UP-TO-DATE
> Task :buildSrc:test NO-SOURCE
> Task :buildSrc:validatePlugins UP-TO-DATE
> Task :buildSrc:check UP-TO-DATE
> Task :buildSrc:build UP-TO-DATE

> Configure project :android-app
WARNING: API 'BaseVariant.getApplicationIdTextResource' is obsolete and has been replaced with 'VariantProperties.applicationId'.
It will be removed in version 5.0 of the Android Gradle plugin.
For more information, see TBD.
To determine what is calling BaseVariant.getApplicationIdTextResource, use -Pandroid.debug.obsoleteApi=true on the command line to display more information.

> Configure project :mpp-library
Kotlin Multiplatform Projects are an Alpha feature. See: https://kotlinlang.org/docs/reference/evolution/components-stability.html. To hide this message, add 'kotlin.mpp.stability.nowarn=true' to the Gradle properties.


The Kotlin source set androidAndroidTestRelease was configured but not added to any Kotlin compilation. You can add a source set to a target's compilation by connecting it with the compilation's default source set using 'dependsOn'.
See https://kotlinlang.org/docs/reference/building-mpp-with-gradle.html#connecting-source-sets

The Kotlin source set androidAndroidTestRelease was configured but not added to any Kotlin compilation. You can add a source set to a target's compilation by connecting it with the compilation's default source set using 'dependsOn'.
See https://kotlinlang.org/docs/reference/building-mpp-with-gradle.html#connecting-source-sets

The Kotlin source set androidAndroidTestRelease was configured but not added to any Kotlin compilation. You can add a source set to a target's compilation by connecting it with the compilation's default source set using 'dependsOn'.
See https://kotlinlang.org/docs/reference/building-mpp-with-gradle.html#connecting-source-sets

The Kotlin source set androidAndroidTestRelease was configured but not added to any Kotlin compilation. You can add a source set to a target's compilation by connecting it with the compilation's default source set using 'dependsOn'.
See https://kotlinlang.org/docs/reference/building-mpp-with-gradle.html#connecting-source-sets

The Kotlin source set androidAndroidTestRelease was configured but not added to any Kotlin compilation. You can add a source set to a target's compilation by connecting it with the compilation's default source set using 'dependsOn'.
See https://kotlinlang.org/docs/reference/building-mpp-with-gradle.html#connecting-source-sets

The Kotlin source set androidAndroidTestRelease was configured but not added to any Kotlin compilation. You can add a source set to a target's compilation by connecting it with the compilation's default source set using 'dependsOn'.
See https://kotlinlang.org/docs/reference/building-mpp-with-gradle.html#connecting-source-sets

The Kotlin source set androidAndroidTestRelease was configured but not added to any Kotlin compilation. You can add a source set to a target's compilation by connecting it with the compilation's default source set using 'dependsOn'.
See https://kotlinlang.org/docs/reference/building-mpp-with-gradle.html#connecting-source-sets

The Kotlin source set androidAndroidTestRelease was configured but not added to any Kotlin compilation. You can add a source set to a target's compilation by connecting it with the compilation's default source set using 'dependsOn'.
See https://kotlinlang.org/docs/reference/building-mpp-with-gradle.html#connecting-source-sets

The Kotlin source set androidAndroidTestRelease was configured but not added to any Kotlin compilation. You can add a source set to a target's compilation by connecting it with the compilation's default source set using 'dependsOn'.
See https://kotlinlang.org/docs/reference/building-mpp-with-gradle.html#connecting-source-sets

> Task :mpp-library:entities:news:compileKotlinIosArm64 UP-TO-DATE
> Task :mpp-library:extensions:errors:compileKotlinIosArm64 UP-TO-DATE
> Task :mpp-library:feature:categories:compileKotlinIosArm64 UP-TO-DATE
> Task :mpp-library:feature:navigation:compileKotlinIosArm64 UP-TO-DATE
> Task :mpp-library:extensions:date:generateMRcommonMain
> Task :mpp-library:generateCommonMainRssNewsDatabaseInterface UP-TO-DATE
> Task :mpp-library:generateMRcommonMain
> Task :mpp-library:extensions:date:generateMRiosArm64Main
> Task :mpp-library:extensions:date:compileKotlinIosArm64 UP-TO-DATE
> Task :mpp-library:feature:news:detail:compileKotlinIosArm64 UP-TO-DATE
> Task :mpp-library:generateMRiosArm64Main
> Task :mpp-library:feature:news:list:compileKotlinIosArm64 UP-TO-DATE
> Task :mpp-library:rssOpenApiGenerate UP-TO-DATE
> Task :mpp-library:openApiGenerate UP-TO-DATE

> Task :cocoapodBuildMCRCDynamicProxyIphoneosArm64
cocoapod build cmd: xcodebuild -project /Users/agusev/Desktop/projects/rss-mobile/ios-app/Pods/Pods.xcodeproj -scheme MCRCDynamicProxy -sdk iphoneos -arch arm64 -configuration debug -derivedDataPath /Users/agusev/Desktop/projects/rss-mobile/build/cocoapods/DerivedData SYMROOT=/Users/agusev/Desktop/projects/rss-mobile/build/cocoapods DEPLOYMENT_LOCATION=YES SKIP_INSTALL=YES build
xcodebuild result is 0

> Task :mpp-library:cinteropCocoapodMCRCDynamicProxyIosArm64 UP-TO-DATE
> Task :mpp-library:compileKotlinIosArm64 UP-TO-DATE
The message received from the daemon indicates that the daemon has disappeared.
Build request sent: Build{id=220705f5-f648-4381-ad7b-a15c4ef78760, currentDir=/Users/agusev/Desktop/projects/rss-mobile/ios-app/Pods}
Attempting to read last messages from the daemon log...
Daemon pid: 7739
  log file: /Users/agusev/.gradle/daemon/6.8.3/daemon-7739.out.log
----- Last  20 lines from daemon log file - daemon-7739.out.log -----

The Kotlin source set androidAndroidTestRelease was configured but not added to any Kotlin compilation. You can add a source set to a target's compilation by connecting it with the compilation's default source set using 'dependsOn'.
See https://kotlinlang.org/docs/reference/building-mpp-with-gradle.html#connecting-source-sets

The Kotlin source set androidAndroidTestRelease was configured but not added to any Kotlin compilation. You can add a source set to a target's compilation by connecting it with the compilation's default source set using 'dependsOn'.
See https://kotlinlang.org/docs/reference/building-mpp-with-gradle.html#connecting-source-sets

The Kotlin source set androidAndroidTestRelease was configured but not added to any Kotlin compilation. You can add a source set to a target's compilation by connecting it with the compilation's default source set using 'dependsOn'.
See https://kotlinlang.org/docs/reference/building-mpp-with-gradle.html#connecting-source-sets

The Kotlin source set androidAndroidTestRelease was configured but not added to any Kotlin compilation. You can add a source set to a target's compilation by connecting it with the compilation's default source set using 'dependsOn'.
See https://kotlinlang.org/docs/reference/building-mpp-with-gradle.html#connecting-source-sets

The Kotlin source set androidAndroidTestRelease was configured but not added to any Kotlin compilation. You can add a source set to a target's compilation by connecting it with the compilation's default source set using 'dependsOn'.
See https://kotlinlang.org/docs/reference/building-mpp-with-gradle.html#connecting-source-sets

The Kotlin source set androidAndroidTestRelease was configured but not added to any Kotlin compilation. You can add a source set to a target's compilation by connecting it with the compilation's default source set using 'dependsOn'.
See https://kotlinlang.org/docs/reference/building-mpp-with-gradle.html#connecting-source-sets
cocoapod build cmd: xcodebuild -project /Users/agusev/Desktop/projects/rss-mobile/ios-app/Pods/Pods.xcodeproj -scheme MCRCDynamicProxy -sdk iphoneos -arch arm64 -configuration debug -derivedDataPath /Users/agusev/Desktop/projects/rss-mobile/build/cocoapods/DerivedData SYMROOT=/Users/agusev/Desktop/projects/rss-mobile/build/cocoapods DEPLOYMENT_LOCATION=YES SKIP_INSTALL=YES build
xcodebuild result is 0
----- End of the daemon log -----


FAILURE: Build failed with an exception.

* What went wrong:
Gradle build daemon disappeared unexpectedly (it may have been killed or may have crashed)

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output. Run with --scan to get full insights.

* Get more help at https://help.gradle.org
> Task :mpp-library:linkMultiPlatformLibraryDebugFrameworkIosArm64
```

Данная версия лога ничего не объяснила, также как и при использовании опции `--stacktrace` (ведь демон крешится). Поэтому следующий шаг - выполнить компиляцию с опцией `-i` - в логе будет очень много сообщений, но главное что в логе будут и команды которые вызывает gradle при обращении к внешним приложениям (например к компилятору Kotlin/Native). В конце лога, почти перед тем как происходит креш, видно команду для `konan` (это название Kotlin/Native компилятора) - мы взяли ее из лога и привели к виду, который можно воткнуть в Terminal для запуска:
```
./konanc -g \
        -ea \
        -target \
        ios_arm64 \
        -p \
        framework \
        -o \
        /Users/alekseymikhailovwork/Documents/development/icerockdev_workspace/shared-code/mobile-moko-boilerplate/mpp-library/build/bin/iosArm64/MultiPlatformLibraryDebugFramework/MultiPlatformLibrary.framework \
        -l \
        /Users/alekseymikhailovwork/Documents/development/icerockdev_workspace/shared-code/mobile-moko-boilerplate/mpp-library/build/classes/kotlin/iosArm64/main/mpp-library-cinterop-cocoapodMCRCDynamicProxy.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/dev.icerock.moko/crash-reporting-napier-iosarm64/0.1.2/3de741de5fc9a7f4694423e76993deef5a426a42/crash-reporting-napier.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/dev.icerock.moko/resources-iosarm64/0.15.1/654c514520f1ff7d79414195cacf76cd8a962c62/resources.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/dev.icerock.moko/resources-iosarm64/0.15.1/5754914dd27a610d34a4e65fb477bf5294ca3a4f/resources-cinterop-pluralizedString.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/dev.icerock.moko/crash-reporting-crashlytics-iosarm64/0.1.2/6997dc644cc3384473fd31420322747c3092a4b0/crash-reporting-crashlytics.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/dev.icerock.moko/crash-reporting-crashlytics-iosarm64/0.1.2/35b39ec4f0b673d1da4390c609fd805110d7a90c/crash-reporting-crashlytics-cinterop-cocoapodMCRCDynamicProxy.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/com.russhwolf/multiplatform-settings-iosarm64/0.7.4/917cbf9ecbdb707ccb7f4ba4fba1c884bafda141/multiplatform-settings.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/com.github.aakira/napier-iosArm64/1.4.1/baf12bb9d36cf300e39426a38c73cce2653269e/napier.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/dev.icerock.moko/parcelize-iosarm64/0.6.1/31fbed757c9392d7880a63c5abb2cdffcdd9afa8/parcelize.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/dev.icerock.moko/network-iosarm64/0.15.0/ecea16e5bacc88f49660654e9947ec42d461c1e0/network.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/dev.icerock.moko/crash-reporting-core-iosarm64/0.1.2/5de5a6a8f342b1a2774cf6db73efa0e415102e44/crash-reporting-core.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/io.ktor/ktor-client-logging-iosarm64/1.5.4/c830e23bbc1e5b9e2714bc453e305d1fd6a99c12/ktor-client-logging.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/io.ktor/ktor-client-ios-iosarm64/1.5.2/860c771bb5bf5e77e57d8950575fc9eb58796f61/ktor-client-ios.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/io.ktor/ktor-client-core-iosarm64/1.5.4/feb1173fd0997a3584413a422917b7f5054596bc/ktor-client-core.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/io.ktor/ktor-http-cio-iosarm64/1.5.4/1963a6fdab8c840134285bb4e109e774cfd23c1c/ktor-http-cio.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/io.ktor/ktor-http-iosarm64/1.5.4/227009499283d57016888ce71364469b3f6108bd/ktor-http.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/io.ktor/ktor-utils-iosarm64/1.5.4/fdb0c146fa6ad57125359cde76d82732340d2d36/ktor-utils.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/io.ktor/ktor-utils-iosarm64/1.5.4/242f2777d94ad56132e3cddbf5d05342249fe98a/ktor-utils-cinterop-utils.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/io.ktor/ktor-io-iosarm64/1.5.4/3456cf7af7b7b011012b404edd9c62ec33aaa722/ktor-io.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/io.ktor/ktor-io-iosarm64/1.5.4/69a3761f924ea3ef7694380064a0cc9f25ca2ebb/ktor-io-cinterop-bits.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/io.ktor/ktor-io-iosarm64/1.5.4/8f37b096aef1bd2c66af2bb096cace44adad5b7e/ktor-io-cinterop-sockets.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/org.jetbrains.kotlinx/kotlinx-coroutines-core-iosarm64/1.4.3-native-mt/d8fde9d5efcfe2063aaa2009004e2873b383ec0/kotlinx-coroutines-core.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/org.jetbrains.kotlinx/kotlinx-serialization-json-iosarm64/1.1.0/7f27ef768a8cb5a64c178a8444b9916bc621c576/kotlinx-serialization-json.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/org.jetbrains.kotlinx/kotlinx-serialization-core-iosarm64/1.1.0/3222283d726f18136a87e60ced087928d05fadd6/kotlinx-serialization-core.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/dev.icerock.moko/graphics-iosarm64/0.6.1/66da5680ac0703dec84ed6d83ee35970e326847b/graphics.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/org.jetbrains.kotlinx/atomicfu-iosarm64/0.15.1/68c4f08dc991a6c7af50d38b505757ae1c957370/atomicfu.klib \
        -l \
        /Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/org.jetbrains.kotlinx/atomicfu-iosarm64/0.15.1/c227af55ec6bf76446ac1a25eeba08fa9356747c/atomicfu-cinterop-interop.klib \
        -Xembed-bitcode-marker \
        -linker-option \
        -F/Users/alekseymikhailovwork/Documents/development/icerockdev_workspace/shared-code/mobile-moko-boilerplate/build/cocoapods/UninstalledProducts/iphoneos \
        -Xexport-library=/Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/com.russhwolf/multiplatform-settings-iosarm64/0.7.4/917cbf9ecbdb707ccb7f4ba4fba1c884bafda141/multiplatform-settings.klib \
        -Xexport-library=/Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/com.github.aakira/napier-iosArm64/1.4.1/baf12bb9d36cf300e39426a38c73cce2653269e/napier.klib \
        -Xexport-library=/Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/dev.icerock.moko/parcelize-iosarm64/0.6.1/31fbed757c9392d7880a63c5abb2cdffcdd9afa8/parcelize.klib \
        -Xexport-library=/Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/dev.icerock.moko/resources-iosarm64/0.15.1/654c514520f1ff7d79414195cacf76cd8a962c62/resources.klib \
        -Xexport-library=/Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/dev.icerock.moko/resources-iosarm64/0.15.1/5754914dd27a610d34a4e65fb477bf5294ca3a4f/resources-cinterop-pluralizedString.klib \
        -Xexport-library=/Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/dev.icerock.moko/network-iosarm64/0.15.0/ecea16e5bacc88f49660654e9947ec42d461c1e0/network.klib \
        -Xexport-library=/Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/dev.icerock.moko/crash-reporting-core-iosarm64/0.1.2/5de5a6a8f342b1a2774cf6db73efa0e415102e44/crash-reporting-core.klib \
        -Xexport-library=/Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/dev.icerock.moko/crash-reporting-crashlytics-iosarm64/0.1.2/6997dc644cc3384473fd31420322747c3092a4b0/crash-reporting-crashlytics.klib \
        -Xexport-library=/Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/dev.icerock.moko/crash-reporting-crashlytics-iosarm64/0.1.2/35b39ec4f0b673d1da4390c609fd805110d7a90c/crash-reporting-crashlytics-cinterop-cocoapodMCRCDynamicProxy.klib \
        -Xexport-library=/Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/dev.icerock.moko/crash-reporting-napier-iosarm64/0.1.2/3de741de5fc9a7f4694423e76993deef5a426a42/crash-reporting-napier.klib \
        -Xmulti-platform \
        -no-endorsed-libs \
        -Xinclude=/Users/alekseymikhailovwork/Documents/development/icerockdev_workspace/shared-code/mobile-moko-boilerplate/mpp-library/build/classes/kotlin/iosArm64/main/mpp-library.klib \
        -verbose
```

Далее осталось перейти в терминале в директорию соответствующей версии Kotlin/Native, для нас это была директория `~/.konan/kotlin-native-prebuilt-macos-1.4.32/bin` и в этой директории запустить команду, которая была выше.

В результате мы получили вывод непосредственно от компилятора:
```
logging: using Kotlin home directory dist/kotlinc
WARNING: An illegal reflective access operation has occurred
WARNING: Illegal reflective access by com.intellij.util.ReflectionUtil (file:/Users/alekseymikhailovwork/.konan/kotlin-native-prebuilt-macos-1.4.32/konan/lib/kotlin-native.jar) to method java.util.ResourceBundle.setParent(java.util.ResourceBundle)
WARNING: Please consider reporting this to the maintainers of com.intellij.util.ReflectionUtil
WARNING: Use --illegal-access=warn to enable warnings of further illegal reflective access operations
WARNING: All illegal access operations will be denied in a future release
warning: linking module flags 'SDK Version': IDs have conflicting values ('[2 x i32] [i32 14, i32 2]' from /Users/alekseymikhailovwork/.konan/kotlin-native-prebuilt-macos-1.4.32/konan/targets/ios_arm64/native/objc.bc with '[2 x i32] [i32 14, i32 5]' from out)
warning: linking module flags 'SDK Version': IDs have conflicting values ('[2 x i32] [i32 14, i32 2]' from /Users/alekseymikhailovwork/.konan/kotlin-native-prebuilt-macos-1.4.32/konan/targets/ios_arm64/native/debug.bc with '[2 x i32] [i32 14, i32 5]' from out)
warning: linking module flags 'SDK Version': IDs have conflicting values ('[2 x i32] [i32 14, i32 2]' from /Users/alekseymikhailovwork/.konan/kotlin-native-prebuilt-macos-1.4.32/konan/targets/ios_arm64/native/strict.bc with '[2 x i32] [i32 14, i32 5]' from out)
warning: linking module flags 'SDK Version': IDs have conflicting values ('[2 x i32] [i32 14, i32 2]' from /Users/alekseymikhailovwork/.konan/kotlin-native-prebuilt-macos-1.4.32/konan/targets/ios_arm64/native/legacy_memory_manager.bc with '[2 x i32] [i32 14, i32 5]' from out)
warning: linking module flags 'SDK Version': IDs have conflicting values ('[2 x i32] [i32 14, i32 2]' from /Users/alekseymikhailovwork/.konan/kotlin-native-prebuilt-macos-1.4.32/konan/targets/ios_arm64/native/std_alloc.bc with '[2 x i32] [i32 14, i32 5]' from out)
warning: linking module flags 'SDK Version': IDs have conflicting values ('[2 x i32] [i32 14, i32 2]' from /Users/alekseymikhailovwork/.konan/kotlin-native-prebuilt-macos-1.4.32/klib/common/stdlib/default/targets/ios_arm64/native/runtime.bc with '[2 x i32] [i32 14, i32 5]' from out)
warning: linking module flags 'SDK Version': IDs have conflicting values ('[2 x i32] [i32 14, i32 2]' from /Users/alekseymikhailovwork/.konan/kotlin-native-prebuilt-macos-1.4.32/klib/platform/ios_arm64/org.jetbrains.kotlin.native.platform.posix/default/targets/ios_arm64/native/cstubs.bc with '[2 x i32] [i32 14, i32 5]' from out)
warning: linking module flags 'SDK Version': IDs have conflicting values ('[2 x i32] [i32 14, i32 2]' from /Users/alekseymikhailovwork/.konan/kotlin-native-prebuilt-macos-1.4.32/klib/platform/ios_arm64/org.jetbrains.kotlin.native.platform.darwin/default/targets/ios_arm64/native/cstubs.bc with '[2 x i32] [i32 14, i32 5]' from out)
warning: linking module flags 'SDK Version': IDs have conflicting values ('[2 x i32] [i32 14, i32 2]' from /Users/alekseymikhailovwork/.konan/kotlin-native-prebuilt-macos-1.4.32/klib/platform/ios_arm64/org.jetbrains.kotlin.native.platform.CoreFoundation/default/targets/ios_arm64/native/cstubs.bc with '[2 x i32] [i32 14, i32 5]' from out)
warning: linking module flags 'SDK Version': IDs have conflicting values ('[2 x i32] [i32 14, i32 2]' from /Users/alekseymikhailovwork/.konan/kotlin-native-prebuilt-macos-1.4.32/klib/platform/ios_arm64/org.jetbrains.kotlin.native.platform.Security/default/targets/ios_arm64/native/cstubs.bc with '[2 x i32] [i32 14, i32 5]' from out)
warning: linking module flags 'SDK Version': IDs have conflicting values ('[2 x i32] [i32 14, i32 2]' from /Users/alekseymikhailovwork/.konan/kotlin-native-prebuilt-macos-1.4.32/klib/platform/ios_arm64/org.jetbrains.kotlin.native.platform.Foundation/default/targets/ios_arm64/native/cstubs.bc with '[2 x i32] [i32 14, i32 5]' from out)
warning: linking module flags 'SDK Version': IDs have conflicting values ('[2 x i32] [i32 14, i32 4]' from /var/folders/c6/fcjx052j7jx6dn5jdygs4_h00000gp/T/native9202777821859166164/cstubs.bc with '[2 x i32] [i32 14, i32 5]' from out)
warning: linking module flags 'SDK Version': IDs have conflicting values ('[2 x i32] [i32 14, i32 2]' from /Users/alekseymikhailovwork/.konan/kotlin-native-prebuilt-macos-1.4.32/klib/platform/ios_arm64/org.jetbrains.kotlin.native.platform.CoreGraphics/default/targets/ios_arm64/native/cstubs.bc with '[2 x i32] [i32 14, i32 5]' from out)
warning: linking module flags 'SDK Version': IDs have conflicting values ('[2 x i32] [i32 14, i32 2]' from /Users/alekseymikhailovwork/.konan/kotlin-native-prebuilt-macos-1.4.32/klib/platform/ios_arm64/org.jetbrains.kotlin.native.platform.CoreText/default/targets/ios_arm64/native/cstubs.bc with '[2 x i32] [i32 14, i32 5]' from out)
warning: linking module flags 'SDK Version': IDs have conflicting values ('[2 x i32] [i32 14, i32 2]' from /Users/alekseymikhailovwork/.konan/kotlin-native-prebuilt-macos-1.4.32/klib/platform/ios_arm64/org.jetbrains.kotlin.native.platform.UIKit/default/targets/ios_arm64/native/cstubs.bc with '[2 x i32] [i32 14, i32 5]' from out)
error: Linking globals named 'kniprot_cocoapods_MCRCDynamicProxy0': symbol multiply defined!
```

В данном логе видно всего одну ошибку
```
error: Linking globals named 'kniprot_cocoapods_MCRCDynamicProxy0': symbol multiply defined!
```

Для дальнейшего анализа проблемы пришлось попросить JetBrains о помощи, и они помогли - по вызываемой команде отметили что у нас есть дублирование cinterop библиотеки:
```
/Users/alekseymikhailovwork/Documents/development/icerockdev_workspace/shared-code/mobile-moko-boilerplate/mpp-library/build/classes/kotlin/iosArm64/main/mpp-library-cinterop-cocoapodMCRCDynamicProxy.klib
/Users/alekseymikhailovwork/.gradle/caches/modules-2/files-2.1/dev.icerock.moko/crash-reporting-crashlytics-iosarm64/0.1.2/35b39ec4f0b673d1da4390c609fd805110d7a90c/crash-reporting-crashlytics-cinterop-cocoapodMCRCDynamicProxy.klib
```

После чего проблема была найдена и исправлена (отключена лишняя генерация cinterop определения) - https://gitlab.icerockdev.com/scl/boilerplate/mobile-moko-boilerplate/-/commit/f3957511213a2dd49aadb2c86dd7caecd5170fe3

## Ошибка из-за разных версий библиотеки

```
e: Could not find "dev.icerock.moko:parcelize_iosMain" in [/Users/alekseymikhailovwork/Documents/development/icerockdev_workspace/mailru-platform/di-mobile, /Users/alekseymikhailovwork/.konan/klib, /Users/alekseymikhailovwork/.konan/kotlin-native-prebuilt-macos-1.4.31/klib/common, /Users/alekseymikhailovwork/.konan/kotlin-native-prebuilt-macos-1.4.31/klib/platform/ios_arm64].
Daemon vm is shutting down... The daemon has exited normally or was terminated in response to a user interrupt.
```

Коротко причина проблемы оказалась в разных версиях используемой библиотеки (две зависимости подключали транзитивно одну и ту же библиотеку, но разных версий). Но в типовом случае когда используются разные версии одной и той же библиотеки gradle берет самую новую и никакого креша gradle daemon не происходит. 

У нас же оказалось что одна зависимость цепляла новую версию moko-parcelize, где есть поддержка всех таргетов и промежуточный сорссет nonAndroidMain, вместо iosMain и подобных. А другая зависимость цепляла старую версию, где только мобилки и промежуточный сорссет там был iosMain. 
Видимо в разных местах градл использует разные версии - в одном он понял что нужна новая, в другом решил что нужна старая и искал iosMain которого нету в новой....и в итоге происходил креш gradle daemon.

Решилась проблема путем обновления библиотек, чтобы все библиотеки использовали одинаковую новую версию moko-parcelize, в которой есть nonAndroidMain.
