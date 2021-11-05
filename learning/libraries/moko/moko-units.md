# moko-units

Это библиотека для управления списками и коллекциями из общего кода приложения.

<iframe src="//www.youtube.com/embed/ES6lHIwp5Jw?list=PL6yFiPOVXVUi90sQ66dtmuXP-1-TeHwl5" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<iframe src="//www.youtube.com/embed/aT1i2vN6H6U?list=PL6yFiPOVXVUi90sQ66dtmuXP-1-TeHwl5" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
<br/>

## Зачем нужна UnitFactory

Иницилизация всех view-моделей происходит на нативной стороне через нашу SharedFactory, которая несет в себе методы для создания фабрик фичей.

Например, iOS испльзует TableView и CollectionView для отображения набора данных, а Android - RecyclerView. 
Следовательно, каждая платформа требует конкретной реализации табличных данных, зависящей от единной модели.

Модель ячейки как раз и описывает конкретный метод из нашего интерфейса.

Для лучшего понимания рассмотрим простой пример: 
```kotlin
/*
*   ListUnitFactory.kt
*/

// Интерфейс создания юнитов для таблицы с однотипными ячейками
interface ListUnitFactory {
    // предопределение метода создания ячейки с текстом
    fun createItem(
        text: String
        itemId: Int
    ): TableUnitItem
}
```

В свою очередь методы этой фабрики нам нужно использовать внутри view-модели, для создания модели самой таблицы: 

```kotlin
/*
*   ListViewModel.kt
*/

val units: List<TableUnitItem> = listOf(
    unitFactory.createItem(text = "Start use Units", itemId = 0),
    unitFactory.createItem(text = "moko-units =)", itemId = 1),
    unitFactory.createItem(text = "Hello Units!", itemId = 2),
    unitFactory.createItem(text = "Wooooww!", itemId = 3)
)
```

А сама реализация создания "юнитов" происходит на платформе при помощи вспомогательных классов:

iOS: 

```swift
/*
*   ListUnitFactoryImpl.swift
*/

import UIKit
import MultiPlatformLibrary
import MultiPlatformLibraryUnits

// реализация интерфейса из общей логики
class ListUnitFactoryImpl: ListUnitFactory {
    func createItem(text: String, itemId: Int32) -> TableUnitItem {
        // использования класса UITableViewCellUnit из пода MultiPlatformLibraryUnits
        return UITableViewCellUnit<TableViewCell>(
            data: .init(text: text), 
            itemId: Int64(itemId)
        )
    }
}
```

Android:

```kotlin
/*
*   ListUnitFactoryImpl.kt
*/

class ListUnitFactoryImpl: ListUnitFactory {
    override fun fun createItem(
        text: String,
        itemId: Int
    ): TableUnitItem = ListItem(
        text: text
        itemId: itemId
    )
    // в данном случае перевод модели во view элемент будет проиходить
    // не внутри реализации фабрики юнитов
}
```

Из всего вышесказанного можно сделать вывод, что нам необходима UnitFactory, чтобы создавать специфичные для платформы элементы с общей моделью, с возможностью управления ими из общей логики.

## Можно ли передавать лямбду в UnitItem?

Да (с использованием `weakLambda`), но нужно следить за цикличными ссылками, иначе будет утечка
памяти на iOS платформе.

Рассмотрим типовой сценарий - у нас есть `MyViewModel`, которая хранит у
себя `LiveData<List<TableUnitItem>>`, и в списке создаются UnitItem'ы, которые запоминают лямбду
обработчик нажатия.

```kotlin
class MyViewModel(private val unitFactory: MyUnitFactory) : ViewModel() {
    val items = MutableLiveData<List<TableUnitItem>>(emptyList())

    init {
        items.value = listOf(
            unitFactory.createItem(
                title = "press me",
                onPress = {
                    this.items.value = emptyList()
                }
            )
        )
    }
}
```

В данном примере есть reference cycle:

- `MyViewModel` удерживает `MutableLiveData`
- та в свою очередь удерживает `List<TableUnitItem>`
- тот в свою очередь удерживает конкретный экземпляр `TableUnitItem` который был возвращен при
  вызове метода `unitFactory`
- тот в свою очередь держит ссылку на лямбду переданную в `onPress`, чтобы вызвать ее в момент клика
- лямбда в свою очередь держит ссылку на `MyViewModel` чтобы при выполнении изменить значение
  свойства `items`

Когда весь цикл находится внутри Kotlin кода - все хорошо, на обеих платформах этот цикл будет
корректно обработан и утечки не произойдет. Но реализация интерфейса `MyUnitFactory` делается в
Swift, и сохранение лямбды переданной в `onPress` тоже будет на стороне Swift кода. Из-за этого
сборщик мусора Kotlin/Native рантайма не сможет определить можно ли удалять объект и поэтому
произойдет утечка.

