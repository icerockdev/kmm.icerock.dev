---
sidebar_position: 10
---

# moko-permissions

Библиотека [moko-permissions](https://github.com/icerockdev/moko-permissions) позволяет получать runtime permissions в общем коде. 

<iframe src="//www.youtube.com/embed/qDhGnTbX8XY" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
<br/>

## Denied and DeniedAlways
Результаты запроса разрешения на Android могут быть следующие:
- Granted - разрешение получено
- Denied - для текущей сессии разрешение не получено, можно запросить повторно в следующей сессии
    - в случае непредоставления разрешения в следующий раз, после denied - оно перейдет в состояние DeniedAlways
- DeniedAlways - для всего приложения разрешение не предоставлено, системным запросом разрешение больше не получить.
    - сразу можно установить, если поставить флаг: "Больше не показывать"

Также, на iOS, в отличие от Android состояния разрешения бывают только granted и  always denied. Из always denied переход в granted также возможен только в настройках приложения.

Из случая DeniedAlways установить разрешение в Granted можно только в настройках приложения. Поэтому, нужно направлять юзера туда и уточнять, что именно ему нужно сделать.

Чтобы получше разобраться, в каких случаях результат запроса будет Denied, а в каких DeniedAlways, предлагаем вам запустить sample библиотеки и протестировать самостоятельно.
