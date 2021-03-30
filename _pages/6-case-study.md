---
title: 6. Примеры ошибок и исправлений
author: Aleksey Mikhailov
layout: post
---

# Работа с moko-units
## Утечка Unit'ов и ViewModel при указании лямбды с действием

## Множественная привязка на LiveData в Unit'е
```
extension PersonalProfileTextFieldTableViewCell: Fillable {
  override func prepareForReuse() {
    super.prepareForReuse()

    closeable?.close()
  }

  func fill(_ data: PersonalProfileTextFieldViewModel) {
    closeable = data.textField.data.bindStringTwoWayToTextFieldText(textField: textField)
  }
}
```

# iOS
## Ошибки переиспользования ячеек
```
extension PersonalProfileTextFieldTableViewCell: Fillable {
  func fill(_ data: PersonalProfileTextFieldViewModel) {
    closeable = data.textField.data.bindStringTwoWayToTextFieldText(textField: textField)

    titleLabel.text = data.placeholderText
    textField.placeholder = data.placeholderText
    textField.isTextInputEnabled = data.isEnabled
    textField.keyboardType = data.keyboardType
    onButtonTap = data.onRightButtonAction

    if let buttonText = data.rightButtonText {
      let rightButton = UIButton()
      rightButton.setTitle(buttonText)
      rightButton.titleLabel?.font = R.font.jjoTypefaceBetaMedium(size: 15)
      rightButton.setTitleColor(data.rightButtonColor, for: .normal)
      rightButton.addTarget(self, action: #selector(onButtonAction), for: .touchUpInside)

      textField.addRightButton(rightButton)
    } else {
      textField.rightView = nil
    }
  }

  func update(_ data: PersonalProfileTextFieldViewModel) {
    fill(data)
  }
}
```