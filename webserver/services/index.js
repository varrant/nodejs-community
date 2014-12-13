/*!
 * 业务服务出口
 * @author ydr.me
 * @create 2014-11-22 15:38
 */

'use strict';


module.exports = {
    comment: require('./comment.js'),
    email: require('./email.js'),
    interactive: require('./interactive.js'),
    label: require('./label.js'),
    notification: require('./notification.js'),
    object: require('./object.js'),
    scope: require('./scope.js'),
    setting: require('./setting.js'),
    user: require('./user.js')
};
