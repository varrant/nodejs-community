/*!
 * 超管路由
 * @author ydr.me
 * @create 2014-11-23 12:00
 */

'use strict';

module.exports = function (app, ctrl) {
    // 中间件
    app.use(/^\/sadmin\/.*$/i, ctrl.middleware.login);
    app.use(/^\/sadmin\/.*$/i, ctrl.middleware.sadmin);


    // 设置
    app.get('/sadmin/', ctrl.main.home);


    // 设置
    app.get('/sadmin/setting/', ctrl.setting.get);


    // section
    app.get('/sadmin/section/', ctrl.section.get);


    // category
    app.get('/sadmin/category/', ctrl.category.get);


    // developer
    app.get('/sadmin/developer/list/', ctrl.developer.list);
    app.get('/sadmin/developer/', ctrl.developer.get);
};