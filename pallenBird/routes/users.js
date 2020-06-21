const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const { User,Articles } = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',async(req,res,next)=>{
  const {email,nick,password} = req.body;
  const pw_hash = await bcrypt.hash(password, await bcrypt.genSalt());
  
  const loginEmail = req.session.loginEmail;
  if(loginEmail){
    delete req.session.loginEmail;
    console.log(`${loginEmail} logout`);
  }//추후 이부분은 get으로 옮길것

  const user_data = await User.create({
    email,nick,password: pw_hash
  })
  res.send(user_data)


});

router.get('/login',(req,res)=>{
   const email= req.session.loginEmail
   res.send({email})
});

router.post('/login',async(req,res,next)=>{
  const {email, password} = req.body;
  const result = await User.findOne({
    where: {email:email}
  })
    const loginEmail = req.session.loginEmail;
    if(loginEmail){
      delete req.session.loginEmail;
      console.log(`${loginEmail} logout`);
      res.send({logout:loginEmail});
    }else if(!result) {
      res.send({message:'not exist user'})
    }else{

      const rs = await bcrypt.compare(password,result.password)
      console.log(`rs:${rs}`);
      req.session.loginEmail = email;
      res.send({
        result : rs?'success':'fail'
      })
    }
    
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
