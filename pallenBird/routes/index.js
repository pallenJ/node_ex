var express = require('express');
var router = express.Router();

const {User,Article} = require('../models')
/* GET home page. */
router.get('/', async(req, res, next)=> {

  res.render('main');
});

module.exports = router;
