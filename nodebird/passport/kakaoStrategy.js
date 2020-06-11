const KakaoStrategy = require('passport-kakao').Strategy;

const {User} = require('../models');

module.exports = (passport)=>{
    passport.use(new KakaoStrategy({
        clientID : process.env.KAKAO_ID,//카카오에서 발급해주는 아이디
        callbackURL: '/auth/kakao/callback',
    },async(accessToken, refreshToken,profile,done)=>{
        try {
            const exUser = await User.findOne({ where: { snsId: profile.id, provider: 'kakao' } });

            if(exUser){//이미 있는 사용자인지 검사. 없다면 회원가입으로.
                done(null,exUser);
            }else{
                const newUser = await User.create({
                    email: profile._json && profile._json.kaccount_email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser);
            }

        } catch (error) {
            console.error(error);
            done(error);
        }

    }));
}