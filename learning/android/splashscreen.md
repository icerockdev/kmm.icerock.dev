# SplashScreen

SplashScreen - это первый экран, который виден юзеру. Как правило, он предствляет собой логотип и название приложения или компании-разработчика. Также, во время показа сплешскрина можно загрузить что-нибудь, нужное для работы приложения 

Сейчас, для создания сплеша существует два подхода
- новый
- старый 

Рассмотрим каждый из них 

Старый подход:

создается стиль с параметром `android:windowBackground`, в который помещается картинка или просто цвет для спелша
```xml
    <style name="AppTheme.Splash">
        <!-- Splash Style -->
        <item name="android:windowBackground">@drawable/launcher_background</item>
    </style>
```

далее в манифесте создается сплеш активити, темой которой указвается наш созданный новый стиль. Также, со сплеша создается переход на main активити

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

Теперь класс сплеша, просто после задержки переходим на main. Если нам нужно загрузить какие-то данные, то переходим только после их полной загрузки

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