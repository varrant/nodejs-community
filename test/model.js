!
 * model test
 * @author ydr.me
 * @create 2014-11-24 20:41
 


var developer = require('../webserver/models/').developer;
var random = require('ydr-util').random;
var test = require('./test.js');

test
    .push('createOne', function (next) {
        developer.createOne({
            email: random.string(10) + '@domain.com',
            github: random.string(10),
            nickname: random.string(10)
        }, function () {
            console.log(arguments);
            next();
        });
    })
    .push('existOne', function (next) {
        developer.existOne({
            github: 'abcdefg'
        }, {
            email: 'abcdefg@domain.com',
            nickname: '呵呵'
        }, function () {
            console.log(arguments);
            next();
        });
    })
    .push('findOneAndUpdate', function (next) {
        developer.findOneAndUpdate({
            github: 'abcdefg'
        }, {
            email: 'abcdefghhhhhhhhhhhhhhhh@domain.com',
            nickname: '呵呵dddddddd'
        }, function () {
            console.log(arguments);
            next();
        });
    })
    .push('getMeta', function (next) {
        developer.getMeta({
            github: 'cloudcome'
        }, 'bio', function () {
            console.log(arguments);
            next();
        });
    })
    .push('setMeta', function (next) {
        developer.setMeta({
            github: 'cloudcome'
        }, 'bio', '呵呵', function () {
            console.log(arguments);
            next();
        });
    })
    .push('setMeta', function (next) {
        developer.setMeta({
            github: 'cloudcome'
        }, {
            bio: '呵呵呵呵'
        }, function () {
            console.log(arguments);
            next();
        });
    })
    .push('increase', function (next) {
        developer.increase({
            github: 'cloudcome'
        }, 'followCount', 1, function () {
            console.log(arguments);
            next();
        });
    })
    .push('push', function (next) {
        var id = random.string(24, 'a0');
        developer.push({
            github: 'cloudcome'
        }, 'organizations', id, function () {
            console.log(arguments);
            next();
        });
    })
    .push('pull', function (next) {
        var id = '001300000004ad0009000000';
        developer.pull({
            github: 'cloudcome'
        }, 'organizations', id, function () {
            console.log(arguments);
            next();
        });
    })
    .push('toggle', function (next) {
        developer.toggle({
            github: 'cloudcome'
        }, 'isBlock', true, function () {
            console.log(arguments);
            next();
        });
    })
    .push('find', function (next) {
        developer.find({}, {limit: 2}, function () {
            console.log(arguments);
            next();
        });
    })
    .push('findOne', function (next) {
        developer.findOne({}, function () {
            console.log(arguments);
            next();
        });
    })
    .push('count', function (next) {
        developer.count({}, function () {
            console.log(arguments);
            next();
        });
    })
    .start();

