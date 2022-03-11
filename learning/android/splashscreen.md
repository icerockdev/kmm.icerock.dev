# SplashScreen

SplashScreen - это первый экран, который виден юзеру. Как правило, он предствляет собой логотип и название приложения или компании-разработчика. Также, во время показа сплешскрина можно загрузить что-нибудь, нужное для работы приложения 


 - это первый экран, который показывается сразу при запуске приложения. Как правило, на нем отображается логотип приложения на каком-нибудь фоне.
SC выполняет сразу две функции 
    - часто, для работы приложения нужно сразу загрузить какие-то данные, например, перые записи в списке новостей, это как раз и произойдет во время показа сплеша
    - это стандартный стиль? Даже если для запуска приложения ничего не нужно грузить, следует показать сплеш на 1-2 секунды 

Существуют два основых способа, для создания сплеша, давайте их разберем:

- современный способ, используя AndroidX, имеет обратную совместимость до Android 21
- старый подход

## Старый подход
Часто на проектах вы встретитесь именно с этим способом создания splasha. 
Он подразумевает под собой создание стартовой SplashActivity, с которой будет начинаться запуск приложения

1. Cоздается стиль с параметром `android:windowBackground`, который позволяет изменить фон главного экрана. Разместим там подговленную картинку с логотипом и фоном
   ```xml
       <style name="AppTheme.Splash">
           <!-- Splash Style -->
           <item name="android:windowBackground">@drawable/launcher_background</item>
       </style>
   ```

1. Теперь класс сплеша, просто после задержки переходим на main. Если нам нужно загрузить какие-то данные, то переходим только после их полной загрузки
   ```kotlin
   class SplashActivity : AppCompatActivity() {
       init {
           lifecycleScope.launchWhenResumed {
               delay(SPLASH_SCREEN_DELAY_IN_MILLI)
               val mainActivityIntent = Intent(this@SplashActivity, MainActivity::class.java)
               this@SplashActivity.startActivity(mainActivityIntent)
               this@SplashActivity.finish()
           }
       }
   
       private companion object {
           const val SPLASH_SCREEN_DELAY_IN_MILLI: Long = 2000
       }
   }
   ```
   
1. И наконец, нужно объявить новую Activity в манифесте, Устанавливаем ей `android:theme` ранее созданным стилем и добавляем переход на `MainActivity`
   ```xml
   <activity
       android:name=".view.SplashActivity"
       android:theme="@style/AppTheme.Splash">
       <intent-filter>
           <action android:name="android.intent.action.MAIN" />
           <category android:name="android.intent.category.LAUNCHER" />
       </intent-filter>
   </activity>
   ```


## Новый подход
https://developer.android.com/guide/topics/ui/splash-screen 
https://developer.android.com/reference/kotlin/androidx/core/splashscreen/SplashScreen

гайд по подключению https://developer.android.com/guide/topics/ui/splash-screen/migrate

Работает на Android Api 31 (Android 12) но имеет совместимость вплоть до Android Api 21 (не работает анимированый лого)

Созадем пустое приложение

Имплементим библиотеку 
```kotlin
implementation 'androidx.core:core-splashscreen:1.0.0-beta01'
```

```kotlin
class MainActivity : AppCompatActivity() {
   override fun onCreate(savedInstanceState: Bundle?) {
      val splashScreen = installSplashScreen()
      super.onCreate(savedInstanceState)

      splashScreen.setKeepOnScreenCondition { true }

      setContentView(R.layout.activity_main)
   }
}
```

создать тему для api 21+

```xml
    <style name="Theme.SplashScreenSample" parent="Theme.SplashScreen">
        <item name="android:windowBackground">@color/teal_700</item>
    </style>
```


