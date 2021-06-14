import StatusCodes from 'http-status-codes';
import { Router,Request, Response } from 'express';
/* import {pwEncryption} from '../middleware/exMiddleware'
import ArticleEX from '@daos/Examples/ArticleEX'
import logger from '@shared/Logger'; */
const { BAD_REQUEST, CREATED, OK } = StatusCodes;
import bcrypt from "bcrypt"
//import logger from '@shared/Logger';
import crypto from 'crypto'
import logger from '@shared/Logger';
const router = Router();
router.get('/',async(req:Request,res:Response)=>{
    return res.render('list');
})
router.post('/save',/* pwEncryption, */async(req:Request,res:Response)=>{
     const pwd = req.body.password;
     const salt = Math.round(new Date().valueOf() * Math.random());
     //req.body.password = bcrypt.hashSync(pwd,20);
     if(pwd)
     req.body.password =crypto.createHmac('sha256',`${salt}`).update(pwd).digest('hex');
    
     return res.json({});
});
export default router;