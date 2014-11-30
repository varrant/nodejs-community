/*!
 * 错误路由
 * @author ydr.me
 * @create 2014-11-22 13:06
 */

'use strict';

module.exports = function (app, ctrlError) {
    /**
     * client error
     */
    app.use(ctrlError.clientError);

    /**
     * server error
     */
    app.use(ctrlError.serverError);
};
