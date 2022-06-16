"use strict";(self.webpackChunkkmm_icerock_dev=self.webpackChunkkmm_icerock_dev||[]).push([[8864],{3905:function(e,t,r){r.d(t,{Zo:function(){return k},kt:function(){return m}});var n=r(67294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var l=n.createContext({}),c=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},k=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},s=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,k=p(e,["components","mdxType","originalType","parentName"]),s=c(r),m=o,f=s["".concat(l,".").concat(m)]||s[m]||u[m]||a;return r?n.createElement(f,i(i({ref:t},k),{},{components:r})):n.createElement(f,i({ref:t},k))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=s;var p={};for(var l in t)hasOwnProperty.call(t,l)&&(p[l]=t[l]);p.originalType=e,p.mdxType="string"==typeof e?e:o,i[1]=p;for(var c=2;c<a;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}s.displayName="MDXCreateElement"},2950:function(e,t,r){r.r(t),r.d(t,{assets:function(){return k},contentTitle:function(){return l},default:function(){return m},frontMatter:function(){return p},metadata:function(){return c},toc:function(){return u}});var n=r(83117),o=r(80102),a=(r(67294),r(3905)),i=["components"],p={sidebar_position:22},l="Socket",c={unversionedId:"socket",id:"socket",title:"Socket",description:"\u041f\u0440\u043e \u0441\u043e\u043a\u0435\u0442 \u0432 \u0412\u0438\u043a\u0438\u043f\u0435\u0434\u0438\u0438).",source:"@site/learning/socket.md",sourceDirName:".",slug:"/socket",permalink:"/learning/socket",draft:!1,editUrl:"https://github.com/icerockdev/kmm.icerock.dev/tree/docusaurus/learning/socket.md",tags:[],version:"current",sidebarPosition:22,frontMatter:{sidebar_position:22},sidebar:"tutorialSidebar",previous:{title:"\u0415\u0434\u0438\u043d\u044b\u0439 \u0441\u0442\u0435\u0439\u0442 \u044d\u043a\u0440\u0430\u043d\u0430",permalink:"/learning/state"},next:{title:"\u0421\u0441\u044b\u043b\u043a\u0438",permalink:"/learning/links"}},k={},u=[{value:"WebSocket",id:"websocket",level:2},{value:"SocketIO",id:"socketio",level:2},{value:"LongPooling-\u0437\u0430\u043f\u0440\u043e\u0441\u044b",id:"longpooling-\u0437\u0430\u043f\u0440\u043e\u0441\u044b",level:2}],s={toc:u};function m(e){var t=e.components,r=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,n.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"socket"},"Socket"),(0,a.kt)("p",null,"\u041f\u0440\u043e \u0441\u043e\u043a\u0435\u0442 \u0432 ",(0,a.kt)("a",{parentName:"p",href:"https://ru.wikipedia.org/wiki/%D0%A1%D0%BE%D0%BA%D0%B5%D1%82_(%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%BD%D1%8B%D0%B9_%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D1%84%D0%B5%D0%B9%D1%81)"},"\u0412\u0438\u043a\u0438\u043f\u0435\u0434\u0438\u0438"),"."),(0,a.kt)("p",null,"\u041a\u0435\u0439\u0441\u044b, \u043a\u043e\u0433\u0434\u0430 \u043d\u0443\u0436\u043d\u044b \u0438\u043c\u0435\u043d\u043d\u043e \u0441\u043e\u043a\u0435\u0442\u044b, \u043a\u043e\u0433\u0434\u0430 \u0441\u0435\u0440\u0432\u0435\u0440 \u0434\u043e\u043b\u0436\u0435\u043d \u043c\u043e\u0447\u044c \u0432 \u043b\u044e\u0431\u043e\u0439 \u043c\u043e\u043c\u0435\u043d\u0442 \u0447\u0442\u043e-\u0442\u043e \u0441\u043e\u043e\u0431\u0449\u0438\u0442\u044c:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u0435 \u043f\u043e\u043b\u043e\u0436\u0435\u043d\u0438\u044f \u0442\u0430\u043a\u0441\u0438 \u043d\u0430 \u043a\u0430\u0440\u0442\u0435"),(0,a.kt)("li",{parentName:"ul"},"\u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u0435 \u0441\u0442\u0430\u0442\u0443\u0441\u0430 \u0432\u044b\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u044f \u0437\u0430\u043a\u0430\u0437\u0430"),(0,a.kt)("li",{parentName:"ul"},"\u0447\u0430\u0442\u044b"),(0,a.kt)("li",{parentName:"ul"},"\u0431\u0438\u0440\u0436\u0438"),(0,a.kt)("li",{parentName:"ul"},"\u0438 \u0442\u0434.")),(0,a.kt)("p",null,"Http \u0437\u0430\u043f\u0440\u043e\u0441\u044b \u0442\u0430\u043a\u0436\u0435 \u043f\u043e\u0441\u0442\u0440\u043e\u0435\u043d\u044b \u043d\u0430 \u0431\u0430\u0437\u0435 \u0441\u043e\u043a\u0435\u0442\u043d\u043e\u0433\u043e \u0441\u043e\u0435\u0434\u0438\u043d\u0435\u043d\u0438\u044f:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u043e\u0442\u043a\u0440\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u0441\u043e\u043a\u0435\u0442\u043d\u043e\u0435 \u0441\u043e\u0435\u0434\u0438\u043d\u0435\u043d\u0438\u0435"),(0,a.kt)("li",{parentName:"ul"},"\u043e\u0442\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0442\u0441\u044f \u043a\u0430\u043a\u0438\u0435-\u0442\u043e \u0434\u0430\u043d\u043d\u044b\u0435"),(0,a.kt)("li",{parentName:"ul"},"\u0432 \u043e\u0442\u0432\u0435\u0442 \u0442\u0430\u043a\u0436\u0435 \u0447\u0442\u043e-\u0442\u043e \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u044f\u0435\u0442\u0441\u044f"),(0,a.kt)("li",{parentName:"ul"},"\u0441\u043e\u0435\u0434\u0438\u043d\u0435\u043d\u0438\u0435 \u043f\u0440\u0435\u0440\u044b\u0432\u0430\u0435\u0442\u0441\u044f")),(0,a.kt)("p",null,"\u0415\u0441\u043b\u0438 \u0441\u043e\u043a\u0435\u0442 \u043e\u0442\u043a\u0440\u044b\u0442 \u0432\u0440\u0443\u0447\u043d\u0443\u044e - \u0442\u043e \u0442\u0430\u043a\u043e\u0435 \u0441\u043e\u0435\u0434\u0438\u043d\u0435\u043d\u0438\u0435 \u043c\u043e\u0436\u043d\u043e \u0434\u043e\u043b\u0433\u043e \u0434\u0435\u0440\u0436\u0430\u0442\u044c \u043e\u0442\u043a\u0440\u044b\u0442\u044b\u043c, \u043e\u043d\u043e \u043d\u0435 \u0437\u0430\u043a\u0440\u043e\u0435\u0442\u0441\u044f \u043f\u043e\u0441\u043b\u0435 \u043e\u0434\u043d\u043e\u0433\u043e \u0437\u0430\u043f\u0440\u043e\u0441\u0430.",(0,a.kt)("br",{parentName:"p"}),"\n","Push Notifications \u0442\u0430\u043a\u0436\u0435 \u0440\u0430\u0431\u043e\u0442\u0430\u044e\u0442 \u043d\u0430 \u0431\u0430\u0437\u0435 \u0441\u043e\u043a\u0435\u0442\u043d\u043e\u0433\u043e \u0441\u043e\u0435\u0434\u0438\u043d\u0435\u043d\u0438\u044f. \u041a\u0430\u043a \u0442\u043e\u043b\u044c\u043a\u043e \u0441\u0435\u0440\u0432\u0435\u0440 \u0443\u0437\u043d\u0430\u0435\u0442, \u0447\u0442\u043e \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u0435\u0439 \u043d\u0443\u0436\u043d\u043e \u043e \u0447\u0435\u043c-\u0442\u043e \u0443\u0432\u0435\u0434\u043e\u043c\u0438\u0442\u044c - \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u044f\u0435\u0442 \u0432 \u044d\u0442\u043e\u0442 \u0441\u043e\u043a\u0435\u0442 \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435 \u0441 \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u0435\u0439."),(0,a.kt)("p",null,"\u0422\u0430\u043a\u0436\u0435, \u0434\u043b\u044f \u0443\u0434\u043e\u0431\u043d\u043e\u0439 \u0440\u0430\u0431\u043e\u0442\u044b \u0441 \u0441\u043e\u043a\u0435\u0442\u0430\u043c\u0438 \u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u0430 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u0441\u0438\u0442\u0443\u0430\u0446\u0438\u0438 \u043f\u043e\u0442\u0435\u0440\u0438 \u0441\u0432\u044f\u0437\u0438 - \u0440\u0435\u043a\u043e\u043d\u043d\u0435\u043a\u0442."),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://android-tools.ru/coding/sokety-v-android/"},"\u041f\u0440\u0438\u043c\u0435\u0440")," \u0440\u0435\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u0438 \u0441\u043e\u043a\u0435\u0442\u0430 \u043d\u0430 Android."),(0,a.kt)("h2",{id:"websocket"},"WebSocket"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://ru.stackoverflow.com/questions/507746/%D0%92-%D1%87%D0%B5%D0%BC-%D1%80%D0%B0%D0%B7%D0%BD%D0%B8%D1%86%D0%B0-%D0%BC%D0%B5%D0%B6%D0%B4%D1%83-socket%D0%BE%D0%BC-%D0%B8-websocket%D0%BE%D0%BC"},"\u0412 \u0447\u0435\u043c \u0440\u0430\u0437\u043d\u0438\u0446\u0430")," \u043c\u0435\u0436\u0434\u0443 Socket \u0438 WebSocket.",(0,a.kt)("br",{parentName:"p"}),"\n","WebSocket ",(0,a.kt)("a",{parentName:"p",href:"https://www.youtube.com/watch?v=SxMvxIHBahU"},"\u043f\u0440\u043e\u0441\u0442\u044b\u043c\u0438 \u0441\u043b\u043e\u0432\u0430\u043c\u0438"),".",(0,a.kt)("br",{parentName:"p"}),"\n","Web Socket. \u0427\u0442\u043e \u044d\u0442\u043e \u0442\u0430\u043a\u043e\u0435? \u041a\u0430\u043a \u0441 \u044d\u0442\u0438\u043c \u0436\u0438\u0442\u044c? - ",(0,a.kt)("a",{parentName:"p",href:"https://www.youtube.com/watch?v=bTxax4k-b8o"},"\u0432\u0438\u0434\u0435\u043e")," \u043e\u0442 ",(0,a.kt)("a",{parentName:"p",href:"https://madbrains.ru/"},"Mad Brains"),".  "),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://www.youtube.com/watch?v=tF0-p4FDepk"},"\u0412\u0438\u0434\u0435\u043e")," \u043f\u0440\u043e \u0440\u0430\u0431\u043e\u0442\u0443 \u0441 \u0441\u0435\u0442\u044c\u044e \u0447\u0435\u0440\u0435\u0437 WebSocket + ",(0,a.kt)("a",{parentName:"p",href:"https://square.github.io/okhttp/"},"OkHttp"),".\n",(0,a.kt)("a",{parentName:"p",href:"https://apptractor.ru/info/articles/websockets-ios.html"},"\u0421\u0442\u0430\u0442\u044c\u044f")," \u043e \u0442\u043e\u043c, \u043a\u0430\u043a \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c WebSocket \u043d\u0430 iOS 13.\n",(0,a.kt)("a",{parentName:"p",href:"https://ssaurel.medium.com/learn-to-use-websockets-on-android-with-okhttp-ba5f00aea988"},"\u0421\u0442\u0430\u0442\u044c\u044f")," \u043f\u0440\u043e WebSocket \u043d\u0430 Android \u0441 OKHttp\n",(0,a.kt)("a",{parentName:"p",href:"https://ktor.io/docs/websocket-client.html"},"WebSocket")," \u0432 Ktor.",(0,a.kt)("br",{parentName:"p"}),"\n",(0,a.kt)("a",{parentName:"p",href:"https://ktor.io/docs/getting-started-ktor-client-chat.html"},"\u0413\u0430\u0439\u0434")," \u043e\u0442 Ktor, \u043a\u0430\u043a \u0441\u0434\u0435\u043b\u0430\u0442\u044c \u0447\u0430\u0442 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u044f WebSocket \u0438 KMM."),(0,a.kt)("h2",{id:"socketio"},"SocketIO"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://socket.io/"},"\u041e\u0444\u0438\u0446\u0438\u0430\u043b\u044c\u043d\u044b\u0439 \u0441\u0430\u0439\u0442")," \u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0438",(0,a.kt)("br",{parentName:"p"}),"\n",(0,a.kt)("a",{parentName:"p",href:"https://coderlessons.com/tutorials/kompiuternoe-programmirovanie/uznaite-socket-io/socket-io-kratkoe-rukovodstvo"},"\u0421\u0442\u0430\u0442\u044c\u044f"),(0,a.kt)("br",{parentName:"p"}),"\n",(0,a.kt)("a",{parentName:"p",href:"https://brander.ua/ru/technologies/socketio"},"\u0415\u0449\u0435 \u043e\u043f\u0438\u0441\u0430\u043d\u0438\u0435"),"  "),(0,a.kt)("p",null,"\u0415\u0441\u043b\u0438 \u043a\u0440\u0430\u0442\u043a\u043e, \u0442\u043e ",(0,a.kt)("inlineCode",{parentName:"p"},"SocketIO")," \u044d\u0442\u043e \u0442\u043e\u0442 \u0436\u0435 WebSocket, \u043d\u043e \u0441 \u0434\u0440\u0443\u0433\u0438\u043c \u043f\u0440\u043e\u0442\u043e\u043a\u043e\u043b\u043e\u043c \u043e\u0431\u043c\u0435\u043d\u0430 \u0434\u0430\u043d\u043d\u044b\u043c\u0438 \u0432\u043d\u0443\u0442\u0440\u0438. \u0422.\u0435. \u043d\u0435 \u0443\u0434\u0430\u0441\u0442\u0441\u044f \u043d\u0430 \u043e\u0434\u043d\u043e\u0439 \u0438\u0437 \u0441\u0442\u043e\u0440\u043e\u043d \u043a\u043b\u0438\u0435\u043d\u0442/\u0441\u0435\u0440\u0432\u0435\u0440 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c ",(0,a.kt)("inlineCode",{parentName:"p"},"SocketIO"),", \u0430 \u043d\u0430 \u0434\u0440\u0443\u0433\u043e\u0439 \u043f\u0440\u043e\u0441\u0442\u043e WebSocket.   "),(0,a.kt)("p",null,"\u041f\u0440\u043e\u0447\u0438\u0442\u0430\u0439\u0442\u0435 \u0441\u0442\u0430\u0442\u044c\u044e \u043f\u0440\u043e ",(0,a.kt)("a",{parentName:"p",href:"https://habr.com/ru/post/498996/"},"\u0440\u0430\u0437\u043d\u0438\u0446\u0443 \u043c\u0435\u0436\u0434\u0443 \u0432\u0435\u0431-\u0441\u043e\u043a\u0435\u0442\u0430\u043c\u0438 \u0438 Socket.IO")," \u0442\u0430\u043c \u0431\u0443\u0434\u0443\u0442 \u043f\u0440\u0438\u043c\u0435\u0440\u044b \u043d\u0430 JS, \u043d\u0435 \u043f\u0443\u0433\u0430\u0439\u0442\u0435\u0441\u044c :)  "),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://socket.io/blog/native-socket-io-and-android/"},"\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435")," SocketIO \u043d\u0430 Android."),(0,a.kt)("p",null,"\u0415\u0441\u043b\u0438 \u0432\u0430\u0448 \u0441\u0435\u0440\u0432\u0435\u0440 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u0442 SocketIO, \u0442\u043e \u0432\u044b \u0442\u0430\u043a\u0436\u0435 \u043c\u043e\u0436\u0435\u0442\u0435 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c \u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0443 ",(0,a.kt)("a",{parentName:"p",href:"../learning/libraries/moko/moko-socket-io"},"moko-so\u0441ket-io")," \u043d\u0430 \u0441\u0442\u043e\u0440\u043e\u043d\u0435 \u043a\u043b\u0438\u0435\u043d\u0442\u0430.  "),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://myrusakov.ru/long-polling-websockets-sse-and-comet.html"},"\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430")," \u043f\u0440\u043e \u0437\u0430\u043f\u0440\u043e\u0441\u044b, \u0441 \u043a\u0430\u0440\u0442\u0438\u043d\u043a\u0430\u043c\u0438."),(0,a.kt)("h2",{id:"longpooling-\u0437\u0430\u043f\u0440\u043e\u0441\u044b"},"LongPooling-\u0437\u0430\u043f\u0440\u043e\u0441\u044b"),(0,a.kt)("p",null,"\u0422\u0430\u043a\u0436\u0435, \u0441\u043b\u0435\u0434\u0443\u0435\u0442 \u0437\u043d\u0430\u0442\u044c \u043f\u0440\u043e \u0435\u0449\u0435 \u043e\u0434\u0438\u043d \u0442\u0438\u043f \u0437\u0430\u043f\u0440\u043e\u0441\u043e\u0432 - LongPooling-\u0437\u0430\u043f\u0440\u043e\u0441\u044b"),(0,a.kt)("p",null,'\u042d\u0442\u043e \u0431\u043e\u043b\u0435\u0435 \u043f\u0440\u043e\u0441\u0442\u0430\u044f \u0438 "\u043b\u0435\u043d\u0438\u0432\u0430\u044f" \u0437\u0430\u043c\u0435\u043d\u0430 \u0441\u043e\u043a\u0435\u0442\u0430\u043c. \u041a\u0430\u043a \u043f\u0440\u0430\u0432\u0438\u043b\u043e, \u043f\u043e\u0434\u0445\u043e\u0434\u0438\u0442 \u0432 \u0442\u043e\u043c \u0441\u043b\u0443\u0447\u0430\u0435, \u0435\u0441\u043b\u0438 \u043d\u0430\u043c \u043d\u0435 \u043d\u0443\u0436\u043d\u043e \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u044b\u0432\u0430\u0442\u044c \u0441\u0438\u0441\u0442\u0435\u043c\u0443 \u0440\u0435\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0432\u0440\u0435\u043c\u0435\u043d\u0438.\n\u041a\u0430\u043a \u044d\u0442\u043e \u0432\u044b\u0433\u043b\u044f\u0434\u0438\u0442:'),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u043a\u043b\u0438\u0435\u043d\u0442 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u044f\u0435\u0442 \u0437\u0430\u043f\u0440\u043e\u0441 \u043d\u0430 \u0441\u0435\u0440\u0432\u0435\u0440, \u0443 \u044d\u0442\u043e\u0433\u043e \u0437\u0430\u043f\u0440\u043e\u0441\u0430 \u043e\u0447\u0435\u043d\u044c \u0431\u043e\u043b\u044c\u0448\u043e\u0435 \u0432\u0440\u0435\u043c\u044f \u043e\u0436\u0438\u0434\u0430\u043d\u0438\u044f \u043e\u0442\u0432\u0435\u0442\u0430"),(0,a.kt)("li",{parentName:"ul"},"\u0441\u0435\u0440\u0432\u0435\u0440 \u043e\u0442\u0432\u0435\u0442\u0438\u0442 \u0442\u043e\u043b\u044c\u043a\u043e \u0442\u043e\u0433\u0434\u0430, \u043a\u043e\u0433\u0434\u0430 \u0443 \u043d\u0435\u0433\u043e \u043f\u043e\u044f\u0432\u0438\u0442\u0441\u044f \u0447\u0442\u043e-\u0442\u043e \u043d\u043e\u0432\u043e\u0435 \u043f\u043e \u0437\u0430\u043f\u0440\u043e\u0441\u0443 \u043a\u043b\u0438\u0435\u043d\u0442\u0430, \u0447\u0442\u043e-\u0442\u043e, \u0447\u0442\u043e \u043e\u043d \u0435\u0449\u0435 \u043d\u0435 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u044f\u043b"),(0,a.kt)("li",{parentName:"ul"},"\u0435\u0441\u043b\u0438 \u043d\u0438\u0447\u0435\u0433\u043e \u043d\u043e\u0432\u043e\u0433\u043e \u043d\u0435\u0442, \u0441\u0435\u0440\u0432\u0435\u0440 \u043f\u0440\u043e\u0441\u0442\u043e \u0436\u0434\u0435\u0442, \u043a\u043e\u0433\u0434\u0430 \u043f\u043e\u044f\u0432\u0438\u0442\u0441\u044f \u0447\u0442\u043e-\u0442\u043e \u043d\u043e\u0432\u043e\u0435"),(0,a.kt)("li",{parentName:"ul"},"\u0435\u0441\u043b\u0438 \u0432\u0440\u0435\u043c\u044f \u043e\u0436\u0438\u0434\u0430\u043d\u0438\u044f \u043e\u0442\u0432\u0435\u0442\u0430 \u0438\u0441\u0442\u0435\u043a\u043b\u043e, \u043a\u043b\u0438\u0435\u043d\u0442 \u0442\u0443\u0442 \u0436\u0435 \u043f\u043e\u0432\u0442\u043e\u0440\u0438\u0442 \u0437\u0430\u043f\u0440\u043e\u0441"),(0,a.kt)("li",{parentName:"ul"},"\u043a\u0430\u043a \u0442\u043e\u043b\u044c\u043a\u043e \u043a\u043b\u0438\u0435\u043d\u0442 \u043f\u043e\u043b\u0443\u0447\u0438\u0442 \u043e\u0442\u0432\u0435\u0442 \u043d\u0430 \u0437\u0430\u043f\u0440\u043e\u0441, \u043e\u043d \u0441\u0440\u0430\u0437\u0443 \u0436\u0435 \u0435\u0433\u043e \u043f\u0440\u043e\u0434\u0443\u0431\u043b\u0438\u0440\u0443\u0435\u0442")),(0,a.kt)("p",null,"\u0414\u043b\u044f \u0440\u0430\u0431\u043e\u0442\u044b \u0442\u0430\u043a\u0438\u0445 \u0437\u0430\u043f\u0440\u043e\u0441\u043e\u0432 \u044d\u0442\u0443 \u043c\u0435\u0445\u0430\u043d\u0438\u043a\u0443 \u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u043e \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u0442\u044c \u043d\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435. \u0412 \u0434\u043e\u0431\u0430\u0432\u043e\u043a, \u0434\u043b\u044f \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0438 \u0442\u0430\u043a\u043e\u0433\u043e \u0441\u043e\u0435\u0434\u0438\u043d\u0435\u043d\u0438\u044f \u0442\u0440\u0430\u0444\u0438\u043a\u0430 \u0442\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044f \u0431\u043e\u043b\u044c\u0448\u0435, \u0447\u0435\u043c \u0434\u043b\u044f \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0438 \u0441\u043e\u043a\u0435\u0442\u043d\u043e\u0433\u043e."))}m.isMDXComponent=!0}}]);