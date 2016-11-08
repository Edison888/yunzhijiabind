/**
 * Created by Administrator on 2016/10/26.
 */
var app = angular.module('history', []);
app.controller('opinion', function ($scope, $http) {
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