var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/binding', function(req, res, next) {
  res.render('binding');
});
router.get('/todo', function(req, res, next) {
  res.render('todo');
});
router.get('/form', function(req, res, next) {
  res.render('form');
});
router.get('/history', function(req, res, next) {
  res.render('history');
});
router.get('/flow', function (req, res, next) {
  res.render('flow');
});
router.get('/attachment', function (req, res, next) {
  res.render('attachment');
});

module.exports = router;
