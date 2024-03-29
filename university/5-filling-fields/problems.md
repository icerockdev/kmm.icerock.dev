---
sidebar_position: 1
---

# Что следует знать про формы ввода
Первым делом, посмотрите видео об основном, что следует знать о формах ввода:
<iframe src="//www.youtube.com/embed/2kvG8ZXVue4" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
<br/>

Ниже описаны тезисы из видео:
- Данные, введенные пользователем, должны валидироваться
  - Поле не должно валидироваться, пока юзер не закончил его ввод, чтобы не пугать преждевременными ошибками
  - Если поле одно - первая валидация должна произойти после ввода данных в поле и нажатия кнопки-триггера, после этого валидация происходит в момент заоплнения поля
  - Если полей несколько - валидация происходит при переходе с одного поля на другое (когда невалидное поле осталось одно - в момент его заполнения наверное?)
- В клавиатуре должны быть настроены вспомогательные клавиши - переход фокуса на следующее поле, отправка данных на последнем поле (вызов дейтсвия по триггер-кнопке) 
- Должны быть правильно настроены клавиатуры и подсказки (предложение автозаполнения типа? пароль/email/телефон) для разных типов вводимых данных
  - email - текст(латиница), цифры, символы - клава только с латиницей, без других языков
  - текст - просто обычная клава
  - номер телефона: цифирная клава без символов
- Обратный отсчет на форме - для таймера нужно сравнивать время начала отсчета и текущее время, чтобы правильно отсчитать
  - На iOS приложение полностью ставится на паузу при сворачивании, если бы были на delay - то он бы не работал
  - Использовать `delay` нельзя, потому что он будет работать не ровно через секунду, а через чуть большее время, т.к. мобилки - это не системы реального времени, поэтому рано или поздно накопится ошибка, из-за чего какая-то секунда проскочит (отображалось 11 сек, а потом сразу 9 сек)
  - надо брать текущее время, и сравнивать его миллисекундами с временем запуска таймера - тогда не поломается 
- Если на форме есть связанные поля - например пароль и подтверждение пароля, то надо чтобы их валидация зависела друг от друга и чтобы она срабатывала при изменении любого из полей.
  - Пример: ввели пароль, потом ввели повторение пароля - видим, что пароли не совпадают. Поняли, что первый раз забыли одну букву - вернулись и добавили пропущенную букву. После этого валидация должна пройти успешно
- Если сервер сообщает об ошибке в данных, полученных из поля ввода - нужно выводить эту ошибку у этого поля. Локальная проверка полей ввода также должна отображать ошибки валидации у конкретного поля
  - Примеры ошибок валидации, о которых может сообщить сервер:
    - email уже используется
    - email не найден  
    - Время недоступно 
    - никнейм занят
    - новый пароль совпадает со старым
- Если ожидается работа с сетью или какая-то другая работа программы с введенными данными - формы ввода и триггер-кнопка должны становиться неактивными
- Если на форме есть поля, которые должны заполнять друг друга (конвертер валют) - важно сделать это аккуратно и не создать рекурсию изменений. Логика должна быть полностью в общем коде :)
- Если триггер-кнопка активируется только при валидных данных - нужно быть аккуратным - если пользователю не будет указано что не так с тем, что он ввел, он может не догадаться почему кнопка не активна и посчитает приложение сломанным
- Если форма длинная, мы все заполнили и проскроллили вниз до триггер-кнопки, нажали кнопку и нам вернулась ошибка в поле, которое не видно - надо скроллить к первому полю с ошибкой
- Должна быть корректно проставлена информация о контенте поля для автозаполнения (email, телефон, пароль, файл)
- Обязательные поля должны быть как-то выделены, например звездочкой, юзер не должен гадать какие поля нужно заполнять
- Те данные, которые приложение может заполнить автоматически, должны заполняться автоматически () 
- Многострочные поля ввода должны растягиваться при появлении множества строк, но до ограниченной высоты - дальше должен включаться скролл для просмотра контента
- Пробелы в начале и конце введенного текста должны обрезаться
- При выборе даты должны быть проставлены соответствующие границы возможного выбора (нельзя выбрать в прошлом или будущем)
- Поля по типу цены или зп или чего-то такого - важно стирать ведущие нули, и правильно переводить текст в дробное число
