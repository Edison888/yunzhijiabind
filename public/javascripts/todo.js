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
var app = angular.module('todo', ['ngCookies']);
//var userid = "22b387d3-9b1e-11e6-943d-005056b8712a";
var userid = "6b2da1c2-95d8-11e6-a383-005056b8712a";//杨总
//var userid = "fcbe652e-9f22-11e6-943d-005056b8712a";//高梦雅预算测试2016-11-22 15:34:52
//var userid = "fccda66d-9f22-11e6-943d-005056b8712a";//胡文全
//var userid = "fcc56718-9f22-11e6-943d-005056b8712a";//胡文全
var pageSize = 10;
$('#myTab a').click(function (e) {
    e.preventDefault();
    $(this).tab('show')
});
function switchTab(currentTab) {
    switch (currentTab) {
        case 'todounhd':
            XuntongJSBridge.call('setWebViewTitle', '待办流程');
            break;
        case 'todohd':
            XuntongJSBridge.call('setWebViewTitle', '已办流程');
            break;
        case 'subunhd':
            XuntongJSBridge.call('setWebViewTitle', '我的在办');
            break;
        case 'subhd':
            XuntongJSBridge.call('setWebViewTitle', '我的已办');
            break;

    }
}
var count = 0;
app.controller('matters', function ($scope, $http, $cookieStore, $window) {
    $cookieStore.put('iszhipai', false);
    //$window.addEventListener('load', function () {
    //    $scope.getMatters('todohd');
    //    $scope.getMatters('todounhd');
    //    $scope.getMatters('subhd');
    //    $scope.getMatters('subunhd');
    //});
    var currentTab = $cookieStore.get('currentTab');
    if (currentTab) {//如果currentTab不为空
        switchTab(currentTab);
    } else {
        switchTab('todounhd');
    }
    document.getElementById('spinner').style.visibility = 'visible';
    $scope.setCookie = function (cookieValue) {
        $cookieStore.put('currentTab', cookieValue);
    };
    $scope.isActive = function (historyTab) {
        if (!currentTab) {//如果第一次打开
            if (historyTab == 'todounhd') {//默认显示待办流程
                $cookieStore.put('currentTab', 'todounhd');
                XuntongJSBridge.call('setWebViewTitle', '待办流程');
                return true;
            } else {
                return false;
            }
        } else {
            if (historyTab == currentTab) {//如果页签对应上了cookie里面存储的历史页签，那么返回true
                switchTab(currentTab);
                return true;
            } else {
                return false;
            }
        }
    };
    $scope.showTitle = function (title) {
        XuntongJSBridge.call('setWebViewTitle', {'title': title});
    };
    $scope.hds = [];
    $scope.unhds = [];
    $scope.subhds = [];
    $scope.subunhds = [];
    $scope.todounhdcount = 0;
    $scope.todohdcount = 0;
    $scope.subhdcount = 0;
    $scope.subunhdcount = 0;
    $scope.getMatters = function (type) {
        document.getElementById('spinner').style.visibility = 'visible';
        distinguish(type);
        switch (type) {
            case 'todounhd':
                count = $scope.todounhdcount;
                $scope.todounhdcount = $scope.todounhdcount + 1;
                break;
            case 'todohd':
                count = $scope.todohdcount;
                $scope.todohdcount = $scope.todohdcount + 1;
                break;
            case 'subhd':
                count = $scope.subhdcount;
                $scope.subhdcount = $scope.subhdcount + 1;
                break;
            case 'subunhd':
                count = $scope.subunhdcount;
                $scope.subunhdcount = $scope.subunhdcount + 1;
                break;

        }
        $http({
                method: 'get',
                url: requrl,
                params: {
                    userid: userid,
                    statuskey: statuskeyparam,
                    statuscode: statuscodeparam,
                    startline: count * pageSize,
                    count: pageSize,
                    condition: '',
                    method: 'getTaskList'
                }
            }
        ).success(function (response) {
                document.getElementById('spinner').style.visibility = 'hidden';
                console.log(type);
                console.log(response);
                if (response.flag) {
                    if (response.data.length == 0) {
                        //toastr.info('暂无待办');
                        document.getElementById('hdload').style.visibility = 'hidden';
                        document.getElementById('unhdload').style.visibility = 'hidden';
                        document.getElementById('subhdload').style.visibility = 'hidden';
                        document.getElementById('subunhdload').style.visibility = 'hidden';
                    } else {
                        switch (type) {
                            case 'todohd'://需要我处理并且已经处理
                                document.getElementById('mytabcontent').style.visibility = 'visible';
                                if (response.data.length == pageSize) {
                                    document.getElementById('hdload').style.visibility = 'visible';
                                } else {
                                    document.getElementById('hdload').style.visibility = 'hidden';
                                }
                                $scope.hds = $scope.hds.concat(response.data);
                                break;
                            case 'todounhd'://需要我处理并且未处理
                                document.getElementById('mytabcontent').style.visibility = 'visible';
                                if (response.data.length == pageSize) {
                                    document.getElementById('unhdload').style.visibility = 'visible';
                                } else {
                                    document.getElementById('unhdload').style.visibility = 'hidden';
                                }
                                $scope.unhds = $scope.unhds.concat(response.data);
                                break;
                            case 'subhd'://我提交的并且已经处理
                                document.getElementById('mytabcontent').style.visibility = 'visible';
                                if (response.data.length == pageSize) {
                                    document.getElementById('subhdload').style.visibility = 'visible';
                                } else {
                                    document.getElementById('subhdload').style.visibility = 'hidden';
                                }
                                $scope.subhds = $scope.subhds.concat(response.data);
                                break;
                            case 'subunhd'://我提交的并且未处理
                                document.getElementById('mytabcontent').style.visibility = 'visible';
                                if (response.data.length == pageSize) {
                                    document.getElementById('subunhdload').style.visibility = 'visible';
                                } else {
                                    document.getElementById('subunhdload').style.visibility = 'hidden';
                                }
                                $scope.subunhds = $scope.subunhds.concat(response.data);
                                break;
                        }

                    }
                } else {
                    toastr.error(response.desc);
                }
            });

    };
    $scope.getMatters('todohd');
    $scope.getMatters('todounhd');
    $scope.getMatters('subhd');
    $scope.getMatters('subunhd');
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
    $scope.goDetail = function (matter, type) {
        var uri = new URI('/form');
        uri.addQuery('taskid', matter.taskid);
        uri.addQuery('userid', userid);
        uri.addQuery('billtype', matter.billtype);
        uri.addQuery('ts', matter.senddate);
        uri.addQuery('billid', matter.billid);
        uri.addQuery('isFromApp', false);//记录来自App还是轻应用
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