/*!
 * 主
 * @author ydr.me
 * @create 2014-12-03 21:19
 */

'use strict';

var random = require('ydr-util').random;

module.exports = function (app) {
    var exports = {};

    /**
     * home 页
     * @param req
     * @param res
     * @param next
     */
    exports.getHome = function (req, res, next) {
        res.render('front/home.html', {
            list: [{
                title: '完善简历，抽“金卡”，高薪工作送到家！！',
                viewCount: random.number(20, 10000),
                commentCount: random.number(20, 10000),
                favoriteCount: random.number(20, 10000)
            },{
                title: 'metro ui 侧边栏问题，使用框架后，单击左侧按钮好，怎样使左侧的菜单处于原来的状态？',
                viewCount: random.number(20, 10000),
                commentCount: random.number(20, 10000),
                favoriteCount: random.number(20, 10000)
            },{
                title: '缩略图样式里面的代码是什么意思？其中一小段',
                viewCount: random.number(20, 10000),
                commentCount: random.number(20, 10000),
                favoriteCount: random.number(20, 10000)
            },{
                title: 'chart.js 怎么做响应式？',
                viewCount: random.number(20, 10000),
                commentCount: random.number(20, 10000),
                favoriteCount: random.number(20, 10000)
            },{
                title: '组合输入框使用Glyphicon在一个手机上显示正常，另外一个手机显示 这样[图]',
                viewCount: random.number(20, 10000),
                commentCount: random.number(20, 10000),
                favoriteCount: random.number(20, 10000)
            },{
                title: '在不联网的情况下，怎么使用Glyphicons 字体图标呢？',
                viewCount: random.number(20, 10000),
                commentCount: random.number(20, 10000),
                favoriteCount: random.number(20, 10000)
            },{
                title: '如何让面板是直角展示呢！',
                viewCount: random.number(20, 10000),
                commentCount: random.number(20, 10000),
                favoriteCount: random.number(20, 10000)
            },{
                title: '表单构造器中拖拽的表单都是中间对齐的,但为什么拷下来源码就不是这样显示?',
                viewCount: random.number(20, 10000),
                commentCount: random.number(20, 10000),
                favoriteCount: random.number(20, 10000)
            },{
                title: 'where！',
                viewCount: random.number(20, 10000),
                commentCount: random.number(20, 10000),
                favoriteCount: random.number(20, 10000)
            },{
                title: '【请教】BootStrap的JavaScript插件问题',
                viewCount: random.number(20, 10000),
                commentCount: random.number(20, 10000),
                favoriteCount: random.number(20, 10000)
            }]
        });
    };


    /**
     * post 页
     * @param req
     * @param res
     * @param next
     */
    exports.getPost = function (req, res, next) {
        var type = req.params[0];
        var uri = req.params[1];

        res.render('front/post-' + type + '.html', {
            list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        });
    };

    return exports;
};
