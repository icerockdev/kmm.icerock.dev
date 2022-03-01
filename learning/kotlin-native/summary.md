---
sidebar_position: 1
---

# Kotlin/Native

Общее описание "что это такое" - <https://kotlinlang.org/docs/native-overview.html>

Выступление Иготти про внутрянку K/N - <https://youtu.be/DqsYo_4QWSg>

## runtime

1.  Интероп Kotlin и ObjectiveC - <https://kotlinlang.org/docs/native-objc-interop.html> тут вся важная информация о стыке iOS мира и Kotlin. Очень важный раздел для хорошего понимания какой код из common как будет виден в ios нативном мире из swift
2.  Иммутабельность объектов в многопоточной среде - <https://kotlinlang.org/docs/native-immutability.html> это важный на данный момент аспект K/N сильно влияющий на общий код, если в проекте используется многопоточность. По ссылке указана идея заложенная в фундамент memory management'а K/N рантайма.
3.  Сборщик мусора
    1.  Кратко про него сказано тут - <https://kotlinlang.org/docs/native-faq.html#what-is-kotlin-native-memory-management-model>
    2.  Заявлена его переработка - <https://blog.jetbrains.com/kotlin/2020/07/kotlin-native-memory-management-roadmap/>
    3.  <https://youtu.be/f-e-SdAugOs> - выступление Иготти про сборщик
    4.  <https://kotlinlang.org/docs/apple-framework.html#garbage-collection-and-reference-counting> - про сборщик в котлин на айосе. коротко.
    5.  <https://discuss.kotlinlang.org/t/kotlin-native-1-3-50-relaxed-mode/13586> - немного про relaxed режим памяти K/N, но новый сборщик мусора не на нем основан, это просто альтернативная опция про которую мало что известно и я даже не уверен что этот режим до конца доделали.
4.  Многопоточность - <https://kotlinlang.org/docs/native-concurrency.html> тесно связанная с пунктом про иммутабельность тема - многопоточность. Какие возможности предоставляются и как их использовать.
    1.  <https://www.youtube.com/watch?v=nw6YTfEyfO0> - выступление Иготти о том как устроена многопоточность и иммутабельность в K/N
    2.  <https://www.youtube.com/watch?v=oxQ6e1VeH4M> - выступление Галлигана с разжевыванием темы многопоточнсоти
    3.  <https://dev.to/touchlab/practical-kotlin-native-concurrency-ac7> - три статьи от Галлигана с хорошим разобором темы
    4.  <https://kotlinlang.org/docs/mobile/concurrent-mutability.html> - раздел Working with concurrency в документации KMM тоже с хорошим разобром от Галлигана
    5.  Колдовская штука-хак <https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker-bound-reference/> которая позволяет шарить что-либо без заморозки.
    6.  Touchlab гайд по многопоточности + видео - <https://touchlab.co/kotlin-native-concurrency/>
5.  Отладка K/N - <https://kotlinlang.org/docs/native-debugging.html>
    1.  Для простоты есть <https://github.com/touchlab/xcode-kotlin>
    2.  Также позволяет дебажить <https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile>
    3.  И AppCode - <https://blog.jetbrains.com/kotlin/2019/04/kotlinnative-support-for-appcode-2019-1/>
6.  Coroutines - <https://github.com/Kotlin/kotlinx.coroutines/blob/native-mt/kotlin-native-sharing.md> про native-mt ветку и ограничения корутин из-за иммутабельности

## compilation

1.  Про градл плагин K/N - <https://github.com/JetBrains/kotlin-native/blob/master/GRADLE_PLUGIN.md>
2.  Подробный референс градл плагина - <https://kotlinlang.org/docs/mpp-dsl-reference.html>
3.  Про сборку итоговых бинарников K/N - <https://kotlinlang.org/docs/mpp-build-native-binaries.html> для айоса важен бинарь framework и экспорт зависимостей, а также универсальные фреймворки (но мы их не юзаем)
4.  Гибкая настройка компиляции, детали про cinterop - <https://kotlinlang.org/docs/mpp-configure-compilations.html>
5.  Статья про реализацию swift библиотеки для подключение через cinterop в kotlin (на примере криптографии) - [Create a Kotlin/Multiplatform library with Swift](https://medium.com/kodein-koders/create-a-kotlin-multiplatform-library-with-swift-1a818b2dc1b0)
6.  <https://youtu.be/5QPPZV04-50> - запись с Kotlin 1.4 online event про мпп детали
7.  Интеграция через cocoapods (официальный плагин) - <https://kotlinlang.org/docs/native-cocoapods.html>
8.  Дебажные символы для крешрепортов осмысленных - <https://kotlinlang.org/docs/native-ios-symbolication.html>
9.  Про внутрянку klib'ов и K/N lib - <https://kotlinlang.org/docs/native-libraries.html>
10.  Про размер бинарника на iOS - <https://youtu.be/hrRqX7NYg3Q?t=1895>
11.  Некоторые хаки компиляции - <https://github.com/JetBrains/kotlin-native/blob/master/HACKING.md> (очень специфичная история)
12. советы по ускорению компиляции - <https://kotlinlang.org/docs/native-improving-compilation-time.html>
