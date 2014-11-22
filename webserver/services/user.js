/*!
 * 用户相关
 * @author ydr.me
 * @create 2014-11-22 15:26
 */

'use strict';

var user = require('../models/').user;

/**
 * 注册
 */
exports.signUp = user.createOne;


/**
 * 根据 ID 查找
 */
exports.findById = user.findById;



/**
 * 查找
 */
exports.findOne = user.findOne;


