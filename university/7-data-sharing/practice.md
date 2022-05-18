---
sidebar_position: 6
---

# Практическое задание
Необходимо добавить новый функционал в ваше приложение, готовое после пердыдущего блока.
Предлагаем сделать возможность добавлять комментарии и прикреплять файлы к issues репозитория.
Также, отображайте количество комментариев (или просто списком все?)

Во время работы над практическим заданием настоятельно рекомендуем обращаться к разделу [Памятки для разработчика](../memos/function)

добавить на экран создания issues возможность добавлять картинки

## Функциональные требования
1. Добавьте на экран детального просмотра issue счетчик - количество комментариев
2. Добавьте на экран детального просмотра issue кнопку - добавить комментарий
3. Добавьте в ваше Github-приложение новый экран - добавление комментариев к конкретной issue. Экран должен содержать:
    - поле ввода сообщения комментария
    - кнопку добавления файла
    - кнопку добавления комментария
    - кнопка `Create issue`
4. Отображать пользователю ошибки валидации от сервера
5. Переход на новый экран создания issue должен происходить по кнопке, с экрана просмотра детальной информации о репозитории.
6. На экран детальной информации о репозитории замените счетчик и картинку для forks на картинку и количество открытых issue в репозитории
## Технические требования

## Материалы
1. [GitHub Issues API](https://docs.github.com/en/rest/issues/issues#about-the-issues-api)
2. ***ДОБАВИТЬ Дизайн Android***
3. ***ДОБАВИТЬ Дизайн iOS***
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

либо закидвать на какой-нибудь хостинг картинку, а в гитхаб лепить ссылку
image bb