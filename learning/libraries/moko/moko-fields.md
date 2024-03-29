---
sidebar_position: 6
---

# moko-fields

Библиотека [moko-fields](https://github.com/icerockdev/moko-fields) позволяет реализовывать формы ввода, а также их валидацию в общем коде.  
<iframe src="//www.youtube.com/embed/a9RnGvYS4sY" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
<br/>

<iframe src="//www.youtube.com/embed/WXBbbF5pKho?list=PL6yFiPOVXVUi90sQ66dtmuXP-1-TeHwl5" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>

## FormField

Потребность в библиотеке возникла из-за того, что для создания логики формы ввода в общем коде необходимы следующие элементы:
- `LiveData(String)` - текст поля
- `LiveData(Bool)` - валидно/невалидно поле 
- `LiveData(String)` - текст ошибки валидации

А представьте, что у вас 7 или 8 таких полей, получится много однотипного кода, в котором легко будет запутаться и допустить ошибку.

Библиотека позволяет использовать специальный класс `FormField` для форм ввода, который включает в себя все эти три лайвдаты.

Для создания `FormField` необходимо только установить тип и задать валидацию для этого значения. Тип поля не обязательно должен быть `String`, подойдет любой, который можно как-то установить: `int`, `bitmap`, `data` и тд.

## Валидация
Разберем, как добавлять валидацию в `FormField`:
- можно использовать [встроенные валидаторы](https://github.com/icerockdev/moko-fields/tree/c9c09069da717d4995ee6c96f8ec6ef7446af503/fields/src/commonMain/kotlin/dev/icerock/moko/validations)
- можно создать полностью свою валидацию

Как можно настроить валидацию:
- валидацию можно вызвать в любой момент. Зачем это?
    - при первом вводе юзера - валидация не должна проверяться, пока он не закончит ввод до конца, и не нажмет кнопку, к которой будет привязана валидация, чтобы, пока он еще не ввел все, что задумал, у него не светились ошибки.
- поля можно объединить в список и валидировать их одновременно
- валидация полей может быть завязана на других полях (пароль + повторите пароль)
- у FormField есть поле `isValid` и `validationError`
