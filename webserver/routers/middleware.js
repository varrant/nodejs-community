/*!
 * 路由中间件
 * @author ydr.me
 * @create 2014-11-23 13:16
 */

'use strict';

module.exports = function (app, ctrlMiddleware) {
    // 严格路由
    app.use(ctrlMiddleware.strictRouting);

    // POST|PUT|DELETE 安全性检测
    app.use(ctrlMiddleware.createCsrf);
    app.post('*', ctrlMiddleware.safeDetection);
    app.put('*', ctrlMiddleware.safeDetection);
    app.delete('*', ctrlMiddleware.safeDetection);

    // 读取用户
    app.use(ctrlMiddleware.readEngineer);
};
