/**
 * Created by 1 on 2016/11/8.
 */
angular.module('app', []).controller('attachment', function ($scope, $http) {
    $scope.openFile = function (index) {
        XuntongJSBridge.call('showFile',
            {
                fileName: $scope.attachments[index]['name'],
                fileExt: $scope.attachments[index]['ext'],
                //fileTime: $scope.attachments[index]['name'],
                fileTime: '2015-06-02 15:40',
                fileSize: $scope.attachments[index]['size'],
                //fileDownloadUrl: fileDownloadUrl + '&fileSize=' + fileSize
                fileDownloadUrl: $scope.attachments[index]['url']
            },
            function (result) {
                alert(result);
                if (!(result.success)) {
                    alert(result.error);
                }
            }
        );
    };
    $http({
        method: 'get',
        url: requrl,
        params: {
            billid: urlObj.billid,
            billtype: urlObj.billtype,
            method: 'getBillFileList'
        }
    }).success(function (response) {
        console.log(response);
        $scope.attachments = response.data;

    });
});
