# 本地变量
- app.locals.$config 社区配置
- app.locals.$setting web 配置
- app.locals.$section 社区版块
- app.locals.$category 社区分类
- app.locals.$founder 社区创始人
- app.locals.$system 系统信息
- req.session.$csrf 请求令牌
- req.session.$developer 请求开发者
- req.session.$github github授权
- req.session.$state 授权状态值
- res.locals.$csrf 响应令牌
- res.locals.$developer 响应开发者


# 全局变量
- window['-csrf-'] 请求令牌
- window['-engineer-'] 当前用户信息
- _window['-refresh-'] 登录之后是否刷新【部分页面】_
- window['-section-'] 页面所在版块ID【部分页面】
- window['-id-'] 详情页ID【部分页面】
- window['-page-'] 分页值【部分页面】
- window['-author-'] 作者信息【部分页面】


# HTTP 状态值
- 200 正常
- 301 跳转
- 400 未验证
- 401 未登陆
- 403 无权限
- 404 未找到
- 406 验证失败
- 500 服务错误


# 用户组
- owner 创始人
- admin 管理员
- vip VIP
- normal 普通


# 参考项目
- <https://cnodejs.org/>
- <http://www.html-js.com/>
- <http://aroundnode.org/>
- <http://f2e.im/>
- <https://coding.net/u/coding/activity>
- <http://wenda.bootcss.com/>
- <http://www.imooc.com/wenda/0>
- <https://nodebb.org.cn/>
- <https://coderq.com/>
- <http://nodeclass.com/>