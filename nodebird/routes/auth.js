const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const {isLoggedIn,isNotLoggedIn}= require('./middlewares');
const {User} = require('../models')

const router = express.Router();

router.post('/join', isNotLoggedIn, async(req,res,next)=>{
    const {email, nick, password} = req.body;

    try {
     const exUser = await User.findOne({where:{ email } });
     if(exUser){
         req.flash('이미 가입된 이메일 입니다.')
         return res.redirect('/join');
     }
     //비밀번호 암호화. bcypt의 2번째 인자는 pbkdf2의 반복횟수와 비슷한 일을 수행. 최대 31까지 가능.
     const hash = await bcrypt.hash(password,12);
     console.log(hash);
     
     await User.create({
         email,
         nick,
         password:hash,
     });
     return res.redirect('/')

    } catch (error) {
     console.error(error);
     return next(error);   
    }
});
router.post('/login',isNotLoggedIn,(req,res,next)=>{
    //미들웨어가 로컬 로그인 전략 수행.
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
          console.error(authError);
          return next(authError);
        }
        if (!user) {
          req.flash('loginError', info.message);
          return res.redirect('/');
        }
        return req.login(user, (loginError) => {
          if (loginError) {
            console.error(loginError);
            return next(loginError);
          }
          console.log('로긴')
          return res.redirect('/');
        });
      })(req, res, next); //미들웨어 내의 미들 웨어에는 (req,res,next)를 붙임
});

router.get('/logout',isLoggedIn,(req,res)=>{
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;