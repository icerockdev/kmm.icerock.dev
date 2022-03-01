---
sidebar_position: 5
---

# UI и навигация 

Создавать UI и навигацию на iOS можно по-разному: можно использовать .storyboard, .xib или вообще описать все в коде  
Предлагаем вам ознакомиться со всеми этими подходами:
- [статья-сравнение](https://putkovdimi.medium.com/%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4%D1%8B-%D0%BA-%D1%80%D0%B5%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8-ui-%D0%B2-swift-22de5f1662f4) .xib, .storyboard и code для UI
- [статья](https://swiftbook.ru/post/tutorials/ios-root-controller-navigation/) про то, как делать навигацию без .storyboard, используя RootViewController
- [статья](https://habr.com/ru/company/mobileup/blog/456086/) плюсы и минусы .storyboard
- [видео](https://www.youtube.com/watch?v=Pt9TGFzLVzc) - разбор использования ApplicationCoordinator для навигации между экранами

В наших проектах, для верстки и навигации на iOS мы больше не будем использовать .storyboard, вместо этого мы будем пользоваться следующими инструментами:
- AppCoordinator - главный координатор приложения, который будет запускать другие координаторы в зависимости от входных данных
- Другие координаторы - отвечают за свои зоны приложения (авторизация, просмотр новостей, редактирование профиля и тд)
- .xib и code для верстки - экраны верстаем в .xib, navigation items и более сложные настройки делаем через код 

Чтобы связать .xib и контроллер мы можем назвать их одинаково при создании, тогда .xib автоматически привяжется к нужному контроллеру. Сделать это можно выбрав типа файла при создании ***Cocoa Touch Class*** и в следующем меню выбрать пункт ***Also create xib file***, тогда сразу создадутся связанные друг с другом .xib и .swift файлы.  
Если имя контроллера и .xib отличаются, то нужно при создании контролера передать туда нужный .nib. 

## Практическое задание

В качестве практики предлагаем вам потренироваться в использовании ApplicationCoordinator. Ориентируясь на [проект](https://github.com/pegurov/CoordinatorsDemo) из [видео](https://www.youtube.com/watch?v=Pt9TGFzLVzc) сделать следующее приложение: 
- всего 2 экрана: AuthViewController и HomeViewController и 3 координатора: AppCoordinator, AuthCoordinator и HomeCoordinator
- AuthViewController - экран регистрации, добавьте сюда поле для ввода никнейма и кнопку "Login"
- HomeViewController - основной экран приложения, добавьте сюда Label с приветствием юзера по никнейму и кнопку "Logout"
- никнейм сохранять в параметры устройства используя NSUserDefaults 
- использовать ApplicationCoordinator для первичной навигации - если никнейм есть - значит запускать GreetingCoordinator, иначе запускать AuthCoordinator
- не используйте .storyboard, создайте необходимые контроллеры и свяжите их с .xib
- для UserEditViewController используйте .xib с таким же именем, а для CitiesViewController создайте .xib с отличающимся именем
