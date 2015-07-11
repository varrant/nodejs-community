/*coolie@0.21.9*/
define("0",["1v","1","2"],function(i,n,e){"use strict";var t=i("1v");i("1");i("2");new t("#list","#pagination",{query:{section:window["-section-"].id}})});
define("1v",["x","b","c","d","1c","e","j","v","1w","5"],function(e,t,i){"use strict";var n=e("x"),o=e("b"),s=e("c"),r=e("d"),u=e("1c"),a=e("e"),c=e("j"),l=e("v"),p=e("1w"),y=e("5"),g={listURL:"/admin/api/object/list/",itemURL:"/admin/api/object/",section:"",query:{page:1,limit:20,type:null,section:null,author:null},data:null,methods:null},d=n.create({constructor:function(e,t,i){var n=this;n._listSelector=e;n._paginationSelector=t;n._options=a.extend(!0,{},g,i);n.query={page:c.parseInt(u.get("query","page"),n._options.query.page),limit:c.parseInt(u.get("query","limit"),n._options.query.limit),type:u.get("query","type")||n._options.query.type,author:u.get("query","author")||"",section:n._options.query.section};n._init()},_init:function(){var e=this;e.getList();e._initEvent();return e},_initEvent:function(){var e=this;u.on("query","page",function(t,i){e.query.page=i.query.page||1;e.query.limit=i.query.limit||20;e.getList()})},getList:function(){var e=this,t=e._options;o({url:t.listURL+"?"+l.stringify(e.query)}).on("success",e._onsuccess.bind(e)).on("error",s)},_onsuccess:function(e){var t=this,i={},n={};e.categories&&e.categories.forEach(function(e){i[e.id]=e});e.columns&&e.columns.forEach(function(e){n[e.id]=e});if(t.vue){t.vue.$data.list=e.list;t._pagination.render({page:t.query.page,max:Math.ceil(e.count/t.query.limit)})}else{t.vue=new Vue({el:t._listSelector,data:a.extend({list:e.list,query:t.query,categoriesMap:i,columnsMap:n,sectionIDMap:e.sectionIDMap},t._options.data),methods:a.extend({onremove:t._onremove.bind(t)},t._options.methods)});t.vue.$el.classList.remove("none");t._pagination=new p(t._paginationSelector,{page:t.query.page,max:Math.ceil(e.count/t.query.limit)}).on("change",function(e){u.set("query",{page:e,limit:t.query.limit});y.scrollTop(window,0)})}},_onremove:function(e,t){var i=this,n=i._options,u=i.vue.$data.list,a=function(){o({loading:"删除中",url:n.itemURL,method:"delete",body:{id:e}}).on("success",function(){s("《"+u[t].title+"》已被删除");u.splice(t,1)}).on("error",s)};r("确认要删除《"+u[t].title+"》吗？<br>删除操作不可逆，请仔细确认！").on("sure",a)}});d.defaults=g;i.exports=d});
define("b",["r","s","c","t","p","o"],function(e,n,o){"use strict";var r=e("r"),t="application/json; charset=utf-8",i=e("s"),c=e("c"),s=e("t"),a=e("p"),d=e("o"),u=d["extends"](a).create(function(e){var n=this,o=e.body&&e.body.constructor===FormData;e.headers=e.headers||{};o||(e.headers["content-type"]=e.headers["content-type"]||t);e.headers.accept=t;e.headers["x-request-csrf"]=window["-csrf-"];o||(e.body=JSON.stringify(e.body));if(e.loading!==!1&&null!==e.loading){n.loading&&n.loading.done();n.loading=new s(window,e.loading)}n.xhr=r.ajax(e).on("success",function(e){switch(e.code){case 400:break;case 401:return c(e).on("sure",i);case 406:return c(e).on("close",function(){location.replace("/")})}if(200===e.code)return n.emit("success",e.data);var o=new Error(e.message);o.code=e.code;n.emit("error",o)}).on("error",function(e){n.emit("error",e)}).on("progress",function(e){n.emit("progress",e)}).on("complete finish",function(e,o){if(!e&&200!==o.code){e=new Error(o.message);e.code=o.code}n.emit(this.alienEmitter.type,e,o&&o.data)}).on("complete",function(){if(n.loading){n.loading.done();n.loading=null}})});o.exports=function(e){return new u(e)}});
define("s",[],function(e,o,n){"use strict";n.exports=function(){var e=window.screen.width,o=window.screen.height,n=1080,i=600,t=(e-n)/2,r=(o-i)/3,h="/developer/oauth/authorize/";e>1080?window.open(h,"授权 github 登录","width="+n+",height="+i+",top="+r+",left="+t+",scrollbars=no,resizable=no,menubar=no"):window.location.href=h}});
define("1",["4","5","6","7","8","9","a","b","c","d"],function(n,o,i){"use strict";var t=n("4"),e=n("5"),a=n("6"),c=n("7"),r=n("8"),u=n("9"),l=n("a"),s=n("b"),f=n("c"),d=n("d"),v={},p="active",g="unfolded",m=window,h=m["-developer-"],C=!!h.id;v.toggle=function(){var n=t.query("#header")[0],o=t.query("#nav")[0],i=t.query(".j-flag",n),a=i[0],c=i[1],r=i[2],l=i[3],s=m["-section-"]&&m["-section-"].uri||"home";s=s.replace(/\/.*$/,"");var f=t.query(".nav-item-"+s,r)[0];e.addClass(f,p);u.on(c,"click",function(){e.addClass(o,g);return!1});u.on(a,"click",function(){e.removeClass(o,g);return!1});if(C){u.on(l,"click",function(){e.hasClass(n,p)?e.removeClass(n,p):e.addClass(n,p);return!1});u.on(document,"click",function(){e.removeClass(n,p)})}};v.notification=function(){if(C){var n=t.query(".j-notification-wrap");n.length&&s({url:"/admin/api/notification/count/",loading:!1}).on("success",function(o){var i=o||0,t=i>9?"N":i;n.forEach(function(n){var o=a.create("span",{"class":"nav-notification-count j-notification-count transition","data-value":i});o.innerHTML=t;e.css(o,"display",i?"":"none");a.insert(o,n)})}).on("error",f)}};v.logout=function(){var n=function(){s({method:"post",url:"/api/developer/logout/",loading:"注销中"}).on("success",function(){var n=location.pathname;/^\/admin\//i.test(n)?location.replace("/"):location.replace(n)}).on("error",f)};u.on(document,"click",".j-logout",function(o){o.preventDefault();d("亲爱的<b>"+h.nickname+"</b>：<br>确定要登出吗？").on("sure",n)})};v.toggle();v.notification();v.logout()});
define("2",["4","5","6","7","m","a","17","1a"],function(o,n,r){"use strict";var t=o("4"),i=o("5"),s=o("6"),c=o("7"),e=o("m"),a=o("a"),l=o("17"),u=o("1a"),d=window,f={};f.scrollProgress=function(){var o=t.query("#scrollProgress")[0],n=new u(d);n.on("y",function(n){c.transition(o,{width:100*n.ratioY+"%"},{duration:100})})};f.gotop=function(){var o=t.query("#gotop")[0],n=!1,r={durtaion:567},s="active";e.on(d,"scroll",a.debounce(function(){var n=i.scrollTop(window);i[(n>20?"add":"remove")+"Class"](o,s)}));e.on(o,"click",function(){if(!n){n=!0;c.scrollTo(d,{y:0},r,function(){n=!1;i.removeClass(o,s);i.css(o,"bottom","")});c.transition(o,{bottom:"100%"},r)}})};f.scrollProgress();f.gotop()});
coolie.chunk(["2","1","0"]);