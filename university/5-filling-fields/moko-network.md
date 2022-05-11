---
sidebar_position: 4
---

# moko-network

В контексте форм нам нужно разобраться с классом ExceptionFactory, который отвечает за обработку ошибок запросов. Он позволяет установить парсеры для обработки различных ошибок, которые может вернуть сервер.  
Для работы с формами ввода нас будет интересовать конкретная ошибка, с кодом 442 - ошибка валидации.

Используя библиотеку, мы легко сможем получить от сервера поле и текст ошибки валидации. 

## ExceptionFactory

Для создания объекта [ExceptionFactory](https://github.com/icerockdev/moko-network/blob/26fd7bbf10da6b09f1a543f316155c6c3880023e/network/src/commonMain/kotlin/dev/icerock/moko/network/exceptionfactory/HttpExceptionFactory.kt) нам необходимо указать два параметра, а именно `defaultParser` и `customParsers`.  
 - `defaultParser` - парсер для всех ошибок от сервера, за исключением тех, обработку которых мы захотим сделать самостоятельно.  
 - `customParsers` - набор парсеров, привязанных к конкретному коду ошибки.  

Например, для ошибки валидации и конкретного JSON объекта от сервера в библиотеке уже реализован [ValidationExceptionParser](https://github.com/icerockdev/moko-network/blob/0f8459ff2d51c6b7cade0cadd6d11066b7a55d60/network/src/commonMain/kotlin/dev/icerock/moko/network/exceptionfactory/parser/ValidationExceptionParser.kt).  

Из его кода видно, что парсер подходит для JSON объектов, выглядящих следующим образом:
```json
[
  {
    "message": "password used earlier",
    "field": "title"
  }
]
```

Если создавать новый проект, используя [шаблон](/university/icerock-basics/mobile-moko-boilerplate) то там уже будет готовый httpClient, с настроенной ExceptionFactory, использующей как раз парсеры из библиотеки - дефолтный ErrorExceptionParser и ValidationExceptionParser для ошибок валидации.

Для создания собственного парсера необходимо: 
- создать класс-наследник интерфейса HttpExceptionFactory.HttpExceptionParser
- реализовать метод parseException
- использовать ваш кастомный парсер при создании ExceptionFactory

## Практическое задание
Добавьте свою реализацию парсера для обработки [объекта](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#client-errors), который приходит от GitHub REST API при ошибке валидации.
