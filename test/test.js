/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-24 20:41
 */

'use strict';

var howdo = require('howdo');
var userMode = require('path/to/user-model');
var postMode = require('path/to/post-model');
var followMode = require('path/to/follow-model');

/**
 * 查询 3 个用户
 * @param callback {Function} 完成回调
 */
var getThreeUsers = function (callback) {
    userMode.getUsers(10, callback);
};

/**
 * 查询 1 个用户的文章信息
 * @param user {Object} 用户信息
 * @param callback {Function} 完成回调
 */
var getUserPosts = function (user, callback) {
    postMode.getUserPosts(user, callback);
};


/**
 * 查询 1 个用户的关注信息
 * @param user {Object} 用户信息
 * @param callback {Function} 完成回调
 */
var getUserFollows = function (user, callback) {
    followMode.getUserFollows(user, callback);
};

/**
 * 读取所有用户的文章信息
 * @param users {Array} 用户列表数组
 * @param done {Function} 完成回调
 */
var getUsersPosts = function (users, callback) {
    // 读取用户的文章信息
    howdo.each(users, function (index, user, done) {
        getUserPosts(user, done);
    }).together(function (err, user0Posts, user1Posts, user2Posts) {
        if (err) {
            return callback(err);
        }

        var postsList = Array.prototype.slice.call(arguments, 1);

        // 写入用户的文章信息
        postsList.forEach(function (posts, index) {
            users[index].posts = posts;
        });
        callback(null, users);
    });
};

/**
 * 读取所有用户的关注信息
 * @param users {Array} 用户列表数组
 * @param callback {Function} 完成回调
 */
var getUsersFollows = function (users, callback) {
    // 读取用户的关注信息
    howdo.each(users, function (index, user, done) {
        getUserFollows(user, done);
    }).together(function (err, user0Follows, user1Follows, user2Follows) {
        if (err) {
            return callback(err);
        }

        var followsList = Array.prototype.slice.call(arguments, 1);

        // 写入用户的文章信息
        followsList.forEach(function (follows, index) {
            users[index].follows = follows;
        });
        callback(null, users);
    });
};


howdo
    .task(getThreeUsers)
    .task(function (next, users) {
        howdo
            .task(function (done) {
                getUserPosts(users, done);
            })
            .task(function (done) {
                getUsersFollows(users, done);
            })
            // 异步并行
            .together(next);
    })
    // 异步并行
    .follow(function (err, users) {
        if (err) {
            console.error(err);
            process.exit(-1);
        }

        // 组装好后的 users 对象
        console.log(users);
    });


