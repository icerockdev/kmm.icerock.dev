---
sidebar_position: 2
---

# SQLDelight

## SQLDelight

[SQLDelight](https://cashapp.github.io/sqldelight/multiplatform_sqlite/) - это библиотека для удобной работы с БД в общем коде. Она позволяет генерировать классы и методы для работы с базой данных.

Статьи для пошаговой настройки библиотеки:
- [Configuring SQLDelight and implementing cache logic](https://play.kotlinlang.org/hands-on/Networking%20and%20Data%20Storage%20with%20Kotlin%20Multiplatfrom%20Mobile/05_Configuring_SQLDelight_an_implementing_cache) от Kotlin
- [Настройка SQLDelight для хранения данных](https://runebook.dev/ru/docs/kotlin/docs/kmm-configure-sqldelight-for-data-storage)

Изучите [что такое миграции](https://habr.com/ru/post/121265/) и [прочитайте](https://cashapp.github.io/sqldelight/jvm_sqlite/migrations/) как их создавать в SQLDelight.

## Реактивный источник данных c SQLDelight

Для начала, вспомните что такое [реактивный источник данных](../icerock-basics/repository#проблема-и-решение)

Сейчас мы разберем, как реализовать реактивный источник данных, используя [SQLDelight](https://cashapp.github.io/sqldelight/) базу данных и `Flow`.

### Реализация источника данных
 
Допустим, у нас есть экран со списком кораблей, по клику на элемент списка нужно показать детальную информацию о конкретном корабле на следующем экране.
Как вы уже знаете из [статьи](/learning/android/data-sharing#какие-данные-можно-передавать), передавать нужно идентификаторы данных, а не сами данные.  
Поэтому, по клику на корабль мы будем передавать `id` этого корабля на следующий экран, а там уже обращаться в БД и получать данные интересующего нас корабля.

Создадим таблицу, в которой будет храниться информация о корабле и запрос, позволяющий получить корабль по `id`.  
Вот как будут выглядеть таблица и запрос:

```sqldelight
CREATE TABLE ShipsTable (
    id INTEGER AS Int PRIMARY KEY,
    name TEXT NOT NULL, 
    buildYear TEXT NOT NULL, 
    peopleCount INTEGER AS Int NOT NULL,
    maxSpeed REAL AS Double NOT NULL,
    loadCapacity INTEGER AS Int NOT NULL,
    rating INTEGER AS Int NOT NULL
);

getShipById:
SELECT *
FROM ShipsTable
WHERE id = :shipId;
```

`shipId` в строке `WHERE id = :shipId;` - это название аргумента, который будет принимать функция `getShipById`.  
Вот какая функция будет сгенерирована:

```kotlin
public fun getShipById(shipId: Int): Query<ShipsTable>
```

Названия аргументов не обязательно указывать явно - можно использовать `?`, однако это очень неудобно.  
Например, у нас есть ~~очень полезная~~ функция `getShips`, позволяющая получить все корабли, если угадать и подставить подходящие аргументы :) Она принимает 3 параметра:
```sqldelight
getShips:
SELECT *
FROM ShipsTable
WHERE ? > 123 & ? < 456 & length(?) < 7;
```
Опустим обсуждение её смысла и полезности, посмотрим на то, что будет сгенерировано в этом случае:

```kotlin
public fun getShips(
  `value`: Long,
  value_: Long,
  value__: Long?
): Query<ShipsTable>
```
Согласитесь, по названиям `value` не понятно абсолютно ничего: зачем эти аргументы, за что они отвечают и тд. Еще непонятнее станет вашему коллеге, который это увидит.  
Поэтому, старайтесь всегда использовать именованные аргументы.

После создания таблицы и вызова нужной `gradle-задачи` - `generateSqlDelightInterface`, нам будем доступен для использования класс этой таблицы.

`ShipsTable.kt`:
```kotlin
public data class ShipsTable(
  public val id: Int,
  public val name: String,
  public val buildYear: String,
  public val peopleCount: Int,
  public val maxSpeed: Double,
  public val loadCapacity: Int,
  public val rating: Int
) {
  public override fun toString(): String = """
  |ShipsTable [
  |  id: $id
  |  name: $name
  |  buildYear: $buildYear
  |  peopleCount: $peopleCount
  |  maxSpeed: $maxSpeed
  |  loadCapacity: $loadCapacity
  |  rating: $rating
  |]
  """.trimMargin()
}
```
Реализация метода `getShipById` будет следующей:

```kotlin
fun getShipById(id: Int): Flow<ShipsTable?> {
  return shipsQueries.getShipById(id)
    .asFlow()
    .mapToOneOrNull()
}
```

В этой реализации есть одна проблема - мы работаем со сгенерированным на основе таблицы классом `ShipsTable`:
- при добавлении, удалении или изменении полей из таблицы нам может понадобиться исправлять все места, где используются объекты `ShipsTable`
- объекты `ShipsTable` будут содержать абсолютно все поля БД, которые редко будут нужны все сразу

Чтобы избежать этих проблем, создадим свой класс `Ship`, с объектами которого мы будем работать во всем приложении. Также, добавим `extension` - `ShipsTable.toFeature()` с помощью которого будем преобразовывать объекты `ShipsTable` в `Ship`.

`Ship.kt`:
```kotlin
data class Ship(
    val id: Int,
    val name: String,
    val buildYear: String,
    val peopleCount: Int,
    val maxSpeed: Double,
    val loadCapacity: Int,
    val rating: Int
)
```

`ShipsTableMapper.kt`:
```kotlin
internal fun ShipsTable.toFeature(): Ship = Ship(
    id = this.id,
    name = this.name,
    buildYear = this.buildYear,
    peopleCount = this.peopleCount,
    maxSpeed = this.maxSpeed,
    loadCapacity = this.loadCapacity,
    rating = this.rating
)
```

Обновленный метод `getShipById`:

```kotlin
fun getShipById(id: Int): Flow<Ship?> {
  return shipsQueries.getShipById(shipId = id)
    .asFlow()
    .mapToOneOrNull()
    .map { it?.toFeature() }
}
```
Такой подход позволит нам спокойно менять таблицу. После изменений нам нужно будет изменить только один метод - `toFeature()`.

### Как подписаться на Flow

Итак, теперь мы получаем от таблицы не просто объект `Ship`, а `Flow`, на который можем подписаться из `viewModel`:

Вариант подписки, используя `StateFlow`:
```kotlin
val currentShip: StateFlow<Ship?> = repository.getShipById(id).stateIn(viewModelScope, SharingStarted.Eagerly, null )
```

Вариант подписки, используя `LiveData`:
```kotlin
val currentShip: LiveData<Ship?> = repository.getShipById(id).asLiveData(viewModelScope, initialValue = null)
```

Теперь, если данные в таблице изменятся, то все методы, у которых изменилось возвращаемые значение, вызовутся еще раз. Все места в приложении, где используются данные из этого запроса, обновятся. Нигде не придется ничего вызывать и обновлять вручную. Данные изменились - `UI` сразу обновится.

Например: в источнике данных обновился `rating` корабля с идентификатором `id` - он автоматически обновится на всех экранах, где мы его отображаем, потому что результат `repository.getShipById(id)` - это `Flow`, а мы на него подписались.

## Практическое задание
Подключите базу данных [SQLDelight](https://cashapp.github.io/sqldelight/multiplatform_sqlite/) к вашему приложению, выполните следующие условия: 
  - Создание БД должно происходить в `SharedFactory`
  - Доступ к БД должен быть только у репозитория 
  - Создайте таблицу - `RepoTable` с двумя столбцами: id и testMessage
  - Создайте метод для добавления записи в БД
  - Создайте метод для получения всех записей в БД
  - Протестируйте работоспособность вашей БД

Главное - чтобы проект запустился и заработал на обеих платформах, дальше в практике мы заполним БД.
