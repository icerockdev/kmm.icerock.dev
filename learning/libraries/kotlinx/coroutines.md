# coroutines

Для реализации асинхронной логики и выделения работы на отдельные потоки на наших проектах
используется [kotlinx.coroutines](https://github.com/Kotlin/kotlinx.coroutines).

## Материалы

### Beginner

- 📄 [KotlinLang Docs - Coroutines guide](https://kotlinlang.org/docs/coroutines-basics.html)
  - [Coroutines basics](https://kotlinlang.org/docs/coroutines-basics.html)
    - Beginner    
      - `launch`, `delay`, `runBlocking`, `Structured` `concurrency`, `coroutineScope`, `Job`, `Scope builder`
      - создание первой корутины и suspend функции, запуск корутин параллельно, обращение к корутине через объект Job
      - корутины не потеряются и не будет утечек, не потеряются ошибки в корутинах (Structured concurrency)
      - отличия между runBlocking и coroutineScope (Scope builder)
      - обращение к корутине через объект Job (explicit job)
      - пример легковестности корутин по сравнению с потоками
  - [Cancellation and timeouts](https://kotlinlang.org/docs/cancellation-and-timeouts.html)
    - Beginner   
      - `Job`, `cancel`, `cancelAndJoin`, `isActive`, `ensureActive`, `NonCancellable`, `withTimeout`, `withTimeoutOrNull`, `CancellationException`, `TimeoutCancellationException`
      - в корутине нужно проверять, хотят ли её отменить
      - проверка на отмену происходит в каждом suspension point, чтобы проверять чаще используйте: ensureActive. Или проверяйте статус Job с помощью флага isActive (Making computation code cancellable)
      - пример правильной и неправильной отмены корутины (Cancellation is cooperative)
      - работа корутины по time-out (Timeout)  
      - работа с ресурсами внутри withTimeout блока, пример проблемы и решения (timeout and resources)
  - [Composing suspending functions](https://kotlinlang.org/docs/composing-suspending-functions.html)
    - Beginner
      - `async`, `Deferred`, `Job`, `await`, `start`
      - примеры последовательного и асинхронного запуска
      - отложенный запуск корутины, отличия между запуском start и await (Lazy started async)
      - корутина, возвращающая значение - async, Deferred
      - хороший стиль объявления async-функции (Async-style functions)
      - пример возникновения ошибок в coroutineScope (Structured concurrency with async)
    - Intermediate
      - `awaitAll`
      - [Пример с параллельным запуском множества запросов и работа с их результатами](https://proandroiddev.com/awaiting-multiple-coroutines-the-clean-way-75469f8df160)
  - [Coroutine context and dispatchers](https://kotlinlang.org/docs/coroutine-context-and-dispatchers.html)  
    - Beginner
      - `CoroutineContext`, `CoroutineScope`, `Dispatcher`, `Unconfined`, `newSingleThreadContext`, `Job`, `join`, `asContextElement`
      - про Dispatcher и как он связаны с потоками (Dispatchers and threads)
      - отладка корутин, используя дебаггер в IDEA или логгирование, CoroutineName (Debugging with IDEA)
      - работа корутин в разных потоках, освобождение создонного потока (Jumping between threads)
      - как получить Job из контекста (Job in the context)
      - дочерние и родительские корутины
      - описание CoroutineScope
      - как использовать несколько контекстов для создания, неассоциативный + (Combining context elements)
      - передача локальных данных потока в корутины или между ними (Thread-local data)
  - [Asynchronous Flow](https://kotlinlang.org/docs/flow.html)
    - Beginner
      - `Flow`, `emit`, `collect`, `flowOf`, `asFlow`, `operators`, `cold`, `hot`, `builders`, `cancel`
      - что такое Flow, операторы Flow, остановка Flow
      - холодные и горячие Flow
      - Flow builders
    - Intermediate 
      - `transform`, `take`, `numbers`, `toList`, `toSet`, `first`, `single`, `reduce`, `fold`, `flow`, `flowOn`, `buffer`, `conflate`, `collectLatest`, `zip`, `combine`, `flatMapConcat`, `flattenConcat`, `flatMapMerge`, `flattenMerge`, `flatMapLatest`, `try catch`, `finally`, `onCompletion`, `launchIn`
  - [Channels](https://kotlinlang.org/docs/channels.html)
    - Beginner
      - `Channel`, `send`, `receive`, `produce`, `consumeEach`, `capacity`, `buffer`, `tick`
      - что такое Channel, типы каналов
      - как происходит закрытие канала (Closing and iteration over channels)
      - паттерн производитель/потребитель (Building channel producer)
      - паттерн конвеер (Pipeline)
      - работа с каналом из нескольких корутин одновременно, справедливая работа канала (Fan-in, Fun-out, Channels are fair)
      - емкость канала
  - [Coroutine exceptions handling](https://kotlinlang.org/docs/exception-handling.html)
      - Beginner
        - `cancel`, `CancellationException`, `CoroutineExceptionHandler`, `SupervisionJob`, `SupervisionScope` 
        - обработка ошибок в корутинах (Exception propagation)
        - настраиваемый обработчик ошибок (CoroutineExceptionHandler)
        - игнорируемое исключение CancellationException при завершении корутины (Cancellation and exceptions)
        - обработка нескольких исключений от дочерних корутин (Exceptions aggregation)
        - SupervisionJob и SupervisionScope
  - [Shared mutable state and concurrency](https://kotlinlang.org/docs/shared-mutable-state-and-concurrency.html) 
      - Beginner
        - `shared mutable state`, `Thread-safe`
        - проблема изменения общего значения из параллельных корутин
        - решения проблемы: потокобезопасные типы данных, ограничение потоков, mutex (Thread-safe data structures, fine-grained, coarse-grained )
        - пример потраченного времени на переключение между потоками
      - Intermediate
        - что такое mutex (Mutual exclusion) 
      - Advanced
        - `volatile`, `Threadsafe`, `mutex`
        - Actors (устаревший подход, `actor` deprecated с kotlinx.coroutines 1.5.2, рекомендуется использовать Channel напрямую)
  - [Debug coroutines using IntelliJ IDEA – tutorial](https://kotlinlang.org/docs/debug-coroutines-with-idea.html) - как дебажить корутины в IDEA
  - [Debug Kotlin Flow using IntelliJ IDEA – tutorial](https://kotlinlang.org/docs/debug-flow-with-idea.html) - как дебажить flow в IDEA

- 📄 [Корутины в Kotlin (гайд)](https://habr.com/ru/company/alfa/blog/336228/)
  - `coroutine`, `Thread`, `suspend`, `runBLocking`, `launch`, `join`, `async`, `await`, `Deferred`, `CoroutineContext`, `CoroutineDispatсher`, `Thread safe`, `Actor`, `Channel`, `send`, `receive`
  - Beginner
    - отличия потоков в Java с корутинами в Kotlin
    - два простых примера с пояснениями (runBlocking, launch, suspend, join, async, await, Deferred)
    - CoroutineContext и CoroutineDispatсher - что это и зачем
    - Thread-safe, Actor и Channel

- 📄 [Roman Elizarov - Structured Concurrency](https://elizarov.medium.com/structured-concurrency-722d765aa952)
  - `Structured Concurrency`, `coroutineScope`
  - Beginner
    - как пришли к Structured Concurrency, какие проблемы решает, какие преимущества дает
    - корутины не глобальные, как потоки. Они связаны со своим скоупом, который представляет собой объект с ограниченным временем жизни. Например элемент UI.

- 🎦 [KotlinConf 2019: Asynchronous Data Streams with Kotlin Flow by Roman Elizarov](https://www.youtube.com/watch?v=tYcqn48SMT8)
  - `suspend`, `Channel`, `hot`, `flow`, `operators`, `Flowable`
  - Beginner
    - [2:15](https://youtu.be/tYcqn48SMT8?t=136) Введение, как работают suspend функции, проблема runBlocking
    - [4:55](https://youtu.be/tYcqn48SMT8?t=296) Channel
    - [7:12](https://youtu.be/tYcqn48SMT8?t=433) горячие каналы, проблемы каналов
    - [9:40](https://youtu.be/tYcqn48SMT8?t=580) Flow, принцип работы, операторы
    - [13:42](https://youtu.be/tYcqn48SMT8?t=823) Flow vs List
    - [18:44](https://youtu.be/tYcqn48SMT8?t=1124) Flowable
    - [24:03](https://youtu.be/tYcqn48SMT8?t=1384) Flow

- 📄 [Structured Concurrency in action! (using Kotlin coroutines)](https://proandroiddev.com/structured-concurrency-in-action-97c749a8f755?gi=85a83dfe8ceb)
  - `Structured Concurrency`, `cancellation`, `Job`, `isActive`, `CoroutineScope`, `CoroutineContext`
  - Beginner
    - основные концепции Structured Concurrency
    - описание поведения отмены, примеры
    - Параллельная декомпозиция, какие проблемы решает CoroutineScope
    - CoroutineScope и CoroutineContext, в чем разница? (Scope - область действия корутины, Context - элементы жизненного цикла корутины, переменные и константы, с которыми она работает)
    - демонстрация нарушения Structured Concurrency, если корутине передать Context, отличающающийся от контекста родительского CoroutineScope этой корутины

- 🎦 [Александр Нозик. Кое-что о корутинах](https://youtu.be/t0AERgx0lrY)
  - Beginner
    - `Deferred`, `Structured Cuncurrency`, `Job`, `CoroutineScope`, `GlobalScope`, `cancel`, 
    - [22:55](https://youtu.be/t0AERgx0lrY?t=1367) хорошее объяснение, как ведут себя корутины при передаче Deferred
    - [29:32](https://youtu.be/t0AERgx0lrY?t=1772) проблема с потоками, почему они занимают много памяти
    - [52:49](https://youtu.be/t0AERgx0lrY?t=3169) пример проблемы в корутинах, которую решает Structured Concurrency
    - [57:38](https://youtu.be/t0AERgx0lrY?t=3458) Job позволяет работать с результатом корутины, вырубать корутину и еще всякое, но это не сама корутина
    - [1:00:42](https://youtu.be/t0AERgx0lrY?t=3642) CoroutineScope   
    - [1:5:28](https://youtu.be/t0AERgx0lrY?t=3928) GlobalScope, это пустышка, нет контекста, нет родителей, не знает о других запусках из GlobalScope, поэтому нарушается Structured Cuncurrency, некуда прокинуть результат и прочее
    - [1:25:20](https://youtu.be/t0AERgx0lrY?t=5120) Если корутина была закрыта с помощью cancel, то закрывает только детей, родителей не трогает
    - [1:26:57](https://youtu.be/t0AERgx0lrY?t=5217) Поведение при возникновении ошибки: если в корутине возникла ошибка, то она закрывает себя, сообщает родителю что случилось, закрывает всех потомков 
    - [1:34:10](https://youtu.be/t0AERgx0lrY?t=5650) Нельзя закрывать корутину где угодно, нужно делать в точках расщепления, где проверяется, что она не закрыта

- 🎦 [Александр Нозик. Кое-что о корутинах. Flow, Scope](https://youtu.be/AAFi_C40BOM)
  - Видео хорошее, рекомендуется к просмотру целиком (x1.5)
  - Beginner
    - `CoroutineContext`, `EmptyCoroutinesContext`, `Job`, `GlobalScope` `launch`, `newCoroutinesContext`, `cancel`, `supervisorScope`, `async`, `await`, `Deferred`, `Channel`, `isActive`, `Flow`, `cold`, `hot`
    - [8:15](https://youtu.be/AAFi_C40BOM?t=521) CoroutineContext  
    - [12:55](https://youtu.be/AAFi_C40BOM?t=775) используя EmptyCoroutinesContext вы никак не пользуетесь преимуществами StructuredConcurrency
    - для использования StructuredConcurrency необходим объкет Job, который будет помнить детей и родителя этой корутины
    - [15:29](https://youtu.be/AAFi_C40BOM?t=929) GlobalScope - пустышка, хранит и использует EmptyCoroutinesContext
    - [19:59](https://youtu.be/AAFi_C40BOM?t=1199) разбор launch, newCoroutinesContext
    - [30:00](https://youtu.be/AAFi_C40BOM?t=1800) способ завершить все корутины - отменить корневой Scope
    - [34:12](https://youtu.be/AAFi_C40BOM?t=2052) нельзя держать какой-нибудь Scope и периодический давать ему задачи
    - [45:26](https://youtu.be/AAFi_C40BOM?t=2726) supervisorScope - когда внутри происходит ошибка, он не обрушивает Scope-родительского
    - [52:31](https://youtu.be/AAFi_C40BOM?t=3151) async похож на Job, отличие в том, что он возвращает Deferred, await() - позволяет использовать результат, когда он будет получен.
    - [55:11](https://youtu.be/AAFi_C40BOM?t=3311) вместо async можно использовать suspend функцию, единственное отличие в том, что async можно отменить, в отличие от suspend функции
    - [57:11](https://youtu.be/AAFi_C40BOM?t=3572) Channel, служит для обмена данными между корутинами, виды каналов
    - [57:49](https://youtu.be/AAFi_C40BOM?t=3469) while(isActive){...} - проверяет, отменена ли данная корутина, и если она отменена, то не входит в новую итерацию цикла. Если использовать while(true){...}, то тот же самый эффект будет в ближайшем suspension point
    - [1:02:41](https://youtu.be/AAFi_C40BOM?t=3761) типы каналов
    - [1:10:42](https://youtu.be/AAFi_C40BOM?t=4227) Flow
      - [1:15:43](https://youtu.be/AAFi_C40BOM?t=4543) холодные - следующий элемент вычисляется не тогда, когда он готов, а когда кто-нибудь его запросил из Flow.
      - [1:29:41](https://youtu.be/AAFi_C40BOM?t=5381) горячий - возвращает элемент сразу же, как сгенерит
  - Intermediate
    - [8:43](https://youtu.be/AAFi_C40BOM?t=523) CoroutinesContext, отличия от map - строгое типизирование ( если использовать ключ <Е>, то получите объект типа Е ), сумма двух CoroutineContext не ассоциотивна ( CoroutineContext1 + CoroutineContext2 != CoroutineContext2 + CoroutineContext1 т.к если в CoroutineContext1 есть ключи из CoroutineContext2, то при сумме значения по этим ключам перезапишутся из CoroutineContext2 )

- 📄 [Hands-on: Intro to coroutines and channels](https://play.kotlinlang.org/hands-on/Introduction%20to%20Coroutines%20and%20Channels?_gl=1*1j033dc*_ga*Nzc2NDAwNzc2LjE2MjAyODkwMTg.*_ga_J6T75801PF*MTYzMTg1MjIzOC4xMzcuMS4xNjMxODUyMjY2LjMy&_ga=2.168555557.561329090.1631509904-776400776.1620289018)
  - `Channel`
  - Beginner
    - [Как работает Channel](https://play.kotlinlang.org/hands-on/Introduction%20to%20Coroutines%20and%20Channels/08_Channels) - очень хороший разбор работы канала с примером

- 🎦 [RedMadRobot - Coroutines. Хаотичное изучение. Часть 1](https://www.youtube.com/watch?v=cHERit7LNGM)
  - `Dispatcher`, `withContext`, `NonCancellableContext`, `viewModelScope`, `suspend`, `main-thread`
  - Beginner  
    - [4:02](https://youtu.be/cHERit7LNGM?t=242) виды Dispatcher
    - [5:18](https://youtu.be/cHERit7LNGM?t=318) что такое withContext и пример с NonCancellableContext
    - [8:10](https://youtu.be/cHERit7LNGM?t=490) viewModelScope - готовый Scope, привязанный к жизни компонента
    - [9:38](https://youtu.be/cHERit7LNGM?t=575) вызовы suspend функций должны быть безопасны для main-thread

- 🎦 [RedMadRobot - Coroutines. Хаотичное изучение. Часть 2](https://www.youtube.com/watch?v=6Apj_v9ZkBs)
  - `Scope`, `CoroutineContext`, `Job`, `Dispatcher`, `CoroutineName`, `CoroutineExceptionHandler`, `CoroutinesScope`, `SupervisorScope`, `Deferred`, `async`, `await` `cancellable`
  - Beginner  
    - [3:05](https://youtu.be/6Apj_v9ZkBs?t=185) CoroutinesScope создает новый Scope, копирует все из Scope-родителя и исполняет переданный ему блок
    - [3:59](https://youtu.be/6Apj_v9ZkBs?t=238) supervisorScope не упадет, если упадет ребенок. Если упадет сам Scope, то не упадет Scope-родитель
    - [5:11](https://youtu.be/6Apj_v9ZkBs?t=311) Job - фоновая работа, имеет ЖЦ(active, cancelled). Job предоставляет управление корутиной, можем вызвать Job.cancel и тд, не имеет результата
    - [7:06](https://youtu.be/6Apj_v9ZkBs?t=426) Deferred это Job, но с результатом, создается myScope.async{...}. Получить значение - myDeferred.await() - вернет занечение или исплючение при ошибке 
    - [8:55](https://youtu.be/6Apj_v9ZkBs?t=535) как запустить работу во внешнем Scope, что делать, если нам не подходит ViewModelScope, потому что работа должна жить дольше чем ViewModel
    - [15:21](https://youtu.be/6Apj_v9ZkBs?t=921) что такое CoroutineContext, что в нем может находиться (Job, CoroutineDispatcher, CoroutineName, CoroutineExceptionHandler)
    - [16:57](https://youtu.be/6Apj_v9ZkBs?t=1017) разница между CoroutineScope и CoroutineContext
    - [19:32](https://youtu.be/6Apj_v9ZkBs?t=1172) когда Job отменили, корутина не отменится автоматичеки, разбор кейса

- 🎦 [RedMadRobot - Coroutines. Хаотичное изучение. Часть 3](https://www.youtube.com/watch?v=7JSHSqAhErw)
  - `Channel`, `capacity`, `close`, `trySend`, `Flow`, `buffer`, `conflate`, `SharedFlow`, `hot`, `cold`, `shareIn`, `whileSubscribed`, `timeout`, `Job`, `lifecycle`, `repeatOnLifecycle`, `DESTROYED`, `flowWithLifecycle`
  - Beginner  
    - [7:50](https://youtu.be/7JSHSqAhErw?t=470) Channel - канал для обмена, можно положить и получить, не блокирующий (оперции саспендятся), можно закрыть, разные capacity(RENDEZVOUS, UNLIMITED, CONFLATED, BUFFERED) 
    - [3:38](https://youtu.be/7JSHSqAhErw?t=218) SingleLiveEvent, что это и зачем (события нужно обрабатывать только один раз)
    - [11:30](https://youtu.be/7JSHSqAhErw?t=690) SingleLiveEvent используя Channel
    - [15:52](https://youtu.be/7JSHSqAhErw?t=952) как добавить к flow буффер на случай медленного получения
    - [17:25](https://youtu.be/7JSHSqAhErw?t=1045) conflate, сокращение для buffer с параметрами CONFLATED и DROP_OLDEST, т.е хранит одно значение и перезаписыват его
    - [18:07](https://youtu.be/7JSHSqAhErw?t=1087) flowOn переключает контекст выполнения операторов идущих до него, если операторы без своего контекста
    - [20:07](https://youtu.be/7JSHSqAhErw?t=1207) shareIn превращает холодный Flow в горячий SharedFlow
    - [21:52](https://youtu.be/7JSHSqAhErw?t=1312) WhileSubscribed запускает корутину при первом подписчике, остонавливает когда пропадет последний подписчик, можно сохранить кэш при выключении или стереть после timeout
    - [23:12](https://youtu.be/7JSHSqAhErw?t=1392) На что можно заменить Job.cancel()? можно Lifecycle.repeatOnLifecycle
    - [23:39](https://youtu.be/7JSHSqAhErw?t=1419) Lifecycle.repeatOnLifecycle запускает корутину, когда ЖЦ подходит до определенного состояния, когда ЖЦ ниже нужного состояния - отменяет корутину и усылпяет(suspend), когда снова в нужном состоянии - запускает повторно
    - [24:42](https://youtu.be/7JSHSqAhErw?t=1482) особенности repeatOnLifecycle, рекомендуется создавать либо в Activity.onCreate() или Fragment.onViewCreated()
    - [25:22](https://youtu.be/7JSHSqAhErw?t=1522) поведение при DESTROYED, держет в suspend внешнюю корутину, пока не DESTROYED, когда DESTROYED - отпустит
    - [26:20](https://youtu.be/7JSHSqAhErw?t=1580) Flow.flowWithLifecycle это обертка над repeatOnLifecycle, упрощает написание если только 1 продюсер 


- 📄 [Guide to UI programming with coroutines](https://github.com/Kotlin/kotlinx.coroutines/blob/master/ui/coroutines-guide-ui.md)
    - `UI`, `dispatcher`, `context`, `Dispatchers.Main`, `Dispatchers.JavaFx`, `Dispatchers.Swing`, `UI coroutine`, `cancel UI coroutine`, `actor`, `RendezvousChannel`, `capacity`, `ConflatedChannel`, `Channel.UNLIMITED`, `UI freeze`, `Structured concurrency`, `lifecycle`, `parent-child hierarchy`

- 📄 [Best practices for coroutines](https://developer.android.com/kotlin/coroutines/coroutines-best-practices)
    - `Dispatcher`, `suspend`, `ViewModel`, `mutable`, `Flow`, `test`, `TestDispatcher`, `GlobalScope`, `cancel`, `cancellable`, `ensureActive`
    - Intermediate
      - почему не нужно хардкодить Dispatcher
      - suspend функции должны быть безопасны для основного потока, т.е. классы, вызывающие suspend функции не должны беспокоиться о том, какой Dispatcher использовать, эта ответственность лежит на классе, который выполняет эту работу 
      - ViewModel должен создавать корутины, а не suspend-функции
      - предоставляйте неизменяемые типы другим классам
      - для классов данных и бизнес-уровня необходимы должны предоставлять suspend функции для одноразовых вызовов и Flow для изменяемых данных
      - используйте `StandardTestDispatcher` или `UnconfinedTestDispatcher` в тестах (`TestCoroutineDispatcher` deprecated с kotlinx.coroutines 1.6)
      - избегайте GlobalScope (это неконтролируемая область, очень усложняет тестирование, нет обзего CoroutineContext)
      - suspend функции должны быть cancellable 
  
- 🎦 [Roman Elizarov — Structured concurrency](https://www.youtube.com/watch?v=Mj5P47F6nJg)
- [CodeLab от JetBrains с основами применения механизмов корутин и каналов](https://kotlinlang.org/docs/coroutines-and-channels.html)

### Advanced

- 🎦 [Андрей Бреслав — Асинхронно, но понятно. Сопрограммы в Kotlin](https://www.youtube.com/watch?v=ffIVVWHpups)
  - Немного устаревшее, но про внутрянку наглядно показано.
- 🎦 [Корутины в Kotlin — Роман Елизаров, JetBrains](https://www.youtube.com/watch?v=b4mBmi1QNF0)
- 📄 [Coroutines Codegen](https://github.com/JetBrains/kotlin/blob/document-coroutines-codegen/compiler/backend/src/org/jetbrains/kotlin/codegen/coroutines/coroutines-codegen.md#state-machine)
  - Документ подробно описывающий что делает компилятор с suspend кодом и что генерируется в результате

## Highlights

### Внутреннее устройство

> Мы не стремимся здесь дать полное объяснение того, как сопрограммы работают под капотом, но примерный смысл того, что происходит, очень важен.
> 
> Сопрограммы полностью реализованы с помощью технологии компиляции (поддержка от языковой виртуальной машины, среды исполнения, или операционной системы не требуется), а приостановка работает через преобразование кода. В принципе, каждая функция приостановки (оптимизации могут применяться, но мы не будем вдаваться в эти подробности здесь) преобразуется в конечный автомат, где состояния соответствуют приостановленным вызовам. Прямо перед приостановкой следующее состояние загружается в поле сгенерированного компилятором класса вместе с сопутствующими локальным переменными и т. д. При возобновлении сопрограммы локальные переменные и состояние восстанавливаются, и конечный автомат продолжает свою работу.
> 
> Приостановленную сопрограмму можно сохранять и передавать как объект, который хранит её приостановленное состояние и локальные переменные. Типом таких объектов является Continuation, а преобразование кода, описанное здесь, соответствует классическому Continuation-passing style. Следовательно, приостановливаемые функции принимают дополнительный параметр типа Continuation (сохранённое состояние) под капотом.
> 
> Более детально о том, как работают сопрограммы, можно узнать в этом проектном документе. Похожие описания async / await в других языках (таких как C# или ECMAScript 2016) актуальны и здесь, хотя особенности их языковых реализаций могут существенно отличаться от сопрограмм Kotlin.

[Source](https://kotlinlang.ru/docs/reference/coroutines.html) (архивная статья).

Пример преобразования кода на этапе компиляции:

Исходник:
```kotlin
dummy() // suspend
println(1)
dummy() // suspend
println(2)
```

При компиляции преобразуется в:
```kotlin
val $result: Any? = null
when (this.label) {
    0 -> {
        this.label = 1
        $result = dummy(this)
        if ($result == COROUTINE_SUSPENDED) return COROUTINE_SUSPENDED
        goto 1
    }
    1 -> {
        println(1)
        this.label = 2
        $result = dummy(this)
        if ($result == COROUTINE_SUSPENDED) return COROUTINE_SUSPENDED
        goto 2
    }
    2 -> {
        println(2)
        return Unit
    }
    else -> {
        throw IllegalStateException("call to 'resume' before 'invoke' with coroutine")
    }
}
```

Более подробно можно прочитать в [документе](https://github.com/JetBrains/kotlin/blob/master/compiler/backend/src/org/jetbrains/kotlin/codegen/coroutines/coroutines-codegen.md#state-machine)

Также можно прочитать [статью или посмотреть видео](https://manuelvivo.dev/suspend-modifier).

### CoroutineScope

[CoroutineScope](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html) 
задает область действия корутины. Именно используя скоуп производится остановка всех отложенных
операций привязанных к некоторому жизненному циклу.

Например, у каждой `ViewModel` есть `viewModelScope` - это `CoroutineScope`, который создается при
создании `ViewModel` и отменяется при вызове `onCleared`. 

Рассмотрим небольшую тестовую `ViewModel`:
```kotlin
class TestViewModel: ViewModel() {
  init {
    viewModelScope.launch {
      delay(10000)
      println("work done!")
    }
  }
}
```

Если мы зайдем на экран, использующий эту `ViewModel`, и сразу уйдем (не дожидаясь 10 секунд), то
сообщение не будет выведено в лог. А если подождем 10 секунд - будет. Это как раз потому что при
вызове `onCleared` отменяется `CoroutineScope`, а вместе с ним и все его корутины. А вызов `onCleared`
происходит при окончательном уходе с экрана (прямо перед удалением `ViewModel`).

Также важно понимать что скоуп может быть вложенным (любой уровень вложенности поддерживается). 
Для создания вложенного скоупа используется билдер `coroutineScope`. При отмене родительского скоупа
отменяются и все вложенные.

Вложенный скоуп может пригодиться в случаях, когда вам не доступен класс текущего `CoroutineScope`,
но нужно вызвать один из билдеров (`launch`/`async`).

```kotlin
suspend fun doSomeParallelWork() {
    coroutineScope {
        val task1 = async { callFirstRequest() }
        val task2 = async { callSecondRequest() }
        awaitAll(task1, task2)
    }
}
```

Все корутины принадлежат какому либо скоупу. Скоуп либо создается вручную
(вызовом `CoroutineScope`), либо используется `GlobalScope`, который не имеет ограничения жизненного
цикла - живет все время жизни процесса приложения, поэтому не рекомендуется к использованию без
твердой уверенности что это верно.   

#### Использование async

При запуске асинхронных задач (вызов `async`) важно учитывать, что возникновение ошибки внутри задачи будет вызывать отмену текущего Scope. Поэтому важно запускать дочерний скоуп используя `coroutineScope` для выполнения асинхронных задач - тогда ошибка выполнения этих задач не сломает основной `CoroutineScope`, а будет выброшена как результат `coroutineScope` и сможет обработаться `try-catch`.

Например в [следующем коде](https://pl.kotl.in/jAbDHCZMJ):
```kotlin
suspend fun main() {
    coroutineScope {
        launch {
            try {
                listOf<Deferred<Unit>>(
                    async { TODO() },
                    async { TODO() }
                ).awaitAll()
            } catch(exc: Throwable) {
                println(exc.stackTraceToString())
            }
        }
    }
}
```

Блок `catch` не отловит ошибку, произойдет вылет приложения.

[Исправленный вариант](https://pl.kotl.in/FE39k7QR-):
```kotlin
suspend fun main() {
    coroutineScope {
        launch {
            try {
                coroutineScope {
                    listOf<Deferred<Unit>>(
                        async { TODO() },
                        async { TODO() }
                    ).awaitAll()
                }
            } catch(exc: Throwable) {
                println(exc.stackTraceToString())
            }
        }
    }
}
```

`coroutineScope` это suspend-функция, которая создаёт новый скоуп и идёт дальше только после его завершения и не привязывается к родительскому скоупу. Когда скоуп, созданный `coroutineScope`, упал, падает сама suspend-функция, а не весь родительский scope.

### CoroutineContext
Корутина, запущенная другой, наследует весь контекст той, внутри которой она запустилась и становится для нее дочерней.
Если остановить родителскую корутину, то остановятся и все дочерние корутины. 
Способы переопределения дефолтного поведения наследования: 
  - явно указать DifferentScope.launch
  - передать другой объект Job в качестве контекста корутины  

В обоих случаях корутина не привяжется к области, из которой она была запущенна.
    
Также, родительская корутина всегда дожидается завершения дочерних корутин, для этого не требуется явно отслеживать всех потомков или делать Job.join

### Dispatcher

Dispatcher определяет, какой поток или потоки использует корутина для выполнения.
Может ограничить выполнение корутины одним потоком, отправить корутину в пулл потоков или никак ее не ограничивать.
Основные диспетчеры: `Dispatchers.Default` (пул потоков для CPU-интенсивных задач), `Dispatchers.IO` (пул потоков для I/O операций), `Dispatchers.Main` (главный/UI поток), `Dispatchers.Unconfined` (без привязки к потоку)

### Механика delay

По началу `delay` все интерпретируют как `Thread.sleep` и считают что текущий поток будет остановлен
на N миллисекунд.
Но [это не так](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html)
. Рассмотрим следующий блок кода:

```kotlin
suspend fun startTimer() {
    println("show message at start")
    delay(1000)
    println("show message after second")
}
```

При компиляции данный код будет преобразован (если сильно упростить) в нечто похожее на:

```kotlin
fun startTimer() {
    println("show message at start")
    delayCallback(1000) {
        println("show message after second")
    }
}
```

То есть вместо вызова `sleep` на весь поток, вся работа после suspend-point (`delay` это suspend
функция), будет "завернута в callback", закинута в очередь текущего потока (через Dispatcher
корутин) и данный калбек будет выполнен через секунду (когда будет получен из очереди диспатчером).

Вывод - вызов `delay` не останавливает работу потока.

Более детальное сравнение `delay` и `Thread.sleep` можете прочитать в [статье](https://blog.shreyaspatil.dev/sleepless-concurrency-delay-vs-threadsleep)

### Механика отмены канала

Для закрытия канала используется метод close()
Он посылает специальный токен закрытия и итерация получения элементов из канала остановится, когда токен будет получен
Это дает гарантию, что все элементы, отправленные до закрытия, будут получены

### Coroutineexceptionhandler

Дочерние корутины прокидывают свои необработанные ошибки родительской, и так вплоть до корневой.
Они не используют ExceptionHandler, установленный в их области действия

Если несколько дочерних корутин выбрасывают исклюения одновременно, то пробрасывается и обрабатывается только первое, а остальные присоединяются к первому как подавленные

### Supervision

Используя SupervisionJob при неудачном завершении дочерней корутины завершение не распростанится на родительскую корутину и других детей
Supervision scope распространяет отмену только в отношении дочерних корутин, отменяет всех только если сам завершился с ошибкой. Ожидает завершения всех детей, так же как и coroutineScope.
Каждый дочерний элемент обязан самостоятельно обрабатывать свои исключения. Корутины внутри SupervisionScope используют ExceptionHandler установленный в их области действия

### Операторы Flow
- [Intermediate flow operators](https://kotlinlang.org/docs/flow.html#intermediate-flow-operators) - основыные операторы похожи на map и filter, отличие от последовательностей в том, что внутри этих операторов можно вызвать suspend функцию
- [Transform operator](https://kotlinlang.org/docs/flow.html#transform-operator) - применяет функцию в блоке transform для какждого значения
- [Size-limiting operators](https://kotlinlang.org/docs/flow.html#size-limiting-operators) - отменяют выполнение потока когда лимит достигнут. Отмена происходит с помощью испключения, так что все блоки завершатся корректно
- [Terminal flow operators](https://kotlinlang.org/docs/flow.html#terminal-flow-operators) - toList, toSet, first, reduce, fold (про first и reduce не очень понятно)
- [Flows are sequential](https://kotlinlang.org/docs/flow.html#flows-are-sequential) - каждый сбор flow по дефолту выполняется последовательно, операторы коллекции выполняются в той же корутине, в которой они были запущены, новые не создаются, каждое переданное значение выполняется всеми промежуточными операторами
- [Flow context](https://kotlinlang.org/docs/flow.html#flow-context) - сбор flow всегда проихсодит в контексте вызывающей корутины
- [Wrong emission withContext](https://kotlinlang.org/docs/flow.html#wrong-emission-withcontext) - нельзя менять контекст внутри flow
- [flowOn operator](https://kotlinlang.org/docs/flow.html#flowon-operator) - приавильный способ изменить контекст для собирания flow
- [Buffering](https://kotlinlang.org/docs/flow.html#buffering) - буферизует выбросы потока через канал указанной емкости и запускает сборщик в отдельной сопрограмме.
- [Conflation](https://kotlinlang.org/docs/flow.html#conflation) - emitter не приостановится из-за медленного коллектора, а удерживает свои элементы, пока коллектор их не запросит, а когда запросит, отправит самый новый элемент из тех, которые накопиились, потом заново начнет копить
- [Processing the latest value](https://kotlinlang.org/docs/flow.html#processing-the-latest-value) - когда flow выдает новое значениеЮ блок действий для старого значения отменяется

### SharedFlow и StateFlow

`SharedFlow` — горячий поток, который может иметь несколько коллекторов. Значения emit'ятся во все активные коллекции.
`StateFlow` — специализированный `SharedFlow`, хранящий последнее значение и эмитящий только изменения. Является заменой `LiveData` в Kotlin Multiplatform.

- [StateFlow and SharedFlow](https://kotlinlang.org/docs/stateflow-and-sharedflow.html) — официальная документация
- `shareIn` — превращает холодный `Flow` в горячий `SharedFlow`
- `stateIn` — превращает холодный `Flow` в `StateFlow`
- `SharingStarted.WhileSubscribed` — стартует при появлении подписчика, останавливается когда пропадает последний подписчик
- `SharingStarted.Eagerly` — стартует немедленно
- `SharingStarted.Lazily` — стартует при первом подписчике, никогда не останавливается

### Тестирование корутин

Начиная с kotlinx.coroutines 1.6, `TestCoroutineDispatcher` и `TestCoroutineScope` deprecated. Используйте новый API:

- `runTest` — замена `runBlockingTest`, автоматически продвигает виртуальное время
- `TestScope` — тестовый скоуп с контролем виртуального времени
- `StandardTestDispatcher` — диспетчер, который ставит задачи в очередь и выполняет их через `advanceUntilIdle`
- `UnconfinedTestDispatcher` — диспетчер, который выполняет задачи немедленно (как `Dispatchers.Unconfined`)
- [Testing coroutines guide](https://kotlinlang.org/docs/coroutine-test-and-debug.html)

### runInterruptible

Функция `runInterruptible` позволяет прерывать блокирующие вызовы (например `Thread.sleep`, `BlockingQueue.take`) при отмене корутины. Без неё отмена корутины не прервёт блокирующий вызов на JVM.

```kotlin
suspend fun readBlocking() = withContext(Dispatchers.IO) {
    runInterruptible {
        Thread.sleep(10000)
    }
}
```

