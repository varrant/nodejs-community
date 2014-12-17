# `engineer` 模型

适用于：前端开发工程师。

- `email` 邮箱
- `github` github 帐号
- `weibo` 授权后的 weibo 帐号，用于个人/组织认证
- `nickname` 昵称
- `role` 2^0 -> 2^20，默认2^=1，所有者最高为`2^0 + 2^1 + ... + 2^20 = 2097151`
- `title` 头衔
- `signUpAt` 注册时间
- `signInAt` 登录时间
- `score` 积分，默认1
- `viewCount` 用户主页访问数量
- `commentCount` 评论次数
- `repliedCount` 被回复次数
- `agreedCount` 被赞同次数
- `acceptedCount` 被接受次数
- `followCount` 关注人数
- `followedCount` 被关注人数
- `objectStatistics` object 统计
- `isBlock` 是否被阻止登入
- `organizations` 加入的组织、团队
- `isCertification` 是否被认证了
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
- 2^11- 2^20：分配给操作权限