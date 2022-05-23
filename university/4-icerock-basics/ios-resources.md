---
sidebar_position: 8
---

# Ресурсы на iOS

## R.swift
Для доступа к ресурсам на iOS мы используем библиотеку [R.swift](https://github.com/mac-cain13/R.swift). Она позволяет получить доступ ко всем ресурсам приложения, используя сгенерированный класс `R`. С полным список ресурсов, с которыми можно работать используя эту библиотеку, вы можете ознакомиться по [ссылке](https://github.com/mac-cain13/R.swift#features).  

## Инструкция по подключению
- [installation](https://github.com/mac-cain13/R.swift#installation)
- добавьте под `pod 'R.swift'`
- вызовите команду `pod install`
- добавьте скрипт для генерации `R` класса ![img.png](media/rswift-setup.png)
- соберите проект `command + B`
- добавьте `R.generated.swift` к файлам проекта
- ![img.png](media/add-files-to-ios-app.png)
- ![img.png](media/add-rgenerated.png)

## Практическое задание 
1. создайте проект по [инструкции](https://kotlinlang.org/docs/kmm-create-first-app.html)
1. перейдите от SwiftUI к UIKit, а затем удалите Storyboard, создайте StartViewController, начинайте запуск приложения с него
1. добавьте какую-нибудь картинку в Assets из [дизайна](https://www.figma.com/file/XmpoCqkdWTGb2NGdR2bgiQ/Git_test-iOS)
1. подключите библиотеку R.swift
1. отобразите картинку из ресурсов на экране, используя R.swift, убедитесь, что все работает
