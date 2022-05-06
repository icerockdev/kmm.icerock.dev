---
sidebar_position: 5
---

# Практика

Изучите, что можно менять в юзере на гитхабе через [апи](https://docs.github.com/en/rest/users/users#update-the-authenticated-user)

либо экран профиля и картинку на фон кидать

либо экран создания/просмотра ишусы, с добавлением туда файла

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
