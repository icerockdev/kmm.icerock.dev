---
sidebar_position: 3
---

# Extensions в Kotlin и Swift

Несмотря на то, что Extensions имеют одинаковую суть - расширение функционала класса, они имеют 
множество различий в возможностях в Swift и Kotlin. 
Для начала рассмотрим базовый синтаксис создания расширения.

**Kotlin**
```kotlin
class MyClass { }
fun MyClass.extensionFunction() { }
```

**Swift**
```swift
class MyClass { }
extension MyClass {
    func extensionFunction() { }
}
```
## Различия в возможностях Extensions в Kotlin и Swift
В таблице приведены основные различия между расширениями двух языков.

|Kotlin                                                          |Swift |
|--------------------------------------------------|--------------------------------------------------|
|Добавляет статическую функцию, не модифицирует класс |Непосредственно модифицирует класс |
|Можно создать extension для опционального типа |Нельзя создать extension для опционального типа (на самом деле можно) |
|Можно создать extension для generic типа |Нельзя (Костыль через NSObject)|
|Можно создать extension для класса внутри другого класса, с доступом полям обоих классов |Нельзя создать extension внутри класса|
|Не имеет доступ к приватным полям |Extension имеет доступ к приватным полям класса |
|Нет возможности задать новый конструктор через extension |Можно создать новый конструктор как extension |
|Нельзя реализовать интерфейс через extension |Можно Реализовать протокол через extension |
|Нельзя переопределить функцию расширение родительского класса |Можно переопределить функцию расширение родительского класса |
|Можно добавить свойство как extension | Можно добавить свойство как extension (да, это не различие) |

Дальше рассмотрим каждый пункт по отдельности

### Принцип работы расширений 

В Kotlin расширения на самом деле не проводят никаких модификаций с классами, которые они расширяют. 
Объявляя расширение, вы создаёте новую статическую функцию, а не новый член класса. В итоге при компиляции 
получается примерно следующее:
```kotlin
fun extensionFunction(receiver: MyClass) { }
```
В Swift расширения при компиляции непосредственно добавляются в результирующий класс. То есть при компиляции получим примерно следующее:
```swift
class MyClass {
    func extensionFunction() { }
}
```
Это различие в принципе работы расширений, являются причиной большинства приведенных ниже различий.

### Extension для опционального типа 
В Kotlin это доступно с простым и красивым синтаксисом 
```kotlin
class MyClass {
   val localVal = "aaa"
    fun doSomething() {
        println("Normal doSomething")
    }
}

fun MyClass?.doSomething() {
    if (this == null) println("Null doSomething")
    else doSomething()
}
```
Если мы попробуем написать что-то похожее в Swift: 
```swift
class MyClass {
    let localVal = "aaa"
    func doSomething() {
       print("Normal doSomething")
    }
}

extension MyClass? {
    func extensionFunc() {
       self == nil ? println("Null doSomething") : doSomething()
    }
}
```
То получим закономерную ошибку - `constrained extension must be declared on the unspecialized generic type 'Optional' with constraints specified by a 'where' clause`. Которая дает нам подсказку о том, как же все таки реализовать extension для опционального типа в Swift. Нам нужно создать extension для перечисления `Optional<Wrapped>` с указанием, нашего класса в качестве `Wrapped`. Пример:
```swift  
extension Optional where Wrapped: MyClass  {
    func extensionFunc() {
        self == nil ? print("Null doSomething") : self?.doSomething()
   }
}
```  
Таким образом выходит, что в Swift, все таки можно создать extension для опционального типа, хоть и не самым простым и очевидным способом.
  
### Extension для дженерика
  Kotlin позволяет создавать расширения для дженерика, что означает, что данная функция будет доступна для любого класса. Помимо того, что данная функция будет доступна для любого класса, дженерик можно также использовать в качестве параметра и возвращаемого значения, выглядит это следующим образом:
```kotlin
fun <T> T.parameterOrSelf(parameter: T?): T {
    return parameter ?: this
}
```   
В Swift нет возможности создать ничего похожего. Тем не менее можно сделать extension для NSObject, что покроет только классы, которые наследуются от NSObject, что также не позволяет использовать в качестве параметра или возвращаемого значения класс, тот же класс, у которого данная функция вызывается. 
  
