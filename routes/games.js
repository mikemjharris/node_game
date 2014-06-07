var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('small_game_test')
  // res.sendfile("public/html/canvas_game.html")
});

router.get('/jade', function(req, res) {
  res.render('canvas_game')
});

router.get('/small', function(req, res) {
  console.log('test log');
  res.render('small_game_test')
});



module.exports = router;
