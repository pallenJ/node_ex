var express = require('express');
var router = express.Router();

const {User,Article} = require('../models')
/* GET home page. */
router.get('/', async(req, res, next)=> {
  const article_list = await Article.findAll(
    {
        include: {model:User}
    });
  res.render('main',{article_list});
});

module.exports = router;
