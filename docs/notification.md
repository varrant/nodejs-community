# notification

适用于：通知。

`*`表示虚拟字段

- `type` 通知类型，详见下表
- `activeUser` 激活者
- `activeByUser` 被激活者
- `object` 影响者
- `hasActived` 是否已经激活了
- `activeAt` 激活时间
- * `activeTimestamp` 激活时间
- `activeByAt` 被激活时间
- * `activeByTimestamp` 被激活时间
- `meta` 元信息


# type
- `comment`: A评论了B的object
- `reply`: A回复了B的comment
- `favorite`: A收藏了B的object
- `apply`: A申请了B的organization
- `follow`: A关注了B
- `at`: A提到了B
- `score`: A的object被管理员加分了
- `color`: A的object被管理员加色了
- `essence`: A的object被管理员设置为精华
- `recommend`: A的object被管理员设置为推荐
- `update`: A的object被管理员更新了
- `accepted`: A的回答被接受了
- `certificated`: A的organization被认证了
- `weibo`: A的个人微博被认证了
- `role`: A的权限被修改了
