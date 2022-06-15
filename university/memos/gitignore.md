---
sidebar_position: 6
---

# .gitignore

При инициализации проекта убедитесь в том, что файл `.gitignore` настроен правильно: 
1. расположен в корне проекта
1. имеет содержимое, как в [mobile-moko-boilerplate/.gitignore](https://gitlab.icerockdev.com/scl/boilerplate/mobile-moko-boilerplate/-/blob/master/.gitignore)

Если вы не сразу проинициализировали `.gitignore`, и сейчас у вас в репозиторий загружены файлы, как например `.idea`, `.gradle`, `.project` и т.д, уже добавленные в `.gitignore`, выполните следующие действия:
1. убедитесь, что `.gitignore` расположен в корне проекта
1. убедитесь, что он правильно заполнен и включает в себя те файлы, которые вы не хотите заливать
1. выполните команды в терминале, в корне проекта
    - `git rm -r --cached .`
    - `git add .`
