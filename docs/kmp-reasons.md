---
sidebar_position: 1
---

# Почему выбирают Kotlin Multiplatform Mobile?

В сообществе [MobileNativeFoundation](https://github.com/MobileNativeFoundation) представитель Touchlab [рассказал их наблюдения о том почему компании выбирают Kotlin Multiplatform](https://github.com/MobileNativeFoundation/discussions/discussions/43#discussioncomment-476363).

> Here's a selection of some reasons I've heard for choosing Kotlin Multiplatform as a native code sharing solution vs a cross-platform solution
> 
> * Must have strong offline capabilities
> * Heavy reliance on device sensors
> * Been burned by choosing cordova/react-native/xamarin in the past
> * Don't want to reskill the team
> * Want to focus on sharing business logic and don't want to retool UIs
> * Maximizing the the value of code sharing is better than maximizing the amount of code sharing
> * The risk of making the wrong choice (backing out of KMP can keep Android app, backing out of others means starting over)
> * See the value of native UI for optimal customer experience
> * Retain great devs who see the value in learning and using Swift, SwiftUI, Kotlin, and Jetpack Compose
> * Apple's mobile investments and Google's Android investments are a more stable bet than Google's Flutter and other 3rd party solutions
> * Don't want to introduce a 3rd platform (still need native devs with other solutions)
> * Can use innovations from Apple and Google as soon as appropriate rather than waiting on 3rd party or community
> * Current library choices don't have equivalents in other solutions, are less maintained, featureful, or would require taking on the work of making them work
> 
> Here are some more articles ([airbnb](https://github.com/MobileNativeFoundation/discussions/discussions/43#discussioncomment-456753), [shopify](https://github.com/MobileNativeFoundation/discussions/discussions/43#discussioncomment-456753), and [nubank](https://github.com/MobileNativeFoundation/discussions/discussions/43#discussioncomment-434237) already in previous comments)
> 
> * [VMWare chooses KMP](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)
> * [Square chooses KMP](https://developer.squareup.com/blog/developing-on-ios-and-android/)
> * [Quizlet chooses KMP](https://medium.com/tech-quizlet/shared-code-at-quizlet-kotlin-multiplatform-2ee1b57646c)
> * [Wantedly moving from React Native to KMP](https://medium.com/wantedly-engineering/moving-from-react-native-to-kotlin-multiplatform-292c7569692)
> * [Udacity moving from React Native to Native](https://engineering.udacity.com/react-native-a-retrospective-from-the-mobile-engineering-team-at-udacity-89975d6a8102)
> * [infinut Math chooses KMP over Unity](https://medium.com/@anaredmond/unity-vs-kotlin-native-64cd75386357)
> * [Netflix chooses KMP](https://netflixtechblog.com/netflix-android-and-ios-studio-apps-kotlin-multiplatform-d6d4d8d25d23)
> * [SuperAwesome chooses KMP](https://www.superawesome.com/blog/how-we-developed-our-new-video-platform-rukkaz-as-a-cross-platform-mobile-app/)
> * [Slack moves away from C++](https://slack.engineering/client-consistency-at-slack-beyond-libslack/)
> * [Dropbox moves away from C++](https://dropbox.tech/mobile/the-not-so-hidden-cost-of-sharing-code-between-ios-and-android)

А также на сайте [Kotlin Multiplatform Mobile](https://kotlinlang.org/lp/mobile/) в разделе [Case Studies](https://kotlinlang.org/lp/mobile/case-studies/) можно прочитать детально о опыте использованя технологии в разных компаниях. Уже сейчас там есть компании VMWare, Autodesk, Yandex, Square, Philips, Netflix и другие, включая и нас, IceRock.