Чтобы избежать такого рода утечек мы используем специальную функцию `weakLambda`
из [moko-utils](https://github.com/icerockdev/moko-utils). Она позволяет создать лябмду, в которой
receiver будет сохранен слабой ссылкой. Рабочий код будет выглядеть так:

```kotlin
class MyViewModel(private val unitFactory: MyUnitFactory) : ViewModel() {
    val items = MutableLiveData<List<TableUnitItem>>(emptyList())

    init {
        items.value = listOf(
            unitFactory.createItem(
                title = "press me",
                onPress = weakLambda(this) {
                    this.items.value = emptyList()
                }
            )
        )
    }
}
```

Мы передаем в `onPress` лямбду, которая не захватывает напрямую `viewModel` - мы передали ссылку
на `viewModel` как аргумент в `weakLambda` и далее указали саму лямбду, в которую переданная нами
ссылка придет уже слабой, в receiver аргумент.

[Реализация weakLambda](https://github.com/icerockdev/moko-utils/blob/master/utils/src/iosMain/kotlin/dev/icerock/moko/utils/withLambda.kt#L9)

## Можно ли хранить ссылку на контекст/активити/фрагмент внутри класса фабрики юнитов?

```kotlin
class MyViewModelUnitsFactoryImpl(private val context: Context) : MyViewModelUnistFactory {}
```

Нет. Фабрика юнитов имеет жизненный цикл вьюмодели, она переживает смерть активити/фрагмента (в том
числе и single activity), следовательно будет утечка. Контекст приложения можно передавать, но в нем
может не оказаться нужных для UnitItem'ов данных (например, темы активити или чего-то еще). Работа с
контекстом должна быть строго внутри самого UnitItem'а в сооветствующих методах (`createViewHolder`
и `bindViewHolder`) и полученный Context не должен сохраняться куда либо (его использование должно
ограничиваться данными методами UnitItem'а).

## Android Как подписаться на лайвдату в юните

Для случаев когда необходимо подписаться на лайвдату внутри юнита следует использовать Closable В VBViewHolder юнита мы можем сохранить его текущую подписку в storedRef

```kotlin
class VBViewHolder<VB : ViewBinding>(
    val binding: VB,
    val lifecycleOwner: LifecycleOwner,
) : RecyclerView.ViewHolder(binding.root) {
    val context: Context get() = itemView.context
    var storedRef: Any? = null
}
```

При переиспользовании вьюхолдера нам нужно изменить лайв дату на которую он подписан. Для этого нужно закрыть Closable который сохранен в вьюхолдере, чтобы отписаться от старой лайвдаты. И сохранить в него новый, который мы получим при подписке на актуальную лайвдату.
Пример:

```kotlin
override fun bindData(
    context: Context,
    lifecycleOwner: LifecycleOwner,
    viewHolder: VBViewHolder<ItemBiometrySwitchBinding>
) {
    (viewHolder.storedRef as? Closeable)?.close()
    viewHolder.storedRef = isSelectedLiveData.bind(lifecycleOwner) {
        viewHolder.binding.switchView.isChecked = it ?: true
    }
}   
```

## itemId - как и зачем?

Для коректного отображения нестатичных данных каждый элемент должен иметь свой уникальный 
идентификатор, зависящий от ключевых (неизменяемых) значений его сигнатуры. Иначе же при изменении модели ячейки, ее идентификатор будет меняться, что приведет к полному пересозданию ячейки, а не ее изменению.
Давайте разберем, что здесь написано на небольшом примере:

Пусть у нас есть эндпоинт `/news` нашего API для доступа к списку новостей, возвращаемый данные в некоторой сигнатуре. Необходимо создать таблицу для отображения этих данных.

Json ответ:

```json
{
    "news": [
        {
            "id": 1, // идентификатор
            "title": "Release Moko-Units!!!", // заголовок новости
            "description": "Wow , IceRock =)", // текст новости
            "views": 11 // количество просмотров, 
            // меняется когда просматривают запись на сайте, например
        }
    ]
}
```

В таком случае уникальный номер записи приходит с сервера, и мы спокойно может использовать его как itemId
конкретного юнита в нашей таблице. И при повторном запросе, при котором вполне может поменяться
количество просмотром данной записи, у нас произойдет изменение ячейки по ее идентификатору, а не полное ее пересоздание.

> Что делать, если данные приходят без идентификатора?

В таком случае можно самостоятельно выделить из модели данных ключевой элемент: 

```json
{
    "customers": [
        {
            "firstName": "Ivan", 
            "lastName": "Ivanov", 
            "phone": "+79999999999", // ключевое значение
            "ordersCount": 12 
            // ...
        },
        // ...
    ]
}
```

в последствии они будут переведены в data-класс:
```kotlin
data class CustomerModel(
    val firstName: String,
    val lastName: String,
    val phone: String,
    val ordersCount: Int,
    // ...
)
```

по ключевому значению которого можно взять хеш:

```kotlin

interface ListUnitFactory {
    // предопределение метода создания ячейки с текстом
    fun createCustomerItem(
        model: CustomerModel
        itemId: Int
    ): TableUnitItem
}

// ...
private val customers: MutableLiveData<List<CustomerModel>> = MutableLiveData(
    listOf(
        CustomerModel(
            firstName = "Ivan",
            lastName = "Ivanov",
            phone = "89999999999"
        ),
        // ...
    )
)

val units: LiveData<List<TableUnitItem>> = items.map { items ->
    items.map { 
        unitFactory.createCustomerItem(
            model = it,
            itemId = it.phone.hashCode()
        )
    }
}
```

Из-за использования хеш-функций мы снижаем вероятность коллизий
в идентификаторах ячеек нашей таблицы.

## Материалы

- [Репозиторий библиотеки](https://github.com/icerockdev/moko-units)
