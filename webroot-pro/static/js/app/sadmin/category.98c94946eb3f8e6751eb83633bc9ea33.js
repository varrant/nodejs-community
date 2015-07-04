/*coolie@0.21.6*/
define("0",["3j","3k","3l"],function(e,t,i){"use strict";e("3j");e("3k");var a=e("3l");new a("#category",{url:"/admin/api/category/",itemKey:"category",listKey:"categories",type:"分类"})});
define("3j",["4","7","m"],function(n){"use strict";var e=n("4"),o=n("7"),t=n("m"),r={};r.scrollTop=function(){var n=e.query("header")[0];t.on(n,"selectstart",function(n){n.preventDefault()});t.on(n,"dblclick",function(n){o.scrollTo(window,{y:0},{duration:234});n.preventDefault()})};r.scrollTop()});
define("3k",["b","c","1j","e","4","5"],function(n,a,v){"use strict";var e=n("b"),i=n("c"),c=n("1j"),t=n("e"),d=n("4"),o=n("5"),r={};r.nav=function(){var n="nav-"+(window["-nav-"]||"home"),a=d.query("#nav ."+n)[0];o.addClass(a,"active")};r.nav()});
define("b",["r","s","c","t","p","o"],function(e,n,o){"use strict";var r=e("r"),t="application/json; charset=utf-8",i=e("s"),c=e("c"),s=e("t"),a=e("p"),d=e("o"),u=d["extends"](a).create(function(e){var n=this,o=e.body&&e.body.constructor===FormData;e.headers=e.headers||{};o||(e.headers["content-type"]=e.headers["content-type"]||t);e.headers.accept=t;e.headers["x-request-csrf"]=window["-csrf-"];o||(e.body=JSON.stringify(e.body));if(e.loading!==!1&&null!==e.loading){n.loading&&n.loading.done();n.loading=new s(window,e.loading)}n.xhr=r.ajax(e).on("success",function(e){switch(e.code){case 400:break;case 401:return c(e).on("sure",i);case 406:return c(e).on("close",function(){location.replace("/")})}if(200===e.code)return n.emit("success",e.data);var o=new Error(e.message);o.code=e.code;n.emit("error",o)}).on("error",function(e){n.emit("error",e)}).on("progress",function(e){n.emit("progress",e)}).on("complete finish",function(e,o){if(!e&&200!==o.code){e=new Error(o.message);e.code=o.code}n.emit(this.alienEmitter.type,e,o&&o.data)}).on("complete",function(){if(n.loading){n.loading.done();n.loading=null}})});o.exports=function(e){return new u(e)}});
define("s",[],function(e,o,n){"use strict";n.exports=function(){var e=window.screen.width,o=window.screen.height,n=1080,i=600,t=(e-n)/2,r=(o-i)/3,h="/developer/oauth/authorize/";e>1080?window.open(h,"授权 github 登录","width="+n+",height="+i+",top="+r+",left="+t+",scrollbars=no,resizable=no,menubar=no"):window.location.href=h}});
define("3l",["v","b","c","d","4","1a","m","e","1b"],function(t,o,e){"use strict";var n=t("v"),i=t("b"),u=t("c"),a=t("d"),s=t("4"),r=t("1a"),c=t("m"),d=r.get("query","id"),l=t("e"),p=t("1b"),_={emptyData:{name:"",uri:"",cover:"",background:"",introduction:""},uploadOptions:{isClip:!0,minWidth:200,minHeight:200,ratio:1,ajax:{url:"http://up.qiniu.com/",method:"post",fileKey:"file"}},url:"",itemKey:"",listKey:"",type:""},v=n.create({constructor:function(t,o){var e=this;e._selector=t;e._options=l.extend(!0,{},_,o);e._init()},_init:function(){var t=this,o=t._options;t._initData();t._upload=new p(o.uploadOptions);t._upload.on("success",function(o){if(!o.key){u("上传失败");return!1}t.vue.$data[t._options.itemKey][t._imgKey]=t._url}).on("upload",function(){i({url:"/admin/api/qiniu/"}).on("success",function(o){t._url=o.url;t._upload.setOptions({ajax:{body:{key:o.key,token:o.token}}});t._upload.upload()}).on("error",function(){t.uploadDestroy();u("上传凭证获取失败")});return!1}).on("error",u)},_initData:function(){var t=this,o=t._options,e=o.itemKey,n=o.listKey;i({url:o.url}).on("success",function(i){var u={},a=l.extend({},o.emptyData);d&&l.each(i,function(t,o){if(o.id===d){l.extend(a,o);return!1}});u[n]=i;u[e]=a;t.vue=new Vue({el:t._selector,data:u,methods:{onupload:t._onupload.bind(t),onreset:t._onreset.bind(t),onsave:t._onsave.bind(t),onchoose:t._onchoose.bind(t),onremove:t._onremove.bind(t)}});t.vue.$el.classList.remove("none");t._translate()}).on("error",u)},_onupload:function(t,o){var e=this;e._upload.setOptions("isClip",t).open();e._imgKey=o||"cover"},_onreset:function(){var t=this,o=t._options,e=o.itemKey;t.vue.$data[e]=l.extend({},o.emptyData)},_onsave:function(){var t=this,o=t._options,e=this.vue,n=o.itemKey,a=o.listKey,s=e.$data[n],r=!!s.id;i({method:"put",url:o.url,body:e.$data[n]}).on("success",function(t){r||e.$data[a].push(t);e.$data[n]=t}).on("error",u)},_onchoose:function(t){var o=this.vue,e=this._options.itemKey,n=this._options.listKey;o.$data[e]=o.$data[n][t]},_onremove:function(t){var o=this,e=o._options,n=e.listKey,s=e.type,r=o.vue,c=r.$data[n][t],d=c.id;if(c.objectCount>0)return u("该"+s+"下还有"+c.objectCount+"个项目，无法删除");var l=function(){i({url:e.url,method:"delete",body:{id:d}}).on("success",function(){r.$data[n].splice(t,1)}).on("error",u)};a("确认要删除该"+s+"吗？").on("sure",l)},_translate:function(){var t=null,o=this._options.itemKey,e=this.vue,n=s.query("#translate")[0];c.on(n,"keyup",function(){t&&t.abort();t=i({url:"/api/translate/?word="+encodeURIComponent(this.value)}).on("success",function(t){e.$data[o].uri=t}).on("complete",function(){t=null})})}});v.defaults=_;e.exports=v});
coolie.chunk(["0","1","2"]);