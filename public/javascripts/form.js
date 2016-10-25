var app = angular.module('form', []);
var type = urlObj.type;
app.controller('form_detail', function ($scope, $http) {
    $http(
        {
            method: 'get',
            url: requrl,
            params: {
                statuskey: statuskeyparam,
                statuscode: statuscodeparam,
                taskid: urlObj.taskid,
                method: 'GetTask'
            }
        }
    ).success(function (response) {
            console.log(response)
        });

});