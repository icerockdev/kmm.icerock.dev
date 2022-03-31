---
sidebar_position: 2
---

# Использование Shaper

1. Установите `Shaper`, выполнив в терминале команду `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/icerockdev/shaper/master/install-shaper.sh)"`
1. Добавьте в ваш `.zshenv` переменную `export PATH=~/.shaper/shaper-cli/bin:$PATH` 
1. Проверить правильность установки можно выполнив команду `shaper-cli -h` в новой сессии терминала
1. Скачайте проект [база шаблонов](https://gitlab.icerockdev.com/scl/boilerplate/mobile-shaper-templates), в нем представлены шаблоны, которы мы чаще всего используем
1. Настройте `shaper/config.yaml`. Это нужно для того, чтобы при вызове `shaper` не нужно было указывать абсолютный путь до `.yaml`-файла шаблона
   - вызовите команду `nano ~/.shaper/config.yaml`
   - добавьте строку с полным путем к директории шаблонов `- /Volumes/T7/Users/me/ProjectsT7/mobile-shaper-templates`
   - получиться должно примерно так:
      ```text
      repositories:
           - /Volumes/T7/Users/me/ProjectsT7/mobile-shaper-templates
      ```
1. Выберите нужный вам шаблон
1. Запустите команду `shaper-cli -i относительный директории шаблонов путь до yaml-файла нужного вам шаблона -o относительный путь куда сгенерировать`
1. Укажите нужные вам `packageName value`, `feature value` и `screen value` в сессии терминала

Пример команды использования: `shaper-cli -i android/fragment.yaml -o ` 
