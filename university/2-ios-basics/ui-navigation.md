---
sidebar_position: 5
---

# UI и навигация 

Создавать UI и навигацию на iOS можно по-разному: можно использовать `.storyboard`, `.xib` или вообще описать все в коде.
Предлагаем вам ознакомиться со всеми этими подходами:
- [статья-сравнение](https://putkovdimi.medium.com/%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4%D1%8B-%D0%BA-%D1%80%D0%B5%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8-ui-%D0%B2-swift-22de5f1662f4) `.xib`, `.storyboard` и code для UI
- [статья](https://habr.com/ru/company/mobileup/blog/456086/) о плюсах и минусах `.storyboard`
- [видео](https://www.youtube.com/watch?v=lRfCAYaGldg) о том, как добавить `NavigationController` программно  
- [статья](https://medium.com/@felicity.johnson.mail/pushing-popping-dismissing-viewcontrollers-a30e98731df5) про навигацию внутри `NavigationController`
- [статья](http://macbug.ru/ios/cnavigation) о структуре `NavigationController`. В ней встречается код на Objective-C, не пугайтесь :)
- второй пункт [статьи](https://levelup.gitconnected.com/uinavigation-controller-and-uinavigationbar-in-swift-ff3532fd58b6) про настройку `NavigationBar`
- [статья](https://imjhk03.github.io/posts/create-viewcontroller-from-xib/) про то, как создавать `.xib` и `ViewController` и связывать их друг с другом
- Чтобы сразу создать связанные `.xib` и `.swift` файлы, нужно выбрать типом создаваемого файла ***Cocoa Touch Class*** и в следующем меню выбрать пункт ***Also create xib file***

В реальных проектах крайне редко используется `Storyboard` и `Seque`, значительно чаще для верстки используется `.xib` а навигация происходит через код. Поэтому с ней нужно попрактиковаться.

## Практическое задание

Создайте проект, где будет 2 экрана, объединенные `UINavigationController`.  
Стартовый экран будет просто с кнопкой по центру, при нажатии будем переходить на второй. На втором - таблица.
Попрактикуйтесь в разных способах создания экранов:
- стартовый создайте используя одинаковые имена для `.xib` и `.swift` файлов 
- второй экран создайте используя разные имена для `.xib` и `.swift` файлов, свяжите их вручную
