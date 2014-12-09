# `user` 模型

适用于：用户。

- `email` 邮箱
- `github` github 帐号
- `weibo` 授权后的 weibo 帐号，用于个人/组织认证。
- `nickname` 昵称
- `role` 2^0 -> 2^20，默认2^=1，所有者最高为`2^0 + 2^1 + ... + 2^20 = 2097151`
- `signUpAt` 注册时间
- `signInAt` 登录时间
- `score` 积分，默认1
- `commentCount` 评论次数
- `praisedCount` 被点赞次数
- `acceptedCount` 被接受次数
- `followCount` 关注人数
- `followedCount` 被关注人数
- `essencedCount` 被精华次数
- `recommendCount` 被推荐次数
- `isBlock` 是否被阻止登入
- `organizations` 加入的组织、团队
- `isCertification` 是否被认证了
- `meta` 元信息
	- `location` 位置
	- `position` 职位
	- `company` 公司
	- `blog` 博客
	- `bio` 简介
