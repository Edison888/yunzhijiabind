/**
 * Created by Administrator on 2016/10/26.
 */
var app = angular.module('history', []);
app.filter('selectIcon', function () {
    return function (input) {
        var out = '';
        switch (input) {
            case '提交':
                out = 'glyphicon glyphicon-arrow-up item-icon item-icon-blue';
                break;
            case '批准':
                out = 'glyphicon glyphicon-ok-sign item-icon item-icon-green';
                break;
            case '不批准':
                out = 'glyphicon glyphicon-remove-circle item-icon item-icon-red';
                break;
            case '驳回':
                out = 'glyphicon glyphicon-repeat item-icon item-icon-purple';
                break;
        }

        return out;
    }
}).controller('opinion', function ($scope, $http) {
    $scope.showIcon = function (iconStr) {
        return iconStr ? iconStr : 'img/icon.png';
    };
    $scope.redirectFlow = function (imgUrl) {
        var uri = new URI('/flow');
        uri.addQuery('imgUrl', imgUrl);
        window.location = uri.toString();
    };
    $http({
        method: 'get',
        url: requrl,
        params: {
            billid: urlObj.billid,
            billtype: urlObj.billtype,
            taskid: urlObj.taskid,
            ts: urlObj.ts,
            method: 'getWorkflow'
        }
    }).success(function (response) {
        $scope.flowUrl = response.data.workflowurl;
    });
    $http({
        method: 'get',
        url: requrl,
        params: {
            billid: urlObj.billid,
            billtype: urlObj.billtype,
            method: 'getApproveHistory'
        }
    }).success(function (response) {
        console.log(response);
        if (response.flag) {
            $scope.historys = response.data.reverse();
        } else {
            toastr.error(response.desc);
        }
    });
});
