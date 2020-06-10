exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(403).send('로그인 필요');
    }
  };
  
  exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/');
    }
  };

//로그인 여부를 확인하는 미들웨어들.btn
//회원가입이나 로그인시 로그인 상태가 아닌지, 프로필을 확인하거나 글쓸때 로그인 상태가 맞는지 등을 확인할때 사용