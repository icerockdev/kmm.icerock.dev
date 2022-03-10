# Передача данных 

## Теория

При переходе между фрагментами или активити регулярно требуется передавать какие-то данные. 

В первую очередь стоит отметить, что передавать стоит только id-шники или ключи, по которым получатель обратится к репозиторию и получит нужные данные. Это обезопасит вас от таких проблем, как:
- поддержка `Parcelable` у передаваемых данных
- объем хранилища `Bundle` всего 1 МБ  
- завязка экранов на предыдущих -> проблемы при пересоздании экранов (отсутствие данных, полученных с прошлого экрана, которые лежали в кеше и стерлись, например, из-за ошибки памяти) //переписать

Поэтому, удобнее и правильнее передавать какие-нибудь ключи или id-шники, чтобы:
- без проблем можно было сохранить в `Bundle`, обезопасившись от привязки на данные от предыдущего экрана при неожиданной ошибке или пересозданию экрана
- получать данные от репозитория, по полученному id или ключу

Рассмотрим, как происходит передача данных между `Fragment` и `Activity`.

Передача данных между фрагментами осуществляется во время перехода по графу навигации, например, с помощью метода `navigate`. 

```kotlin
    /**
     * Navigate to a destination from the current navigation graph. This supports both navigating
     * via an {@link NavDestination#getAction(int) action} and directly navigating to a destination.
     *
     * @param resId an {@link NavDestination#getAction(int) action} id or a destination id to
     *              navigate to
     * @param args arguments to pass to the destination
     */
    public void navigate(@IdRes int resId, @Nullable Bundle args) {
        navigate(resId, args, null);
    }
```

Для перехода между активити и передачи данных используется [Intent](https://developer.android.com/reference/android/content/Intent) и один из его методов `putExtra`.

```kotlin
 /**
     * Add extended data to the intent.  The name must include a package
     * prefix, for example the app com.android.contacts would use names
     * like "com.android.contacts.ShowAll".
     *
     * @param name The name of the extra data, with package prefix.
     * @param value The Parcelable[] data value.
     *
     * @return Returns the same Intent object, for chaining multiple calls
     * into a single statement.
     *
     * @see #putExtras
     * @see #removeExtra
     * @see #getParcelableArrayExtra(String)
     */
    public @NonNull Intent putExtra(String name, @Nullable Parcelable[] value) {
        if (mExtras == null) {
            mExtras = new Bundle();
        }
        mExtras.putParcelableArray(name, value);
        return this;
    }
```

Как можно заметить `navigate` и `putExtra` работают с хранилищем типа [Bundle](https://developer.android.com/reference/kotlin/android/os/Bundle), в которое можно сохранить только `Parcelable` значения. Это как раз подходит для наших целей - передавать только простые ключи и id-шники.

## Реализация

Разберем всю цепочку на примере перехода между двумя фрагментами, для активити принцип будет такой же.  
Допустим, мы хотим перейти с `AuthScreenFragment` на `MainScreenFragment` и передать `userId` пользователя.
Поскольку `Bundle` - это `key-value` хранилище, нам нужен секретный ключ для `userId`, который бы знал только фрагмент-получатель (`MainScreenFragment`), но записать по нему `userId` мог и фрагмент-отправитель (`AuthScreenFragment`).  
Для этого создадим компаньон-объект в `MainScreenFragment`:

```kotlin
companion object {
    private const val USER_ID_KEY = "userIdKey"

    fun argsBundle(userId: Int): Bundle {
        return bundleOf(USER_ID_KEY to userId)
    }
}
```

А когда нужно будет перейти c `AuthScreenFragment` на `MainScreenFragment` вызовем следующий метод:

```kotlin
override fun routeToMainScreen(userId: Int) {
    findNavController().navigate(
        R.id.action_authScreenFragment_to_mainScreenFragment,
        MainScreenFragment.argsBundle(userId)
    )
}
```

Таким образом, о секретном ключе, по которому будет находиться `userId` знает только фрагмент-получатель, потому что только ему нужен этот id, чтобы получить по нему данные от репозитория.
