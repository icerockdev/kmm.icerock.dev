# Генерация строк локализации

В корне проекта находится скрипт `master.sh`, который несет в себе вспомогательные функции.

## Фукнция локализации
Для генерации локализованных строк из Google Sheet's нам необходима функция `cmdLocalize`:

```bash
function cmdLocalize() {
    # ...

    npm start android strings "GSHEET_ID_HERE" 'platform!A1:C' ../mpp-library/shared/src/androidMain/res/
    npm start mpp strings "GSHEET_ID_HERE" 'mpp!A1:C' ../mpp-library/src/commonMain/resources/MR/
    npm start mpp plurals "GSHEET_ID_HERE" 'mpp-plurals!A1:D' ../mpp-library/src/commonMain/resources/MR/
    npm start ios strings "GSHEET_ID_HERE" 'platform!A1:C' ../ios-app/src/Resources/
}
```

Вместо GSHEET_ID_HERE должен стоять Google Sheet Id файла локализации.

Далее, чтобы обновить строки локализации в проекте необходимо вызвать команду:

```bash
./master.sh localize
```

Для корректной работы скрипта у вас должен быть установлен [npm](https://www.npmjs.com).

## Материалы 
- [GitLab - Sheets Localizations Generator](https://gitlab.icerockdev.com/scl/sheets-localizations-generator)