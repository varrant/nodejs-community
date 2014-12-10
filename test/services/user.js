/*!
 * services/user
 * @author ydr.me
 * @create 2014-12-10 14:24
 */

'use strict';

var test = require('../test.js');
var mongoose = require('../../webserver/mongoose.js');
var user = require('../../webserver/services/').user;
var random = require('ydr-util').random;

//test.push('user.increaseCommentCount', function (next) {
//    user.increaseCommentCount({
//
//    });
//});