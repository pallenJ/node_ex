import UserDao from '@daos/User.dao'
import { PassportStatic } from 'passport'

export const UserConfig = (passport:PassportStatic)=>{
    passport.use(UserDao.createStrategy());
    passport.serializeUser(UserDao.serializeUser);
    passport.deserializeUser(UserDao.deserializeUser);
}