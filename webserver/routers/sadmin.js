/*!
 * 超管路由
 * @author ydr.me
 * @create 2014-11-23 12:00
 */

'use strict';

module.exports = function (app, ctrlSadmin) {
    // 中间件
    app.use(/^\/sadmin\/.*$/i, ctrlSadmin.middleware.login);


    // 设置
    app.get('/sadmin/setting/', ctrlSadmin.setting.get);


    // section
    app.get('/sadmin/section/', ctrlSadmin.section.get);


    // category
    app.get('/sadmin/category/', ctrlSadmin.category.get);


    // developer
    app.get('/sadmin/developer/list/', ctrlSadmin.developer.list);
    app.get('/sadmin/developer/', ctrlSadmin.developer.get);
};