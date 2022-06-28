---
sidebar_position: 0
---

# Best Practices

## Введение
На этой странице перечислены наиболее распространенные ошибки, которые, как правило, новички повторяют не один раз, что существенно увеличивает время ревью.    
Однако, большинство из этих ошибок совсем не сложные и их легко заметить и исправить самостоятельно.    
Это позволит существенно сократить время прохождения ревью и быстрее стать крутым разработчиком ;)  

Для самопроверки, обращайтесь к тому разделу, которым вы сейчас занимаетесь.  

## Общее
1.
<details>
  <summary>Продумывайте имена функций и их содержимое</summary>
    <a href="function">памятка</a> Дописать еще чтобы в функции было что-то одно
</details>
1.
<details>
  <summary>Не реализуйте то, что уже есть в системе</summary>
    Если что-то в дизайне немного отличается от системного варианта <code>Alert</code>, <code>Toolbar</code>, кнопка "назад" - спросите у руководителя, действительно ли должно 1 в 1 быть как в дизайне. 99%, что системная реализация подходит
</details>
1.
<details>
  <summary>Не должно быть никакого хардкода текста, который показывается пользователю, надо использовать строки локализации</summary>
    Написать всякое
</details>
1.
<details>
  <summary>Не работайте с сетевыми сущностями в приложении</summary>
    <ul>
        <li>Преобразуйте сетевые сущности в свои - доменные и используйте их во всем приложении</li>
        <li>если в приложении вы работаете с сетевыми сущностями, то в случае, если на сервере что-то изменят, например изменят имя какого-то поля или поменяют вложенность полей, то вам придется исправлять все места, где используется эта сущность. А если при получении сетевой сущности вы сразу преобразуете(маппите) ее в доменную, то при изменении сетевой вам нужно будет просто изменить функцию-маппер.</li>
        <li>если от сервера где-то приходит `null` вы можете как-то заменить на `not-null` значение, чтобы удобнее работать в приложении. Например, если приходит поле `description = null` - в маппере можно заменить на пустую строку</li>
        <li>доменная сущность пишется независимо от серверной, она включает только то, что реально будет использоваться приложением, а не хранит абсолютно все данные, полученные от сервера</li>
    </ul>
</details>
1.
<details>
  <summary>Следите за неймингом!</summary>
    У вас не должно быть переменных и методов, которые не несут в названии никакой информации о том, для чего они предназначены
    например: <code>binding.button.setOnCLickListener &#123; buttonClickAction() &#125;</code> - ни кнопка, ни метод не несут абсолютно никакой информации о том, к чему они относятся
</details>
1.
<details>
  <summary>Используйте автоформатирование после изменения каждого файла</summary>
    <ul>
        <li> <code>Option</code> + <code>Command</code> + <code>L</code> (Android Studio)</li>
        <li> <code>Control</code> + <code>I</code> + <code>L</code> (Xcode)</li>
    </ul>
</details>
1.
<details>
  <summary>Нейминг переменных для Sate и Action</summary>
        Если вы используете  <code>State</code> и <code>Actions</code>, то в названии переменных обязательно должно фигурировать, что это <code>state</code> или <code>actions</code>
</details>
1.
<details>
  <summary>Начиная с 4ого блока</summary>
    <ul>
        <li> новые зависимости добавляйте сразу в <a href="../../learning/gradle/version-catalogs">libs.versions.toml</a> в нужный блок.</li>
        <li> Не используйте <code>MR</code> ресурсы на платформе, на Android есть <code>R</code>, на iOS есть <code>R.swift</code></li>
        <li> в мультиплатформенных ресурсах должны быть только те, которые управляются общей логикой. Те ресурсы, которые ей не управляются - должны находиться на платформе. ***ссылка на четвертый блок, где будет пояснение).***</li>
    </ul>
</details>
1.
<details>
  <summary> Не создавайте дополнительную переменную, если она никак не улучшает читаемость кода</summary>
        Пример?
</details>
1.
<details>
  <summary>Не допускайте сильной вложенности кода</summary>
    <ul>
        <li> используйте <a href="../../code-style/early-return">early return</a></li>
        <li> избегайте callback hell</li>
        <li> <code>somethingButton.setOnClickListener(::somethingButtonPressed)</code> - устанавливайте действие на клик одной функцией, не пишите логику сразу в <code>setOnClickListener</code> </li>
    </ul>
</details>
1.
<details>
  <summary> Максимально настраивайте UI элемент в <code>.xml</code> или <code>.xib</code></summary>
        чтобы не заниматься его настройкой в коде, Пример? 