### Extension внутри тела другого класса
В Kotlin есть возможность создать extension функцию для класса *A* прямо в теле класса *B*, при этом внутри этой функции будут доступны свойства обоих классов, и *A* и *B*. Выглядит это следующим образом:
```kotlin    
class MyClass {
    val myClassLocalVariable = "myClassLocalVariable"
    fun doSomething() {
        println("Normal doSomething")
    }
}

class WrapperClass {

    private val wrapperLocalVariable = "wrapperLocalVariable"

    fun MyClass.printBoth() {
        println("$wrapperLocalVariable $myClassLocalVariable")
    }
}
```  
Если же мы попытаемся сделать то же самое в Swift:
```swift  
class WrapperClass {
    extension MyClass {
       func insideWrapped() {
           print("insideWrapped")
       }
    }
}
```  
То получим ошибку говорящую, о том, что объявление расширений возможно только в скоупе файла: 
  
    declaration is only valid at file scope
  
### Доступ к приватным полям 
  В Swift расширения имеют доступ к приватным поля класса, который они расширяют. Пример: 
```swift  
class MyClass {
    private let localVal = "localVal"
}

extension MyClass {
    func printLocalVal() {
       print(localVal)
    }
}
```  
Если мы напишем подобную конструкцию в Kotlin, результатом будет ошибка:
```kotlin
class MyClass {
   private val localVal = "localVal"
}

fun MyClass.printLocalVal() {
    println(localVal) // Cannot access 'localVal': it is private in 'MyClass'
}
```

### Добавление нового конструктора через extension 
В Swift можно добавить свой собственный конструктор для уже существующего класса, через extension. Например, конструктор для класса String:
```swift  
extension String {
    init(myClass: MyClass) {
        self = myClass.localVal
    }
}
```
Kotlin же, не позволяет задавать новый конструктор классу через extension.
  
### Использование extension для реализации протокола/интерфейса
Swift позволяет добавить реализацию протокола в виде расширения к классу, это позволяет держать реализации протоколов отдельно от самого класса, а также позволяет добавить реализацию протокола уже существующему классу, к исходному коду которого у нас нет доступа.
```swift   
protocol MyProtocol {
    func sayHello()
}

extension String: MyProtocol {
   func sayHello() {
       print("Hello String")
   }
}
```

### Переопределение расширений родительского класса
В Swift есть возможность переопределить расширение родительского класса прямо внутри класса, но для этого переопределяемый метод должен быть помечен атрибутом `@objc`. Пример:
```swift
class A {}

extension A {
    @objc func extensionFunction() {
        print("I am A")
    }
}

class B: A {
    override func extensionFunction() {
        print("I am B")
    }
}

let example: A = B()
example.extensionFunction()
```    
Результатом выполнения этого кода будет `I am B`

В Kotlin, переопределить расширения родительского класса внутри класса нельзя, но можно создать расширение для дочернего класса с точно такой же спецификацией и оно будет иметь приоритет над родительским. Однако есть кейс, в котором этот механизм отработает не самым очевидным способом. Пример:
```kotlin
open class A {}
class B: A() {}

fun A.extensionFunction() {
    println("I am A")
}

fun B.extensionFunction() {
    println("I am B")
}

fun main() {
    val b: B = B()
    val a: A = b
    b.extensionFunction()
    a.extensionFunction()
}
```   
Результатом выполнения данного кода будет: 
```
    I am B
	I am A
```
То есть несмотря на то, что фактически переменная `a` имеет класс `B`, вызывается родительская функция, так как тип переменной указан как `A`. 

## Добавление нового свойства классу через extension
По части добавления свойств классу, через механизм расширений, Swift и Kotlin практически не отличаются. В обоих языках можно добавить свое свойство существующему классу, но оно не сможет хранить значение, то есть у него может быть только getter. Пример: 
	
**Kotlin**
```kotlin
val <T> List<T>.lastIndex: Int
    get() = size - 1
```    
**Swift**
```swift
extension Double {
    var km: Double { return self * 1_000.0 }
    var m: Double { return self }
    var cm: Double { return self / 100.0 }
    var mm: Double { return self / 1_000.0 }
    var ft: Double { return self / 3.28084 }
}
```

## Материалы для более подробного ознакомления: 
- [Kotlin vs Swift: The Extension](https://medium.com/mobile-app-development-publication/kotlin-vs-swift-the-extension-5462b531260b) Статья, которая была взята за основу для этой статьи
- [Kotlin Extensions](https://kotlinlang.org/docs/extensions.html) Официальная документация Kotlin, раздел расширений
- [Swift Extensions](https://docs.swift.org/swift-book/LanguageGuide/Extensions.html) Официальная документация Swift, раздел расширений
