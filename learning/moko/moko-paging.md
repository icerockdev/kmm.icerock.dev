# moko-paging

Библиотека [moko-paging](https://github.com/icerockdev/moko-paging) позволяет загружать
список элементов, используя пагинацию.

## Основные компоненты

Главным компонентов является класс `Pagination`.
В большинстве случаев объект этого класса будет иметь примерно следующий вид:

```kotlin
val pagination = Pagination(
    parentScope = viewModelScope,
    dataSource = LambdaPagedListDataSource<Data> { currentList ->
        val offset = TODO("some logic")
        val limit = TODO("some logic")
        repository.loadData(offset, limit)
    },
    comparator = Comparator { a, b ->
         a.id - b.id
    },
    nextPageListener = { result: Result<List<Int>> ->
        TODO("check result")
    },
    refreshListener = { result: Result<List<Int>> ->
        TODO("check result")
    },
    initValue = emptyList()
)
```

Передаваемые компоненты:

- `parentScope` - объект `CoroutineScope`, в котором будут происходить запросы на получение и обновление списка данных;
- `dataSource` - объект `PagedListDataSource`, ответственный за получение новых данных на основе уже имеющихся;
- `comparator` - объект `Comparator`, за счет которого будут определяться новые элементы списка;
- `nextPageListener` - лямбда, в которой можно обработать успешный или неуспешный результат загрузки новых данных;
- `refreshListener` - лямбда, в которой можно обработать успешный или неуспешный результат обновления всего списка данных;
- `initValue` - первоначальное значение списка.

В примере выше используется `viewModelScope`, однако его можно заменить на любой другой объект `CoroutineScope`.

Также там используется объект `LambdaPagedListDataSource` - ему в конструктор передается лямбда,
в которой и происходит получение новых данных.

Для проверки элементов списка на совпадение используется простое сравнение `id` этих элементов.
Также можно использовать сравнение хешей или любой другой способ:

```kotlin
comparator = { a, b -> a.hashCode() - b.hashCode() }
```

Лямбды `nextPageListener` и `refreshListener` удобно использовать для показа ошибок при дозагрузке/обновлении данных:

```kotlin
nextPageListener = { it.onFailure(::showError) }
refreshListener = { it.onFailure(::showError) }
```

## Использование пагинации

Для загрузки, дозагрузки и обновления данных используются специальные методы класса `Pagination`:

```kotlin
pagination.loadFirstPage()
pagination.loadNextPage()
pagination.refresh()
```

Из объекта `Pagination` можно получить `state` - общее состояние пагинации, а также кое-что еще.
В примере ниже показаны наиболее часто использующиеся состояния экрана, получаемые из объекта `Pagination`:

```kotlin
val isEmpty: LiveData<Boolean> = pagination.state.isEmptyState()
val isLoading: LiveData<Boolean> = pagination.state.isLoadingState()
val isRefreshing: LiveData<Boolean> = pagination.refreshLoading

val isErrorVisible: LiveData<Boolean> = pagination.state.isErrorState()
val error: LiveData<Throwable?> = pagination.state.error()

val isDataVisible: LiveData<Boolean> = pagination.state.isSuccessState()
val data: LiveData<List<Data>?> = pagination.state.data()
```

## Пример для копирования в проект

Данный код можно скопировать в ViewModel, заменив в нем Data на класс с загружаемыми данными:

```kotlin
private val pagination = Pagination(
    parentScope = viewModelScope,
    dataSource = LambdaPagedListDataSource<Data> { list ->
        repository.getData(
            offset = list?.size ?: 0,
            limit = PAGINATION_LIMIT
        )
    },
    comparator = { a, b -> (a.id - b.id).toInt() },
    nextPageListener = { it.onFailure(::showError) },
    refreshListener = { it.onFailure(::showError) },
    initValue = emptyList()
)

val isEmpty: LiveData<Boolean> = pagination.state.isEmptyState()
val isLoading: LiveData<Boolean> = pagination.state.isLoadingState()
val isRefreshing: LiveData<Boolean> = pagination.refreshLoading

val isErrorVisible: LiveData<Boolean> = pagination.state.isErrorState()
val error: LiveData<Throwable?> = pagination.state.error()

val isDataVisible: LiveData<Boolean> = pagination.state.isSuccessState()
val data: LiveData<List<Data>> = pagination.state.data()

init {
    pagination.loadFirstPage()
}

fun onLoadNextPage() {
    pagination.loadNextPage()
}

fun onRefresh() {
    pagination.refresh()
}

private fun showError(error: Throwable) {
    eventsDispatcher.dispatchEvent {
        showError(errorMapper(error))
    }
}

interface EventsListener {
    fun showError(error: StringDesc)
}

companion object {
    private const val PAGINATION_LIMIT = 20
}
```

## Часто задаваемые вопросы

### Как обрабатывать ошибку первой загрузки данных? Почему нет отдельного листенера для этой ошибки?

При первой загрузке данных ошибка передается в `pagination.state`.
Экран, содержащий список с пагинацией, должен иметь специальное состояние для показа ошибки
(поэтому для этой ошибки нет отдельного листенера).
На состояние ошибки можно подписаться, получив его через `pagination.state.error()` (см. пример выше).

### Почему при дозагрузке данных ошибка не попадает в `pagination.state`?

Ошибка при дозагрузке данных в состояние пагинации не попадает, чтобы в объекте
`pagination.state` сохранилось успешное состояние, полученное при первой загрузке данных
(иначе бы это состояние затиралось при неуспешной дозагрузке).
Для обработки ошибки дозагрузки добавлен листенер - `nextPageListener`.

### Можно ли обновить данные в `Pagination` вручную?

Да, можно. В `Pagination` для этого есть методы `setData(items)` и `setDataSuspend(items)`.
Однако при работающей пагинации использовать их не стоит, для ручного добавления/обновления данных
лучше использовать отдельную `MutableLiveData`:

```kotlin
private val paginationData: LiveData<List<Data>?> = pagination.state.data()

private val otherData: MutableLiveData<List<Data>> = MutableLiveData(emptyList())

val combinedData: LiveData<List<Data>> = paginationData.mergeWith(otherData) { one, other ->
    TODO("some logic of combining two lists")
}
```
