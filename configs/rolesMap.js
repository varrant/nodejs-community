/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-24 22:11
 */

'use strict';

module.exports = function (app) {
    var rolesMap = {};
    var number = 0;

    rolesMap[_pow2(number++)] = {
        name: 'create post',
        desc: '发布观点'
    };

    rolesMap[_pow2(number++)] = {
        name: 'edit post',
        desc: '编辑观点'
    };

    rolesMap[_pow2(number++)] = {
        name: 'remove post',
        desc: '删除观点'
    };

    rolesMap[_pow2(number++)] = {
        name: 'create note',
        desc: '撰写笔记'
    };

    rolesMap[_pow2(number++)] = {
        name: 'edit note',
        desc: '编辑笔记'
    };

    rolesMap[_pow2(number++)] = {
        name: 'remove note',
        desc: '删除笔记'
    };

    rolesMap[_pow2(number++)] = {
        name: 'create note',
        desc: '发布提问'
    };

    rolesMap[_pow2(number++)] = {
        name: 'edit note',
        desc: '编辑提问'
    };

    rolesMap[_pow2(number++)] = {
        name: 'remove note',
        desc: '删除提问'
    };

    rolesMap[_pow2(number++)] = {
        name: 'create comment',
        desc: '发布提问'
    };

    rolesMap[_pow2(number++)] = {
        name: 'edit comment',
        desc: '编辑提问'
    };

    rolesMap[_pow2(number++)] = {
        name: 'remove comment',
        desc: '删除提问'
    };

    return rolesMap;
};

/**
 * 2的开方计算
 * @param mathStr
 * @returns {number}
 * @private
 */
function _pow2(pow) {
    return Math.pow(2, pow);
}
