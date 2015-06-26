/*coolie@0.21.6*/
define("0",["2r","1","2","2s","z","1v","4","7","5","e","15","9","b"],function(n,a,t){"use strict";n("2r");n("1");n("2");n("2s");var e=n("z"),i=n("1v"),o=n("4"),r=n("7"),u=n("5"),p=n("e"),c=n("15"),s=n("9"),g=n("b"),l=window["-pager-"],h={},f=window["-section-"],d=o.query("#body")[0],b=o.query("#template")[0].innerHTML,w=new e(b);h.getPath=function(){var n=location.pathname,a=function(a){var t=new RegExp("\\/"+a+"\\/([^/]+)\\/","i"),e=n.match(t);return e?e[1]:null};h.options={"in":a("in"),at:a("at"),on:a("on"),as:a("as"),by:a("by"),page:a("page")||1}};h.buildPath=function(){var n=["in","at","on","as","by","page"],a=[];f&&f.uri&&a.push(f.uri);n.forEach(function(n){h.options[n]&&a.push(n+"/"+h.options[n])});return"/"+a.join("/")+"/"};h.buildPager=function(){if(l.max){var n=o.query("#pager")[0];if(!n)return;h.page=new i("#pager",l);h.page.on("change",function(n){h.options.page=n;var a=h.buildPath();history.pushState({url:a},"",a);h.pjax(a)})}};h.pjax=function(n){g({url:n}).on("success",function(n){d.innerHTML=w.render(n);p.extend(l,n.pager);l.max=Math.ceil(l.count/l.limit);h.options.page=n.pager.page;h.page.render({page:l.page,max:Math.ceil(l.count/l.limit)});h.getPath();r.scrollTo(window,{y:u.top(d)-60})})};h.buildPjax=function(){s.on(d,"click",".choose a",function(){var n=this.href;history.pushState({url:n},"",n);h.pjax(n);return!1});s.on(window,"popstate",function(){var n=history.state;n&&n.url&&h.pjax(n.url)})};h.getPath();h.buildPager();h.buildPjax()});
define("2r",["m","6","1f","s"],function(e,t,n){"use strict";var i=e("m"),o=e("6"),c=e("1f"),r=e("s"),u={};u.initDom=function(){var e=o.create("div");o.insert(e,document.body,"beforeend");this.dialog=new c(e,{title:"登录",remote:"/developer/oauth/authorize/"})};u.initEvent=function(){i.on(document.body,"click",".j-login",function(e){e.preventDefault();r()})};u.initEvent()});
define("s",[],function(e,o,n){"use strict";n.exports=function(){var e=window.screen.width,o=window.screen.height,n=1080,i=600,t=(e-n)/2,r=(o-i)/3,h="/developer/oauth/authorize/";e>1080?window.open(h,"授权 github 登录","width="+n+",height="+i+",top="+r+",left="+t+",scrollbars=no,resizable=no,menubar=no"):window.location.href=h}});
define("1",["4","5","6","7","8","9","a","b","c","d"],function(n,o,i){"use strict";var t=n("4"),e=n("5"),a=n("6"),c=n("7"),r=n("8"),u=n("9"),l=n("a"),s=n("b"),f=n("c"),d=n("d"),v={},p="active",g="unfolded",m=window,h=m["-developer-"],C=!!h.id;v.toggle=function(){var n=t.query("#header")[0],o=t.query("#nav")[0],i=t.query(".j-flag",n),a=i[0],c=i[1],r=i[2],l=i[3],s=m["-section-"]&&m["-section-"].uri||"home";s=s.replace(/\/.*$/,"");var f=t.query(".nav-item-"+s,r)[0];e.addClass(f,p);u.on(c,"click",function(){e.addClass(o,g);return!1});u.on(a,"click",function(){e.removeClass(o,g);return!1});if(C){u.on(l,"click",function(){e.hasClass(n,p)?e.removeClass(n,p):e.addClass(n,p);return!1});u.on(document,"click",function(){e.removeClass(n,p)})}};v.notification=function(){if(C){var n=t.query(".j-notification-wrap");n.length&&s({url:"/admin/api/notification/count/",loading:!1}).on("success",function(o){var i=o||0,t=i>9?"N":i;n.forEach(function(n){var o=a.create("span",{"class":"nav-notification-count j-notification-count transition","data-value":i});o.innerHTML=t;e.css(o,"display",i?"":"none");a.insert(o,n)})}).on("error",f)}};v.logout=function(){var n=function(){s({method:"post",url:"/api/developer/logout/",loading:"注销中"}).on("success",function(){var n=location.pathname;/^\/admin\//i.test(n)?location.replace("/"):location.replace(n)}).on("error",f)};u.on(document,"click",".j-logout",function(o){o.preventDefault();d("亲爱的<b>"+h.nickname+"</b>：<br>确定要登出吗？").on("sure",n)})};v.toggle();v.notification();v.logout()});
define("b",["r","s","c","t","p","o"],function(e,n,o){"use strict";var r=e("r"),t="application/json; charset=utf-8",i=e("s"),c=e("c"),s=e("t"),a=e("p"),d=e("o"),u=d["extends"](a).create(function(e){var n=this,o=e.body&&e.body.constructor===FormData;e.headers=e.headers||{};o||(e.headers["content-type"]=e.headers["content-type"]||t);e.headers.accept=t;e.headers["x-request-csrf"]=window["-csrf-"];o||(e.body=JSON.stringify(e.body));if(e.loading!==!1&&null!==e.loading){n.loading&&n.loading.done();n.loading=new s(window,e.loading)}n.xhr=r.ajax(e).on("success",function(e){switch(e.code){case 400:break;case 401:return c(e).on("sure",i);case 406:return c(e).on("close",function(){location.replace("/")})}if(200===e.code)return n.emit("success",e.data);var o=new Error(e.message);o.code=e.code;n.emit("error",o)}).on("error",function(e){n.emit("error",e)}).on("progress",function(e){n.emit("progress",e)}).on("complete finish",function(e,o){if(!e&&200!==o.code){e=new Error(o.message);e.code=o.code}n.emit(this.alienEmitter.type,e,o&&o.data)}).on("complete",function(){if(n.loading){n.loading.done();n.loading=null}})});o.exports=function(e){return new u(e)}});
define("2",["4","5","6","7","m","a","15","18"],function(o,n,r){"use strict";var t=o("4"),i=o("5"),s=o("6"),c=o("7"),e=o("m"),l=o("a"),a=o("15"),u=o("18"),d=window,f={};f.scrollProgress=function(){var o=t.query("#scrollProgress")[0],n=new u(d);n.on("y",function(n){c.transition(o,{width:100*n.ratioY+"%"},{duration:100})})};f.gotop=function(){var o=t.query("#gotop")[0],n=!1,r={durtaion:567},s="active";e.on(d,"scroll",l.debounce(function(){var n=i.scrollTop(window);i[(n>20?"add":"remove")+"Class"](o,s)}));e.on(o,"click",function(){if(!n){n=!0;c.scrollTo(d,{y:0},r,function(){n=!1;i.removeClass(o,s);i.css(o,"bottom","")});c.transition(o,{bottom:"100%"},r)}})};f.scrollProgress();f.gotop()});
define("2s",["4","5","m","e"],function(e,n,t){"use strict";var i=window,o=e("4"),c=e("5"),h=e("m"),s=e("e"),r=function(e){var n=i.screen.width,t=i.screen.height,o=650,c=400,h=(n-o)/2,s=(t-c)/3;n>1080?i.open(e,"","width="+o+",height="+c+",top="+s+",left="+h+",scrollbars=no,resizable=no,menubar=no"):i.location.href=e},a=encodeURIComponent,u=i.shareData||{},p=a(u.title||"写的不错，分享一下啦。《"+document.title+"》"),l=a(u.desc||c.attr(o.query('meta[name="description"]')[0],"content")),m=a(u.link||location.href),d=o.query("img:not(.favicon)"),f="";s.each(d,function(e,n){if(n.width>99&&n.height>99){f=a(n.src);return!1}});h.on(document,"click",".share-weibo",function(){var e="http://v.t.sina.com.cn/share/share.php?",n=[];n.push("url="+m);n.push("title="+p);n.push("appkey="+a("3801039502"));f&&n.push("pic="+f);r(e+n.join("&"))});h.on(document,"click",".share-qq",function(){var e="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?",n=[];n.push("url="+m);n.push("desc="+l);n.push("summary="+l);f&&n.push("imageUrl="+f);r(e+n.join("&"))});h.on(document,"click",".share-baidu",function(){var e="http://tieba.baidu.com/f/commit/share/openShareApi?",n=[];n.push("url="+m);n.push("title="+l);n.push("desc="+l);f&&n.push("pic="+f);r(e+n.join("&"))})});
coolie.chunk(["0","1","2"]);