# Передача данных 

## Реализация передачи данных между фрагментами 

Переход с одного фрагмента на другой осуществляется средствами [Navigation Component](https://developer.android.com/guide/navigation).  
Отправка данных между фрагментами происходит во время перехода по графу навигации, например, с помощью метода `navigate`.

```kotlin
public void navigate(@IdRes int resId, @Nullable Bundle args) {
    navigate(resId, args, null);
}
```

Разберем всю цепочку на примере перехода между двумя фрагментами, для активити принцип будет такой же.  
Допустим, мы хотим перейти с `FirstFragment` на `SecondFragment` и передать `userId`.
Поскольку `Bundle` - это `key-value` хранилище, нам нужен секретный ключ для `userId`, который бы знал только фрагмент-получатель (`SecondFragment`), но сохранить по этому ключу `userId` мог и фрагмент-отправитель (`FirstFragment`).

Для этого создадим [companion object](https://kotlinlang.org/docs/object-declarations.html#companion-objects) в `SecondFragment`

```kotlin
companion object {
    private const val USER_ID_KEY = "userIdKey"

    fun createArguments(userIdKey: String): Bundle {
        return bundleOf(USER_ID_KEY to userIdKey)
    }
}
```

Когда нужно будет перейти c `FirstFragment` на `SecondFragment` вызовем следующий метод:

```kotlin
fun routeToSecondFragment(userIdKey: String) {
    findNavController().navigate(
        R.id.action_firstFragment_to_secondFragment,
        SecondFragment.createArguments(userIdKey = editText.text.toString())
    )
}
```

Получать данные из аргументов `SecondFragment` будет так:
```kotlin
private val userId: String
    get() = requireArguments().getString(USER_ID_KEY).let { requireNotNull(it) }
```
В случае отсутствии аргумента на инициализации фрагмента, произойдет ошибка:
`E/AndroidRuntime: FATAL EXCEPTION: main
        Process: com.example.testsharingdata, PID: 26781
java.lang.IllegalArgumentException: Required value was null.`


Также, можно добавить сообщение, которое отобразится при ошибке:

```kotlin
private val userId: String
    get() = requireArguments().getString(USER_ID_KEY).let { requireNotNull(it) { "argument $USER_ID_KEY should be not null" } }
```

В случае ошибки, увидим сообщение:
`E/AndroidRuntime: FATAL EXCEPTION: main
Process: com.example.testsharingdata, PID: 26906
java.lang.IllegalArgumentException: argument userIdKey should be not null`

## Передача данных между активити

Для перехода между активити и отправки данных используется объект [Intent](https://developer.android.com/reference/android/content/Intent).  
Переходить будем с `MainActivity` на `SecondActivity`, будем также передавать `userId`

В `SecondActivity` создадим `companion object`:

```kotlin
companion object {
    private const val USER_ID_KEY = "user id key"

    fun createIntent(context: Context, userId: String): Intent {
        val intent = Intent(context, SecondActivity::class.java)
        intent.putExtra(USER_ID_KEY, userId)
        return intent
    }
}
```

Когда решим переходить на другую активити, вызовем метод

```kotlin
private fun routeToSecondActivity(userId: String) {
    val intent = SecondActivity.createIntent(context = requireContext(), userId)
    startActivity(intent)
}
```

Получение аргументов на активити:

```kotlin
private val userId: String
    get() = requireArguments().getString(USER_ID_KEY).let { requireNotNull(it) { "argument $USER_ID_KEY should be not null" } }
```

## Какие данные можно передавать? 

Если данные, которые необходимы экрану, можно получить от какого-либо источника данных (база данных, сервер и пр.), то следует передавать идентификатор этих данных.
Для использования такого подхода - передавать идентификатор данных, необходимо следующее требование к источнику данных: для каждого экрана приложения источник обязательно должен уметь получать все необходимые данные даже после полного пересоздания приложения.  

Однако, бывают ситуации, когда какие-то простые данные уже появились, но их еще рано сохранять в базу данных или отправлять на сервер. В таком случае стоит передавать сами данные, потому что другой возможности получить их у нас не будет.

**Например:** текстовое поле на экране `A`, текст из которого отобразится в форме-заполнения на экране `B`. В этом случае нам нужно поддерживать следующее поведение:  
- если приложение будет закрыто непосредственно юзером, то данные должны пропасть при следующем открытии экрана `A`
- если приложение закроется самостоятельно, например, из-за ошибки или отсутствия свободной памяти на устройстве, то введенные в поле данные пропасть не должны

Достигается такое поведение благодаря методам [onSaveInstanceState](https://developer.android.com/reference/android/app/Activity#onSaveInstanceState(android.os.Bundle)) и [onRestoreInstanceState](https://developer.android.com/reference/android/app/Activity.html#onRestoreInstanceState(android.os.Bundle))

**Разберем ещё один пример:** допустим, мы открыли экран - список книг. Загрузили все ссылки на книги из списка в оперативную память, хотим перейти на чтение конкретной - передали `id` этой книги при переходе на экран чтения. Внезапно, что-то пошло не так и наше приложение крашнулось. Приложение открывается заново, на детальном просмотре интересующей нас книги. `Id` нужной книги лежит у нас в аргументах, но в оперативной памяти нет никаких ссылок на книги, потому что это сохранение происходило на предыдущем экране. Об этом стоит помнить и учитывать это при проектировании репозитория. Данные можно хранить в оперативной памяти, однако нужно еще обрабатывать ситуации, когда этих данных там не будет - либо обращаться к серверу и получать то, что нас интересует, либо сохранять данные в локальную базу данных и работать уже с ней, а не оперативной памятью.

**Таким образом, передача только идентификаторов и простых данных позволит вам:**
- не поддерживать [Parcelable](https://developer.android.com/reference/android/os/Parcelable) у передаваемых данных
- не бояться превышения объема хранилища [Bundle](https://developer.android.com/reference/kotlin/android/os/Bundle). При пересоздании фрагмента/активити переданные аргументы сохраняются в `Bundle`, но он вмещает всего 1 МБ данных и содержит не только наши данные, но и системные. При превышении объема хранилища произойдет ошибка [TransactionTooLargeException](https://developer.android.com/reference/android/os/TransactionTooLargeException)

## Выводы

Используя подход передачи идентификаторов данных и группировка всей логики передачи в получателе позволяет: 
- не усложнять модели данных поддержкой `Parcellable`
- не вылезем за пределы размера `Bundle`
- скрыть детали перехода на экран от других классов
- избавиться от дублирования. Теперь, для перехода на фрагмент/активити со значениями не нужно самостоятельно создавать объект `Bundle` и заполнять его
- строгое API. Перейти на фрагмент/активити и передать туда данные, не используя дублирование и прочите костыли, можно только используя специальную функцию из компаньон объекта
