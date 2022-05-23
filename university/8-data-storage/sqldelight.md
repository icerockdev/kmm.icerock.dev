---
sidebar_position: 2
---

# SqlDelight

## Реактивный источник данных

## Проблема и решение
Почти во всех приложениях обязательно есть работа с данными, которые мы получаем от сервера, из интернета, от базы данных и т.д.  
Какие-то данные будут отображаться на одном экране приложения, какие-то на двух, а какие-то на трех и более.

Например, приложение любой социальной сети: один пост может быть репостнут разными людьми и группами. У поста есть лайки, комментарии, репосты и просмотры.  
Чтобы на всех экранах отображать данные о постах в актуальном состоянии мы можем закидывать сервер запросами, однако нет гарантии, что мы нигде не ошибемся и где-нибудь не забудем добавить обновление. Из-за этого отображение поста на разных экранах будет отличаться. В любом случае, поддерживать такой проект будет очень тяжело.

Чтобы избежать всех этих проблем нам нужно использовать такой источник данных, который бы позволил обновлять данные автоматически, а не вручную.  
То, что нам нужно называется ***Реактивный источник данных*** - он выдает подписки, т.е. что-то, на что мы можем подписаться из. Благодаря этому, при любых обновлениях данных в источнике на экране они также обновятся.

Как это представлено в проекте:
- источник данных, который ильпользует паттерн [Observer](https://ru.wikipedia.org/wiki/%D0%9D%D0%B0%D0%B1%D0%BB%D1%8E%D0%B4%D0%B0%D1%82%D0%B5%D0%BB%D1%8C_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F)), например [Flow](https://developer.android.com/kotlin/flow) или [LiveData](https://developer.android.com/topic/libraries/architecture/livedata):
    - база данных, которая выдает `Flow`
    - репозиторий, который держит `StateFlow` или `LiveData` в оперативной памяти
    - `Socket`, который выдает `Flow`
- подписываемся на `Flow` или `LiveData` у источника данных

## Пример реализации
### Реализация источника данных
Разберем на примере [SQLDelight](https://cashapp.github.io/sqldelight/) базы данных и `Flow`.  
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
Сделайте приложение, которое содержит:
- Реактивный репозиторий
- Источник данных для репозитория - база данных [SQLDelight](https://cashapp.github.io/sqldelight/)
- Экран со списком элементов, и двумя кнопками
    - данные для списка реактивно тянутся от репозитория
    - по нажатию на первую кнопку в БД добавляется еще один элемент списка
    - по нажатию на вторую кнопку БД очищается
