import StatusCodes from 'http-status-codes';
import { Router,Request, Response } from 'express';
import logger from '@shared/Logger';

const router = Router();
router.post('/login',(req:Request,res:Response,next:Function)=>{/*middleware */ next();},
    async(req:Request,res:Response)=>{
        try {
            const rs = {role:'login'};
            return res.status(200).send(rs);
        } catch (error) {
            return res.status(500).send(error);
        }
    });
router.post('/join',(req:Request,res:Response,next:Function)=>{/*middleware */ next();},
    async(req:Request,res:Response)=>{
        try {
            const rs = {role:'join'};
            return res.status(200).send(rs);
        } catch (error) {
            return res.status(500).send(error);
        }
    });
export default router;