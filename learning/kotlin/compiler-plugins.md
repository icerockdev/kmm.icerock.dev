# Плагины компилятора

Компилятор Kotlin позволяет модифицировать логику компиляции за счёт подключения компиляторных
плагинов. Начиная с Kotlin 1.9+ / 2.0 JVM, JS и Native используют единую IR-инфраструктуру
для плагинов. Для подключения используется специальный Gradle-плагин, который сообщает
компилятору, откуда и какие плагины компилятора нужно взять.

## Примеры

- https://github.com/Foso/KotlinCompilerPluginExample
- https://github.com/Foso/MpApt (архивирован, вместо него рекомендуется KSP)
- https://github.com/icerockdev/moko-widgets/tree/master/plugin (архивирован)
- https://github.com/AhmedMourad0/no-copy
- https://kotlinlang.org/docs/all-open-plugin.html

## Отладка

https://github.com/Foso/MpApt/wiki/How-to-debug-Kotlin-Compiler-Plugin

Для отладки Kotlin/Native плагина нужно добавить в gradle.properties:

```
kotlin.native.jvmArgs=-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=5006
kotlin.native.disableCompilerDaemon=true
```

И в IDEA добавить `Remote JVM debug` конфигурацию с подключением по порту 5006.

Для отладки Kotlin/JVM / JS плагина добавить в gradle.properties:
```
kotlin.daemon.jvm.options=-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=5006
```

## Ссылки

- https://blog.bnorm.dev/writing-your-second-compiler-plugin-part-1 (статья из 6 частей)
- https://medium.com/@heyitsmohit/writing-kotlin-compiler-plugin-with-arrow-meta-cf7b3689aa3e
- https://www.youtube.com/watch?v=w-GMlaziIyo — KotlinConf 2018, Kevin Most «Writing Your First Kotlin Compiler Plugin»
- https://github.com/ShikaSD/kotlin-compiler-notes
