/**
 * Created by Administrator on 2016/10/26.
 */
var app = angular.module('history', []);
app.controller('opinion', function ($scope, $http) {
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
        console.log(response);
        $scope.flowUrl = response.data.workflowurl;
        console.log($scope.flowUrl);
        //if (response.flag) {
        //    $scope.historys = response.data.reverse();
        //} else {
        //    toastr.error(response.desc);
        //}
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