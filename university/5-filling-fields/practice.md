---
sidebar_position: 5
---

# Практика
- Переделайте на экране авторизации поле ввода, исопользуя библиотеку moko-fields

## Добавление issue
На экране просмотра репо сделайте кнопку - [список issues](https://docs.github.com/en/rest/issues/issues#list-repository-issues)  
Добавьте экран просмотра списка issues c возможностью открыть [просмотр конкретной issue](https://docs.github.com/en/rest/issues/issues#get-an-issue)  
На экране просмотра конкретной issue добавьте возможность [редактировать текущую](https://docs.github.com/en/rest/issues/issues#update-an-issue), [полный список](https://docs.github.com/en/rest/issues/issues#update-an-issue) параметров, которые можно обновить у ишусы

### Вписывается
формы ввода там будут на редактировании
- там кейс с ошибкой валидации сверху, когда мы проскролили ишшу вниз
- кейс с правильными символами для клавиатуры - есть куда вводить только цифры, текст и тд.
- вспомогательные кнопки на клавиатуре для перехода по полям ввода
- как правильно валидировать, когда много форм
- мб даже можно поискать ошибки, которые нельзя будет проверить на девайсе и обрабатывать их от сервера (есть в ответах от гитхаба 422 Validation failed)
- предлагать что-нибудь заполнять автоматически
    - может быть добавить подпись, как в gmail попробовать сделать аля: "Спасибо за вашу библиотеку" и тд, которое будет добавляться в body
- вывод ошибок у нужных полей 
- деактивация форм и кнопки при действии - добавлении или обновлении
- кнопку можно сделать неактивной, пока не введены все необходимые поля
- указывать все необходимые поля
- растягивать поле body и добавлять скролл
- динамическое обрезание пробелов добавить, чтобы просто не вводился пробел

- ***В следующих блоках можно будет сделать добавление файла к issue***

### Не вписываются
- таймер
- меняем одно поле - меняется другое
- валидация одного поля завязана на другом  

```text
curl 'https://github.com/upload/policies/assets' \
-X 'POST' \
-H 'Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryddXGauO9FaoePkf4' \
-H 'Accept: application/json' \
-H 'Accept-Language: en-GB,en;q=0.9' \
-H 'Accept-Encoding: gzip, deflate, br' \
-H 'Host: github.com' \
-H 'Origin: https://github.com' \
-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15' \
-H 'Connection: keep-alive' \
-H 'Referer: https://github.com/icerockdev/kmm.icerock.dev/issues/72' \
-H 'Content-Length: 658' \
-H 'X-Requested-With: XMLHttpRequest' \
```
