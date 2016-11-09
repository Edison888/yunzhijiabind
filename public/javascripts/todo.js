toastr.options = {
    "closeButton": false,
    "debug": true,
    "positionClass": "toast-bottom-full-width",
    "onclick": null,
    "showDuration": "1",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};
var app = angular.module('todo', []);
var userid = "22b387d3-9b1e-11e6-943d-005056b8712a";
$('#myTab a').click(function (e) {
    e.preventDefault();
    $(this).tab('show')
});
XuntongJSBridge.call('setWebViewTitle', {'title': '待办流程'});
app.controller('matters', function ($scope, $http) {
    document.getElementById('spinner').style.visibility = 'visible';
    $scope.showTitle = function (title) {
        XuntongJSBridge.call('setWebViewTitle', {'title': title});
    };
    $scope.getMatters = function (type) {
        distinguish(type);
        $http({
                method: 'get',
                url: requrl,
                params: {
                    userid: userid,
                    statuskey: statuskeyparam,
                    statuscode: statuscodeparam,
                    startline: '0',
                    count: '10',
                    condition: '',
                    method: 'getTaskList'
                }
            }
        ).success(function (response) {
                console.log(response);
                document.getElementById('spinner').style.visibility = 'hidden';
                if (response.flag) {
                    if (response.data.length == 0) {
                        toastr.info('暂无待办');
                    } else {
                        switch (type) {
                            case 'todohd'://需要我处理并且已经处理
                                $scope.hds = response.data;
                                break;
                            case 'todounhd'://需要我处理并且未处理
                                $scope.unhds = response.data;
                                break;
                            case 'subhd'://我提交的并且已经处理
                                $scope.subhds = response.data;
                                break;
                            case 'subunhd'://我提交的并且未处理
                                $scope.subunhds = response.data;
                                break;
                        }

                    }
                } else {
                    toastr.error(response.desc);
                }
            });

    };
    //$scope.getMatters = function (type) {
    //    var params = {};
    //    switch (type){
    //        case 'todohd':
    //            params = hdparams;
    //            break;
    //        case 'todounhd':
    //            params = unhdparams;
    //            break;
    //        case 'subhd':
    //            params = subhdparams;
    //            break;
    //        case 'subunhd':
    //            params = subunhdparams;
    //            break;
    //    }
    //}
    $scope.getMatters('todohd');
    $scope.getMatters('todounhd');
    $scope.getMatters('subhd');
    $scope.getMatters('subunhd');
    $scope.goDetail = function (matter, type) {
        var uri = new URI('/form');
        uri.addQuery('taskid', matter.taskid);
        uri.addQuery('userid', userid);
        uri.addQuery('billtype', matter.billtype);
        uri.addQuery('ts', matter.senddate);
        uri.addQuery('billid', matter.billid);
        uri.addQuery('type', type);//跳转到表单详情页面时，携带了type参数，用来告知表单详情页面过来的这个待办是哪种类型的待办。
        window.location = uri.toString();
    }
});
//$(function () {
//        XuntongJSBridge.call('setWebViewTitle', {'title': '业务审批'});//设置页面标题并显示
//        $('#myTabs a').click(function (e) {
//            e.preventDefault();
//            $(this).tab('show');
//        });
//        var userId = '';
//        document.getElementById('spinner').style.visibility = 'visible';
////TODO 测试用，先注释掉判断云之家环境并获取用户ID的代码↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓2016-8-19 09:46:45
////        if (isYzjApp()) {//如果运行在云之家（Android或IOS的云之家APP客户端）里面，才能执行下面的逻辑
////            XuntongJSBridge.call('getPersonInfo', {}, function (result) {//这里返回的result是个对象，转换json传使用JSON.stringfy(result)
////                getServerHost('OA', function (serverHost) {
////                    $.post(serverHost + fetchUsernameUrl,
////                        {
////                            openid: result.data.openId,
////                            params: JSON.stringify({
////                                securityCode: security,
////                                time: time
////                            })
////                        }//只需要传一个openid即可
////                        , function (res) {
////                            if (res.resultcode == 0) {//如果为0，那么获取成功
////TODO 测试用，先注释掉判断云之家环境并获取用户ID的代↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑2016-8-19 09:46:47
//        userId = 'sunyangyang';
//        //userId = res.userid;
//        getServerHost('OA', function (serverHost) {
//            var url = serverHost + todoUrl;
//            $.post(url//获取待办列表
//                , {
//                    userId: userId
//                    , params: JSON.stringify({
//                        securityCode: security,
//                        time: time
//                    })
//                }
//                , function (result, code) {
//                    console.log(result);
//                    var o = result;
//                    if (o.resultcode == 0) {
//                        if (o.data.length == 0) {
//                            toastr.info('暂无待办');
//                            document.getElementById('spinner').style.visibility = 'hidden';
//                        }
//                        var html = '';
//                        for (var i = 0; i < o.data.length; i++) {
//                            var info = o.data[i];
//                            getFormName(i, info, function (back, formname) {
//                                    var info = o.data[back];
//                                    //↓↓↓↓↓↓↓↓↓时间戳转换成时间↓↓↓↓↓↓↓↓↓
//                                    var time = transTimeStampToTime(info.getdate);
//                                    //↑↑↑↑↑↑↑↑↑时间戳转换成时间↑↑↑↑↑↑↑↑↑
//                                    html += '<li onclick="" class="list-group-item"' +
//                                    ' data-form-source="' + info.source +//系统来源
//                                    '" data-form-biztype="' + info.biztype +//业务类型
//                                    '" data-form-bizurl="' + info.bizurl +
//                                    '" data-form-entityid="' + info.entityid +//表单详情id
//                                    '" data-form-pid="' + info.pid +//审批流程id
//                                    '" data-form-taskid="' + info.taskid +//对应审批操作
//                                    '" data-form-formname="' + formname +//表单名字
//                                    '" ><h5>' +
//                                    info.title +
//                                    '</h5><div>' +
//                                    '<p>' +
//                                    info.source +
//                                    '</p><p>' +
//                                    formname +
//                                    '</p><p>' +
//                                    info.username + '</p><h6>' +
//                                    time +
//                                    '</h6></div></li>';
//                                    if (back == o.data.length - 1) {//如果进行到最后一次回调
//                                        document.getElementById('spinner').style.visibility = 'hidden';
//                                        $('#todo-ul').html(html);
//                                        $('#todo-ul li').click(function () {
//                                            var source = $(this).attr('data-form-source');
//                                            var biztype = $(this).attr('data-form-biztype');
//                                            var bizurl = $(this).attr('data-form-bizurl');
//                                            var entityid = $(this).attr('data-form-entityid');
//                                            var pid = $(this).attr('data-form-pid');
//                                            var taskid = $(this).attr('data-form-taskid');
//                                            var formname = $(this).attr('data-form-formname');
//                                            //跳转到表单详情页，dispatch里面会默认跟一个isFromApp=false
//                                            if (bizurl == '') {
//                                                dispatch('json/router.json', formname, source, biztype, bizurl, entityid, pid, taskid, userId, function (url) {
//                                                    window.location = url;
//                                                });
//                                            } else {
//                                                window.location = bizurl;
//                                            }
//
//                                        });
//                                    }
//                                }
//                            );//getFormName
//                        }
//                    }//todo formal
//                });//获取待办列表
//        });
////TODO 测试用，先注释掉判断云之家环境并获取用户ID的代码↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓2016-8-19 09:48:09
////                            }//if (res.resultcode == 0)
////
////                        });// $.post(fetchUsernameUrl
////                });
////            });//XuntongJSBridge.call
////
////        }
////        else {
////            alert('请在云之家App内打开应用');
////        }//if (isYzjApp())
////TODO 测试用，先注释掉判断云之家环境并获取用户ID的代码↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑2016-8-19 09:48:05
//    }
//);
//判断是否运行于云之家App中
function isYzjApp() {
    return navigator.userAgent.match(/Qing\/.*;(iPhone|Android).*/) ? true : false;
}
/*
 * 获取表单名字（注意这里的i变量，是为了记录todo.js里面进行到了第几次循环，在回调里面方便判断是否应该进行html的赋值）
 * */
