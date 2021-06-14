import StatusCodes from 'http-status-codes';
import { Router,Request, Response } from 'express';
const { BAD_REQUEST, CREATED, OK } = StatusCodes;
import logger from '@shared/Logger';
import TestSampleService from './../service/TestSample.service';
const router = Router();
router.get('/',async(req:Request,res:Response)=>{
    return res.render('list');
})
router.post('/add',async(req:Request,res:Response)=>{

  const rs = await TestSampleService.createSample(req,res);
  res.send(rs);
});
export default router;