</details>
1.
<details>
  <summary> Не используйте форскасты. </summary>
        О том, когда их действительно нужно использовать вы поймете, когда дорастёте до мидла :)
</details>
1.
<details>
  <summary> Разделяйте классы/интерфейсы/объекты по файлам </summary>
        <a href="../../learning/code-style/separate-by-files">кодстайл</a>
</details>
1.
:::tip ОБЯЗАТЕЛЬНО
Проверяйте по [кодстайлу](../../learning/code-style/it-in-lambdas) все то, что вы написали
:::
1.
<details>
  <summary> Кликабельные элементы UI не должны сами решать, какой метод вьюмодели им вызывать </summary>
    <ul>
        <li> <code>exitButton.setOnClickListener  &#123; viewModel.clearUserData() &#125;</code> - UI не должен говорить вьюмодели - чисти данные пользователя </li>
        <li> <code>exitButton.setOnClickListener &#123; viewModel.onExitButtonPressed() &#125;</code> - UI должен говорить вьюмодели - нажата кнопка <code>exitButton</code>, т.е. публичное API вьюмодели должно быть таким, чтобы по нему явно было понятно, когда его использовать </li>
    </ul>
</details>
1. 
:::warning ЭТО В РЕВЬЮ НЕ ОТМЕЧАЕТСЯ, СЛЕДИТЕ САМОСТОЯТЕЛЬНО
Используйте аннотации [@Throws](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/) только в случае, если это попадает в swift код
:::
1.
:::info
Используйте [weakLambda](../../learning/libraries/moko/moko-units#можно-ли-передавать-лямбду-в-unititem) - позволяет сохранять `receiver` слабой ссылкой
:::
1.
:::warning ЭТО В РЕВЬЮ НЕ ОТМЕЧАЕТСЯ, СЛЕДИТЕ САМОСТОЯТЕЛЬНО
Проверяйте, что не загрузили в гит всякую фигню, [настройте](https://kmm.icerock.dev/university/memos/gitignore) `.gitignore`
:::
1.
:::warning ЭТО В РЕВЬЮ НЕ ОТМЕЧАЕТСЯ, СЛЕДИТЕ САМОСТОЯТЕЛЬНО
Код не должен содержать никаких дебажных `print` и закомменченных строк, которые не несут никакой смысловой нагрузки
:::
1.
<details>
  <summary> Используйте <code>KeyValueStorage</code> правильно</summary>
    Данные из <code>KeyValueStorage</code> не должны сохраняться в свойства класса, каждый раз надо обращаться к <code>KeyValueStorage</code> и получать актуальное значение
</details>
1.
<details>
  <summary> Создавайте кастомные <code>Exceptions</code> правильно</summary>
    Кастомные <code>Exceptions</code>, которые вы сами кидаете, наследуйте от <code>RuntimeException()</code>, либо от более конкретных его наследников. Также, не забывайте прокидывать в родителя <code>cause</code> реально произошедшей ошибки, чтобы потом увидеть ее в <code>stackTrace</code>
</details>
1. 
<details>
  <summary> Расставляйте элементы UI в <code>xml</code> в порядке отрисовки, а не вразнобой </summary>
    <ul>
        <li> те элементы, которые находятся сверху экрана <code>Toolbar</code> объявляйте сверху в <code>.xml</code></li>
        <li> не забывайте, что объявленные "выше" элементы могут перекрываться элементами, объявленными ниже в <code>.xml</code></li>
    </ul>
</details>
1. 
<details>
  <summary> Не забывайте про конфликты имен Kotlin и iOS </summary>
    <ul>
        <li>если у вас в common коде будет свойство <code>description</code>, <a href="../../learning/kotlin-multiplatform/mobile-highlights#конфликты-имен-на-ios">вот</a> как оно будет доступно на iOS</li>
        <li> одинаковые имена переменных в двух разных интерфейсах</li>
        <li> функции с одинаковыми именами аргументов, но разными типами</li>
        <li> классы с одинаковым именем, но в разных пакетах</li>
    </ul>
</details>
1. 
<details>
  <summary> Связь UI с <code>viewModel</code> должна полностью находиться в функции <code>bindToViewModel</code> </summary>
    <ul>
        <li> функция <code>bindToViewModel</code> должна быть легкочитаема, поэтому должна вызывать другие функции, которые связывают конкретный UI элемент с <code>viewModel</code></li>
    </ul>
</details>
1. 
<details>
  <summary> Константы должны иметь явное название, чтобы по имени было понятно, для чего они нужны</summary>
    <ul>
        <li> плохо <code>const val REPO_NAME = "repo_name"</code></li>
        <li> плохо <code>const val REPO_NAME_ARG_KEY = "repo_name"</code></li>
    </ul>
</details>
1.
<details>
  <summary> Не надо выдавать никакие данные из юнита (например по клику)</summary>
    <ul>
        <li>по клику на юнит он должен просто информировать наружу - "на меня нажали"</li>
    </ul>
</details>
1.
:::info
Не создавайте общий класс констант - рано или поздно получится свалка, константы должны создаваться именно там, где они имеют смысл
:::
1.
<details>
  <summary>Никогда не обрабатывайте ловите <code>Error</code>-ы в <code>catch</code></summary>
    <ul>
        <li> у <code>Throwable</code> два наследника - <code>Exception</code> и <code>Error</code>. <code>Exception</code> нужно обрабатывать, они исправимы. а <code>Error</code>-ы - неисправимы, их обрабатывать не надо, приложение должно упасть с информацией о том чего пошло не так (в <code>Error</code> эта информация)</li>
        <li> изучите <a href="https://rollbar.com/blog/java-exceptions-hierarchy-explained/">документацию</a></li>
    </ul>
</details>
1.
:::warning
Если приложение поддерживает не только портретную ориентацию, проверяйте все экраны на соответствие дизайну перед отправкой на ревью
:::


## iOS
### Logic
1. 
:::warning ЭТО В РЕВЬЮ НЕ ОТМЕЧАЕТСЯ, СЛЕДИТЕ САМОСТОЯТЕЛЬНО
Все <code>@IBOutlet</code> должны быть приватными
:::
1. 
:::info
Обрабатывайте стейты на iOS [правильно](../../learning/state#обработка-на-ios)
:::
1. 
<details>
  <summary>Не забывайте про <a href="../../learning/memory_management">циклы</a> сильных ссылок </summary>
    <ul>
        <li> используйте <code>weak self</code> там, где он нужен</li>
        <li> приведет у утечке памяти: <code>cell.onTap = &#123; self.navigationController?... &#125;</code></li>
        <li> не приведет у утечке памяти: <code>cell.onTap = &#123; [weak self] in self?.navigationController?... &#125;</code></li>
    </ul>
</details>
1.
:::info
SplashScreen делать в `LaunchScreen.storyboard`, а не в `SplashViewController`
:::
1. 
<details>
  <summary> Убирайте текст кнопки "Назад" правильно</summary>
    <ul>
        <li> Чтобы у кнопки "Назад" не было текста - нужно у предыдущего экрана выставить в <code> navigationItem.backButtonTitle = "" </code></li>
        <li> <code>navController</code> берет название для кнопки "Назад" от того экрана, на который будет производиться переход назад </li>
    </ul>
</details>
1. 
<details>
  <summary> Ключи в классах всегда <code>private static let</code></summary>
    <ul>
        <li> Ключи не уникальные для конкретного экземпляра класса, поэтому делаем статическими</li>
    </ul>
</details>
1. 
<details>
  <summary> Устанавливайте версии подов в <code>Podfile</code></summary>
    <ul>
        <li> Версии установленных подов можно посмотреть после установки подов в файле <code>Podfile.lock</code></li>
        <li> Если версии подов не будут явно обозначены - то у нового разработчика, или у тебя (на другом компе) при установке подов могут подтянуться более новые версии. Есть вероятность, что в этих новых подах что-то будет изменено и проект не скомпилируется. Либо, как сейчас популярно, в библиотеку всунут зловредный код в новой версии он тоже скачается :) </li>
    </ul>
</details>
1. 
<details>
  <summary> Называйте <code>ViewController</code>-ы правильно</summary>
    <ul>
        <li> Все <code>ViewController</code>-ы должны называться с окончанием <code>ViewController</code>, а не <code>Screen</code>, потому что <code>Screen</code>- это экран девайса. <code>ViewController</code> не обязательно занимает весь экран, их на экране сразу несколько: твой собственный, <code>UINavigationController</code>, <code>UITabBarController</code>, модалки</li>
    </ul>
</details>
1. 
:::info
Не устанавливайте ресурсы для UI элементов в `xib` (текст, картинки и тд). Также, все строки локализации должны устанавливаться во `ViewController` в отдельной функции `localize()`
:::
1. 
<details>
  <summary> Называйте <code>@IBOutlet</code>-ы правильно</summary>
    <ul>
        <li>Все аутлеты должны содержать в название тех данных приложения, которые будут в нем отображаться</li>
        <li>По названию каждого аутлета должно быть однозначно понятно, к какому классу <code>View</code> он относится</li>
        <li>пример плохого нейминга для поля с описанием чего-либо - <code>@IBOutlet private var label: UILabel!</code></li>
        <li>хороший нейминг - <code>@IBOutlet private var descriptionLabel: UITextView!</code></li>
    </ul>
</details>
1.
:::info
Все изменения конфигурации проекта должны производиться в [xcconfig](https://kmm.icerock.dev/learning/ios/configuration)
:::
1. 
<details>
  <summary>Работа с ресурсами из <code>R.swift</code></summary>
    <ul>
        <li>Когда вы добавили картинки, цвета и другие ресурсы в Assets, вы можете получить к ним доступ через <code>R.swift</code>, например: <code>R.image.somethingImage()</code></li>
        <li>Однако, некоторые ресурсы, такие как цвета, <code>R.swift</code> возвращает <code>nullable</code>. В этом случае обработка этого состояния, и подставление другого цвета - неправильно, потому что раз <code>R.swift</code> предоставил доступ к переменной, значит смог ее сгенерировать на основе цвета. В этом случае можно использовать форскаст, а не обрабатывать возможность <code>null</code> и подставлять другой цвет, потому что в этом случае, если по какой-то причине ресурса цвета все таки не окажется (по неизвестной причине, т.к. переменная для доступа сгенерилась), об этой ошибке мы никогда не узнаем </li>
    </ul>
</details>
### UI
1.
<details>
  <summary> Используйте кастомные <code>View</code></summary>
    <ul>
        <li> Если какой-то одинаковый набор элементов используется сразу на нескольких экранах - выносите его в отдельную кастомную <code>UIView</code> и используйте на нужных экранах </li>
        <li> добавление кастомных вьюх должно быть не через код, а через <code>Interface builder</code></li>
    </ul>
</details>
1.
<details>
  <summary> в <code>.xib</code> добавляйте ресурсы только для отладки</summary>
    <ul>
        <li> Добавляйте текст, элементы списка, картинки, чтобы легче ориентироваться на дизайне экрана. Не добавляйте такой текст, который должен быть в готовом приложении, чтобы потом не забыть поменять. </li>
        <li> например, для названия кнопки ввода используйте не "Ввод", а "//Ввод", тогда, если бы вы забыли заменить этот текст, то сразу бы увидели это при запуске приложения</li>
    </ul>
</details>
1.
<details>
  <summary>Проверяйте имя файла картинки, которую скачали с <code>Figma</code></summary>
    <ul>
        <li> Имя картинки должно явно обозначать, что это за картинка, аналогично с неймингом переменных</li>
        <li> векторные картинки должны быть <code>single scale</code></li>
    </ul>
</details>
1.
<details>
  <summary> Если фон во всем приложении одинаковый - устанавливайте его правильно</summary>
    <ul>
        <li> вариант 1: установить в <code>AppDelegate</code>, <code>navigationController?.navigationBar.barStyle = .black</code> - сразу после создания контроллера устанавливаем цвет </li>
        <li> вариант 2: в <code>.plist</code> установите <code>UIViewControllerBasedStatusBarAppearance = NO</code> и <code>Status bar is initially hidden = NO</code>, тогда вообще не придется устанавливать <code>navigationBar.barStyle = .black</code></li>
    </ul>
</details>
1.
:::warning
`Extensions` для каждого класса должны находиться строго в отдельных файлах, с соответствующим названием файла - `ClassName+Extensions`
:::

## Android
### Logic
1.
:::info
Обрабатывайте стейты на Android [правильно](../../learning/state#обработка-на-android)
:::

1. Используйте конструкцию `with(binding...)` для `XML` элементов правильно. Не стоит ей злоупотреблять, иначе она будет только ухудшать читаемость.
   - не стоит использовать `binding`
      ```kotlin
      private fun setToolBar() {
          with(binding.toolbar) {
              navigationIcon = AppCompatResources.getDrawable(
                  requireContext(),
                  R.drawable.arrow_back
              )
              setNavigationOnClickListener {
                  findNavController().navigateUp()
              }
              setOnMenuItemClickListener { menuItem ->
                  when (menuItem.itemId) {
                      R.id.action_logout -> {
                          viewModel.onLogoutPressed()
                          true
                      }
                      else -> {
                          false
                      }
                  }
              }
          }
      }
      ```
   - стоит использовать `binding`
      ```kotlin
      with(binding.view1.subview1.subsubview1) {
          label1.text = TODO()
          button1.setOnClickListener { TODO() }
          image1.imageAlpha = TODO()
          view11.subview1.button1.setOnClickListener { TODO() }
          view11.subview2.button2.setOnClickListener { TODO() }
      }
      ```
1.
<details>
  <summary> Если в вашем приложении есть логика по выбору стартовой навигации</summary>
    <ul>
        <li> не забывайте использовать <code>savedInstanceState</code>, чтобы не создавать граф навигации заново</li>
        <li> убедитесь, что установили граф в <code>activity_main.xml</code></li>
    </ul>
</details>
1.
<details>
  <summary> Если вы не используете <a href="https://developer.android.com/guide/navigation/navigation-pass-data">navigation-safe-args-gradle-plugin</a> </summary>
    <ul>
        <li> аргументы фрагмента получайте через `requireArguments()`</li>
        <li> если какого-то аргумента нет - кидайте кастомную ошибку, что нет конкретного аргумента</li>
        <li> используйте вычисляемые свойства для работы с аргументами: `private val something: String get() = requireArguments().getString(SOMETHING_KEY) ?: throw NoArgumentsException(lostArgument: SOMETHING_KEY)`</li>
    </ul>
</details>
1.
:::info
Подписка вью на вьюмодель должна создаваться сразу, как только мы их создали, в методе `onViewCreated`
:::
1.
:::info
Тема приложения должна выставляться в `AndroidManifest`, а не в `Activity` и `Fragment`-ах
:::
1.
:::info
Во `Fragment`-ах корутины нужно запускать во `viewLifecycleScope`, а не `lifecycleScope`. То есть цепляться ко вьюхе, а не к фрагменту
:::
7. Не запутайтесь с удалением `Observer`:
   - так ничего не удалится
     ```kotlin
     private val request = MutableLiveData<...>()
     request.observeForever {
         if (it != null) {
             ...
         }
     }
     request.removeObserver { }
     ```
   - а вот так удалится
     ```kotlin
     private val request = MutableLiveData<...>()
     private val requestObserver: Observer<...?> = Observer { ... }
     request.removeObserver(requestObserver)
     ```
1.
:::info
***На чистом `Android`*** при работе со списками не забывайте смотреть [сюда](../../learning/android/adapter)
:::
1.
<details>
  <summary> Используйте <code>lateinit</code> правильно</summary>
    <ul>
        <li><code>lateinit</code> - это чисто андроидная штука, костыль, чтобы передавать компоненты во фрагменты и активити. Нужна потому что мы не можем создать кастомный класс фрагмента или активити, чтобы передавать зависимости сразу в конструктор. Мы даже не можем точно предсказать место, где будет создан объект фрагмента/активити. Поэтому <code>lateinit</code> - это костыль, которого нужно избегать, потому что <code>lateinit</code> переменную можно забыть проинитить и приложение крашнется</li>
    </ul>
</details>
1.
<details>
  <summary> Настраивайте <code>Toolbar</code> правильно </summary>
    <ul>
        <li>чтобы полностью взять на себя настройку <code>Toolbar</code> - укажите тему <code>NoActionBar</code> и, вместо <code>ActionBar</code>-а системного, используйте <code>Toolbar</code> - UI элемент который полностью тобой управляется. Также, у него есть встроенная интеграция с <code>Navigation Component</code></li>
    </ul>
</details>
1. 
:::info
Константы класса должны находиться в `сompanion object`, а в свойствах должно быть все то, что уникально для каждого экземпляра класса
:::

### UI
1.
<details>
  <summary> Используйте константы для отступов в приложении правильно: </summary>
    <ul>
        <li>если дизайнер обозначил, что есть общие значения для некоторых отступов и т.д. - используйте константы</li>
        <li>если обозначения общих размеров и отступов нет - использование констант на свой страх и риск (не рекомендуется)</li>
        <li>констант не должно быть слишком много, иначе они будут только путать</li>
        <li>именоваться константы должны относительно контекста использования - <code>background_color</code>, <code>status_bar_color</code>, <code>button_color_default</code>, <code>default_top_margin</code> и т.д.</li>
    </ul>
</details>
1.
:::info
Если какой-то набор элементов используется на нескольких экранах - выносите его в отдельный `.xml` и подключайте с помощью [include](https://developer.android.com/training/improving-layouts/reusing-layouts)
:::
1.
<details>
  <summary>Используйте <a href="https://developer.android.com/studio/write/tool-attributes"></a></summary>
    <ul>
        <li>во всех UI элементах, которые содержат поле <code>text</code>, устанавливайте текст используя <code>tools:text</code>, чтобы было легче ориентироваться в дизайне экрана</li>
    </ul>
</details>
1.
<details>
  <summary>Избегайте вложенности при использовании <code>ConstraintLayout</code></summary>
    <ul>
        <li>главная цель <code>ConstraintLayout</code> в том, чтобы не использовать вложение в <code>LinearLayout</code> для расположения элементов на экране. Нужно это, во-первых, для улучшения производительности, потому что при большой вложенности <code>layout</code> друг в друга она сильно падает. Во-вторых, для более удобной верстки и улучшения читаемости <code>xml</code></li>
    </ul>
</details>
1.
<details>
  <summary>Верстайте экран сверху вниз, констрейнты вьюхам устанавливайте относительно друг друга, а не привязывайте каждую к корневому <code>Layout</code></summary>
    <ul>
        <li>если элемент всегда расположен внизу экрана - не надо цеплять его к верхнему элементу</li>
        <li>чтобы убедиться, что ваши правила верстки правильные - проверяйте на экранах разного размера - большой, средний, маленький, для этого просто переключайте превью</li>
    </ul>
</details>
1.
:::warning ЭТО В РЕВЬЮ НЕ ОТМЕЧАЕТСЯ, СЛЕДИТЕ САМОСТОЯТЕЛЬНО
Не использовать `bias` для расположения элемента на экране
:::
1.
:::info
Отступы всегда должны быть кратны ***4*** (8, 16, 24, 32), если в дизайне по-другому, задавайте вопросы
:::
1.
<details>
  <summary>Используя свои стили, всегда наследуйтесь от дефолтного, чтобы не потерять его настройки</summary>
    <ul>
        <li>не указывайте размеры <code>width</code> и <code>height</code> в стилях</li>
    </ul>
</details>
1.
<details>
  <summary><code>xml</code> называйте аналогично названию класса</summary>
    <ul>
        <li>плохо: <code>DetailRepoInfoFragment</code> и <code>fragment_detail_repo</code></li>
        <li>хорошо: <code>DetailInfoFragment</code> и <code>detail_info_fragment</code></li>
    </ul>
</details>
1.
<details>
  <summary>Устанавливайте размеры вьюх правильно</summary>
    <ul>
        <li>размеры вьюх на Android не хардкодятся, как на iOS</li>
        <li>Фиксированные размеры устанавливаются только у картинок</li>
        <li>У всех остальных элементов высота - <code>wrap_content</code>, ширина - <code>0dp</code> - чтобы элемент растягивался по констрейнтам</li>
    </ul>
</details>

<details>
  <summary>ТЕст</summary>
    <ul>
        <li>
            <details>
            <summary>ТЕст2</summary>
                <ul>
                    <li></li>
                    <li></li>
                </ul>
            </details>
        </li>
        <li>
            <details>
            <summary>ТЕст3</summary>
                <ul>
                    <li></li>
                    <li></li>
                </ul>
            </details>
        </li>
    </ul>
</details>


## Перед отправкой на ревью
- Проверяйте, чтобы у MR не было конфликтов
  - если конфликты есть, вам нужно смержить ветку, в которую вы собираетесь мержить в ту, которую вы собираетесь мержить, и исправить конфликты
- При повторной отправке на ревью пройдитесь по всем предыдущим комментариям и убедитесь, что все исправили, отвечайте на каждый коммент, чтобы ничего не пропустить и ревьювер сразу понимал, что вы это исправили
- После каждого коммита выделяйте немного времени, чтобы отсмотреть все изменения, на наличие ошибок, перечисленных на этой странице.
- Обязательно обращайте внимание на пункты, выделенные красным. Ошибки в этих пунктах ***НЕ БУДУТ*** отмечены на ревью, вам нужно будет найти и исправить их самостоятельно.
- После создания итогового merge request, отсмотрите все сделанные в нем изменения. Благодаря тому, что вы проверяли их после каждого коммита, это не займет у вас слишком много времени.
- Чем чаще вы будете перепроверять себя, тем больше ошибок будите видеть и сможете не допускать их в будущем 

Такая самопроверка не только позволит вам не допускать перечисленных ошибок в будущем, но и ускорит ревью вашего merge request, потому что в нем уже не будет части ошибок.
