# interactive

适用于：点赞、被评论、被收藏、申请加入组织等

`*`表示虚拟字段

- `source` 源
- `target` 目标
- `type` 类型
- `value` 值
- `object` 被操作 object
- `response` 被操作 response
- `interactiveAt` 操作时间
- `hasApproved` 是否被允许、被读取，通常为新消息、新申请时，设置为 false，默认为 true
- `meta` 元信息



# 已实现的 type
- `comment`: A评论了B的object
- `reply`: A回复了B的comment
- `accept`: A的回答被接受了
- `agree`: A的评论/回复被赞同
- `role`: A的权限被修改了
- `follow`: A关注了B
- `following-comment`：关注者参与了评论
- `following-reply`：关注者参与了回复
- `following-article`：关注者发表了文章
- `following-link`：关注者分享了链接
- `following-question`：关注者发起了提问
- `at`: A提到了B

# 未实现的 type
- `favorite`: A收藏了B的object
- `apply`: A申请了B的organization
- `score`: A的object被管理员加分了
- `color`: A的object被管理员加色了
- `essence`: A的object被管理员设置为精华
- `recommend`: A的object被管理员设置为推荐
- `update`: A的object被管理员更新了
- `certificated`: A的organization被认证了
- `weibo`: A的个人微博被认证了
