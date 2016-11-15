/**
 * Created by 1 on 2016/11/8.
 */
function bytesToSize(bytes) {
    if (bytes === 0) return '0 B';

    var k = 1024;

    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    i = Math.floor(Math.log(bytes) / Math.log(k));

    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}
angular.module('app', []).controller('attachment', function ($scope, $http) {
    $scope.showSize = function (size) {
        return bytesToSize(size);
    };
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
                if (!(result.success)) {
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
        if (response.data.length == 0) {
            alert('暂无附件');
        } else {
            $scope.attachments = response.data;
        }

    });
});
