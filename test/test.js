/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-24 20:41
 */


var mongoose = require('../server/mongoose.js');
var user = require('../server/models/').user;
var post = require('../server/models/').post;
var scope = require('../server/models/').scope;

mongoose(function (err) {
    if (err) {
        console.log('mongoose error');
        console.error(err);
        return process.exit(-1);
    }

    //user.increase({
    //    _id: '547db3547eb55b21d51f7b56'
    //}, 'followCount', 1, function(){
    //    console.log(arguments);
    //});

    scope.createOne({
        name: '测试域',
        uri: 'test-scope',
        cover: '1.png'
    }, function () {
        console.log(arguments);
    });
});