# Плагины компилятора

Компилятор Kotlin позволяет делать модификацию логики компиляции за счет подключения компиляторных
плагинов. На данный момент Kotlin/JVM и Kotlin/JS используют один вариант компиляторных плагинов, а
Kotlin/Native другой. Для подключения используется специальный gradle плагин, который сообщает
компилятору откуда и какие плагины компилятора нужно взять.

## Примеры

- https://github.com/Foso/KotlinCompilerPluginExample
- https://github.com/Foso/MpApt
- https://github.com/icerockdev/moko-widgets/tree/master/plugin
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

- https://bnorm.medium.com/writing-your-second-kotlin-compiler-plugin-part-1-project-setup-7b05c7d93f6c (6 частей у статьи)
- https://medium.com/@heyitsmohit/writing-kotlin-compiler-plugin-with-arrow-meta-cf7b3689aa3e
- https://www.youtube.com/watch?v=w-GMlaziIyo
