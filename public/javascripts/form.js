var app = angular.module('form', []);
var type = urlObj.type;
app.controller('form_detail', function ($scope, $http) {
    $http(
        {
            method: 'get',
            //url: requrl,
            url: 'json/form',
            params: {
                statuskey: statuskeyparam,
                statuscode: statuscodeparam,
                taskid: urlObj.taskid,
                method: 'GetTask'
            }
        }
    ).success(function (response) {
            console.log(response)
            $scope.heads = response.data.taskbill.head.tabContent;
            $scope.bodys = response.data.taskbill.body.tabContent;
            $('#myTab a').click(function (e) {
                e.preventDefault()
                $(this).tab('show')
            });
            $('#myTab a:first').tab('show');
        });

});