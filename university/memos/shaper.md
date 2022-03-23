---
sidebar_position: 2
---

# Использование Shaper

1. Установите `Shaper`, выполнив в терминале команду `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/icerockdev/shaper/master/install-shaper.sh)"`
1. Проверить правильность установки можно выполнив команду `shaper-cli -h`
1. Скачайте проект [база шаблонов](https://gitlab.icerockdev.com/scl/boilerplate/mobile-shaper-templates), в нем представлены шаблоны, которы мы чаще всего используем
1. Выберите нужный вам шаблон
1. Настройте `.yaml` файл выбранного шаблона
1. Запустите команду `shaper-cli -i абсолютный путь до yaml-файла -o абсолютный путь куда сгенерировать`

Пример команды использования: `shaper-cli -i /Volumes/T7/Users/ashestak/ProjectsT7/mobile-shaper-templates/android/fragment.yaml -o /Volumes/T7/Users/ashestak/ProjectsT7/testGeneratedFragment` 
