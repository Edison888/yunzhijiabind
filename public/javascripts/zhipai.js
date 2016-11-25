var app = angular.module('app', ['ngCookies']);
/*
 * 延时关闭当前界面
 * */
function deplayCloseCurrentPage() {
    setTimeout(function () {
        if (history.length <= 1 || getUrlParamObj()['isFromApp'] == 'true') { //顶级页面，则关闭当前Web
            XuntongJSBridge.call('closeWebView');
        } else {
            history.back();
        }
    }, 1500);
}
app.controller('userlist', function ($scope, $http, $cookieStore) {
    var list = $cookieStore.get('psnstructlist');
    $scope.isZhiPai = function () {
        if ($scope.selecteds.length == 0) {
            return true;
        } else {
            return false;
        }
    };
    $scope.selecteds = [];
    $scope.assigns = list;
    $scope.selectedUserIdStr = '';
    $scope.selectAll = function () {
        $scope.selecteds = ($scope.selecteds).concat($scope.assigns);
        $scope.assigns = [];
    };
    $scope.cancelAll = function () {
        $scope.assigns = ($scope.selecteds).concat($scope.assigns);
        $scope.selecteds = [];
    };
    $scope.zhipai = function () {
        console.log($scope.selecteds);
        $scope.selectedUserIdStr = $scope.selecteds[0].id;
        if ($scope.selecteds.length > 1) {
            for (var i = 1; i < $scope.selecteds.length; i++) {
                $scope.selectedUserIdStr += ',' + $scope.selecteds[i]['id'];
            }
            console.log($scope.selectedUserIdStr);
        }
        $http({
            method: 'get',
            url: requrl,
            params: {
                userid: urlObj.userid,
                taskid: urlObj.taskid,
                action: $scope.currentOper,
                note: $scope.note,
                zpuserids: $scope.selectedUserIdStr,
                method: 'dealTask'
            }
        }).success(function (response) {
            console.log(response);
            if (response.flag == 0) {
                toastr.success('审批成功');
                $cookieStore.put('iszhipai', true);
                console.log($cookieStore.get('iszhipai'));
                deplayCloseCurrentPage();
                $scope.isApproved = true;
                //$('#footer > div:first-child').removeAttr('data-toggle');
                //$('#footer > div:nth-child(2)').removeAttr('data-toggle');
                //$('#footer > div:nth-child(3)').removeAttr('data-toggle');
            }
        });
    };
    $scope.pushSelecteds = function (index) {
        $scope.selecteds.push($scope.assigns[index]);
        $scope.assigns.splice(index, 1);
    };
    $scope.pushAssigns = function (index) {
        $scope.assigns.push($scope.selecteds[index]);
        $scope.selecteds.splice(index, 1);
    };


});