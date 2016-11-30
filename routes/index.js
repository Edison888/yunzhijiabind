let express = require('express');
let request = require('request');
let fs = require('fs');
let uuid = require('node-uuid');
let router = express.Router();
let sender = require('.././bin/www');

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
    const sign = uuid.v1();
    res.render('QRcode', {sign: sign});
    res.end();
});

router.post('/permission', function (req, res, next) {
    console.dir(req.body);
    regexAdmin(req.body.openid).then(function (result) {
        res.send(result);
    });
});

let regexAdmin = function (openId) {
    return new Promise(function (resolve, reject) {
        const adminConfig = JSON.parse(fs.readFileSync('./config/admin.json'));
        if (Array.from(adminConfig.admin).find(admin => admin == openId)) {
            resolve({
                result: true,
                openId: openId
            });
        } else {
            resolve({
                result: false
            });
        }
    });
};
let getUserInfo = function (host, ticket, access_token) {
    return new Promise(function (resolve, reject) {
        request({
            //?ticket=TICKET&access_token=TOKEN
            uri: host + '/openauth2/api/getcontext',
            method: 'GET',
            qs: {
                ticket: ticket,
                access_token: access_token
            },
            json: true
        }, function (error, status, data) {
            resolve(data.openid);
        });

    });
};
router.post('/qrlogin', function (req, res, next) {
    let host = 'http://xt.gzbfdc.com';
    let ticket = req.body.ticket;
    let appid = req.body.appid;
    let secret = 'bindingpage';
    let grant_type = 'client_credential';
    //var uri = new URI('http://xt.gzbfdc.com/openauth2/api/token');
    //grant_type=client_credential&appid=10207&secret=bindingpage
    getToken(host, appid, secret, grant_type).then(function (token) {
        return getUserInfo(host, ticket, token);
    }).then(function (curUserOpenId) {
        return regexAdmin(curUserOpenId);
    }).then(function (data) {
        return notify(data, req.body.sign);
    }).then(function () {
        res.status(200);
        res.end();
    });
});


let notify = function (data, sign) {
    sender.emit(sign, data.openId);
    return new Promise(function (resolve, reject) {
        if (data.result) {
            resolve();
        } else {
            resolve();
        }
    });
};

let getToken = function (host, appid, secret, grant_type) {
    return new Promise(function (resolve, reject) {
        request(
            {
                uri: host + '/openauth2/api/token',
                method: 'GET',
                qs: {
                    grant_type: grant_type,
                    appid: appid,
                    secret: secret
                },
                json: true
            },
            function (error, status, data) {
                resolve(data.access_token);
            });
    });
};


module.exports = router;
