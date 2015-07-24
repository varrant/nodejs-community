/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-07-24 20:00
 */


'use strict';

module.exports = function (app) {
    var exports = {};

    // 发现首页
    exports.getHome = function (req, res, next) {
        var list = [];
        var listCommunities = [];
        var listGroups = [];
        var listBlogs = [];

        list.push({
            type: '社区',
            list: listCommunities
        });
        listCommunities.push({
            link: 'http://frontenddev.org/',
            text: 'FED社区'
        });
        listCommunities.push({
            link: 'http://segmentfault.com/',
            text: 'SegmentFault'
        });
        listCommunities.push({
            link: 'https://www.v2ex.com/',
            text: 'V2EX'
        });
        listCommunities.push({
            link: 'http://www.oschina.net/',
            text: '开源中国'
        });
        listCommunities.push({
            link: 'http://www.infoq.com/cn/',
            text: 'infoQ'
        });
        listCommunities.push({
            link: 'http://div.io/',
            text: 'Div.IO'
        });
        listCommunities.push({
            link: 'http://www.html-js.com/',
            text: '前端乱炖'
        });
        listCommunities.push({
            link: 'https://cnodejs.org/',
            text: 'CNode'
        });
        listCommunities.push({
            link: 'http://f2e.im/',
            text: 'F2E社区'
        });
        listCommunities.push({
            link: 'http://angularjs.cn/',
            text: 'AngularJS中文社区'
        });
        listCommunities.push({
            link: 'http://ionichina.com/',
            text: 'Ionic 中文社区'
        });

        list.push({
            type: '团队',
            list: listGroups
        });
        listGroups.push({
            link: 'http://ued.taobao.org/blog/',
            text: '淘宝UED'
        });
        listGroups.push({
            link: 'http://ued.tmall.com/',
            text: '天猫UED'
        });
        listGroups.push({
            link: 'http://ux.etao.com/',
            text: '一淘UED'
        });
        listGroups.push({
            link: 'http://tgideas.qq.com/',
            text: '腾讯TGideas'
        });
        listGroups.push({
            link: 'http://isux.tencent.com/',
            text: '腾讯ISUX'
        });
        listGroups.push({
            link: 'http://cdc.tencent.com/',
            text: '腾讯CDC'
        });

        list.push({
            type: '博客',
            list: listBlogs
        });
        listBlogs.push({
            link: 'http://qianduanblog.com/',
            text: '前端博客'
        });
        listBlogs.push({
            link: 'http://www.zhangxinxu.com/wordpress/',
            text: '张鑫旭博客'
        });

        var data = {
            title: '发现',
            keywords: '前端，你的世界，等你去发现',
            description: '前端，你的世界，等你去发现',
            list: list
        };

        res.render('front/discover.html', data);
    };

    return exports;
};

