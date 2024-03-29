# Неочевидные кейсы, связанные с порядком инициализации в kotlin

## Порядок инициализации при создании объекта класса

1. Объявление свойств, указанных в конструкторе класса и присвоение им значений;
2. Инициализация свойств в теле класса;
3. Выполнение кода в блоке init
*если свойств в теле класса и блоков init объявлено несколько, они инициализируются в том же порядке, в каком были объявлены*

### Пример

````kotlin
class Person(val name: String) {
    val cat = "Это свойство будет проинициализировано первым"

    init {
        //Этот блок инициализации будет проинициализирован следом за свойством cat
        doSomething()
    }

    val dog = "Это свойство будет проинициализировано следом за блоком инициализации"

    init {
        //Второй блок инициализации будет проинициализирован последним
    }

    fun doSomething() {
        // здесь будет код...
    }
}
````

## Порядок инициализации вложенных и внутренних классов

Вложенные классы не имеют доступа к переменным внешнего класса. При создании экземпляра вложенного класса экземпляр внешнего класса (в котором объявлен вложенный), создан не будет.

Экземпляр внутреннего класса всегда хранит ссылку на экземпляр внешнего класса. Вначале создается экземпляр внешнего класса, а затем на его основе - экземпляр внутреннего класса

### Пример вложенного класса

````kotlin
class Person {
    val cat = "Cat"
    val dog = "Dog"

    class Nested {
        // у класса нет доступа к переменным cat и dog
    }
}
````

### Пример внутреннего класса

````kotlin
class Person {
    val cat = "Cat"
    val dog = "Dog"

    inner class Inner {
        // может обращаться к свойствам внешнего класса
        val catDog = cat + dog
    }
}
````

## Первичные и вторичные конструкторы

Класс может иметь основной конструктор и один или более дополнительных конструкторов для создания объектов одного и того же класса разными способами.

Алгоритм инициализации при создании объекта с помощью разных конструкторов:
[алгоритм](./init_algorhitm.png)

## Порядок инициализации класса-наследника

При создании экземпляра класса-наследника вначале будет проинициализирован родительский класс

# Кейсы

## Использование свойства до его инициализации

Свойство **string** класса **RuntimeExceptionCase** используется до его инициализации, вызывая исключение во время выполнения: java.lang.NullPointerException: Parameter specified as non-null is null. Не проинициализированное свойство типа String получает значение null перед тем, как у него будет вызван метод startsWith(). **Компилятор не подсветит ошибку**

````kotlin
  class RuntimeExceptionCase {
    private val string: String

    init {
        this.crash() // ошибка выбрасывается здесь
        string = "String was initialized"
    }

    private fun crash() {
        string.startsWith("init")
        // Non-null свойство типа String в этой строчке примет значение null
        print("In RuntimeException case value of non-null type String= $string")
    }
}
  ````

## Предыдущий кейс с использованием свойства до его инициализации без выбрасывания исключения

Как и в предыдущем случае, компилятор не подсветит ошибку

````kotlin
object {
    val string: String

    init {
        // Non-null свойство типа String будет иметь значение null, которое будет выведено на экран при выполнении этой строки
        println(valueOfString())
        string = "Some value"
    }

    fun valueOfString(): String = string
}
````

## Кейс с обращением в блоке init класса-родителя к свойству, переопределенному в классе-наследнике

При создании класса DerivedFromBase выбрасывается исключение во время выполнения: *java.lang.NullPointerException: Attempt to invoke interface method 'int java.util.List.size()' on a null object reference.* Это происходит из-за того, что в первую очередь инициализируется базовый класс **Base**, создается его конструктор и выполняется код в его блоке *init*. На этот момент конструктор производного класса **DerivedFromBase** еще не запущен, свойство **items** не проинициализировано и имеет значение *null*. Однако в блоке *init* происходит обращение к переопределенному в классе-наследнике свойству **size**, выполняется код получения размера у списка элементов **items** и мы получаем NPE.

````kotlin
open class Base {
    open val size: Int = 0

    init {
        println("size = $size")
    }
}

class DerivedFromBase : Base() {
    private val items = mutableListOf(1, 2, 3)
    override val size: Int get() = items.size
}
````

## Кейс с описанием порядка инициализации свойств класса-наследника

Представим, что существует класс **Player**, который унаследован от абстрактного класса **GameObject**:

````kotlin
class Player(x: Float, y: Float) : GameObject(x, y) {
    override val width = 3F
    override val height = 4F
}

abstract class GameObject(x: Float, y: Float) {
    abstract val width: Float
    abstract val height: Float

    val bounds = Bounds(x, y, width, height)
}

data class Bounds(val x: Float, val y: Float, val width: Float, val height: Float)
````

Внутри класса-родителя создается объект класса **Bounds**, в параметры конструктора которого приходят свойства, переданные в конструктор класса **GameObject**.

При создании экземпляра класса **Player** передадим в параметры значения для x и y:

````kotlin
val player = Player(1F, 2F)
````

Что же будет выведено на экран при выполнении этого кода?

````kotlin
println(player.bounds)
````

Результат:

````kotlin
Bounds(x = 1.0, y = 2.0, width = 0.0, height = 0.0)
````

Почему результат не окажется таким?

````kotlin
Bounds(x = 1.0, y = 2.0, width = 3.0, height = 4.0)
````

При создании класса **Player** вначале происходит инициализация его класса-родителя GameObject, внутри которого создается объект класса **Bounds**. К моменту инициализации класса **Player** свойство **bounds** внутри класса-родителя уже проинициализировано значениями: x=1, y=2, которые были переданы в параметры конструктора **Player** и значениями ширины и высоты из родителя **GameObject** width=0.0, height=0.0

## Кейс, иллюстрирующий приоритет выполнения блока init перед вторичным конструктором

Представим, что есть класс с первичным и вторичным конструктором:

````kotlin
class ClassWithSecondaryConstructor(var result: String) {
    constructor(firstValue: String, secondValue: String) : this(firstValue) {
        this.result += secondValue
    }

    init {
        result += "not "
    }
}
````

При создании объекта этого класса с помощью вторичного конструктора

````kotlin
val case = ClassWithSecondaryConstructor(firstValue = "Vegetables are ", secondValue = "healthy")
````

и выполнения следующего кода

````kotlin
println(case.result)
````

на экран будет выведена строка *Vegetables are not healthy*. Почему не *Vegetables **are** healthy?*

Вернемся к иллюстрации:
[алгоритм](./init_algorhitm.png)

В процессе инициализации при создании экземпляра класса **ClassWithSecondaryConstructor** после вызова вторичного конструктора будет вызван основной конструктор класса + произойдет выполнение кода в его блоке *init* перед выполнением кода в теле вторичного конструктора. Такми образом, этот код

````kotlin
result += "not "
```` 

будет выполнен перед конкатенацией значений, переданных в параметры вторичного констуктора

````kotlin
this.result += secondValue
````

<div style={{textAlign:"right"}}>Автор: <a href="https://github.com/maria-93">@maria-93</a></div>
