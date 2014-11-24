# 功能

## 权限
- 2^0 = 1: 所有权限，除了被细分的之外
- >1: 后续权限由新建的板块来划分
	- 2^1 = 2: 全局通知
	- 2^2 = 4: 官方文章分类
	- 2^3 = 8: 官方提问分类
	- 2^4 = 16: 官方招聘分类


## 用户
- 只能通过 github 注册
- 权限
	- 游客：阅读、订阅分类
	- 注册：阅读、订阅分类、评论、点赞、提问、回答、收藏实例、关注
	- 超管：所有
- 资产
	- 积分


## 文章
- 发布（作者 author、时间 time、域 scope、标签 label、内容 content、标题 title）
- 编辑（热门加色、置顶加粗）
- 修改
- 删除
- 被
	- 评论 1comment = +1
	- 回答 1answer = +1
	- 点赞 1praise = +2
	- 取消点赞 1unpraise = -2
	- 收藏 1favorite = +2
	- 取消收藏 1unfavorite = -2
	- 采纳 1accept = +5
	- 取消采纳 1unaccept = -1（特殊）
	- 关注 1follow = +5
	- 取消关注 1unfollow = -1（特殊）
	- 精华 1essence = +10
	- 取消精华 1unessence = -10
	- 推荐 1recommend = +20
	- 取消推荐 1unrecommend = -20


## 问答
- 发布（标题 title、内容 content、描述 desc、积分 coin）
- 编辑
- 修改
- 删除
- 被
	- 回答（普通回答、最佳回答）


## demo
- what


## 招聘
- what


## 资源
- what


## 参考
- <https://cnodejs.org/>
- <http://www.html-js.com/>
- <http://aroundnode.org/>
