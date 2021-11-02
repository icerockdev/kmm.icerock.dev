# Dispatch Queue


###  Разница между DispathchQueue..sync{} и DispathchQueue..async{}

DispathchQueue..sync{} - block and wait <br />
DispathchQueue..async{} - dispatch and proceed

Когда нельзя использовать sync вызов? Когда запуск кода происходит с того же потока, на котором запускается. Например:
```
DispatchQueue.main.sync {
     print("sync call from main thread on main thread")
}
```

Результат:  `EXC_BAD_INSTRUCTION (code=EXC_I386_INVOP, subcode=0x0).`

Так как sync вызов блокирует поток и ждет выполнения кложура, сам кложур на этом же потоке выполниться не может, так как он заблокирован ожиданием выполнения самого себя. Получается deadlock.

Это касается не только главной очереди, можно с тем же результатом положить и другую:

```
let myQueue = DispatchQueue(label: "MyOwnQueue")
 
myQueue.sync {
    myQueue.sync {
        print("sync call on my own queue")
    }
}
```

global() так положить не получится, так как она имеет несколько потоков:

```
DispatchQueue.global(qos: .userInteractive).sync {
    DispatchQueue.global(qos: .userInteractive).sync {
        print("call main.sync from background thread")
    }
}
```

Когда использовать sync?
Когда нужно дождаться выполнения кода в другом треде прежде чем продолжить выполнение:

```
DispatchQueue.global().async {
    var x = 0
     
    DispatchQueue.main.sync {
        x += 1
    }
     
    print(x)
}
```

если сделать инкремент в async вызове, то в консоль выведется 0, а sync - 1
