const local  = require('./localStrategy');
const kakao  = require('./kakaoStrategy');
const {User} = require('../models');

module.exports = (passport)=>{
    passport.serializeUser((user,done)=>{
        done(null,user.id);
    });
    passport.deserializeUser((id,done)=>{
        User.findOne({
            where: { id },
            include :[{
                model: User,
                attributes: ['id','nick'],
                as:'Followers'
            },{
                model: User,
                attributes: ['id','nick'],
                as:'Followings'
            }] 
        })
        .then(user => done(null,user))
        .catch(err => done(err))
    });
    local(passport);
    kakao(passport);
}
/*
    serializeUser와 deserializeUser가 핵심


    serializeUser는 req.session에 어떤 데이터를 저장할지 선택
    deserializeUser는 매 요청시 실행, passort.session()이호출
    세션에 저장한 아이디를 받아 DB에서 사용자정보를 조회
    req.user에 조회한 정보를 저장해서 로그인한 사용자 정보 조회가능
 */