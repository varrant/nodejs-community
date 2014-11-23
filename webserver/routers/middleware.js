/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-23 13:16
 */

'use strict';

module.exports = function (app, ctrlMiddleware) {
    /**
     * POST|PUT|DELETE 安全性检测
     */
    app.use(ctrlMiddleware.createCsrf);
    app.post('*', ctrlMiddleware.safeDetection);
    app.put('*', ctrlMiddleware.safeDetection);
    app.delete('*', ctrlMiddleware.safeDetection);
};
