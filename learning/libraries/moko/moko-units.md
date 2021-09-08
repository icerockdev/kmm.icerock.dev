# moko-units

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

