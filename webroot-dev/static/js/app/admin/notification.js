/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 19:29
 */


define(function (require, exports, module) {
    'use strict';

    var List = require('../../widget/admin/List.js');
    var ajax = require('../../widget/common/ajax.js');
    var hashbang = require('../../alien/core/navigator/hashbang.js');
    var selector = require('../../alien/core/dom/selector.js');
    var attribute = require('../../alien/core/dom/attribute.js');
    var methods = {};
    var $notification = selector.query('.j-notification-count');


    // 选择读状态
    methods.onchange = function () {
        list.query.type = this.$data.type;
        list.getList();
        hashbang.set('query', 'type', this.$data.type);
    };


    // 标记已读
    methods.toggle = function (item) {
        ajax({
            method: item.hasActived ? 'put' : 'delete',
            url: '/admin/api/notification/',
            data: {
                id: item.id
            }
        });
        item.hasActived = !item.hasActived;
        increse(item.hasActived ? -1 : 1);

        var hasActivedLength = 0;
        var unActivedLength = 0;
        var length = this.$data.list.length;
        this.$data.list.forEach(function (item) {
            if (item.hasActived) {
                hasActivedLength++;
            } else {
                unActivedLength++;
            }
        });

        if ((hasActivedLength === length || unActivedLength === length) && this.$data.type !== 'all') {
            list.getList();
        }
    };


    require('../../widget/front/nav.js');

    var type = hashbang.get('query', 'type') || 'unactive';
    var list = new List('#list', '#pagination', {
        url: '/admin/api/notification/',
        query: {
            type: type,
            limit: 10
        },
        data: {
            type: type,
            sectionURIMap: window['-section-uri-map-']
        },
        methods: methods
    });


    /**
     * 改变当前未读通知数量
     * @param count
     */
    function increse(count) {
        $notification.forEach(function ($nt) {
            var val = 1 * attribute.data($nt, 'value');

            val += count;
            attribute.data($nt, 'value', val);
            $nt.innerHTML = val > 9 ? 'N' : val;
        });
    }
});