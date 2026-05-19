---
sidebar_position: 20
---

# Многопоточность

## Материалы

### Обязательные

- [kotlinlang docs - Coroutines guide](https://kotlinlang.org/docs/coroutines-guide.html)
- [kotlinlang docs - Immutability in Kotlin/Native](https://kotlinlang.org/docs/native-immutability.html)
- [kotlinlang docs - Concurrency in Kotlin/Native](https://kotlinlang.org/docs/native-concurrency.html)
- [kotlinlang docs - Concurrent mutability](https://kotlinlang.org/docs/mobile/concurrent-mutability.html)
- [kotlinlang docs - Shared mutable state and concurrency](https://kotlinlang.org/docs/shared-mutable-state-and-concurrency.html)
- [kotlinlang docs - Native memory manager](https://kotlinlang.org/docs/native-memory-manager.html)
- [Многопоточность и Kotlin в Яндекс.Картах: как не допустить падения новых фич на iOS](https://habr.com/ru/company/yandex/blog/575846/)
- [KotlinConf 2019: Kotlin Native Concurrency Explained by Kevin Galligan](https://www.youtube.com/watch?v=oxQ6e1VeH4M)

### Дополнительные

- [KotlinConf 2018 - Kotlin/Native Concurrency Model by Nikolay Igotti](https://www.youtube.com/watch?v=nw6YTfEyfO0)
- [Touchlab - Practical Kotlin Native Concurrency](https://dev.to/touchlab/practical-kotlin-native-concurrency-ac7)
- [Touchlab - Kotlin/Native Concurrency](https://touchlab.co/kotlin-native-concurrency/)
- [Роман Елизаров — Корутины в Kotlin](https://www.youtube.com/watch?v=rB5Q3y73FTo)
- [Материалы с конференций](https://confluence.icerockdev.com/pages/viewpage.action?pageId=78134108)

## Интересные детали

- [WorkerBoundReference - share without freeze](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker-bound-reference/)
- [MutableSharedFlow - onBufferOverflow](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-mutable-shared-flow.html) - определяет по какой логике будет работать `emit` в случае переполнения буффера.

## Тестирование

[Google Forms](https://forms.gle/ZCKW34TnLN1tfHQBA)

## Шпаргалка

### Deferred — async / await

`async` запускает корутину и возвращает `Deferred<T>` — обещание вернуть результат позже. `await` приостанавливает корутину до получения результата.

```kotlin
scope.launch {
    val deferred: Deferred<Int> = async(Dispatchers.Default) {
        computeResult()
    }
    val result: Int = deferred.await()
}
```

Похож на `Future` в Java / `Promise` в JS. Используй, когда нужен результат от фоновой работы.

### Dispatchers

Определяют, на каком пуле потоков выполняется корутина:

- `Dispatchers.Main` — UI-поток (Android, iOS)
- `Dispatchers.Default` — CPU-ёмкие задачи
- `Dispatchers.IO` — I/O (сеть, диски) — на JVM расширяет пул по необходимости
- `Dispatchers.Unconfined` — не привязан к конкретному потоку (не путай с Main)

```kotlin
launch(Dispatchers.Default) { /* тяжёлые вычисления */ }
```

Реализация диспатчеров зависит от платформы. На JVM (Android) `Default` использует пул потоков размером по числу ядер CPU, `Main` — главный (UI) поток. На Kotlin/Native (iOS) `Default` — всего один фоновый поток (из-за ограничений нативной многопоточности), а `Main` привязан к основному потоку через RunLoop (цикл обработки событий в iOS, аналог MainLooper в Android).

### withContext

Переключает контекст (обычно передаем просто диспатчер) для блока кода и возвращает результат. Не создаёт новой корутины (в отличие от `async`) — просто меняет поток внутри существующей.

```kotlin
scope.launch(Dispatchers.Main) { 
    // Main
    val data = withContext(Dispatchers.Default) {       
        // переключились на Default (тяжёлая работа)
        loadData()
    }                                                   
    // вернулись на Main, обновляем UI
    render(data)
}
```

На Kotlin/Native при смене диспатчера захваченные объекты замораживаются (freeze) — помни об этом.

### Channel

Канал для передачи данных между корутинами (горячий поток). Producer отправляет, consumer получает. Разные типы буферизации: `RendezVous` (по умолчанию — без буфера, отправитель ждёт получателя), `Buffered`, `Conflated`, `Unlimited`.

```kotlin
val channel = Channel<Int>(capacity = Channel.CONFLATED)

// producer
launch {
    repeat(10) { channel.send(it) }
    channel.close()
}

// consumer
launch {
    for (value in channel) { println(value) }
}
```

Используй для организации pipeline: несколько корутин обрабатывают данные через общий канал. В KMM — один из немногих shareable-примитивов для обмена данными между потоками.

### Flow / StateFlow / SharedFlow

Холодный асинхронный поток данных. Flow ничего не испускает, пока на него не подписались. В отличие от Channel, Flow — ленивый и иммутабельный.

```kotlin
fun observeUpdates(): Flow<Int> = flow {
    repeat(5) {
        delay(1000)
        emit(it)
    }
}.flowOn(Dispatchers.Default)

scope.launch {
    observeUpdates().collect { /* on each value */ }
}
```

**StateFlow** — горячий поток, хранит последнее значение. Аналог `LiveData` в Android, идеален для UI-состояния:

```kotlin
val state = MutableStateFlow(initialValue)
state.value = newValue // emit

// в UI
scope.launch { state.collect { /* рендер */ } }
```

**SharedFlow** — горячий поток без состояния. Для одноразовых событий (тосты, навигация). Используй с `replay` для опоздавших подписчиков.

### Atomic

Безопасное изменение состояния без блокировок из разных потоков. Доступные классы: `AtomicInt`, `AtomicLong`, `AtomicReference<T>`.

```kotlin
val counter = AtomicInt(0)

fun increment() {
    counter.addAndGet(1) // атомарно
}

counter.value // текущее значение
```

На Kotlin/Native атомики не замораживаются — их можно свободно передавать между потоками. Используй для счётчиков, флагов, кешей.

### Mutex

Если нужно защитить общие данные от одновременного доступа из нескольких корутин, используй `Mutex`. Работает как обычный мьютекс, но с ключевым отличием: вместо блокировки потока (как `synchronized`), `withLock` приостанавливает корутину — поток остаётся свободным для других задач.

```kotlin
val mutex = Mutex()
val sharedList = mutableListOf<Int>()

suspend fun add(value: Int) = mutex.withLock {
    sharedList.add(value)
}
```

Всегда используй `withLock` — он сам вызовет `unlock()` при выходе из блока, даже если было исключение. Ручная пара `lock()`/`unlock()` чревата забытым `unlock`.
Сам `Mutex` можно безопасно передавать между корутинами и потоками.

### volatile (`@Volatile`)

Гарантирует видимость изменений поля между потоками — чтение всегда возвращает последнюю запись.

```kotlin
@Volatile
var isReady = false

fun worker() {
    while (!isReady) { /* ждём */ }
}

fun setReady() {
    isReady = true // видно в worker()
}
```

Используй для флагов состояния, но **не** для составных операций (нужен `synchronized` / `Mutex`). Поле не замораживается.

### ThreadPool и Dispatchers

`Dispatchers.Default` и `Dispatchers.IO` — это высокоуровневые обёртки над тред-пулами. Можно создать свой:

```kotlin
val myDispatcher = Executors.newFixedThreadPool(4).asCoroutineDispatcher()

launch(myDispatcher) { /* на пуле из 4 потоков */ }
```

На Kotlin/Native запуск отдельного тред-пула ограничен: доступен `newSingleThreadContext()`. Default пул на Native — один поток.

### freeze (устаревшая модель)

В старой модели памяти Kotlin/Native вызов `freeze()` делал граф объектов глубоко неизменяемым — только так их можно было передать в другой поток. После freeze любая попытка мутации кидала `InvalidMutabilityException`.

```kotlin
data class Data(var x: Int)

val d = Data(5)
d.freeze()
d.x = 10 // InvalidMutabilityException!
```

С новым менеджером памяти (стабилен с Kotlin 1.9.20) freeze **не нужен** — объекты безопасно передаются между потоками без заморозки. Код с `freeze()` всё ещё будет компилироваться, но уже как no-op.
