"use strict";(self.webpackChunkkmm_icerock_dev=self.webpackChunkkmm_icerock_dev||[]).push([[512],{3905:function(t,e,n){n.d(e,{Zo:function(){return p},kt:function(){return m}});var r=n(67294);function i(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function o(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function a(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?o(Object(n),!0).forEach((function(e){i(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function l(t,e){if(null==t)return{};var n,r,i=function(t,e){if(null==t)return{};var n,r,i={},o=Object.keys(t);for(r=0;r<o.length;r++)n=o[r],e.indexOf(n)>=0||(i[n]=t[n]);return i}(t,e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(r=0;r<o.length;r++)n=o[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(i[n]=t[n])}return i}var c=r.createContext({}),s=function(t){var e=r.useContext(c),n=e;return t&&(n="function"==typeof t?t(e):a(a({},e),t)),n},p=function(t){var e=s(t.components);return r.createElement(c.Provider,{value:e},t.children)},u={inlineCode:"code",wrapper:function(t){var e=t.children;return r.createElement(r.Fragment,{},e)}},d=r.forwardRef((function(t,e){var n=t.components,i=t.mdxType,o=t.originalType,c=t.parentName,p=l(t,["components","mdxType","originalType","parentName"]),d=s(n),m=i,k=d["".concat(c,".").concat(m)]||d[m]||u[m]||o;return n?r.createElement(k,a(a({ref:e},p),{},{components:n})):r.createElement(k,a({ref:e},p))}));function m(t,e){var n=arguments,i=e&&e.mdxType;if("string"==typeof t||i){var o=n.length,a=new Array(o);a[0]=d;var l={};for(var c in e)hasOwnProperty.call(e,c)&&(l[c]=e[c]);l.originalType=t,l.mdxType="string"==typeof t?t:i,a[1]=l;for(var s=2;s<o;s++)a[s]=n[s];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},34614:function(t,e,n){n.r(e),n.d(e,{frontMatter:function(){return a},contentTitle:function(){return l},metadata:function(){return c},toc:function(){return s},default:function(){return u}});var r=n(87462),i=n(63366),o=(n(67294),n(3905)),a={sidebar_position:2},l="Kotlin",c={unversionedId:"android-basics/kotlin",id:"android-basics/kotlin",isDocsHomePage:!1,title:"Kotlin",description:"Examples",source:"@site/university/1-android-basics/kotlin.md",sourceDirName:"1-android-basics",slug:"/android-basics/kotlin",permalink:"/university/android-basics/kotlin",editUrl:"https://github.com/icerockdev/kmm.icerock.dev/tree/docusaurus/university/1-android-basics/kotlin.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"\u041f\u0435\u0440\u0432\u044b\u0435 \u0448\u0430\u0433\u0438",permalink:"/university/android-basics/getting-started"},next:{title:"Gradle",permalink:"/university/android-basics/gradle"}},s=[{value:"Examples",id:"examples",children:[]},{value:"Koans",id:"koans",children:[]},{value:"\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430\u0446\u0438\u044f",id:"\u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430\u0446\u0438\u044f",children:[]},{value:"\u0413\u0434\u0435 \u043c\u043e\u0436\u043d\u043e \u043f\u043e\u043f\u0440\u0430\u043a\u0442\u0438\u043a\u043e\u0432\u0430\u0442\u044c\u0441\u044f",id:"\u0433\u0434\u0435-\u043c\u043e\u0436\u043d\u043e-\u043f\u043e\u043f\u0440\u0430\u043a\u0442\u0438\u043a\u043e\u0432\u0430\u0442\u044c\u0441\u044f",children:[]},{value:"\u0412\u0441\u043f\u043e\u043c\u043d\u0438\u0442\u044c \u0433\u043b\u0430\u0432\u043d\u043e\u0435",id:"\u0432\u0441\u043f\u043e\u043c\u043d\u0438\u0442\u044c-\u0433\u043b\u0430\u0432\u043d\u043e\u0435",children:[]}],p={toc:s};function u(t){var e=t.components,n=(0,i.Z)(t,["components"]);return(0,o.kt)("wrapper",(0,r.Z)({},p,n,{components:e,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"kotlin"},"Kotlin"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("p",null,"\u0414\u043b\u044f \u0437\u043d\u0430\u043a\u043e\u043c\u0441\u0442\u0432\u0430 \u0441 \u044f\u0437\u044b\u043a\u043e\u043c \u0440\u0430\u0437\u0440\u0430\u0431\u043e\u0442\u043a\u0438 Kotlin \u0432\u043e\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u043c\u0441\u044f \u0440\u0430\u0437\u0434\u0435\u043b\u043e\u043c ",(0,o.kt)("a",{parentName:"p",href:"https://play.kotlinlang.org/byExample"},"Examples")," \u043d\u0430 \u043e\u0444\u0438\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u043c \u0441\u0430\u0439\u0442\u0435 (\u0433\u0440\u0443\u043f\u043f\u0443 Kotlin/JS \u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u043d\u0435 \u043d\u0443\u0436\u043d\u043e).\n\u0414\u0430\u043d\u043d\u044b\u0439 \u0440\u0430\u0437\u0434\u0435\u043b \u043f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0435\u0442 \u043d\u0430\u0433\u043b\u044f\u0434\u043d\u043e, \u043d\u0430 \u0438\u043d\u0442\u0435\u0440\u0430\u043a\u0442\u0438\u0432\u043d\u044b\u0445 \u043f\u0440\u0438\u043c\u0435\u0440\u0430\u0445, \u0432\u0435\u0441\u044c \u0441\u0438\u043d\u0442\u0430\u043a\u0441\u0438\u0441 \u044f\u0437\u044b\u043a\u0430 \u0438 \u043d\u0430\u0438\u0431\u043e\u043b\u0435\u0435 \u043f\u043e\u043f\u0443\u043b\u044f\u0440\u043d\u044b\u0435 \u0432\u043e\u0437\u043c\u043e\u0436\u043d\u043e\u0441\u0442\u0438 \u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u043e\u0439 \u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0438 Kotlin."),(0,o.kt)("h2",{id:"koans"},"Koans"),(0,o.kt)("p",null,"\u041f\u043e\u0441\u043b\u0435 \u0438\u0437\u0443\u0447\u0435\u043d\u0438\u044f \u0442\u0435\u043e\u0440\u0438\u0438 \u043d\u0443\u0436\u043d\u043e \u043f\u043e\u043f\u0440\u0430\u043a\u0442\u0438\u043a\u043e\u0432\u0430\u0442\u044c\u0441\u044f - \u0440\u0430\u0437\u0434\u0435\u043b ",(0,o.kt)("a",{parentName:"p",href:"https://play.kotlinlang.org/koans/overview"},"Koans")," \u043f\u043e\u043c\u043e\u0436\u0435\u0442 \u0437\u0430\u043a\u0440\u0435\u043f\u0438\u0442\u044c \u0438\u0437\u0443\u0447\u0435\u043d\u043d\u044b\u0435 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b \u043d\u0430 \u043f\u0440\u0430\u043a\u0442\u0438\u043a\u0435.\n\u0412 \u0434\u0430\u043d\u043d\u043e\u043c \u0440\u0430\u0437\u0434\u0435\u043b\u0435 \u0432 \u0438\u043d\u0442\u0435\u0440\u0430\u043a\u0442\u0438\u0432\u043d\u043e\u043c \u0444\u043e\u0440\u043c\u0430\u0442\u0435, \u043f\u0440\u044f\u043c\u043e \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435, \u0432\u0430\u043c \u043d\u0443\u0436\u043d\u043e \u0432\u044b\u043f\u043e\u043b\u043d\u0438\u0442\u044c \u0440\u0430\u0437\u043d\u044b\u0435 \u043d\u0435\u0441\u043b\u043e\u0436\u043d\u044b\u0435 \u0437\u0430\u0434\u0430\u0447\u0438."),(0,o.kt)("h2",{id:"\u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430\u0446\u0438\u044f"},"\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430\u0446\u0438\u044f"),(0,o.kt)("p",null,"\u041e\u0444\u0438\u0446\u0438\u0430\u043b\u044c\u043d\u0430\u044f \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430\u0446\u0438\u044f Kotlin \u0440\u0430\u0441\u043f\u043e\u043b\u043e\u0436\u0435\u043d\u0430 \u043f\u043e \u0430\u0434\u0440\u0435\u0441\u0443 ",(0,o.kt)("a",{parentName:"p",href:"https://kotlinlang.org/docs/"},"kotlinlang.org/docs"),". \u041a \u043d\u0435\u0439 \u0441\u0442\u043e\u0438\u0442 \u043e\u0431\u0440\u0430\u0449\u0430\u0442\u044c\u0441\u044f \u0432\u043e \u0432\u0441\u0435\u0445 \u0441\u043b\u0443\u0447\u0430\u044f\u0445, \u043a\u043e\u0433\u0434\u0430 \u0447\u0442\u043e-\u0442\u043e \u043d\u0435 \u043f\u043e\u043d\u044f\u0442\u043d\u043e \u043f\u0440\u043e \u044f\u0437\u044b\u043a \u0440\u0430\u0437\u0440\u0430\u0431\u043e\u0442\u043a\u0438 \u0438 \u0435\u0433\u043e \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439."),(0,o.kt)("p",null,"\u0421\u0440\u0430\u0437\u0443 \u0437\u043d\u0430\u043a\u043e\u043c\u0438\u0442\u044c\u0441\u044f \u0441\u043e \u0432\u0441\u0435\u0439 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430\u0446\u0438\u0435\u0439 \u043d\u0435 \u0441\u0442\u043e\u0438\u0442 (\u0432\u0441\u0435 \u0440\u0430\u0432\u043d\u043e \u0437\u0430\u0431\u0443\u0434\u0435\u0442\u0441\u044f \u0431\u0435\u0437 \u043f\u0440\u0430\u043a\u0442\u0438\u043a\u0438), \u043d\u043e \u043d\u0443\u0436\u043d\u043e \u043f\u0440\u043e\u0447\u0438\u0442\u0430\u0442\u044c \u043d\u0435\u0441\u043a\u043e\u043b\u044c\u043a\u043e \u0431\u0430\u0437\u043e\u0432\u044b\u0445 \u0440\u0430\u0437\u0434\u0435\u043b\u043e\u0432:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://kotlinlang.org/docs/basic-syntax.html"},"Basic Syntax")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://kotlinlang.org/docs/idioms.html"},"Idioms"),' - \u043f\u0440\u0438\u043c\u0435\u0440\u044b \u0442\u043e\u0433\u043e, \u043a\u0430\u043a \u043f\u0440\u0438\u043d\u044f\u0442\u043e \u043f\u0438\u0441\u0430\u0442\u044c \u043a\u043e\u0434 \u0432 "Kotlin \u0441\u0442\u0438\u043b\u0435", \u043a\u0430\u043a \u0437\u0430\u0434\u0443\u043c\u0430\u043d\u043e \u0430\u0432\u0442\u043e\u0440\u0430\u043c\u0438 \u044f\u0437\u044b\u043a\u0430'),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://kotlinlang.org/docs/coding-conventions.html"},"Coding Conventions")," - \u043a\u0430\u043a \u043e\u0444\u043e\u0440\u043c\u043b\u044f\u0442\u044c \u043a\u043e\u0434, \u043d\u0430 \u043f\u0440\u0438\u043c\u0435\u0440\u0430\u0445")),(0,o.kt)("h2",{id:"\u0433\u0434\u0435-\u043c\u043e\u0436\u043d\u043e-\u043f\u043e\u043f\u0440\u0430\u043a\u0442\u0438\u043a\u043e\u0432\u0430\u0442\u044c\u0441\u044f"},"\u0413\u0434\u0435 \u043c\u043e\u0436\u043d\u043e \u043f\u043e\u043f\u0440\u0430\u043a\u0442\u0438\u043a\u043e\u0432\u0430\u0442\u044c\u0441\u044f"),(0,o.kt)("p",null,"\u0414\u043b\u044f \u043f\u0440\u0430\u043a\u0442\u0438\u043a\u0438 \u043d\u0430\u043f\u0438\u0441\u0430\u043d\u0438\u044f \u043a\u043e\u0434\u0430 \u043d\u0430 Kotlin \u043c\u043e\u0436\u043d\u043e \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c Android Studio \u0438\u043b\u0438 \u0441\u0430\u0439\u0442 ",(0,o.kt)("a",{parentName:"p",href:"http://play.kotlinlang.org/"},"play.kotlinlang.org"),". \u0421\u0430\u0439\u0442 \u0443\u0434\u043e\u0431\u0435\u043d \u0442\u0435\u043c, \u0447\u0442\u043e \u043f\u0438\u0441\u0430\u0442\u044c \u0438 \u0432\u044b\u043f\u043e\u043b\u043d\u044f\u0442\u044c Kotlin \u043a\u043e\u0434 \u043c\u043e\u0436\u043d\u043e \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435, \u0430 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u043e\u043c \u043f\u043e\u0434\u0435\u043b\u0438\u0442\u044c\u0441\u044f \u0432 \u0432\u0438\u0434\u0435 \u0441\u0441\u044b\u043b\u043a\u0438."),(0,o.kt)("h2",{id:"\u0432\u0441\u043f\u043e\u043c\u043d\u0438\u0442\u044c-\u0433\u043b\u0430\u0432\u043d\u043e\u0435"},"\u0412\u0441\u043f\u043e\u043c\u043d\u0438\u0442\u044c \u0433\u043b\u0430\u0432\u043d\u043e\u0435"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"\u041e\u0444\u0438\u0446\u0438\u0430\u043b\u044c\u043d\u0430\u044f \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430\u0446\u0438\u044f Kotlin - ",(0,o.kt)("a",{parentName:"li",href:"https://kotlinlang.org/docs"},"kotlinlang.org/docs")),(0,o.kt)("li",{parentName:"ul"},"\u041f\u0435\u0441\u043e\u0447\u043d\u0438\u0446\u0430 \u0434\u043b\u044f \u0432\u044b\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u044f Kotlin \u043a\u043e\u0434\u0430 - ",(0,o.kt)("a",{parentName:"li",href:"http://play.kotlinlang.org/"},"play.kotlinlang.org"))))}u.isMDXComponent=!0}}]);