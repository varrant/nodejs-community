/*!
 * 错误路由
 * @author ydr.me
 * @create 2014-11-22 13:06
 */

'use strict';

module.exports = function (app, ctrl) {
    /**
     * client error
     */
    app.use(ctrl.clientError);

    /**
     * server error
     */
    app.use(ctrl.serverError);
};
