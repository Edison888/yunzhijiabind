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
    $scope.isApproved = false;
    $scope.note = '';
    $scope.onInputNote = function (note) {
        console.log(note);
        if (note == undefined || note == '') {
            document.getElementById('confirm').style = 'background-color:grey';
            return true;
        } else {
            document.getElementById('confirm').style = 'background-color:#3cbaff';
            return false;
        }
    };
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
        document.getElementById('confirm').style = 'background-color:grey';
        if (operation == 'agree') {
            $scope.note = '批准';//每次点击前，需要清空note，这样，不管之前是以何种方式关闭了对话框，不管是否已经填写了建议，都先清空，重新填写。
            $('#myModal').modal({
                show: true
            });
        } else if (operation == 'disagree') {
            $scope.note = '不批准';
        } else if (operation == 'reject') {
            $scope.note = '驳回';
        }

    };
    $scope.submit = function (operation) {
        $http({
            method: 'get',
            url: requrl,
            params: {
                userid: urlObj.userid,
                taskid: urlObj.taskid,
                action: operation,
                note: $scope.note,
                method: 'dealTask'
            }
        }).success(function (response) {
            console.log(response);
            if (response.flag == 0) {
                if (response.data.result == 'success') {
                    toastr.success('审批成功');
                    $scope.isApproved = true;
                    $('#footer > div:first-child').removeAttr('data-toggle');
                    $('#footer > div:nth-child(2)').removeAttr('data-toggle');
                    $('#footer > div:nth-child(3)').removeAttr('data-toggle');
                } else {
                    toastr.error(response.data.desc);
                }
            } else {
                toastr.error(response.desc);
            }


        });
    };
    $scope.mcancel = function () {
        $scope.note = '';
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
            console.log(response);
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