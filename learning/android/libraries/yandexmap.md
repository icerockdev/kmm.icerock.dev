# Яндекс карты

## Документация

- [Документация](https://yandex.ru/dev/maps/mapkit/doc/intro/concepts/about.html?from=mapkit)

## Особености работы листенеров
Если добавить на карту InputListener и не сохранить на него ссылку, например вот так
```kotlin
addInputListener(object : InputListener {

    override fun onMapTap(p0: Map, p1: Point) {
        viewModel.onMapMarkerClick(null)
    }

    override fun onMapLongTap(p0: Map, p1: Point) {
        //do nothing
    }
})
```
То этот слушатель может быть уничтожен сборщиком мусора, так как все слушатели яндекс карт являются WeakReference

## Перейти к области
Если необходимо переместить камеру к выбранной области (например переместить карту к группе пинов), можно использовать метод карты
```kotlin
 val camera = mapView.map.cameraPosition(
                BoundingBox(
                    Point(southWest.latitude, southWest.longitude),
                    Point(northEast.latitude, northEast.longitude)
                )
            )
 mapView.map.move(camera)
```
Данный метод игнорирует точку фокусировки карты, и перемещает камеру так, что-бы введеная область была полностью видна в центре mapView