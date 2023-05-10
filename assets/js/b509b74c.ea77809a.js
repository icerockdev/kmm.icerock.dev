"use strict";(self.webpackChunkkmm_icerock_dev=self.webpackChunkkmm_icerock_dev||[]).push([[670],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return h}});var r=n(67294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var o=r.createContext({}),u=function(e){var t=r.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):p(p({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(o.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,l=e.originalType,o=e.parentName,c=a(e,["components","mdxType","originalType","parentName"]),m=u(n),h=i,d=m["".concat(o,".").concat(h)]||m[h]||s[h]||l;return n?r.createElement(d,p(p({ref:t},c),{},{components:n})):r.createElement(d,p({ref:t},c))}));function h(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var l=n.length,p=new Array(l);p[0]=m;var a={};for(var o in t)hasOwnProperty.call(t,o)&&(a[o]=t[o]);a.originalType=e,a.mdxType="string"==typeof e?e:i,p[1]=a;for(var u=2;u<l;u++)p[u]=n[u];return r.createElement.apply(null,p)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},63754:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return o},default:function(){return h},frontMatter:function(){return a},metadata:function(){return u},toc:function(){return s}});var r=n(83117),i=n(80102),l=(n(67294),n(3905)),p=["components"],a={},o="Sign in with Apple",u={unversionedId:"ios/sign_in_with_apple",id:"ios/sign_in_with_apple",title:"Sign in with Apple",description:"\u0412 \u0434\u0430\u043d\u043d\u043e\u0439 \u0441\u0442\u0430\u0442\u044c\u0435 \u043d\u0435 \u0431\u0443\u0434\u0435\u0442 \u043f\u043e\u0434\u0440\u043e\u0431\u043d\u043e\u0433\u043e \u0433\u0430\u0439\u0434\u0430 \u043f\u043e \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0435 \u0438 \u0438\u043d\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0438 Sign in with Apple, \u0430 \u0431\u0443\u0434\u0443\u0442 \u0442\u043e\u043b\u044c\u043a\u043e \u043a\u043b\u044e\u0447\u0435\u0432\u044b\u0435 \u043c\u043e\u043c\u0435\u043d\u0442\u044b \u0438 \u0441\u0441\u044b\u043b\u043a\u0438 \u043d\u0430 \u043f\u043e\u043b\u0435\u0437\u043d\u044b\u0435 \u0441\u0442\u0430\u0442\u044c\u0438.",source:"@site/learning/ios/sign_in_with_apple.md",sourceDirName:"ios",slug:"/ios/sign_in_with_apple",permalink:"/learning/ios/sign_in_with_apple",draft:!1,editUrl:"https://github.com/icerockdev/kmm.icerock.dev/tree/docusaurus/learning/ios/sign_in_with_apple.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Proxyman - tutorial",permalink:"/learning/ios/proxyman-tutorial"},next:{title:"\u0421\u0442\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0435 \u0438 \u0434\u0438\u043d\u0430\u043c\u0438\u0447\u0435\u0441\u043a\u0438\u0435 \u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0438/\u0444\u0440\u0435\u0439\u043c\u0432\u043e\u0440\u043a\u0438 \u0432 iOS",permalink:"/learning/ios/static-dynamic-libs"}},c={},s=[{value:"\u0412 \u043a\u0430\u043a\u0438\u0445 \u0441\u043b\u0443\u0447\u0430\u044f\u0445 \u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u043e \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c",id:"\u0432-\u043a\u0430\u043a\u0438\u0445-\u0441\u043b\u0443\u0447\u0430\u044f\u0445-\u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u043e-\u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c",level:2},{value:"\u041f\u0440\u0438\u0432\u0430\u0442\u043d\u044b\u0435 \u0438\u043c\u0435\u0439\u043b \u0430\u0434\u0440\u0435\u0441\u0430",id:"\u043f\u0440\u0438\u0432\u0430\u0442\u043d\u044b\u0435-\u0438\u043c\u0435\u0439\u043b-\u0430\u0434\u0440\u0435\u0441\u0430",level:2},{value:"\u041f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u0435 \u0434\u0430\u043d\u043d\u044b\u0445 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f",id:"\u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u0435-\u0434\u0430\u043d\u043d\u044b\u0445-\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f",level:2},{value:"Logout",id:"logout",level:2},{value:"\u0414\u0438\u0437\u0430\u0439\u043d \u043a\u043d\u043e\u043f\u043a\u0438",id:"\u0434\u0438\u0437\u0430\u0439\u043d-\u043a\u043d\u043e\u043f\u043a\u0438",level:2},{value:"\u041d\u0430 \u0434\u0440\u0443\u0433\u0438\u0445 \u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0430\u0445",id:"\u043d\u0430-\u0434\u0440\u0443\u0433\u0438\u0445-\u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0430\u0445",level:2},{value:"Sign in with Apple \u0434\u043b\u044f Enterprise \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u043e\u0432",id:"sign-in-with-apple-\u0434\u043b\u044f-enterprise-\u0430\u043a\u043a\u0430\u0443\u043d\u0442\u043e\u0432",level:2},{value:"\u0418\u0441\u0442\u043e\u0447\u043d\u0438\u043a\u0438 \u0438 \u043f\u043e\u043b\u0435\u0437\u043d\u044b\u0435 \u0441\u0441\u044b\u043b\u043a\u0438",id:"\u0438\u0441\u0442\u043e\u0447\u043d\u0438\u043a\u0438-\u0438-\u043f\u043e\u043b\u0435\u0437\u043d\u044b\u0435-\u0441\u0441\u044b\u043b\u043a\u0438",level:2}],m={toc:s};function h(e){var t=e.components,n=(0,i.Z)(e,p);return(0,l.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"sign-in-with-apple"},"Sign in with Apple"),(0,l.kt)("p",null,"\u0412 \u0434\u0430\u043d\u043d\u043e\u0439 \u0441\u0442\u0430\u0442\u044c\u0435 \u043d\u0435 \u0431\u0443\u0434\u0435\u0442 \u043f\u043e\u0434\u0440\u043e\u0431\u043d\u043e\u0433\u043e \u0433\u0430\u0439\u0434\u0430 \u043f\u043e \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0435 \u0438 \u0438\u043d\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0438 Sign in with Apple, \u0430 \u0431\u0443\u0434\u0443\u0442 \u0442\u043e\u043b\u044c\u043a\u043e \u043a\u043b\u044e\u0447\u0435\u0432\u044b\u0435 \u043c\u043e\u043c\u0435\u043d\u0442\u044b \u0438 \u0441\u0441\u044b\u043b\u043a\u0438 \u043d\u0430 \u043f\u043e\u043b\u0435\u0437\u043d\u044b\u0435 \u0441\u0442\u0430\u0442\u044c\u0438.  "),(0,l.kt)("h2",{id:"\u0432-\u043a\u0430\u043a\u0438\u0445-\u0441\u043b\u0443\u0447\u0430\u044f\u0445-\u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u043e-\u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c"},"\u0412 \u043a\u0430\u043a\u0438\u0445 \u0441\u043b\u0443\u0447\u0430\u044f\u0445 \u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u043e \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c"),(0,l.kt)("p",null,"\u041f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f, \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u044e\u0449\u0438\u0435 \u0441\u0442\u043e\u0440\u043e\u043d\u043d\u0438\u0435 \u0441\u0435\u0440\u0432\u0438\u0441\u044b (\u043d\u0430\u043f\u0440\u0438\u043c\u0435\u0440 Facebook, Google \u0438\u043b\u0438 Twitter) \u0434\u043b\u044f \u0430\u0443\u0442\u0435\u043d\u0442\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u0438 \u043e\u0441\u043d\u043e\u0432\u043d\u043e\u0439 \u0443\u0447\u0435\u0442\u043d\u043e\u0439 \u0437\u0430\u043f\u0438\u0441\u0438 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f \u0432 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0438, \u0442\u0430\u043a\u0436\u0435 \u0434\u043e\u043b\u0436\u043d\u044b \u043f\u0440\u0435\u0434\u043b\u0430\u0433\u0430\u0442\u044c \u0432\u0445\u043e\u0434 \u0447\u0435\u0440\u0435\u0437 Apple \u0432 \u043a\u0430\u0447\u0435\u0441\u0442\u0432\u0435 \u0430\u043b\u044c\u0442\u0435\u0440\u043d\u0430\u0442\u0438\u0432\u043d\u043e\u0433\u043e \u0432\u0430\u0440\u0438\u0430\u043d\u0442\u0430."),(0,l.kt)("h2",{id:"\u043f\u0440\u0438\u0432\u0430\u0442\u043d\u044b\u0435-\u0438\u043c\u0435\u0439\u043b-\u0430\u0434\u0440\u0435\u0441\u0430"},"\u041f\u0440\u0438\u0432\u0430\u0442\u043d\u044b\u0435 \u0438\u043c\u0435\u0439\u043b \u0430\u0434\u0440\u0435\u0441\u0430"),(0,l.kt)("p",null,"\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c \u043c\u043e\u0436\u0435\u0442 \u0432\u044b\u0431\u0440\u0430\u0442\u044c \u043e\u043f\u0446\u0438\u044e ",(0,l.kt)("inlineCode",{parentName:"p"},"Hide my email"),". \u0412 \u044d\u0442\u043e\u043c \u0441\u043b\u0443\u0447\u0430\u0435 \u0432\u044b \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u0435 \u0435\u0433\u043e \u043f\u0440\u043e\u043a\u0441\u0438 \u0438\u043c\u0435\u0439\u043b, \u0441\u043e\u0437\u0434\u0430\u043d\u043d\u044b\u0439 \u044d\u043f\u043f\u043b\u043e\u043c \u0432\u0438\u0434\u0430 ",(0,l.kt)("a",{parentName:"p",href:"mailto:random_chars@privaterelay.appleid.com."},"random_chars@privaterelay.appleid.com.")," \u041d\u0430 \u043f\u043e\u0434\u043c\u0435\u043d\u0435\u043d\u043d\u044b\u0439 e-mail \u043c\u043e\u0436\u043d\u043e \u043d\u0430\u043f\u0438\u0441\u0430\u0442\u044c \u0442\u043e\u043b\u044c\u043a\u043e \u0441 \u0442\u0435\u0445 \u0434\u043e\u043c\u0435\u043d\u043e\u0432, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u0432\u044b \u0443\u043a\u0430\u0436\u0435\u0442\u0435 \u0432 \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0430\u0445 \u043d\u0430 developer.apple.com.\n\u041f\u0440\u0438\u043d\u0446\u0438\u043f \u0440\u0430\u0431\u043e\u0442\u044b ",(0,l.kt)("a",{parentName:"p",href:"https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_js/communicating_using_the_private_email_relay_service"},"Private Email Relay Service")," \u0438 ",(0,l.kt)("a",{parentName:"p",href:"https://help.apple.com/developer-account/?lang=en#/devf822fb8fc"},"\u0418\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0438\u044f \u043f\u043e \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0435")," \u043e\u043f\u0438\u0441\u0430\u043d\u044b \u0432 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430\u0446\u0438\u0438 \u043e\u0442 Apple."),(0,l.kt)("p",null,"\u0422\u0430\u043a\u0436\u0435 \u0441\u043b\u0435\u0434\u0443\u0435\u0442 \u043f\u0440\u0435\u0434\u0443\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u0432\u043e\u0437\u043c\u043e\u0436\u043d\u043e\u0441\u0442\u044c \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f \u043f\u0440\u0438\u0432\u044f\u0437\u0430\u0442\u044c \u0430\u043a\u043a\u0430\u0443\u043d\u0442 \u043a \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044e\u0449\u0435\u043c\u0443 \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0443. \u0422\u0430\u043a \u043a\u0430\u043a \u0438\u0437-\u0437\u0430 \u0441\u043a\u0440\u044b\u0442\u043e\u0433\u043e email \u0430\u0434\u0440\u0435\u0441\u0430 \u043d\u0435 \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u044c\u0441\u044f \u0432\u044b\u043f\u043e\u043b\u043d\u0438\u0442\u044c \u043f\u0440\u0438\u0432\u044f\u0437\u043a\u0443 \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438. "),(0,l.kt)("h2",{id:"\u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u0435-\u0434\u0430\u043d\u043d\u044b\u0445-\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f"},"\u041f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u0435 \u0434\u0430\u043d\u043d\u044b\u0445 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f"),(0,l.kt)("p",null,"Sign in with Apple \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u0442 \u0438\u043c\u044f \u0438 \u0444\u0430\u043c\u0438\u043b\u0438\u044e \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f \u0442\u043e\u043b\u044c\u043a\u043e \u043e\u0434\u0438\u043d \u0440\u0430\u0437 \u043f\u0440\u0438 \u0441\u0430\u043c\u043e\u043c \u043f\u0435\u0440\u0432\u043e\u043c \u043b\u043e\u0433\u0438\u043d\u0435. \u041f\u0440\u0438 \u043f\u043e\u043f\u044b\u0442\u043a\u0430\u0445 \u043f\u043e\u0432\u0442\u043e\u0440\u043d\u043e\u0439 \u0430\u0432\u0442\u043e\u0440\u0438\u0437\u0430\u0446\u0438\u0438 \u043c\u043e\u0436\u043d\u043e \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u0442\u043e\u043b\u044c\u043a\u043e ID (\u0443\u043d\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0439 \u0438\u0434\u0435\u043d\u0442\u0438\u0444\u0438\u043a\u0430\u0442\u043e\u0440 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f \u0432 Sign in with Apple). \u041f\u043b\u044e\u0441 \u044d\u0442\u0438 \u0434\u0430\u043d\u043d\u044b\u0435 \u043c\u043e\u0436\u043d\u043e \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u0442\u043e\u043b\u044c\u043a\u043e \u043d\u0430 \u043a\u043b\u0438\u0435\u043d\u0442\u0435, \u0443 \u0441\u0435\u0440\u0432\u0435\u0440\u0430 \u043d\u0435\u0442 \u0434\u043e\u0441\u0442\u0443\u043f\u0430 \u043a \u044d\u0442\u0438\u043c \u0434\u0430\u043d\u043d\u044b\u043c."),(0,l.kt)("h2",{id:"logout"},"Logout"),(0,l.kt)("p",null,"\u0423 Sign in with Apple \u043d\u0435\u0442\u0443 \u0444\u0443\u043d\u043a\u0446\u0438\u0438 logout \u0432 \u043a\u043b\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043a\u043e\u043c \u043f\u043e\u043d\u0438\u043c\u0430\u043d\u0438\u0438 \u044d\u0442\u043e\u0433\u043e \u0441\u043b\u043e\u0432\u0430. \u0411\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0430 \u043d\u0435 \u0445\u0440\u0430\u043d\u0438\u0442 \u043d\u0438\u043a\u0430\u043a\u0438\u0435 \u0434\u0430\u043d\u043d\u044b\u0435, \u0432 \u043e\u0442\u043b\u0438\u0447\u0438\u0435 \u043e\u0442 \u0434\u0440\u0443\u0433\u0438\u0445 \u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a \u0432\u0445\u043e\u0434\u0430, \u043f\u043e\u044d\u0442\u043e\u043c\u0443 \u043d\u0435\u0442 \u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u043e\u0441\u0442\u0438 \u0441\u0442\u0438\u0440\u0430\u0442\u044c \u0434\u0430\u043d\u043d\u044b\u0435, \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u043d\u044b\u0435 \u043f\u0440\u0438 \u043b\u043e\u0433\u0438\u043d\u0435.\n\u041e\u0434\u043d\u0430\u043a\u043e, \u0435\u0441\u043b\u0438 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c \u0440\u0430\u0437\u043e\u0440\u0432\u0430\u043b \u0430\u0441\u0441\u043e\u0446\u0438\u0430\u0446\u0438\u044e Apple ID \u0441 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435\u043c \u0432 Settings (Settings/ Apple ID / Password & Security / Apple ID logins / Edit) \u0432\u044b \u0434\u043e\u043b\u0436\u043d\u044b \u0432\u044b\u043f\u043e\u043b\u043d\u0438\u0442\u044c logout \u0432 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0438 / \u043d\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435. Apple \u0440\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0443\u0435\u0442 \u043f\u0440\u043e\u0432\u0435\u0440\u044f\u0442\u044c \u044d\u0442\u043e \u043d\u0430 \u0441\u0442\u0430\u0440\u0442\u0435 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f \u0441 \u043f\u043e\u043c\u043e\u0449\u044c\u044e ",(0,l.kt)("inlineCode",{parentName:"p"},"ASAuthorizationAppleIDProvider().getCredentialState"),"."),(0,l.kt)("h2",{id:"\u0434\u0438\u0437\u0430\u0439\u043d-\u043a\u043d\u043e\u043f\u043a\u0438"},"\u0414\u0438\u0437\u0430\u0439\u043d \u043a\u043d\u043e\u043f\u043a\u0438"),(0,l.kt)("p",null,"\u041a \u0434\u0438\u0437\u0430\u0439\u043d\u0443 \u043a\u043d\u043e\u043f\u043a\u0438 \u0435\u0441\u0442\u044c \u0446\u0435\u043b\u0430\u044f \u043f\u0430\u0447\u043a\u0430 \u0442\u0440\u0435\u0431\u043e\u0432\u0430\u043d\u0438\u0439, \u0432\u0441\u0435 \u043e\u043d\u0438 \u043e\u043f\u0438\u0441\u0430\u043d\u044b \u0432 ",(0,l.kt)("a",{parentName:"p",href:"https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple/overview/buttons/"},"Human Interface Guidelines"),"."),(0,l.kt)("p",null,"\u041a\u0440\u0430\u0442\u043a\u043e\u0435 \u0438\u0437\u043b\u043e\u0436\u0435\u043d\u0438\u0435:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u041d\u0435\u043b\u044c\u0437\u044f \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c \u043b\u043e\u0433\u043e, \u043e\u0442\u043b\u0438\u0447\u043d\u043e\u0435 \u043e\u0442 \u0442\u043e\u0433\u043e, \u0447\u0442\u043e \u043f\u0440\u0435\u0434\u043e\u0441\u0442\u0430\u0432\u043b\u044f\u0435\u0442 Apple "),(0,l.kt)("li",{parentName:"ul"},"\u0412\u044b\u0441\u043e\u0442\u0430 \u043b\u043e\u0433\u043e \u0434\u043e\u043b\u0436\u043d\u0430 \u0441\u043e\u043e\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u043e\u0432\u0430\u0442\u044c \u0432\u044b\u0441\u043e\u0442\u0435 \u043a\u043d\u043e\u043f\u043a\u0438"),(0,l.kt)("li",{parentName:"ul"},"\u041d\u0435\u043b\u044c\u0437\u044f \u043e\u0431\u0440\u0435\u0437\u0430\u0442\u044c \u043b\u043e\u0433\u043e"),(0,l.kt)("li",{parentName:"ul"},"\u041d\u0435\u043b\u044c\u0437\u044f \u0434\u043e\u0431\u0430\u0432\u043b\u044f\u0442\u044c \u0432\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0439 \u043e\u0442\u0441\u0442\u0443\u043f"),(0,l.kt)("li",{parentName:"ul"},"\u041d\u0435\u043b\u044c\u0437\u044f \u043a\u0430\u0441\u0442\u043e\u043c\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0446\u0432\u0435\u0442\u0430 \u043b\u043e\u0433\u043e"),(0,l.kt)("li",{parentName:"ul"},"\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c \u0442\u043e\u043b\u044c\u043a\u043e \u0448\u0440\u0438\u0444\u0442 \u0441\u0438\u0441\u0442\u0435\u043c\u044b"),(0,l.kt)("li",{parentName:"ul"},"\u0420\u0430\u0437\u043c\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u0430 \u0434\u043e\u043b\u0436\u0435\u043d \u0441\u043e\u0441\u0442\u0430\u0432\u043b\u044f\u0442\u044c 43% \u043e\u0442 \u0432\u044b\u0441\u043e\u0442\u044b \u043a\u043d\u043e\u043f\u043a\u0438")),(0,l.kt)("h2",{id:"\u043d\u0430-\u0434\u0440\u0443\u0433\u0438\u0445-\u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0430\u0445"},"\u041d\u0430 \u0434\u0440\u0443\u0433\u0438\u0445 \u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0430\u0445"),(0,l.kt)("p",null,"Sign in with Apple \u043c\u043e\u0436\u043d\u043e \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c \u043d\u0435 \u0442\u043e\u043b\u044c\u043a\u043e \u0432 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f\u0445 \u0434\u043b\u044f \u043e\u043f\u0435\u0440\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u0445 \u0441\u0438\u0441\u0442\u0435\u043c \u043e\u0442 Apple, \u043d\u043e \u0442\u0430\u043a\u0436\u0435 \u0432 Android \u0438 web \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f\u0445. \u0414\u043b\u044f \u044d\u0442\u043e\u0433\u043e \u043d\u0443\u0436\u043d\u043e \u043e\u0442\u043a\u0440\u044b\u0442\u044c \u0441\u043f\u0435\u0446\u0438\u0430\u043b\u044c\u043d\u0443\u044e \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0443 \u0430\u0432\u0442\u043e\u0440\u0438\u0437\u0430\u0446\u0438\u0438 \u043e\u0442 Apple. "),(0,l.kt)("h2",{id:"sign-in-with-apple-\u0434\u043b\u044f-enterprise-\u0430\u043a\u043a\u0430\u0443\u043d\u0442\u043e\u0432"},"Sign in with Apple \u0434\u043b\u044f Enterprise \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u043e\u0432"),(0,l.kt)("p",null,"\u0412 \u0440\u0430\u0437\u0434\u0435\u043b\u0435 ",(0,l.kt)("a",{parentName:"p",href:"https://help.apple.com/developer-account/#/dev21218dfd6"},"Supported capabilities (iOS)")," \u043f\u043e\u043c\u043e\u0449\u0438 \u043f\u043e \u0443\u0447\u0435\u0442\u043d\u043e\u0439 \u0437\u0430\u043f\u0438\u0441\u0438 \u0440\u0430\u0437\u0440\u0430\u0431\u043e\u0442\u0447\u0438\u043a\u0430 \u0443\u043a\u0430\u0437\u0430\u043d\u043e, \u0447\u0442\u043e Sign in with Apple \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d \u043f\u0440\u0438 \u0443\u0447\u0430\u0441\u0442\u0438\u0438 \u0432 \u043a\u043e\u0440\u043f\u043e\u0440\u0430\u0442\u0438\u0432\u043d\u043e\u0439(Enterprise) \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0435 Apple Developer."),(0,l.kt)("h2",{id:"\u0438\u0441\u0442\u043e\u0447\u043d\u0438\u043a\u0438-\u0438-\u043f\u043e\u043b\u0435\u0437\u043d\u044b\u0435-\u0441\u0441\u044b\u043b\u043a\u0438"},"\u0418\u0441\u0442\u043e\u0447\u043d\u0438\u043a\u0438 \u0438 \u043f\u043e\u043b\u0435\u0437\u043d\u044b\u0435 \u0441\u0441\u044b\u043b\u043a\u0438"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://developer.apple.com/sign-in-with-apple/get-started/"},"\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430\u0446\u0438\u044f \u043e\u0442 Apple c \u0441\u0441\u044b\u043b\u043a\u0430\u043c\u0438 \u043d\u0430 \u0432\u0441\u0435 \u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u044b \u0433\u0430\u0439\u0434\u043b\u0430\u0439\u043d\u044b \u0438 \u0438\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0438\u0438")," "),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://habr.com/ru/company/cian/blog/475062/"},"\u0413\u0430\u0439\u0434 \u043f\u043e \u0438\u043d\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0438 Sign in with apple, \u0432 \u0442\u043e\u043c \u0447\u0438\u0441\u043b\u0435 \u0438 \u0434\u043b\u044f web \u0438 Android, \u043e\u0442 \u0426\u0438\u0430\u043d")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://habr.com/ru/company/sports_ru/blog/467231/"},"\u0420\u0435\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044f \u0441\u0435\u0440\u0432\u0438\u0441\u0430 \u0430\u0432\u0442\u043e\u0440\u0438\u0437\u0430\u0446\u0438\u0438 \u0447\u0435\u0440\u0435\u0437 Apple \u043e\u0442 sports.ru")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://habr.com/ru/company/sports_ru/blog/470175/"},"\u0418\u043d\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u044f Sign in with Apple \u043d\u0430 backend \u043e\u0442 sports.ru")),(0,l.kt)("li",{parentName:"ul"},"\u0418\u043d\u0442\u0435\u0440\u0435\u0441\u043d\u044b\u0435 \u043c\u043e\u043c\u0435\u043d\u0442\u044b \u043f\u0440\u043e Sign in with Apple \u043e\u0442 Alconost \u0432 \u0434\u0432\u0443\u0445 \u0447\u0430\u0441\u0442\u044f\u0445. ",(0,l.kt)("a",{parentName:"li",href:"https://habr.com/ru/company/alconost/news/t/494404/"},"\u041f\u0435\u0440\u0432\u0430\u044f")," \u0438 ",(0,l.kt)("a",{parentName:"li",href:"https://habr.com/ru/company/alconost/blog/506944/"},"\u0432\u0442\u043e\u0440\u0430\u044f")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://habr.com/ru/company/parallels/blog/469499/"},"\u041f\u0440\u043e\u0431\u043b\u0435\u043c\u044b, \u0441 \u043a\u043e\u0442\u043e\u0440\u044b\u043c\u0438 \u0441\u0442\u043e\u043b\u043a\u043d\u0443\u043b\u0438\u0441\u044c \u0432 Parallels \u043f\u0440\u0438 \u0438\u043d\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0438")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://habr.com/ru/news/t/509012/"},"\u041f\u043e\u0447\u0435\u043c\u0443 AnyList \u043e\u0442\u043a\u0430\u0437\u0430\u043b\u0438\u0441\u044c \u043e\u0442 \u0430\u0432\u0442\u043e\u0440\u0438\u0437\u0430\u0446\u0438\u0438 \u0447\u0435\u0440\u0435\u0437 Apple \u0441 \u0444\u0435\u0439\u043a\u043e\u0432\u044b\u043c email"))),(0,l.kt)("div",{style:{textAlign:"right"}},"\u0410\u0432\u0442\u043e\u0440: ",(0,l.kt)("a",{href:"https://github.com/Dorofeev"},"@Dorofeev")))}h.isMDXComponent=!0}}]);