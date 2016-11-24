var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/binding', function (req, res, next) {
    res.render('binding');
});
router.get('/todo', function (req, res, next) {
    res.render('todo');
});
router.get('/form', function (req, res, next) {
    res.render('form');
});
router.get('/history', function (req, res, next) {
    res.render('history');
});
router.get('/flow', function (req, res, next) {
    res.render('flow');
});
router.get('/attachment', function (req, res, next) {
    res.render('attachment');
});
router.get('/qrcode', function (req, res, next) {
    res.render('QRcode');
});
router.get('/qrlogin', function (req, res, next) {
    //发起云之家请求，验证ticket，并获取到用户信息
    //跟据获取到的用户信息去本地的json文件里面判断是否有当前用户如果有，那么，渲染绑定页面返回，如果没有，渲染别的页面。
});


router.post('/qrlogin', function (req, res, next) {
        var ticket = req.body.ticket;
        var appid = req.body.appid;
        //var uri = new URI('http://xt.gzbfdc.com/openauth2/api/token');
        //grant_type=client_credential&appid=10207&secret=bindingpage
        getToken(appid).then(function (token) {
            return getUserInfo(ticket, token);
        }).then(function (curUser) {
            console.log("then log => " + curUser);
        });
    }
);

var getToken = function (appid) {
    var host = 'http://xt.gzbfdc.com';
    var secret = 'bindingpage';
    var grant_type = 'client_credential';
    return new Promise(function (resolve, reject) {
        request(
            {
                uri: host + '/openauth2/api/token',
                method: 'GET',
                qs: {
                    grant_type: grant_type,
                    appid: appid,
                    secret: secret
                }
            },
            function (error, status, data) {
                console.log('getToken -> ' + data);
                resolve(JSON.parse(data).access_token);
            });
    });
};

var getUserInfo = function (ticket, access_token) {
    return Promise(function (resolve, reject) {
        request({
            //?ticket=TICKET&access_token=TOKEN
            uri: host + '/openauth2/api/getcontext',
            method: 'GET',
            qs: {
                ticket: ticket,
                access_token: access_token
            }
        }, function (error, status, data) {
            var curUser = JSON.parse(data);
            console.log('currentUser -> ' + curUser);
            resolve(curUser);
        });

    });
};


module.exports = router;
