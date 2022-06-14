# Обработка State

## Введение

Подход **State and Events** подробно описан на [странице](../android/states-events) в блоке Android, здесь же описан подход обработки объекта State на iOS.

## moko-kswift

Используя [moko-kswift](../libraries/moko/moko-kswift) у нас есть возможность использовать `sealed interface` для `State` и `Actions` из общего кода в виде `enum` в Swift, чтобы можно было обрабатывать объекты в `switch` без ветки `default`.  

Это очень полезно для обработки `Actions`, потому что при появлении нового `Action` в общем коде, iOS приложение не скомпилируется из-за того, что не все объекты `enum` будут обработаны.

Однако, вариант обработки в `switch case` не подходит для объектов `State`, потому что на основе `State` устанавливается состояние экрана - а это множество вьюх, которым нужно выставить: текст, видимость, цвет и так далее.  
Получается, при обработке стейта в `switch case` нам пришлось бы в каждом `case` устанавливать значения всем этим вьюхам. В таком случае у нас бы не было абсолютно никакой гарантии, что мы не забыли настроить какую-нибудь вьюху.

### Пример ненадежной обработки
```swift
private func bindState(
    _ state: SomeStateKs<SomeObject>
) {
    switch(state) {
    case .empty(_):
        titleLabel.isHidden = false
        titleLabel.text = "empty_title"
        descriptionLabel.isHidden = false
        button.isHidden = false
        button.setTitle("refresh button", for: .normal)
    case .failed(let error):
        titleLabel.isHidden = false
        titleLabel.text = "error title"
        descriptionLabel.isHidden = false
        descriptionLabel.text = error.error?.localized() ?? ""
        button.setTitle("retry button", for: .normal)
    case .success
        titleLabel.isHidden = true
        descriptionLabel.isHidden = true
        button.setTitle("", for: .normal)
        button.isHidden = true
    }
}
```

### Пример надежной обработки
```swift
private func bindState(
    _ state: SomeStateKs<SomeObject>
) {
    let isTitleHidden: Bool
    let title: String
    let description: String
    let buttonTitle: String
    
    switch(state) {
    case .empty(_):
        isTitleHidden = false
        title = "empty_title"
        description = "description is empty"
        buttonTitle = "refresh button"
    case .failed(let error):
        isTitleHidden = false
        title = "error_title"
        description = error.error?.localized() ?? ""
        buttonTitle = "retry button"
    case .success:
        isTitleHidden = true
        title = ""
        description = ""
        buttonTitle = ""
    }
    
    titleLabel.isHidden = isTitleHidden
    titleLabel.text = title
    descriptionLabel.isHidden = isTitleHidden
    descriptionLabel.text = description
    button.isHidden = isTitleHidden
    button.setTitle(buttonTitle, for: .normal)
}
```
Мы используем особенность Swift - `let` переменные не обязательно инициализировать сразу при создании, главное - проинициализировать их до первого к ним обращения, и за этим следит компилятор.   

Это позволяет нам создать `let` константы, проинициализировать их в `switch case` в зависимости от стейта и присвоить вьюхам их значения.    
Если мы забудем проинициализировать какую либо из констант в одном из `case` и присвоим ее вьюхе - то приложение не скомпилируется.  
Тем самым, при любом состоянии стейта все вьюхи гарантированно будут проинициализорованы значениями относительно конкретного стейта.  

### Extensions к State
Также, можно создать свои `extensions` к классу `StateKs`, где на основе стейта вьюхе присваивается конкретное значение. Пример [extensions](https://github.com/Alex009/moko-paging-sample/blob/e0d64280ca956773b6578d645a410f32fc6bfa8f/iosApp/iosApp/ResourceStateExt.swift) и [использования](https://github.com/Alex009/moko-paging-sample/blob/e0d64280ca956773b6578d645a410f32fc6bfa8f/iosApp/iosApp/NewsViewController.swift#L45).
