/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 13:06
 */

'use strict';

module.exports = function (app, controller) {
    /**
     * server error
     */
    app.use(controller.serverError);


    /**
     * client error
     */
    app.use(controller.clientError);
};
