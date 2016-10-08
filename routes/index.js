var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/binding', function(req, res, next) {
  res.render('binding');
});

module.exports = router;
