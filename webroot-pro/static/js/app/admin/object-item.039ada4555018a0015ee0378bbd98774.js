/*coolie@0.21.6*/
define("0",["1z","4","5","m","1","2"],function(n,e,o){"use strict";var i=n("1z"),c=n("4"),t=n("5"),s=n("m"),d={};d.object=function(){var n=new i("#form","#content",{section:window["-section-"].id,id:window["-id-"]});n.on("success",d.response)};n("1");n("2");d.object()});
define("1z",["b","c","d","20","19","t","4","v","21","e","a","22","u","r"],function(e,t,n){"use strict";var o=e("b"),i=e("c"),a=e("d"),d=e("20"),r=e("19"),c=e("t"),s=e("4"),u=e("v"),l=e("21"),h=e("e"),b=e("a"),f=e("22"),_=e("u"),p=e("r"),m={url:"/admin/api/object/?",id:"",section:"",hiddenSelector:"#hidden"},v=u.create({constructor:function(e,t,n,o){var i=this;i._formSelector=e;i._contentSelector=t;i._methods=o;i._options=h.extend({},m,n);i._init()},_init:function(){var e=this;e._initData();return e},_initData:function(){var e=this,t=e._options;o({url:e._options.url+_.stringify({id:t.id,section:t.section})}).on("success",e._onsuccess.bind(e)).on("error",i)},_onsuccess:function(e){var t=this;t.emit("success",e);e.object=e.object||{content:"",uri:"",labels:[],section:t._options.section,isDisplay:!0};e.addHidden=e.object.hidden?!0:!1;e.categories.forEach(function(t){t.text=t.name;t.value=t.id;"default"!==t.uri||e.object.category||(e.object.category=t.id)});e.columns.forEach(function(e){e.text=e.name;e.value=e.id});e.columns.push({text:"=不分配专辑=",value:""});t.vue=new Vue({el:t._formSelector,data:t._data=e,methods:h.extend({pushlabel:t._onpushlabel.bind(t),removelabel:t._onremovelabel.bind(t),save:t._onsave.bind(t),oncreatecolumn:t._oncreatecolumn.bind(t),ontogglehidden:t._ontogglehidden.bind(t)},t._methods)});t.vue.$el.classList.remove("none");t._$objectColumn=s.query("#objectColumn")[0];t.editorUploadCallback=function(e,t,n){var a=this,d={};o({url:"/admin/api/qiniu/"}).on("success",function(o){d.url=o.url;var r=new FormData;r.append("key",o.key);r.append("token",o.token);r.append("file",e[0].file);p.ajax({url:"http://up.qiniu.com/",method:"post",body:r}).on("progress",function(e){t(e.alienDetail.percent)}).on("success",function(e){if(!e.key){a.uploadDestroy();return i("上传失败")}var t=new Image;t.src=d.url;t.onload=t.onerror=function(){n(null,[{name:"",url:d.url,width:this.width,height:this.height}])}}).on("error",function(){var e={message:"未知错误"};try{e=JSON.parse(this.xhr.responseText);e.message=e.error}catch(t){}a.uploadDestroy();i(e)})}).on("error",function(){a.uploadDestroy();i("上传凭证获取失败")})};t._editor1=new l(t._contentSelector,{id:e.object.id+"-object",previewClass:"typo",uploadCallback:t.editorUploadCallback,minHeight:200}).on("change",function(t){e.object.content=t});t._watchAddHidden();t._watchTranslate()},_onpushlabel:function(){var e=this.vue,t=e.$data.object,n=t.label.toLowerCase().trim();if(n&&-1===t.labels.indexOf(n)&&t.labels.length<5){t.labels.push(n);t.label=""}},_onremovelabel:function(e){this.vue.$data.object.labels.splice(e,1)},_onsave:function(e,t){var n=this,a=n.vue,d=s.closest(e.target,".btn")[0];d.disabled=!0;d.innerHTML="保存中……";o({url:n._options.url,method:t.id?"put":"post",body:t,loading:"保存中"}).on("success",function(e){if(!n._options.id){n._editor1.clearStore();n._options.id=e.id;n._editor1.setOptions("id",n._options.id);history.pushState("",null,location.pathname+"?id="+e.id)}a.$data.object=e;r.success("保存成功");n._editor1.setValue(e.content);n._editor2&&n._editor2.setValue(e.hidden)}).on("error",i).on("finish",function(){d.disabled=!1;d.innerHTML="保存"})},_oncreatecolumn:function(){var e=this;d("请输入专辑名称").on("sure",function(t){var n=this;t=t.trim();if(!t)return i("专辑名称不能为空");var a=new c(window,"正在翻译");e._translate(t,function(d,r){a.done();if(d)return i(d);o({url:"/admin/api/column/",method:"put",loading:"保存中",body:{name:t,uri:r,cover:window["-default.column-"],introduction:"专辑《"+t+"》创建于 "+f.format("YYYY年M月D日 HH:mm:ss")+"。"}}).on("success",function(t){e._data.columns.push({text:t.name,value:t.id});e._data.object.column=t.id;setTimeout(function(){e._$objectColumn.value=t.id;n.close()},100)}).on("error",i);return void 0})})},_ontogglehidden:function(){var e=this.vue.$data;e.addHidden=!e.addHidden},_watchAddHidden:function(){var e=this,t=e._data,n=function(n){if(n&&!e._editor2){var o=s.query(e._options.hiddenSelector)[0];o&&(e._editor2=new l(o,{id:t.object.id+"-hidden",uploadCallback:e.editorUploadCallback}).on("change",function(e){t.object.hidden=e}))}};t.addHidden&&n(!0);e.vue.$watch("addHidden",n)},_watchTranslate:function(){var e=null,t=this;t._data.object.id||t.vue.$watch("object.title",b.debounce(function(n){e&&e.abort();e=t._translate(n,function(e,n){e||(t._data.object.uri=n)})}))},_translate:function(e,t){var n=o({loading:!1,url:"/api/translate/?word="+encodeURIComponent(e)}).on("complete",function(e,o){t(e,o);n=null}).xhr;return n}});v.defaults=m;n.exports=v});
define("b",["r","s","c","t","p","o"],function(e,n,o){"use strict";var r=e("r"),t="application/json; charset=utf-8",i=e("s"),c=e("c"),s=e("t"),a=e("p"),d=e("o"),u=d["extends"](a).create(function(e){var n=this,o=e.body&&e.body.constructor===FormData;e.headers=e.headers||{};o||(e.headers["content-type"]=e.headers["content-type"]||t);e.headers.accept=t;e.headers["x-request-csrf"]=window["-csrf-"];o||(e.body=JSON.stringify(e.body));if(e.loading!==!1&&null!==e.loading){n.loading&&n.loading.done();n.loading=new s(window,e.loading)}n.xhr=r.ajax(e).on("success",function(e){switch(e.code){case 400:break;case 401:return c(e).on("sure",i);case 406:return c(e).on("close",function(){location.replace("/")})}if(200===e.code)return n.emit("success",e.data);var o=new Error(e.message);o.code=e.code;n.emit("error",o)}).on("error",function(e){n.emit("error",e)}).on("progress",function(e){n.emit("progress",e)}).on("complete finish",function(e,o){if(!e&&200!==o.code){e=new Error(o.message);e.code=o.code}n.emit(this.alienEmitter.type,e,o&&o.data)}).on("complete",function(){if(n.loading){n.loading.done();n.loading=null}})});o.exports=function(e){return new u(e)}});
define("s",[],function(e,o,n){"use strict";n.exports=function(){var e=window.screen.width,o=window.screen.height,n=1080,i=600,t=(e-n)/2,r=(o-i)/3,h="/developer/oauth/authorize/";e>1080?window.open(h,"授权 github 登录","width="+n+",height="+i+",top="+r+",left="+t+",scrollbars=no,resizable=no,menubar=no"):window.location.href=h}});
define("20",["23"],function(t,n,e){"use strict";var i=t("23");e.exports=function(t,n){return i(t,n||"",{input:{className:"ipt"}})}});
define("19",["w","6","1c"],function(t,n,e){"use strict";var i=t("w"),s=t("6"),u=t("1c");s.importStyle(u);var o=function(t,n){return new i({width:"auto",minWidth:100,isModal:!1,title:null,content:n,buttons:null,addClass:"alien-msg-"+t,timeout:3456})};n.success=function(t){o("success",t)};n.error=function(t){o("error",t)}});
define("1c",[],function(y,d,r){r.exports="@charset \"utf-8\";.alien-msg-success .alien-ui-msg{background:#09A51D}.alien-msg-error .alien-ui-msg{background:#A50909}.alien-msg-error .alien-ui-msg-body,.alien-msg-success .alien-ui-msg-body{color:#fff;text-align:center;font-weight:900;padding:10px 20px}"});
define("1",["4","5","6","7","8","9","a","b","c","d"],function(n,o,i){"use strict";var t=n("4"),e=n("5"),a=n("6"),c=n("7"),r=n("8"),u=n("9"),l=n("a"),s=n("b"),f=n("c"),d=n("d"),v={},p="active",g="unfolded",m=window,h=m["-developer-"],C=!!h.id;v.toggle=function(){var n=t.query("#header")[0],o=t.query("#nav")[0],i=t.query(".j-flag",n),a=i[0],c=i[1],r=i[2],l=i[3],s=m["-section-"]&&m["-section-"].uri||"home";s=s.replace(/\/.*$/,"");var f=t.query(".nav-item-"+s,r)[0];e.addClass(f,p);u.on(c,"click",function(){e.addClass(o,g);return!1});u.on(a,"click",function(){e.removeClass(o,g);return!1});if(C){u.on(l,"click",function(){e.hasClass(n,p)?e.removeClass(n,p):e.addClass(n,p);return!1});u.on(document,"click",function(){e.removeClass(n,p)})}};v.notification=function(){if(C){var n=t.query(".j-notification-wrap");n.length&&s({url:"/admin/api/notification/count/",loading:!1}).on("success",function(o){var i=o||0,t=i>9?"N":i;n.forEach(function(n){var o=a.create("span",{"class":"nav-notification-count j-notification-count transition","data-value":i});o.innerHTML=t;e.css(o,"display",i?"":"none");a.insert(o,n)})}).on("error",f)}};v.logout=function(){var n=function(){s({method:"post",url:"/api/developer/logout/",loading:"注销中"}).on("success",function(){var n=location.pathname;/^\/admin\//i.test(n)?location.replace("/"):location.replace(n)}).on("error",f)};u.on(document,"click",".j-logout",function(o){o.preventDefault();d("亲爱的<b>"+h.nickname+"</b>：<br>确定要登出吗？").on("sure",n)})};v.toggle();v.notification();v.logout()});
define("2",["4","5","6","7","m","a","15","18"],function(o,n,r){"use strict";var t=o("4"),i=o("5"),s=o("6"),c=o("7"),e=o("m"),l=o("a"),a=o("15"),u=o("18"),d=window,f={};f.scrollProgress=function(){var o=t.query("#scrollProgress")[0],n=new u(d);n.on("y",function(n){c.transition(o,{width:100*n.ratioY+"%"},{duration:100})})};f.gotop=function(){var o=t.query("#gotop")[0],n=!1,r={durtaion:567},s="active";e.on(d,"scroll",l.debounce(function(){var n=i.scrollTop(window);i[(n>20?"add":"remove")+"Class"](o,s)}));e.on(o,"click",function(){if(!n){n=!0;c.scrollTo(d,{y:0},r,function(){n=!1;i.removeClass(o,s);i.css(o,"bottom","")});c.transition(o,{bottom:"100%"},r)}})};f.scrollProgress();f.gotop()});
define("23",["4","v","w","f","e","k"],function(t,e,n){"use strict";var a=t("4"),i=t("v"),u=t("w"),p=t("f"),r=t("e"),s=t("k"),o="alien-widgets-prompt",c=0,l={title:"请输入",buttons:["确定","取消"],addClass:o,sureIndex:0,input:{tagName:"input",type:"text",className:"",placeholder:"请输入"}},d=i.create({constructor:function(t,e,n){var i=s.args(arguments);if(!p.string(i[1])){e="";n=i[1]}n=r.extend(!0,{},l,n);n.input.tagName=n.input.tagName.toLowerCase();n.input.type=n.input.type.toLowerCase();n.content="<div>"+t+"</div><"+n.input.tagName+' type="'+n.input.type+'" class="'+n.input.className+'" placeholder="'+n.input.placeholder+'" value="'+e+'"id="'+o+c+'">'+("textarea"===n.input.tagName?e+"</textarea>":"");var d=this;d._id=c++;d.prompt=new u(n).on("open",function(){d._$input=a.query("#"+o+d._id)[0];d._$input.select();d._$input.focus()}).on("close",function(t){d.emit(n.sureIndex===t?"sure":"cancel",d._$input.value);return t!==n.sureIndex})},close:function(){var t=this;t.prompt&&t.prompt.destroy()}});n.exports=function(t,e,n){return new d(t,e,n)}});
coolie.chunk(["0","1","2"]);