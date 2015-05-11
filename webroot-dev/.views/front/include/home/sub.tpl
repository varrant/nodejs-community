<!--副-->
<div class="col-md-3 layout-sub">
    <!--统计-->
    <div class="card">
        <div class="card-title"><i class="fi fi-bar-chart"></i>统计</div>
        <div class="card-body">
            <ul class="simplelist text-muted">
                {{var bestList = [];}}
                {{# bestList.push({type: '最活跃', key: 'bestActive'});}}
                {{# bestList.push({type: '最人气', key: 'bestPopularity'});}}
                {{# bestList.push({type: '最积极', key: 'bestInitiative'});}}
                {{# bestList.push({type: '最热门', key: 'bestHot'});}}
                {{# bestList.push({type: '最欢迎', key: 'bestWelcome'});}}
                {{# bestList.push({type: '最神话', key: 'bestRespect'});}}

                {{list bestList as best}}
                    <li><i class="fi fi-user"></i>{{best.type}}：<a href="{{$configs.app.host}}/developer/{{=statistics[best.key].githubLogin}}/"><img src="{{statistics[best.key].email|gravatar:40}}" width="20" height="20" coolieignore>{{statistics[best.key].nickname}}</a></li>
                {{/list}}

                <li><i class="fi fi-user"></i>总用户：{{statistics.engineers|format}}</li>
            </ul>
        </div>
    </div>
    <!--/统计-->
</div>
<!--/副-->