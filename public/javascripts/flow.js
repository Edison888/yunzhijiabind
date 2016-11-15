/**
 * Created by Administrator on 2016/10/26.
 */
var app = angular.module('app', []);
app.controller('flow', function ($scope, $http) {
    XuntongJSBridge.call('setWebViewTitle', {'title': 'Á÷³ÌÍ¼'});
    $scope.flowUrl = urlObj.imgUrl;
});