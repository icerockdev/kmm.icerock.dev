---
sidebar_position: 6
---

# Практическое задание
Необходимо добавить новый функционал в ваше приложение, готовое после пердыдущего блока.
Предлагаем сделать возможность добавлять картинки при создании issue.

Во время работы над практическим заданием настоятельно рекомендуем обращаться к разделу [Памятки для разработчика](../memos/function)

## Функциональные требования
1. Добавьте возможность прикрепить картинку при создании issue:
    - кнопку добавления файла
2. Отображать пользователю ошибки от сервера

## Технические требования
1. Использовать `moko-network` для реализации API
2. Использовать `moko-errors` для отображения пользователю информации об ошибке

## Материалы
1. [GitHub Issues API](https://docs.github.com/en/rest/issues/issues#about-the-issues-api)
2. ***ДОБАВИТЬ Дизайн Android***
3. ***ДОБАВИТЬ Дизайн iOS***
4. [ImageBB API](https://api.imgbb.com/) вдруг понадобится для 

Запрос, который для пихания файла к issue шлет гитхаб
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
