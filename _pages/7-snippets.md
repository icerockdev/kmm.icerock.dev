---
title: 6. Snippets
author: Aleksey Mikhailov
layout: post
---

# Set own minimal iOS version for Kotlin/Native
```groovy
compilations.all {
    kotlinOptions.freeCompilerArgs += "-Xoverride-konan-properties=osVersionMin.ios_x64=13.0;osVersionMin.ios_arm64=13.0"
}
```
