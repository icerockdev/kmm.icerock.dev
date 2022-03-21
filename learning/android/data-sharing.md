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
private val userId: String
    get() = requireArguments().getString(USER_ID_KEY).let { requireNotNull(it) }
```

Можно также добавить сообщение, если аргумента не будет

```kotlin
private val userId: String
    get() = requireArguments().getString(USER_ID_KEY).let { requireNotNull(it) { "argument $USER_ID_KEY should be not null" } }
```

## Какие данные можно передавать? 

Передача данных от одного экрана другому может понадобиться в основном в двух случаях: 
- данные, необходимые для работы экрана. Например: нажали на новость в списке и хотим прочитать её полностью.
- необязательные данные текущей сессии. Например: выбранный юзером фильтр на одном экране и отображение отсортированных данных на другом.

Следует передавать не сами данные, а их идентификаторы, по которыми можно будет получить данные от источника данных.   

Для использования такого подхода - передавать идентификатор данных, необходимо следующее требование к источнику данных: для каждого экрана приложения источник должен уметь получать все необходимые данные даже после полного пересоздания приложения.

Разберем на примере: допустим, мы открыли экран - список книг. Загрузили все ссылки на книги из списка в оперативную память, хотим перейти на чтение конкретной - передали id этой книги при переходе на экран чтения. Внезапно, что-то пошло не так и наше приложение крашнулось. Приложение открывается заново, на детальном просмотре интересующей нас книги. Id нужной книги лежит у нас в аргументах, но в оперативной памяти нет никаких ссылок на книги, потому что это сохранение происходило на пердыдущем экране. Об этом стоит помнить и учитывать это при проектировании репозитория. Данные можно хранить в оперативной памяти, однако нужно еще обрабатывать ситуации, когда этих данных там не будет - либо обращаться к серверу и получать то, что нас интересует, либо сохранять данные в локальную базу данных и работать уже с ней, а не оперативной памятью.

**Следуя этому правилу позволит вам:**
- не поддерживать [Parcelable](https://developer.android.com/reference/android/os/Parcelable) у передаваемых данных
- не бояться превышения объема хранилища [Bundle](https://developer.android.com/reference/kotlin/android/os/Bundle). При пересоздании фрагмента/активити переданные аргументы сохраняются в `Bundle`, но он вмещает всего 1 МБ данных и содержит не только наши данные, но и системные. При превышении объема хранилища произойдет ошибка [TransactionTooLargeException](https://developer.android.com/reference/android/os/TransactionTooLargeException)

**Таким образом, передавая только идентификаторы, мы сможем:**
- без проблем сохранить полученный id-шник в `Bundle`, обезопасившись от привязки к данным от предыдущего экрана
- получать по идентификатору данные от источника, даже при полном перезапуске приложения

## Выводы

Используя подход передачи идентификаторов данных и группировка всей логики передачи в получаетеле позволяет: 
- не усложнять модели данных поддержкой `Parcellable`
- не вылезем за пределы размера `Bundle`
- скрыть детали перехода на экран от других классов
- избавиться от дублирования. Теперь, для перехода на фрагмент/активити со значениями не нужно самостоятельно создавать объект `Bundle` и заполнять его
- строгое API. Перейти на фрагмент/активити и передать туда данные, не используя дублирование и прочите костыли, можно только используя специальную функцию из компаньон объекта
