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
    //console.log(req);
    //发起云之家请求，验证ticket，并获取到用户信息
    //跟据获取到的用户信息去本地的json文件里面判断是否有当前用户如果有，那么，渲染绑定页面返回，如果没有，渲染别的页面。
    console.log(req.query.appid);
    console.log(req.query.mid);
    console.log(req.query.ticket);
});


router.post('/qrlogin', function (req, res, next) {
        //console.log(req.body.appid);
        console.log(req.body.mid);
        console.log(req.body.ticket);

        var uri = new URI('http://xt.gzbfdc.com/openauth2/api/token');
        //grant_type=client_credential&appid=10207&secret=bindingpage
        request(
            {
                uri: uri,
                method: 'GET',
                qs: {
                    grant_type: 'client_credential',
                    appid: req.body.appid,
                    secret: 'bindingpage'
                }
            }
            , function (error, status, data) {
                console.log('========================================================================');
                console.dir(error);
                console.dir(status);
                console.dir(data);
            });
    }
);
module.exports = router;
