/*!
 * 后端路由
 * @author ydr.me
 * @create 2014-11-23 12:00
 */

'use strict';


module.exports = function(app, ctrlAdmin){
    // 中间件
    app.use(/^\/admin\/.*$/i, ctrlAdmin.middleware.login);

    // 主页
    app.get('/admin/', ctrlAdmin.main.home);

    // 板块
    app.get('/admin/types/', ctrlAdmin.type.list);
};