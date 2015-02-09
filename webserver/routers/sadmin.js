/*!
 * 超管路由
 * @author ydr.me
 * @create 2014-11-23 12:00
 */

'use strict';

module.exports = function (app, ctrlAdmin) {
    // 中间件
    app.use(/^\/sadmin\/.*$/i, ctrlAdmin.middleware.login);


    // 设置
    app.get('/sadmin/setting/', ctrlAdmin.setting.get);


    // section
    app.get('/sadmin/section/', ctrlAdmin.section.get);


    // category
    app.get('/sadmin/category/', ctrlAdmin.category.get);


    // developer
    app.get('/sadmin/developer/list/', ctrlAdmin.developer.list);
    app.get('/sadmin/developer/', ctrlAdmin.developer.get);
};