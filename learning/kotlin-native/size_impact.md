# Вес бинарника с Kotlin/Native

- Рассказ в [видео](https://www.youtube.com/watch?v=hrRqX7NYg3Q&t=1892s) о размере фреймворка с
  Kotlin/Native

[Общение из kotlinlang](https://kotlinlang.slack.com/archives/C3PQML5NU/p1633027278225200):
> Anton Afanasev  
> My .framework is around ~15 mb. For a pretty small sdk with a couple of standard dependencies like ktor.   
> I am fine with that, but you know...customers complains. So I must check if there are anything to do with binary sizes.   
> I tried "internalizing" all I could. And there were a pretty nice effect. I actually saw a reduction of ~500 kb after doing that on a bunch of data classes. Wonder if there are anything else that can help to downsize.   
> @kpgalligan I remember you were talking about KMM team working on K\N - Swift interoperability which should reduce the size. Wondering if there are any progress on that. I read somewhere that this work was frozen.
>
> Kevin Galligan  
> Well, again, to measure the actual size, you need to either push it to the app store and let apples servers crunch numbers, or run local size estimates with Xcode. The size on your dev disk is not wha the actual app size will be. I don't remember how I presented it in that talk (and I have a talk today that I'm really not prepared for, so I don't have a lot of time to reply here...), but raw numbers on disk don't really tell the story. For KaMP Kit, which has ktor, sqldelight, and a few others, our sizes were ~1.5m as a final size increase on real devices. I assume local disk size was much larger, but it's been a while.   
> I would try this, if not uploading: https://developer.apple.com/documentation/xcode/reducing-your-app-s-size#Create-the-App-Size-Report  
> They're not 100% the same as uploaded, but very close.
>
> Anton Afanasev  
> Thank you @kpgalligan for great advise. With the help of our iOS team I was able to run the size report and results were pretty good looking. Original ~26mb .framework file was reduced to ~6mb . I believe it should calm down our client. However, for educational purpose I am wondering if anybody have any understanding about processes that makes this downsize actually happen. Why initial .framework is so big and how it is downsized...
>
> Kevin Galligan    
> I don't have a ton of detail, but there are a number of things. Debugging info, possibly multiple architectures (actual device only needs one). Probably a bunch of other stuff. It's not unique to kotlin. Ios size estimation can be complicated
