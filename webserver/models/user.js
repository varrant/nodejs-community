/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 14:36
 */

'use strict';

var mongoose = require('mongoose');
var schema = require('../schemas/').user;

module.exports = mongoose.model('User', schema);