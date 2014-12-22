/*!
 * 主
 * @author ydr.me
 * @create 2014-12-03 21:19
 */

'use strict';

var random = require('ydr-util').random;
var dato = require('ydr-util').dato;
var typeis = require('ydr-util').typeis;
var howdo = require('howdo');
var object = require('../../services/').object;
var engineer = require('../../services/').engineer;
var os = require('os');

module.exports = function (app) {
    var exports = {};

    /**
     * home 页
     * @param req
     * @param res
     * @param next
     */
    exports.getHome = function (req, res, next) {
        var data = {
            title: '主页',
            statistics: {
                uptime: Date.now() - app.locals.$startTime
            }
        };
        var list = app.locals.$section.map(function (item) {
            return item.uri;
        });

        howdo
            // 统计个数
            .each(list, function (index, uri, done) {
                object.count({type: uri}, function (err, count) {
                    if(err){
                        return done(err);
                    }

                    data.statistics[uri] = count;
                    done();
                });
            })
            // 注册用户数
            .task(function (done) {
                engineer.count({}, function (err, count) {
                    if(err){
                        return done(err);
                    }

                    data.statistics.user = count;
                    done();
                });
            })
            .together(function (err) {
                if(err){
                    return next(err);
                }

                res.render('front/home.html', data);
            });
    };


    /**
     * list 页
     * @param req
     * @param type
     * @returns {Function}(req, res, next)
     */
    exports.getList = function (type) {
        return function (req, res, next) {
            var scope = req.params.scope;
            var label = req.params.label;
            var page = req.params.page;

            page = dato.parseInt(page, 1);

            res.render('front/list-' + type + '.html', {
                title: type,
                list: [{
                    title: '完善简历，抽“金卡”，高薪工作送到家！！',
                    viewCount: random.number(20, 10000),
                    commentCount: random.number(20, 10000),
                    favoriteCount: random.number(20, 10000)
                }, {
                    title: 'metro ui 侧边栏问题，使用框架后，单击左侧按钮好，怎样使左侧的菜单处于原来的状态？',
                    viewCount: random.number(20, 10000),
                    commentCount: random.number(20, 10000),
                    favoriteCount: random.number(20, 10000)
                }, {
                    title: '缩略图样式里面的代码是什么意思？其中一小段',
                    viewCount: random.number(20, 10000),
                    commentCount: random.number(20, 10000),
                    favoriteCount: random.number(20, 10000)
                }, {
                    title: 'chart.js 怎么做响应式？',
                    viewCount: random.number(20, 10000),
                    commentCount: random.number(20, 10000),
                    favoriteCount: random.number(20, 10000)
                }, {
                    title: '组合输入框使用Glyphicon在一个手机上显示正常，另外一个手机显示 这样[图]',
                    viewCount: random.number(20, 10000),
                    commentCount: random.number(20, 10000),
                    favoriteCount: random.number(20, 10000)
                }, {
                    title: '在不联网的情况下，怎么使用Glyphicons 字体图标呢？',
                    viewCount: random.number(20, 10000),
                    commentCount: random.number(20, 10000),
                    favoriteCount: random.number(20, 10000)
                }, {
                    title: '如何让面板是直角展示呢！',
                    viewCount: random.number(20, 10000),
                    commentCount: random.number(20, 10000),
                    favoriteCount: random.number(20, 10000)
                }, {
                    title: '表单构造器中拖拽的表单都是中间对齐的,但为什么拷下来源码就不是这样显示?',
                    viewCount: random.number(20, 10000),
                    commentCount: random.number(20, 10000),
                    favoriteCount: random.number(20, 10000)
                }, {
                    title: 'where！',
                    viewCount: random.number(20, 10000),
                    commentCount: random.number(20, 10000),
                    favoriteCount: random.number(20, 10000)
                }, {
                    title: '【请教】BootStrap的JavaScript插件问题',
                    viewCount: random.number(20, 10000),
                    commentCount: random.number(20, 10000),
                    favoriteCount: random.number(20, 10000)
                }]
            });
        };
    };


    /**
     * post 页
     * @param type
     * @returns {Function}(req, res, next)
     */
    exports.getPost = function (type) {
        return function (req, res, next) {
            var uri = req.params.uri;

            res.render('front/post-' + type + '.html', {
                title: type,
                list: [{
                    content: '清除浏览器缓存的文件试试看！不知道有没有童鞋遇到过这样的？我用QQ,搜狗，猎豹，chrome，UC都没问题！！手机wifi调试页面，浏览器是小米3内置浏览器童鞋遇到过这样的？我用QQ,搜狗，猎豹，chrome，UC都没问题！！手机wifi调试'
                }, {
                    content: '我本地wamp环境，手机wifi调试页面，浏览器是小米3内置浏览器；'
                }, {
                    content: '那么问题是：css文件修改后，浏览器不管怎么刷新，（手机，浏览器）重启都不能呈现更新后的样式。'
                }, {
                    content: '不知道有没有童鞋遇到过这样的？我用QQ,搜狗，猎豹，chrome，UC都没问题！！小米浏览器是我见过的手机浏览器最垃圾的 号召大家都不要睬他'
                }]
            });
        }
    };

    return exports;
};
