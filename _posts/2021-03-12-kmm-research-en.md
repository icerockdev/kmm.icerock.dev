---
title: An in-depth look at Kotlin Multiplatform Mobile
author: Aleksey Mikhailov
date: 2021-03-12
category: Learning
layout: post
---

# Immersion in KMM
1. Read more about the technology at <https://kotlinlang.org/lp/mobile/> - all of the information there is contained in brief theses about what the essence of the technology is like
2. [Download] (https://kotlinlang.org/lp/mobile/ecosystem/) Android Studio, Xcode and Kotlin Multiplatform Mobile plugin - [Setting up environment for development with KMM] (https://confluence.icerockdev.com/ pages / viewpage.action? pageId = 78131864)
3. Hello World
    1. Create a project in Android Studio KMM from scratch through the project creation wizard - <https://kotlinlang.org/docs/mobile/create-first-app.html>
    2. Run this application on android, put breakpoints in the common code and see what is displayed when triggered
    3. Run this application on iOS (from Android Studio), put breakpoints in the common code, see what is displayed when it is triggered, then understand the difference with android
    4. Understand what is specified in build.gradle - what is called from where, what constructs are used and what for. The documentation will help - <https://kotlinlang.org/docs/reference/mpp-dsl-reference.html>
    5. Run the iOS application from Xcode, learn how to set breakpoints in kotlin code [using xcode-kotlin] (https://github.com/touchlab/xcode-kotlin), <https://medium.com/hackernoon/kotlin-xcode -plugin-64f52ff8dc2a>. Add the Kotlin source directory to the Xcode project using the folder reference (so that it is a blue folder and just reflects the entire file structure in xcode)
4. Dig further into source sets
    1. Configure iosMain via project hierarchical setup <https://kotlinlang.org/docs/reference/mpp-share-on-platforms.html#share-code-on-similar-platforms>
    2. Try setting up each variant of the sortssets from the article <https://habr.com/ru/post/536480/>
    3. Configure the hierarchy of sortssets described below and enable the commonizer, see what the IDE can see at each of the levels
        1. commonMain
            1. androidMain
            2.appleMain
                1.iosMain
                    1.iosArm64Main
                    2.iosX64Main
                2.macosX64Main
5. Working with platform api
    1. Look through the article <https://kotlinlang.org/docs/mobile/connect-to-platform-specific-apis.html>
        1. Implement the examples from the article in your Hello World project
    2. Make the expect / actual functions yourself to generate Base64 from string and from image

6. CocoaPods
    1. Change the project’s settings so that integration with the Xcode project is through cocoapods, without custom targets and modifications to the xcode project itself.
        1. <https://kotlinlang.org/docs/reference/native/cocoapods.html>
    2. Configure alternative integration via <https://github.com/icerockdev/mobile-multiplatform-gradle-plugin> in a separate branch (to further compare these two approaches)
        1. Example - moko-template
        2. Article (not yet published) - <https://docs.google.com/document/d/1rV_0Bh5hd1BxvwKFYDtEbcJvZgcTOScSZbE58mpNOYE/edit#heading=h.a9ha2i5rx7cj>
    3. And another alternative via <https://github.com/touchlab/KotlinCocoapods> for comparison
    4. Add CocoaPod AFNetworking using both plugins
    5. Move the work with AFNetworking into a separate gradle module so that it is shared (this module itself is compiled in the framework, but does not use it inside AFNetworking) → network (here AFNetworking)

# MOKO

1. As a start, read <http://moko.icerock.dev/> and the readme of all the specified libs there
2. Watch <https://www.youtube.com/watch?v=-JjQJG-xkRE&feature=youtu.be>

# Kotlin vs Swift

1. Kotlin has anonymous classes that allow the implementation of an interface without creating a separate named class, for example. <https://kotlinlang.org/docs/nested-classes.html#anonymous-inner-classes>
    1.anonymous classes come from Java and are analyzed in more detail in the context of Java - <https://javarush.ru/groups/posts/2193-anonimnihe-klassih>
2. Comparison of languages by examples
    1. <https://habr.com/ru/post/350746/>
    2. <https://www.raywenderlich.com/6754-a-comparison-of-swift-and-kotlin-languages>
    3. <https://levelup.gitconnected.com/swift-vs-kotlin-which-is-better-696222a49a34>
    4. <https://medium.com/@anios4991/swift-vs-kotlin-the-differences-that-matter-80a46090d9c6>
3. The difference between class constructors - <https://medium.com/mobile-app-development-publication/kotlin-vs-swift-the-init-construction-f82224a24664>
4. The difference between extensions - <https://medium.com/mobile-app-development-publication/kotlin-vs-swift-the-extension-5462b531260b>
5. Abstract classes - https://medium.com/mobile-app-development-publication/kotlin-vs-swift-the-abstract-class-f8817e5e54f

# Kotlin Multiplatform

1.  expect/actual - <https://kotlinlang.org/docs/mpp-connect-to-apis.html>
    1.  <https://kotlinlang.org/docs/mobile/connect-to-platform-specific-apis.html>
    2.  <https://youtu.be/5QPPZV04-50> - запись с Kotlin 1.4 online event про мпп детали

# Kotlin / Native

General description of "what it is" - <https://kotlinlang.org/docs/native-overview.html>

Igotti's speech on the K / N internals - <https://youtu.be/DqsYo_4QWSg>

# runtime

1. Interop Kotlin and ObjectiveC - <https://kotlinlang.org/docs/native-objc-interop.html> here is all the important information about the junction of the iOS world and Kotlin. A very important section for a good understanding of which code from common will be seen in the ios native world from swift
2. Immutability of objects in a multithreaded environment - <https://kotlinlang.org/docs/native-immutability.html> this is an important aspect of K / N at the moment that greatly affects the overall code if the project uses multithreading. The link shows the idea behind the memory management of the K / N runtime.
3. Garbage collector
    1. Brief descriptions about it can be found here - <https://kotlinlang.org/docs/native-faq.html#what-is-kotlin-native-memory-management-model>
    2. Its revision is declared - <https://blog.jetbrains.com/kotlin/2020/07/kotlin-native-memory-management-roadmap/>
    3. <https://youtu.be/f-e-SdAugOs> - Igotti's talk about the assembler
    4. <https://kotlinlang.org/docs/apple-framework.html#garbage-collection-and-reference-counting> - about the collector in Kotlin on Ayos. short.
    5. <https://discuss.kotlinlang.org/t/kotlin-native-1-3-50-relaxed-mode/13586> - a little about the relaxed K / N memory mode, but the new garbage collector is not based on it, it's just an alternative option about which little is known and I'm not even sure that this mode was completed to the end.
4. Multithreading - <https://kotlinlang.org/docs/native-concurrency.html> the topic closely related to the paragraph about immutability is multithreading. The features provided and how to use them.
    1. <https://www.youtube.com/watch?v=nw6YTfEyfO0> - Igotti's speech on how multithreading and immutability works in K / N
    2. <https://www.youtube.com/watch?v=oxQ6e1VeH4M> - Galligan's speech with chewing on the thread of multithreading
    3. <https://dev.to/touchlab/practical-kotlin-native-concurrency-ac7> - three articles from Galligan with a good understanding of the topic
    4. <https://kotlinlang.org/docs/mobile/concurrent-mutability.html> - section Working with concurrency in the KMM documentation also with a good breakdown from Galligan
    5. Witch hack <https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker-bound-reference/> which allows you to fumble anything without freezing.
    6.Touchlab multithreading guide + video - <https://touchlab.co/kotlin-native-concurrency/>
5. K / N Debugging - <https://kotlinlang.org/docs/native-debugging.html> 

1. For clarity’s sake, there is <https://github.com/touchlab/xcode-kotlin>
    2. Also allows debugging <https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile>
    3. And AppCode - <https://blog.jetbrains.com/kotlin/2019/04/kotlinnative-support-for-appcode-2019-1/>
6. Coroutines - <https://github.com/Kotlin/kotlinx.coroutines/blob/native-mt/kotlin-native-sharing.md> about the native-mt branch and limitations of coroutines due to immutability

# compilation

1. About Gradle plugin K / N - <https://github.com/JetBrains/kotlin-native/blob/master/GRADLE_PLUGIN.md>
2. Detailed reference of gradle plugin - <https://kotlinlang.org/docs/mpp-dsl-reference.html>
3. About the assembly of the final K / N binaries - <https://kotlinlang.org/docs/mpp-build-native-binaries.html> for ios, the framework binar and export of dependencies, as well as universal frameworks are important (but we do not use them)
4. Flexible compilation settings, details about cinterop - <https://kotlinlang.org/docs/mpp-configure-compilations.html>
5. <https://youtu.be/5QPPZV04-50> - recording from Kotlin 1.4 online event about MPP details
6. Integration via cocoapods (official plugin) - <https://kotlinlang.org/docs/native-cocoapods.html>
7. Debugging symbols for meaningful crash reports - <https://kotlinlang.org/docs/native-ios-symbolication.html>
8. About the internal klibs and K / N libs - <https://kotlinlang.org/docs/native-libraries.html>
9. About the size of the binary on iOS - <https://youtu.be/hrRqX7NYg3Q?t=1895>
10. Some compilation hacks - <https://github.com/JetBrains/kotlin-native/blob/master/HACKING.md> (very specific story)
11. Tips to speed up compilation from lead K / N - <https://youtrack.jetbrains.com/issue/KT-42294#focus=Comments-27-4752249.0-0>
    1. Gradle-specific:

        -   Note that first compilation with Gradle usually takes more time than subsequent ones, sometimes significantly (e.g. due to dependencies downloading and missing caches).
        -   Don't use `--no-daemon` when running Gradle, at least for local development.
        -   Try [increasing Gradle's heap](https://docs.gradle.org/current/userguide/build_environment.html#sec:configuring_jvm_memory), e.g. by adding `org.gradle.jvmargs=-Xmx3g` to `gradle.properties`. If you use parallel build, you might need to make the heap even larger or choose the right number of threads with `org.gradle.parallel.threads`.
        -   If you have `kotlin.native.disableCompilerDaemon=true` or `kotlin.native.cacheKind=none` project properties (in `gradle.properties` or Gradle arguments), try to remove them. It is possible that one of these properties was used to workaround a bug that is already fixed.
        -   (Starting from 1.5.0) `linuxX64` and `iosArm64` have an experimental support opt-in support for compiler caches that greatly improves compilation time for debug builds. Try it by adding `kotlin.native.cacheKind.linuxX64=static` or `kotlin.native.cacheKind.iosArm64=static` to `gradle.properties`.
        -   When you need to run the code as soon as possible, don't run Gradle tasks that build everything, like `build` or `assemble`. By using one of those you probably build the same code many times, which increases compilation time for no reason. In some typical cases (like running tests from IDE or starting the app from Xcode) we already avoid unnecessary tasks, but if you have a non-typical case or build configuration you might need to do this yourself.
            -   To run your code during development, you usually need only one binary, so running a single `linkDebug*` task should be enough. Note that compiling a release binary (`linkRelease*`) takes much more time than a debug one (`linkDebug*`).
        -   (Starting from 1.4.30) enable [build cache](https://docs.gradle.org/current/userguide/build_cache.html) in Gradle.

        General:

        -   Use the latest Kotlin version
        -   Try to avoid creating or generating huge classes with a great amount of methods especially if the common use case of such class is calling a small percent of its methods.
