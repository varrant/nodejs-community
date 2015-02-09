/*!
 * 测试路由
 * @author ydr.me
 * @create 2014-11-22 15:39
 */

'use strict';


module.exports = function(app, ctrl){
    app.get('/test1/', ctrl.test1);
    app.get('/test2/', ctrl.test2);
};
