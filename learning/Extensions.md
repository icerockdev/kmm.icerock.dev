
# Extensions в Koltin и Swift

Не смотря на то, что Extensions имеют одинаковую суть - расширение функицонала класса, они имеют множество различий в возможностях в Swift и Kotlin. 
Для начала рассмотрим базовый синтаксис создания расширения.

**Kotlin**

    class MyClass { }
    fun MyClass.extensionFunction() { }
    
**Swift**

    class MyClass { }
    extension MyClass {
        func extensionFunction() { }
    }
    
## Различия в возможностях Extensions в Kotlin и Swift
В таблице приведены основные различия между расширениями двух языков.

|Котлин                                                          |Свифт |
|--------------------------------------------------|--------------------------------------------------|
|Можно создать extension для опционального типа |Нельзя создать extnsion для опционального типа (на самом деле можно) |
|Можно создать extension для дженерика |Нельзя (Костыль через NSObject)|
|Можно создать extension для класса внутри другого класса, с доступом полям обоих классов |Нельзя создать extension внутри класса|
|Не имеет досткп к приватным полям |Extension имеет доступ к приватым полям класса |
|Нет возможности задать новый конструктор через extansion |Можно создать новый конструктор как extenison |
|Нельзя реализовать интерфейс через extenaion |Можно Реализовать протокол через extension |

Дальше рассмотрим каждый пункт по отдельности

### Extension для опционального типа 
В Kotlin это доступно с простым и красивым синтаксисом 

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

Если мы попробуем написать что-то похожее в Swift: 

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
    
То получим закономерную ошибку - *"constrained extension must be declared on the unspecialized generic type 'Optional' with constraints specified by a 'where' clause"*. Которая дает нам подсказку о том, как же все таки реализовть extension для опционального типа в Swift. Нам нужно создать extension для перечисления *Optional<Wrapped>* с указанием, нашего класса в качестве *Wrapped*. Пример:
  
    extension Optional where Wrapped: MyClass  {
        func extensionFunc() {
            self == nil ? print("Null doSomething") : self?.doSomething()
       }
    }
  
Таким образом выходит, что в Swift, все таки можно создать extension для опционального типа, хоть и не самым простым и очевидным способом.
  
### Extension для дженерика
  Kotlin позволяет создавать расширения для дженерика, что означает, что данная функция будет доступна для любого классе, выглядит это следующим образом:

    fun <T> T.strLen() {
       println(toString().length)
    }
   
В Swift нет возможности создать ничего похожего. Тем не менее можно сделать extension для NSObject, что покроет только классы, которые наследуются от NSObject.
  
### Extension внутри тела другого класса
В Koltin есть возможность создать extension функцию для класса *A* прямо в теле класса *B*, при этом внутри этой функции будут доступны свойства обоих классов, и *A* и *B*. Выглядит это следующим образом:
    
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
  
Если же мы попытаемся сделать тоде самое в Swift:
  
    class WrapperClass {
        extension MyClass {
           func insideWrapped() {
               print("insideWrapped")
           }
        }
    }
  
То получим ошибку говорящую, о том, что объявление расширений возможно только в скоупе файла: 
  
    declaration is only valid at file scope
  
### Доспуп к приватным полям 
  В Swift расширения имеют доступ к приватным поля класса, который они расширяют. Пример: 
  
    class MyClass {
        private let localVal = "localVal"
    }

    extension MyClass {
        func printLocalVal() {
           print(localVal)
        }
    }
  
Если мы напишем подобную конструкцию в Kotlin, результатом будет ошибка:

    class MyClass {
       private val localVal = "localVal"
    }

    fun MyClass.printLocalVal() {
	    println(localVal) // Cannot access 'localVal': it is private in 'MyClass'
    }
  
### Добавление нового конструктора через extension 
В Swift можно добавить свой собственный конструктор для уже существующего класса, через extension. Например конструктор для класса String:
  
    extension String {
        init(myClass: MyClass) {
            self = myClass.localVal
        }
    }

Kotlin же, не позволяет задавать новый конструктор классу через extension.
  
### Использование extension для реализации протокола/интерфейса
Swift позволяет добавить реализацию протокола в виде расширения к классу, это позволяет держать реализации протоколов отдельно от самого класса, а также позволяет добавить реализацию протокола уже существующему классу, к исходному коду которого у нас нет доступа.
   
    protocol MyProtocol {
        func sayHello()
    }

    extension String: MyProtocol {
       func sayHello() {
           print("Hello String")
       }
    }
