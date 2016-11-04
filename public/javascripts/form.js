var app = angular.module('form', []);
toastr.options = {
    "closeButton": false,
    "debug": true,
    "positionClass": "toast-top-full-width",
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
app.controller('form_detail', function ($scope, $http) {
    $scope.agree = 'agree';
    $scope.disagree = 'disagree';
    $scope.mreject = 'reject';
    $scope.currentOper = '';
    $scope.goApprove = function () {
        var uri = new URI('/history');
        uri.addQuery('billid', urlObj.billid);
        uri.addQuery('billtype', urlObj.billtype);
        window.location = uri.toString();
    };
    $scope.oper = function (operation) {
        $scope.currentOper = operation;
        $http({
            method: 'get',
            url: requrl,
            params: {
                userid: urlObj.userid,
                taskid: urlObj.taskid,
                action: operation,
                note: 'ëÞ×¼ÁË',
                method: 'dealTask'
            }
        }).success(function (response) {
            console.log(response);
        });
    };
    $http(
        {
            method: 'get',
            url: requrl,
            //url: 'json/form',
            params: {
                statuskey: statuskeyparam,
                statuscode: statuscodeparam,
                taskid: urlObj.taskid,
                method: 'GetTask'
            }
        }
    ).success(function (response) {
            if (response.flag == 0) {
                $scope.heads = response.data.taskbill.head.tabContent;
                $scope.bodys = response.data.taskbill.body.tabContent;
                $('#myTab a').click(function (e) {
                    e.preventDefault();
                    $(this).tab('show')
                });
                $('#myTab a:first').tab('show');
            } else {
                toastr.error(response.desc);
            }

        });

});