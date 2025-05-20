# Kotlin/Native custom options

## Set iOS minimal deployment version

```groovy
compilations.all {
    kotlinOptions.freeCompilerArgs += "-Xoverride-konan-properties=osVersionMin.ios_x64=13.0;osVersionMin.ios_arm64=13.0"
}
```

## Debug linking issues

build.gradle
```groovy
cocoapods { 
    framework {
         freeCompilerArgs += "-Xverbose-phases=Linker"
    }
 }
```

gradle.properties
```
kotlin.internal.compiler.arguments.log.level=info
```

gradle run should be with `--info` option

## Verbose logs for compiler

```groovy
compilations.all {
    kotlinOptions.freeCompilerArgs += "-verbose"
}
```
