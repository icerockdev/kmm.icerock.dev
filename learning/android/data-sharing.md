# Передача данных 

## Реализация передачи данных между фрагментами 

Переход с одного фрагмента на другой осуществяется средствами [Navigation Component](https://developer.android.com/guide/navigation).  
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
    get() = requireArguments().getString(USER_ID_KEY) ?: throw NoArgumentsPassedException()
```

Если по какой-то причене такого аргумента не будет на инициализации фрагмента, произойдет ошибка, по которой мы сразу поймем, в чем проблема <- ПЕРЕПИСАТЬ 

```kotlin
class NoArgumentsPassedException: Exception()
```

## Передача данных между активити

Для перехода между активити и отправки данных используется объект [Intent](https://developer.android.com/reference/android/content/Intent).  
Переходить будем с `MainActivity` на `SecondActivity`, будем также передавать userId

В `SecondActivity` создадим companion object:

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
private val userIdKey
get() = intent.extras?.getString(USER_ID_KEY)
    ?: throw NoArgumentsPassedException()
```

## Какие данные можно передавать? 
В первую очередь стоит отметить, что передавать стоит идентификаторы, с которыми адресат обратится к источнику данных и получит необходимые данные. <- масло масляное переписатт

**Следуя этому правилу позволит вам:**
- не поддерживать [Parcelable](https://developer.android.com/reference/android/os/Parcelable) у передаваемых данных
- не бояться превышения объема хранилища [Bundle](https://developer.android.com/reference/kotlin/android/os/Bundle). При пересоздании фрагмента/активити переданные аргументы сохраняются в `Bundle`, но он вмещает всего 1 МБ данных и содержит не только наши данные, но и системные. При превышении объема хранилища произойдет ошибка [TransactionTooLargeException](https://developer.android.com/reference/android/os/TransactionTooLargeException)
- изавиться от сильной связи с предыдущим экраном. Если экран `A` работает с большими данными, которые он получает от экрана `B` и по-другому получить не может, то в случае перезапуска экрана `A` эти данные не смогут сохраниться в `Bundle` и пропадут

**Таким образом, передавая только идентификаторы, мы сможем:**
- без проблем сохранить полученный id-шник в `Bundle`, обезопасившись от привязки к данным от предыдущего экрана
- получать по идентификатору данные от источника, даже при полном перезапуске приложения

## Выводы
Такой подход - хранить всю информацию для отправки в получателе, позволяет нам:
- избавиться от дублирования. Теперь, для перехода на `SecondFargment` со значениями не нужно самостоятельно создавать объект `Bundle` и заполнять его
- скрыть детали перехода на экран от других классов. О ключе `USER_ID_KEY`, по которому записывается значение `userId`, знает только `SecondFargment`
- строгое API. Перейти на `SecondFargment` и передать туда данные, не используя дублирование и прочите костыли, можно только используя функцию `createArguments`. В функции явно указаны все аргументы, которые необходимы `SecondFragment-у` для работы
