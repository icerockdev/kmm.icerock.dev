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

А для ознакомления на практике пройти уроки из официального Android курса - [Android Basics - Layouts](https://developer.android.com/courses/android-basics-kotlin/unit-2). 

Про `Fragment` полезно пройти CodeLab - [Advanced Android 01.1: Fragments](https://developer.android.com/codelabs/advanced-android-training-fragments).

Также, для изучения жизненного цикла `Activity` и `Fragment`, хорошо подойдет CodeLab [Android Kotlin Fundamentals: Lifecycles and logging](https://developer.android.com/codelabs/kotlin-android-training-lifecycles-logging) и его продолжение - [Android Kotlin Fundamentals: Complex Lifecycle Situations](https://developer.android.com/codelabs/kotlin-android-training-complex-lifecycle)

Вопросы для самопроверки:

- Чем отличаются `Activity` и `Fragment`?
- Какой жизненый цикл `Activity`?
- Какой жизненый цикл `Fragment`?
- Что произойдет с введенным в `EditText` текстом, если произойдет изменение конфигурации (например поворот экрана)?
- Как сохранить положение скролла в `RecyclerView` или `ScrollView` при повороте экрана?

## Экраны и навигация

Современные android приложения строятся по подходу Single Activity, о котором рассказано в следующем видео.

<iframe src="//www.youtube.com/embed/2k8x8V77CrU" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
<br/>

В дополнение можно прочитать [статью](https://habr.com/ru/company/redmadrobot/blog/426617/) на русском языке.

Google рекомендует использовать для построения навигации между экранами [Android Navigation Component](https://developer.android.com/guide/navigation), который наиболее полнофункционален именно с подходом Single Activity, когда мы в пределах одного Activity переходим между разными Fragment'ами.

Более подробно изучить работу с навигацией и попрактиковаться можно по следующим урокам:

- [Navigate between screens](https://developer.android.com/courses/pathways/android-basics-kotlin-unit-3-pathway-1)
- [Introduction to the Navigation component](https://developer.android.com/courses/pathways/android-basics-kotlin-unit-3-pathway-2)

## Верстка экрана

Верстка UI в Android на данный момент возможна несколькими способами:
1. Новый, современный подход, declarative UI - Jetpack Compose
1. Все еще наиболее популярный, но начинающий устаревать - XML layouts

Мы рассматривать будем верстку через xml, так как она наиболее распространена все ещё и эти навыки точно потребуются на проектах ближайшие годы. 

:::info
Тем кто заинтересован посмотреть что такое Jetpack Compose подойдет набор уроков от Google - [Jetpack Compose](https://developer.android.com/courses/pathways/compose)
:::

С версткой через xml можно познакомиться через CodeLab - [Android Kotlin Fundamentals: LinearLayout using the Layout Editor](https://developer.android.com/codelabs/kotlin-android-training-linear-layout)

Многое в практиках от Google показывается через Layout Editor, но важно также смотреть и понимать что получается в результирующем xml, читай xml самостоятельно, даже если внес изменения через Layout Editor, чтобы понимать к чему приводят какие либо действия в редакторе.

### ConstraintLayout

`ConstraintLayout` является универсальным и многофункциональным лейаутом, который позволяет без множественной вложенности описать сложные расположения элементов на экране. Он используется очень часто и его возможности упрощают реализацию даже сложных задач.

Подробно про `ConstraintLayout` - [Build a Responsive UI with ConstraintLayout](https://developer.android.com/training/constraint-layout/index.html). И практика для закрепления [Use ConstraintLayout to design your Android views](https://developer.android.com/codelabs/constraint-layout).

### RecyclerView

Важный элемент практически всех мобильных приложений - список элементов. На Android он реализуется с помощью [RecyclerView](https://developer.android.com/guide/topics/ui/layout/recyclerview). Подробно ознакомиться с концептом этого элемента интерфейса и попрактиковаться можно в CodeLab - [Android Kotlin Fundamentals: RecyclerView fundamentals](https://developer.android.com/codelabs/kotlin-android-training-recyclerview-fundamentals).

Вопросы для самопроверки:

- Что такое `RecyclerView`?
- В каких случаях нужен `RecyclerView`, а в каких достаточно `LinearLayout`?

### Связь верстки и кода

Для обращения из кода к UI элементам мы используем инструмент [View Binding](https://developer.android.com/topic/libraries/view-binding). Он из xml layout'ов автоматически генерирует классы, которые мы можем использовать в коде и обращаться к разным view как к полям этого сгенерированного класса.

Также можно посмотреть следующее видео:

<iframe src="//www.youtube.com/embed/W7uujFrljW0" frameborder="0" allowfullscreen width="675" height="380"></iframe>
<br/>
<br/>

## AndroidX & Jetpack

В текущем блоке мы использовали разные библиотеки от AndroidX и Jetpack. Разберемся с тем что это за библиотеки.

[AndroidX](https://developer.android.com/jetpack/androidx) - набор библиотек обеспечивающих поддержку более новых API на старых версиях устройств. Они позволяют разработчику не задумываться о том, на какой версии android будет запускаться приложение, когда требуемый функционал менялся между разными релизами android. В прошлом этот набор библиотек назывался `Android Support Libraries`. Рекомендуется использовать AndroidX API, так как оно обновляется чаще релизов Android OS и может включать множество разных багфиксов (как и новых багов, куда без них).

[Jetpack](https://developer.android.com/jetpack) - набор библиотек (включающий и AndroidX), предоставляющий множество готовых решения для разных типовых задач разработки приложений - базы данных, архитектурные компоненты, работа с постраничной загрузкой, удобная работа с камерой и прочее (список библиотек большой, можно посмотреть на сайте).

## Забота о User Experience (UX)

Разработчики приложений должны стремиться к удобному и понятному пользовательскому опыту, важно помнить что пишем код не для себя, а чтобы пользователи могли получить приложение которое решает их задачи. Приложение может приносить боль при использовании, а может быть приятным, быстрым и удобным. Ставьте себя на место пользователя, когда делаете какой либо функционал, и спрашивайте "а пользовался бы я сам таким решением?".

В CodeLab Google подготовили набор советов, как сделать приложение удобнее и понятнее - [Create a more polished user experience](https://developer.android.com/codelabs/basic-android-kotlin-training-polished-user-experience).

А также многое про удобство можно прочитать на сайте [material.io](https://material.io/design) - разделы Interaction и Communication очень детально и наглядно объясняют как можно создавать комфортное использование приложения. Многие принципы применимы не только на android, но и на любой системе с UI.

## Practice time

TODO

## Highlights

TODO
