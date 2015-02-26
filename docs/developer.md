# `developer` 模型

适用于：前端开发工程师。

`*`表示虚拟字段

- `email` 邮箱
- `*avatarM` 中等头像 40px
- `*avatar` 标准头像 100px
- `*avatarL` 大头像 200px
- `githubLogin` github 登录帐号
- `githubId` github ID（唯一识别）
- `weibo` 授权后的 weibo 帐号，用于个人/组织认证
- `nickname` 昵称
- `role` 2^0 -> 2^20，默认2^0=1，所有者最高为`2^0 + 2^1 + ... + 2^20 = 2097151`
- `title` 头衔
- `group` 用户组
- `registerAt` 注册时间
- `loginAt` 登录时间
- `score` 积分，默认1
- `objectCount` object 数量
- `viewByCount` 用户主页访问数量
- `commentCount` 评论次数
- `replyCount` 回复次数
- `replyByCount` 被回复次数
- `agreeByCount` 被赞同次数
- `acceptByCount` 被接受次数
- `followCount` 关注人数
- `followByCount` 被关注人数
- `columnCount` column 数量
- `sectionStatistics` section 统计
- `categoryStatistics` category 统计
- `columnStatistics` column 统计
- `isBlock` 是否被阻止登入
- `organizations` 加入的组织、团队
- `hasCertificated` 是否通过了个人认证
- `meta` 元信息
	- `location` 位置
	- `position` 职位
	- `company` 公司
	- `blog` 博客
	- `bio` 简介


# 权限分配
- 各个权限值没有大小之分
- 各个权限值没有层级之分
- 2^0 - 2^10：分配给发布权限
- 2^11- 2^20：分配给用户组权限