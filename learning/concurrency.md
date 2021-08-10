---
sidebar_position: 3
---

# Многопоточность

## Материалы

- [kotlinlang docs - Immutability in Kotlin/Native](https://kotlinlang.org/docs/native-immutability.html)
- [kotlinlang docs - Concurrency in Kotlin/Native](https://kotlinlang.org/docs/native-concurrency.html)
- [kotlinlang docs - Concurrent mutability](https://kotlinlang.org/docs/mobile/concurrent-mutability.html)
- [KotlinConf 2018 - Kotlin/Native Concurrency Model by Nikolay Igotti](https://www.youtube.com/watch?v=nw6YTfEyfO0)
- [KotlinConf 2019: Kotlin Native Concurrency Explained by Kevin Galligan](https://www.youtube.com/watch?v=oxQ6e1VeH4M)
- [Touchlab - Practical Kotlin Native Concurrency](https://dev.to/touchlab/practical-kotlin-native-concurrency-ac7)
- [Touchlab - Kotlin/Native Concurrency](https://touchlab.co/kotlin-native-concurrency/)
- [Kotlinx.coroutines - Sharing and background threads on Kotlin/Native](https://github.com/Kotlin/kotlinx.coroutines/blob/native-mt/kotlin-native-sharing.md)
- [Роман Елизаров — Корутины в Kotlin](https://www.youtube.com/watch?v=rB5Q3y73FTo)

## Интересные детали

- [kotlinx.coroutines - delay not blocking](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html)
- [WorkerBoundReference - share without freeze](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker-bound-reference/)

## Тестирование

[Google Forms](https://forms.gle/ZCKW34TnLN1tfHQBA)

## TO DO

- Deffered - async, await
- Dispatchers
- withContext
- Atomic
- Mutex
- volatile
- ThreadPool и его связь с Dispatchers
- как работает freeze