function getFormName(i, info, func) {
    var formname = '';
    $.get('json/router.json', function (res) {
        for (var _source in res) {//遍历json文件，先从json对象的第一层属性开始遍历（也就是几大业务系统）
            if (info.source == _source) {
                for (var _biztype in res[_source]) {//遍历某业务系统中的业务
                    if (info.biztype == _biztype) {//如果json文件里面配置了此biztype，才会回调
                        formname += res[_source][_biztype]['name'];
                        func(i, formname);
                    }
                }
            }
        }
    });
}
function dispatch(json_file_url, formname, source, biztype, bizurl, entityid, pid, taskid, userid, redirect) {//此redirect是个函数，类似回调
    $.get(json_file_url, function (res) {
        for (var _source in res) {//遍历json文件，先从json对象的第一层属性开始遍历（也就是几大业务系统）
            if (source == _source) {
                for (var _biztype in res[_source]) {//遍历某业务系统中的业务
                    if (biztype == _biztype) {//如果已经存了具体的业务表单type，那么选取其url（也就是在json文件里面配置好的页面）
                        var uri = new URI(res[_source][_biztype]['url']);//这里注意json文件里面用的是相对地址，以后正式服务器也要用相对地址
                        uri.addQuery('source', source);
                        uri.addQuery('biztype', biztype);
                        uri.addQuery('bizurl', bizurl);
                        uri.addQuery('entityid', entityid);
                        uri.addQuery('pid', pid);
                        uri.addQuery('taskid', taskid);
                        uri.addQuery('dataurl', res[_source][_biztype]['dataurl']);//这里是json文件里面保存的表单详情的接口地址，每个表达详情的接口地址都不一样
                        uri.addQuery('userid', userid);
                        uri.addQuery('formname', formname);
                        uri.addQuery('isFromApp', false);
                        redirect(uri.toString());
                        return;//跳转到具体的页面后终止循环
                    }
                }
            }
        }
        //对于传过来的source如果router.json文件里面没有配置，并且bizurl不为空，那么直接进行跳转
        if (bizurl != '' || bizurl != null || bizurl != undefined) {
            redirect(bizurl);
        }
    });
}