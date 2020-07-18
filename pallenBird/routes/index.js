var express = require('express');
var router = express.Router();

const {User,Article} = require('../models')
/* GET home page. */
router.get('/', async(req, res, next)=> {
  let loginInfo = req.session.loginInfo;
  res.render('main',{loginInfo});
});

module.exports = router;
