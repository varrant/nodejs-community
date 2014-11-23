/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-23 11:59
 */

'use strict';

module.exports = function(app, controller){
    app.post('/api/user/sign_in/', controller.test1);
};
