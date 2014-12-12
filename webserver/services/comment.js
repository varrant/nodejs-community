/*!
 * comment service
 * @author ydr.me
 * @create 2014-12-12 17:07
 */

'use strict';


var comment = require('../models/').comment;
var dato = require('ydr-util').dato;


/**
 * 查找
 */
exports.findOne = comment.findOne;



exports.createOne = function (author, data, callback) {
    var data2 = dato.pick(data, ['content', '']);
};

