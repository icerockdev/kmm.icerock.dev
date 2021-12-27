#  Sign in with Apple

В данной статье не будет подробного гайда по настройке и интеграции Sign in with Apple, а будут только ключевые моменты и ссылки на полезные статьи.  

## В каких случаях необходимо использовать

Приложения, использующие сторонние сервисы (например Facebook, Google или Twitter) для аутентификации основной учетной записи пользователя в приложении, также должны предлагать вход через Apple в качестве алетрнативного варианта.

## Приватные имейл адреса

Пользователь может выбрать опцию `Hide my email`. В этом случае вы получите его прокси имейл, созданный эпплом вида random_chars@privaterelay.appleid.com. На подмененный e-mail можно написать только с тех доменов, которые вы укажете в настройках на developer.apple.com.
Принцип работы [Private Email Relay Service](https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_js/communicating_using_the_private_email_relay_service) и [Интсрукция по настройке](https://help.apple.com/developer-account/?lang=en#/devf822fb8fc) описаны в документации от Apple.

Также следует предусмотреть возможность пользователя привязать аккаунт к уже существующему аккаунту. Так как из-за скрытого email адреса не получиться выполнить привязку автоматически. 

## Получение данных пользователя

Sign in with Apple получает имя и фамилию пользователя только один раз при самом первом логине. При попытках повторной авторизации можно получить только ID (уникальный идентификатор пользователя в Sign in with Apple). Плюс эти данные можно получить только на клиенте, у сервера нет доступа к этим данным.

## Logout

У Sign in with Apple нету функции logout в классическом понимании этого слова. Библиотека не хранит никакие данные, в отличие от других библиотек входа, поэтому нет необходимости стирать данные, полученные при логине.
Однако, если пользователь разорвал ассоциацию Apple ID с приложением в Settings (Settings/ Apple ID / Password & Security / Apple ID logins / Edit) вы должны выполнить logout в приложении / на сервере. Apple рекомендует проверять это на старте приложения с помощью `ASAuthorizationAppleIDProvider().getCredentialState`.

## Дизайн кнопки 

К дизайну кнопки есть целая пачка требований, все они описаны в [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple/overview/buttons/).

Краткое изложение:
- Нельзя юзать просто лого как кнопку 
- Высота лого должна соответствовать высоте кнопки
- Нельзя обрезать лого
- Нельзя добавлять вертикальный отступ
- Нельзя кастомизировать цвета лого
- Использовать только шрифт системы
- Размер шрифта должен составлять 43% от высоты кнопки

## На других платформах 

Sign in with Apple можно использовать не только в приложениях для операционных систем от Apple, но также в Android и web приложениях. Для этого нужно открыть специальную страницу авторизации от Apple. 

## Источники и полезные ссылки

- [Документация от Apple c сылками на все необходимы гайдлайны и инструкции](https://developer.apple.com/sign-in-with-apple/get-started/) 
- [Гайд по интеграции Sign in with apple, в том числе и для web и Android, от Циан](https://habr.com/ru/company/cian/blog/475062/)
- [Реализация сервиса авторизации через Apple от sports.ru](https://habr.com/ru/company/sports_ru/blog/467231/)
- [Интеграция Sign in with Apple на backend от sports.ru](https://habr.com/ru/company/sports_ru/blog/470175/)
- Интересные моменты про Sign in with Apple от Alconost в двух частях. [Первая](https://habr.com/ru/company/alconost/news/t/494404/) и [вторая](https://habr.com/ru/company/alconost/blog/506944/)
- [Проблемы, с которыми столкнулись в Parallels при интеграции](https://habr.com/ru/company/parallels/blog/469499/)
- [Почему AnyList отказались от авторизации через Apple с фейковым email](https://habr.com/ru/news/t/509012/)