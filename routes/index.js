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

module.exports = router;
