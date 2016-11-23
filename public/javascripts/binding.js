toastr.options = {
    "closeButton": false,
    "debug": true,
    "positionClass": 'toast-bottom-full-width',
    "onclick": null,
    "showDuration": "1",
    "hideDuration": "1000",
    "timeOut": "3000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};
var app = angular.module('binding', []);
app.controller('list_controller', function ($scope, $http) {
    $scope.searchMobile = '';
    $scope.searchMapping = function (mobile) {
        if (mobile == '') {
            $scope.getMappings();
        } else if (!(/^1[34578]\d{9}$/.test(mobile))) {
            toastr.error('手机号码有误，请重新输入！');
        } else {
            $http({
                method: 'get',
                url: requrl,
                //url: 'json/searchMappingByMobile',
                params: {
                    //phone: mobile,//chenhao
                    mobile: mobile,//jizhe
                    method: 'getUserMappingInfo'//jizhe
                    //method: 'getAllUserMappingInfo'//chenhao
                }
            }).success(function (response) {
                console.log(response);
                if (response.flag == 0) {
                    //$scope.users = response.data;//chenhao
                    $scope.users = [];//jizhe
                    $scope.users.push(response.data);//jizhe
                } else {
                    toastr.error(response.desc);
                }
            });
        }

    };

    $scope.tableSelection = {};
    $scope.selectedRows = [];
    //$scope.selectedOpenIds = [];
    $scope.selectedOpenIdsStr = '';
    $scope.del = function () {
        //start from last index because starting from first index cause shifting
        //in the array because of array.splice()
        if ($scope.selectedRows.length > 0) {
            for (var i = 0; i < $scope.selectedRows.length; i++) {
                var selectIndex = $scope.selectedRows[i];
                $scope.selectedOpenIds.push($scope.users[selectIndex]['yzjid']);
            }
            if ($scope.selectedRows.length == 1) {
                $scope.selectedOpenIdsStr = $scope.selectedOpenIds[0];
            } else {
                $scope.selectedOpenIdsStr += $scope.selectedOpenIds[0];
                for (var i = 1; i < $scope.selectedRows.length; i++) {
                    var selectIndex = $scope.selectedRows[i];
                    $scope.selectedOpenIdsStr += ',' + $scope.users[selectIndex]['yzjid'];
                }
                console.log($scope.selectedOpenIdsStr);
            }
        }
        console.log($scope.selectedOpenIds);
        $http(
            {
                method: 'get',
                url: requrl,
                params: {
                    yzjid: $scope.selectedOpenIdsStr,
                    method: 'deleteUserMapping'
                }

            }
        ).success(function (response) {//todo 请求删除行数据
                console.log(response);
                if (response.flag == 0) {
                    toastr.success("已删除");
                } else {
                    toastr.error(response.desc);

                }

                $scope.selectedRows.reverse();
                console.log($scope.selectedRows);
                for (var i = 0; i < $scope.selectedRows.length; i++) {
                    var selectIndex = $scope.selectedRows[i];
                    //delete row from data
                    $scope.users.splice(selectIndex, 1);
                    console.log(selectIndex);
                    //delete rowSelection property
                    delete $scope.tableSelection[selectIndex];
                    console.log($scope.tableSelection)
                }
                console.log($scope.tableSelection);
            });
    };
    $scope.getSelectedRows = function () {
        //start from last index because starting from first index cause shifting
        //in the array because of array.splice()
        $scope.selectedRows = [];
        $scope.selectedOpenIds = [];
        $scope.selectedOpenIdsStr = '';
        for (var i = 0; i < $scope.users.length; i++) {
            if ($scope.tableSelection[i]) {
                $scope.selectedRows.push(i);
            }
        }
        console.log($scope.selectedRows);
    };
    $scope.getMappings = function () {
        document.getElementById('spinner').style.visibility = 'visible';
        $http({
            method: 'get',
            url: requrl,
            params: {
                method: 'getAllUserMappingInfo'
            }
        }).success(function (response) {
            document.getElementById('spinner').style.visibility = 'hidden';
            console.log(response);
            $scope.users = response.data;
        });
    };
    //分页相关↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    var pageSize = 2;
//        var totalPages = Math.ceil(getUrlParamObj()['pagecount'] / pageSize);
    var totalPages = Math.ceil(5);
    //    document.getElementById('spinner').style.visibility = 'visible';
    /*
     * 分页控件（https://github.com/lyonlai/bootstrap-paginator）
     * */
    var element = $('#paginator');
    var options = {
        bootstrapMajorVersion: 3,//必须指定bootstrap的版本
        currentPage: 1,//默认显示第一页
        numberOfPages: 3,//这里固定为4
        totalPages: totalPages,
        onPageChanged: function (e, oldPage, newPage) {
            $scope.getMappings(newPage, pageSize);
        }
    };
    element.bootstrapPaginator(options);
    $scope.getMappings(1, pageSize);
    //分页相关↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
    $scope.addYzj = function () {
        var phoneValue = document.getElementById('yzj_phone').value;
        if (phoneValue == null || phoneValue == '' || phoneValue == undefined) {
            toastr.error('手机号不能为空');
        } else if (!(/^1[34578]\d{9}$/.test(phoneValue))) {
            toastr.error("手机号码有误，请重填");
        } else {
            document.getElementById('spinner').style.visibility = 'visible';
            $http({
                method: 'get',
                url: requrl,
                params: {
                    method: 'getYzjUserInfo',
                    mobile: phoneValue
                }
            }).success(function (response) {
                    console.log("sdfsdf");
                    console.log(response);
                    document.getElementById('spinner').style.visibility = 'hidden';
                    if (response.flag == 0) {
                        var yzjUserObj = response.data;
                        var user = {
                            yzjid: yzjUserObj.yzjid,	//云之家账号ID
                            yzjmobile: yzjUserObj.yzjmobile,	//云之家人员手机号
                            yzjname: yzjUserObj.yzjname,   // 云之家人员名称
                            yzjdept: yzjUserObj.yzjdept,// 云之家人员部门
                            yzjjob: yzjUserObj.yzjjob//云之家人员职位
                        };
                        $http({
                            method: 'get',
                            url: requrl,
                            params: {
                                yzjid: yzjUserObj.yzjid,	//云之家账号ID
                                yzjmobile: yzjUserObj.yzjmobile,	//云之家人员手机号
                                yzjname: yzjUserObj.yzjname,   // 云之家人员名称
                                yzjdept: yzjUserObj.yzjdept,// 云之家人员部门
                                yzjjob: yzjUserObj.yzjjob,//云之家人员职位
                                method: 'createUserMapping'//方法名

                            }

                        }).success(function (response) {
                            console.log(response);
                            if (response.flag == 0) {
                                $scope.users.push(user);
                            } else {
                                toastr.error(response.desc);
                            }
                        });
                    }
                    else {
                        toastr.error(response.error)
                    }
                }
            )
            ;
        }
    };
    $scope.bindNC = function (currentSelectedNcUser, currentIndex) {
        //todo
        console.log(currentSelectedNcUser);
        document.getElementById('spinner').style.visibility = 'visible';
        $http(
            {
                method: 'get',
                url: requrl,
                params: {
                    ncjob: currentSelectedNcUser.ncjob,
                    ncmobile: currentSelectedNcUser.ncmobile,
                    ncunit: currentSelectedNcUser.ncunit,
                    ncdept: currentSelectedNcUser.ncdept,
                    ncusercode: currentSelectedNcUser.ncuser_code,
                    ncusername: currentSelectedNcUser.ncuser_name,
                    ncuserid: currentSelectedNcUser.ncuserid,
                    method: 'bindNCUser',
                    yzjid: $scope.currentUser.yzjid
                }
            }
        ).success(function (response) {
                document.getElementById('spinner').style.visibility = 'hidden';
                $scope.disableBind();
                if (response.flag == 0) {
                    console.log(currentIndex);
                    $scope.users[currentIndex]['ncuser_code'] = currentSelectedNcUser.ncuser_code;
                    $scope.users[currentIndex]['ncuser_name'] = currentSelectedNcUser.ncuser_name;
                    $scope.users[currentIndex]['ncmobile'] = currentSelectedNcUser.ncmobile;
                    toastr.success("绑定成功");
                } else {
                    toastr.error(response.desc);
                }

            });

    };
    $scope.disableBind = function () {
        $('#binding').attr("disabled", true);
        document.getElementById("binding").style.backgroundColor = "grey";
    };
    $scope.selectNcUser = function (ncUser, index) {
        $("#binding").removeAttr("disabled", false);
        document.getElementById("binding").style.backgroundColor = "#3cbaff";
        $scope.currentSelectedNcUser = ncUser;
    };
    $scope.getYzjData = function (index) {
        $scope.currentIndex = index;
        console.log($scope.currentIndex);
        var user = $scope.users[index];
        $scope.currentUser = {
            yzjid: user.yzjid,
            yzjmobile: user.yzjmobile,
            yzjname: user.yzjname,
            yzjdept: user.yzjdept,
            yzjjob: user.yzjjob
        };
        document.getElementById('spinner').style.visibility = 'visible';
        $http({
            method: 'get',
            url: requrl,
            params: {
                ncname: user.yzjname,
                ncmobile: user.yzjmobile,
                method: 'getNCUserInfo'
            }
        }).success(function (response) {
            document.getElementById('spinner').style.visibility = 'hidden';
            console.log(response);
            $scope.ncusers = [];
            if (response.flag == 0) {
                if (response.data.length > 0) {
                    $scope.ncusers = response.data;
                }
            } else {
                toastr.error(response.desc);
            }
        });
    };

})
;