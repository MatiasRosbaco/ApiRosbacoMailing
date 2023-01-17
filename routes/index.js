var express = require('express');
var router = express.Router();
const apiController = require('../controllers/controllerEnvio');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/enviarMails',apiController.sendMail);
router.post('/enviarMails',apiController.sendMail);

module.exports = router;
