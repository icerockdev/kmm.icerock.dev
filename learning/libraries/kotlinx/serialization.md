# serialization

- [Официальная документация](https://kotlinlang.org/docs/serialization.html)

## Интересные моменты

Сериализация дает способ получить список аннотаций для класса и его свойств через `SerialDescriptor`.
В этот список попадают только аннотации, отмеченные `@SerialInfo`. Доступ к аннотациям класса — через
`descriptor.annotations`, к аннотациям свойства — через `descriptor.getElementAnnotations(index)`.
