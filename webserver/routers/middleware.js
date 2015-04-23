/*!
 * 路由中间件
 * @author ydr.me
 * @create 2014-11-23 13:16
 */

'use strict';

module.exports = function (app, ctrl) {
    // 跨域支持
    app.use(ctrl.crossOrigin);


    // 严格路由
    app.use(ctrl.strictRouting);


    // 严格Host
    app.use(ctrl.strictHost);

    // 读取 URL
    app.use(ctrl.readURL);


    // POST|PUT|DELETE 安全性检测
    app.use(ctrl.createCsrf);
    app.post('*', ctrl.safeDetection);
    app.put('*', ctrl.safeDetection);
    app.delete('*', ctrl.safeDetection);


    // 读取用户
    app.use(ctrl.readDeveloper);

    // 读取版块
    app.use(ctrl.readSection);

    // 读取权限
    app.use(ctrl.readPermission);
};
