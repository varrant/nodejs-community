/*coolie@0.21.6*/
define("0",["3j","3k"],function(e,i,n){"use strict";e("3j");e("3k")});
define("3j",["4","7","m"],function(n){"use strict";var e=n("4"),o=n("7"),t=n("m"),r={};r.scrollTop=function(){var n=e.query("header")[0];t.on(n,"selectstart",function(n){n.preventDefault()});t.on(n,"dblclick",function(n){o.scrollTo(window,{y:0},{duration:234});n.preventDefault()})};r.scrollTop()});
define("3k",["b","c","1j","e","4","5"],function(n,a,v){"use strict";var e=n("b"),i=n("c"),c=n("1j"),t=n("e"),d=n("4"),o=n("5"),r={};r.nav=function(){var n="nav-"+(window["-nav-"]||"home"),a=d.query("#nav ."+n)[0];o.addClass(a,"active")};r.nav()});
define("b",["r","s","c","t","p","o"],function(e,n,o){"use strict";var r=e("r"),t="application/json; charset=utf-8",i=e("s"),c=e("c"),s=e("t"),a=e("p"),d=e("o"),u=d["extends"](a).create(function(e){var n=this,o=e.body&&e.body.constructor===FormData;e.headers=e.headers||{};o||(e.headers["content-type"]=e.headers["content-type"]||t);e.headers.accept=t;e.headers["x-request-csrf"]=window["-csrf-"];o||(e.body=JSON.stringify(e.body));if(e.loading!==!1&&null!==e.loading){n.loading&&n.loading.done();n.loading=new s(window,e.loading)}n.xhr=r.ajax(e).on("success",function(e){switch(e.code){case 400:break;case 401:return c(e).on("sure",i);case 406:return c(e).on("close",function(){location.replace("/")})}if(200===e.code)return n.emit("success",e.data);var o=new Error(e.message);o.code=e.code;n.emit("error",o)}).on("error",function(e){n.emit("error",e)}).on("progress",function(e){n.emit("progress",e)}).on("complete finish",function(e,o){if(!e&&200!==o.code){e=new Error(o.message);e.code=o.code}n.emit(this.alienEmitter.type,e,o&&o.data)}).on("complete",function(){if(n.loading){n.loading.done();n.loading=null}})});o.exports=function(e){return new u(e)}});
define("s",[],function(e,o,n){"use strict";n.exports=function(){var e=window.screen.width,o=window.screen.height,n=1080,i=600,t=(e-n)/2,r=(o-i)/3,h="/developer/oauth/authorize/";e>1080?window.open(h,"授权 github 登录","width="+n+",height="+i+",top="+r+",left="+t+",scrollbars=no,resizable=no,menubar=no"):window.location.href=h}});
coolie.chunk(["0","1","2"]);