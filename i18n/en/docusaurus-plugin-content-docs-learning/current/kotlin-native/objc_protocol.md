# Имплементация ObjC протокола в Kotlin

Objective-C может иметь протокол такого вида:
```objective-c
@protocol WKNavigationDelegate <NSObject>

@optional

- (void)webView:(WKWebView *)webView didStartProvisionalNavigation:(WK_NULL_UNSPECIFIED WKNavigation *)navigation;
- (void)webView:(WKWebView *)webView didFinishNavigation:(WK_NULL_UNSPECIFIED WKNavigation *)navigation;

@end
```
и в `Kotlin` данный протокол переходит с одинаковой сигнатурой - имя функции `webView` с двумя аргументами, у которых типы `WKWebView` и `WKNavigation`. 
```kotlin
class NavigationDelegate: NSObject(), WKNavigationDelegateProtocol {

    override fun webView(webView: WKWebView, didStartProvisionalNavigation: WKNavigation?) { }

    override fun webView(webView: WKWebView, didFinishNavigation: WKNavigation?) { }
}
```
Для IDE и компилятора будет считаться ошибкой, если реализуются оба метода:
- `Conflicting overloads: public open fun webView(webView: WKWebView, didStartProvisionalNavigation: WKNavigation?): Unit defined in ...`
- `public open fun webView(webView: WKWebView, didFinishNavigation: WKNavigation?): Unit defined in ...`

Но по правде, для `Kotlin/Native`, это допустимо (**только в случаях реализации методов от протоколов ObjC**). И для работы требуется использовать `Suppress`:
```kotlin
@Suppress("CONFLICTING_OVERLOADS")
class NavigationDelegate: NSObject(), WKNavigationDelegateProtocol {

    override fun webView(webView: WKWebView, didStartProvisionalNavigation: WKNavigation?) { }

    override fun webView(webView: WKWebView, didFinishNavigation: WKNavigation?) { }
}
```
