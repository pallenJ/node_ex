const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const {User} = require('../models');

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
  let loginInfo = req.session.loginInfo; 
  let jsonData = {};
    if(loginInfo){
      console.warn('already login');
    }else if(!result) {
      jsonData = {message:'not exist user'};
    }else{

      const rs = await bcrypt.compare(password,result.password)
      console.log(`rs:${rs}`);
      if(rs){
        req.session.loginInfo = {id:result.id,nick:result.nick,email,admin:result.admin};
      }
      jsonData = {result : rs?'success':'fail', login:req.session.loginInfo};
    }
      //res.send(jsonData)
      res.redirect('/');
})

router.get('/logout',async(req,res)=>{
      let loginInfo = req.session.loginInfo;
      delete req.session.loginInfo;
      console.log(`${loginInfo.email} logout`);
      jsonData = {logout:loginInfo};
      res.redirect('/');
});


module.exports = router;
