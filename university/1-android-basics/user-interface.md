---
sidebar_position: 4
---

# User Interface

Со всеми приложениями пользователь взаимодействует через интерфейс - User Interface (UI). Ранее мы уже задели создание интерфейса, а в данном блоке рассмотрим эту тему детальнее.

## Основы

Для начала нужно ознакомиться с главными UI классами:

- [Activity](https://developer.android.com/reference/android/app/Activity) - окно приложения, единственное что показывает UI в Android пользователю
- [Fragment](https://developer.android.com/guide/fragments) - часть UI (может быть отдельным экраном приложения, может частью экрана)
- [View](https://developer.android.com/reference/android/view/View) - небольшой блок пользовательского интерфейса, например текст, кнопка, поле ввода и т.д.

Для ознакомления на практике пройти уроки из официального Android курса - [Android Basics - Layouts](https://developer.android.com/courses/android-basics-kotlin/unit-2). 

Про `Fragment` полезно пройти CodeLab - [Advanced Android 01.1: Fragments](https://developer.android.com/codelabs/advanced-android-training-fragments) (в CodeLab используется Java, но при выполнении можно использовать Kotlin).

Также, для изучения жизненного цикла `Activity` и `Fragment`, хорошо подойдет CodeLab [Android Kotlin Fundamentals: Lifecycles and logging](https://developer.android.com/codelabs/kotlin-android-training-lifecycles-logging) и её продолжение - [Android Kotlin Fundamentals: Complex Lifecycle Situations](https://developer.android.com/codelabs/kotlin-android-training-complex-lifecycle)

Вопросы для самопроверки:

- Чем отличаются `Activity` и `Fragment`?
- Какой жизненный цикл `Activity`?
- Какой жизненный цикл `Fragment`?
- Что произойдет с введенным в `EditText` текстом, если произойдет изменение конфигурации (например поворот экрана)?
- Как сохранить положение скролла в `RecyclerView` или `ScrollView` при повороте экрана?

## Экраны и навигация

Современные android приложения строятся по подходу Single Activity, о котором рассказано в следующем видео.

<iframe src="//www.youtube.com/embed/2k8x8V77CrU" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
<br/>

В дополнение можно прочитать [статью](https://habr.com/ru/company/redmadrobot/blog/426617/) на русском языке.

Для построения навигации между экранами Google рекомендует использовать [Android Navigation Component](https://developer.android.com/guide/navigation), который наиболее полнофункционален именно с подходом Single Activity, когда мы в пределах одного Activity переходим между разными Fragment'ами.

Более подробно изучить работу с навигацией и попрактиковаться можно по следующим урокам:

- [Navigate between screens](https://developer.android.com/courses/pathways/android-basics-kotlin-unit-3-pathway-1)
- [Introduction to the Navigation component](https://developer.android.com/courses/pathways/android-basics-kotlin-unit-3-pathway-2)
  
Обязательно прочитайте про [передачу данных между компонентами](/learning/android/data-sharing). Из этой статьи вы узнаете:
- как правильно передавать данные между `Fragment`-ами и `Activity`
- почему следует передавать идентефикаторы данных, а не сами данные
- как реализовать строгое API передачи данных

## Верстка экрана

Верстка UI в Android на данный момент возможна несколькими способами:
1. Jetpack Compose - новый, современный подход, declarative UI 
1. XML layouts - все еще наиболее популярный, но начинающий устаревать

Мы будем рассматривать верстку через xml, так как она все ещё наиболее распространена и эти навыки точно потребуются на проектах ближайшие годы. 

:::info
Тем кто заинтересован посмотреть что такое Jetpack Compose подойдет набор уроков от Google - [Jetpack Compose](https://developer.android.com/courses/pathways/compose)
:::

С версткой через xml можно познакомиться через CodeLab - [Android Kotlin Fundamentals: LinearLayout using the Layout Editor](https://developer.android.com/codelabs/kotlin-android-training-linear-layout)

Многое в практиках от Google показывается через Layout Editor, но важно также смотреть и понимать что получается в результирующем xml. Чтобы понимать, к чему приводят действия в Layout Editor, читайте xml после действий в редакторе.

### ConstraintLayout

`ConstraintLayout` - это универсальный и многофункциональный лейаут. Его основное преимущество - без множественной вложенности описать сложное расположение элементов на экране. Он используется очень часто, потому что его возможности сильно упрощают реализацию сложных задач.

Подробно про `ConstraintLayout` - [Build a Responsive UI with ConstraintLayout](https://developer.android.com/training/constraint-layout/index.html). И практика для закрепления [Use ConstraintLayout to design your Android views](https://developer.android.com/codelabs/constraint-layout).

### RecyclerView

Важный элемент практически всех мобильных приложений - список элементов. На Android он реализуется с помощью [RecyclerView](https://developer.android.com/guide/topics/ui/layout/recyclerview). Подробно ознакомиться с концептом этого элемента и попрактиковаться можно в CodeLab - [Android Kotlin Fundamentals: RecyclerView fundamentals](https://developer.android.com/codelabs/kotlin-android-training-recyclerview-fundamentals).  
Чтобы лучше разобраться с требованиями к `RecyclerView.Adapter` рекомендуем прочитать [статью](/learning/android/adapter).  

Вопросы для самопроверки:

- Что такое `RecyclerView`?
- В каких случаях нужен `RecyclerView`, а в каких достаточно `LinearLayout`?

### Связь верстки и кода

Для обращения к UI элементам из кода мы используем инструмент [View Binding](https://developer.android.com/topic/libraries/view-binding). Он из xml layout'ов автоматически генерирует классы, которые мы можем использовать в коде и обращаться к разным view как к полям этого сгенерированного класса.

Также можно посмотреть следующее видео:

<iframe src="//www.youtube.com/embed/W7uujFrljW0" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
<br/>

## AndroidX & Jetpack

В текущем блоке мы использовали разные библиотеки от AndroidX и Jetpack. Разберемся с тем что это за библиотеки.

[AndroidX](https://developer.android.com/jetpack/androidx) - набор библиотек, обеспечивающих поддержку более новых API на старых версиях устройств. Они позволяют разработчику не задумываться о том, на какой версии android будет запускаться приложение, когда требуемый функционал менялся между разными релизами android. В прошлом этот набор библиотек назывался `Android Support Libraries`. Рекомендуется использовать AndroidX API, так как оно обновляется чаще релизов Android OS и может включать множество разных багфиксов (как и новых багов, куда без них).

[Jetpack](https://developer.android.com/jetpack) - набор библиотек (включающий и AndroidX), предоставляющий множество готовых решения для разных типовых задач разработки приложений - базы данных, архитектурные компоненты, работа с постраничной загрузкой, удобная работа с камерой и прочее (список библиотек большой, можно посмотреть на сайте).

## Забота о User Experience (UX)

Разработчики приложений должны стремиться к удобному и понятному пользовательскому опыту. Важно помнить, что мы пишем код не для себя, а чтобы пользователи могли получить приложение которое решает их задачи. Приложение может приносить боль при использовании, а может быть приятным, быстрым и удобным. Ставьте себя на место пользователя, когда делаете какой либо функционал, и спрашивайте "а пользовался бы я сам таким решением?".

В CodeLab Google подготовили набор советов, как сделать приложение удобнее и понятнее - [Create a more polished user experience](https://developer.android.com/codelabs/basic-android-kotlin-training-polished-user-experience).

А также многое про удобство можно прочитать на сайте [material.io](https://material.io/design) - разделы Interaction и Communication очень детально и наглядно объясняют как можно создавать комфортное использование приложения. Многие принципы применимы не только на android, но и на любой системе с UI.

## Practice time

Сделать приложение по [дизайну](https://www.figma.com/file/07E2agIcfVsAZBMoq91ccL/android-ui-education).

<iframe width="800" height="450" src="//www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2F07E2agIcfVsAZBMoq91ccL%2Fandroid-ui-education%3Fpage-id%3D0%253A1%26node-id%3D2%253A3%26viewport%3D241%252C48%252C0.62%26scaling%3Dscale-down%26starting-point-node-id%3D2%253A3" allowfullscreen></iframe>

1. Создать приложение с шаблона `Empty Activity`
1. Создать `data class Contact(val firstName: String, val lastName: String, val avatarResourceId: Int)`
1. Объявить глобальное свойство `contacts: List<Contact>` в котором написать 5 или больше разных контактов - это будут данные нашего приложения
1. Добавить 2 фрагмента - `ContactsFragment` и `ContactFragment`
1. На фрагменте `ContactsFragment` расположить `RecyclerView` отрисовывающий множество элементов - разные контакты
1. На фрагменте `ContactFragment` с помощью `ConstraintLayout` сверстать UI экрана просмотра контакта
1. С помощью Android Navigation Component сделать переходы между списком и просмотром контакта
