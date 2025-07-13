---
sidebar_position: 10
---

# Генерация строк локализации

На наших проектах мы используем генерацию строк из Google Sheets.
В корне проекта шаблона находится скрипт `master.sh`, который несет в себе вспомогательные функции.

## Функция локализации
Для генерации локализованных строк из Google Sheet's нам необходима функция `cmdLocalize`:

```bash
function cmdLocalize() {
    # ...

    npm start android strings "GSHEET_ID_HERE" 'platform!A1:D' ../android-app/src/main/res/
    npm start mpp strings "GSHEET_ID_HERE" 'mpp!A1:D' ../mpp-library/resources/src/commonMain/moko-resources/
    npm start mpp plurals "GSHEET_ID_HERE" 'mpp-plurals!A1:D' ../mpp-library/resources/src/commonMain/moko-resources/
    npm start ios strings "GSHEET_ID_HERE" 'platform!A1:D' ../ios-app/SwiftUIApp/Resources/
    npm start mpp strings "GSHEET_ID_HERE" 'auth!A1:D' ../mpp-library/features/auth/src/commonMain/moko-resources/
    npm start mpp strings "GSHEET_ID_HERE" 'profile!A1:D' ../mpp-library/features/profile/src/commonMain/moko-resources/
    npm start mpp strings "GSHEET_ID_HERE" 'order!A1:D' ../mpp-library/features/order/src/commonMain/moko-resources/
}
```

Вместо GSHEET_ID_HERE должен стоять Google Sheet Id файла локализации.
Для каждой новой фичи в файле локализации создается вкладка с названием, которая должна быть добавлена в скрипт вместе с путем к директории moko-resources данной новой фичи. Выше в примере добавлены auth, profile и order.

Если папку moko-resources в фиче пока не создавали, скрипт ее создаст при генерации строк локализации.

Далее, чтобы обновить строки локализации в проекте необходимо вызвать команду:

```bash
sh master.sh localize
```

Для корректной работы скрипта у вас должен быть установлен [npm](https://www.npmjs.com).

## Материалы 
- [GitLab - Sheets Localizations Generator](https://gitlab.icerockdev.com/scl/sheets-localizations-generator)
