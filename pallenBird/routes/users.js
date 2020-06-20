var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const { User,Articles } = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',async(req,res,next)=>{
  const {email,nick,password} = req.body;
  const pw_hash = await bcrypt.hash(password, await bcrypt.genSalt());

  const user_data = await User.create({
    email,nick,password: pw_hash
  })
  res.send(user_data)


});

router.post('/login',async(req,res,next)=>{
  const {email, password} = req.body;
  const result = await User.findOne({
    where: {email:email}
  })
    if(!result) return;
    const rs = await bcrypt.compare(password,result.password)
    console.log(`rs:${rs}`);

    res.send({
      result : rs?'success':'fail'
  })
})

router.post('/pwTest',async(req, res, next)=>{
  const {pw1,pw2} = req.body;
  const hash1 = await bcrypt.hash(pw1,await bcrypt.genSalt());
  const rs = await bcrypt.compare(pw2,hash1);

  console.log(req.body);
  
  res.send({
    pw1,pw2,hash1, rs 
  })
});

module.exports = router;
