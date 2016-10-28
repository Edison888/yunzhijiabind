/**
 * Created by Administrator on 2016/10/26.
 */
var app = angular.module('history', []);
app.controller('opinion', function ($scope, $http) {
    $http({
        method:'get',
        url:'json/history',
        params:{

        }
    }).success(function (response) {
        $scope.historys = response.data.reverse();
    console.log(response);
    });
});