import StatusCodes from 'http-status-codes';
import { Router,Request, Response } from 'express';
import logger from '@shared/Logger';
import TestSampleService from './../service/TestSample.service';
const router = Router();
router.get('/',async(req:Request,res:Response)=>{
    const rs = res.json(await TestSampleService.list(req));
    return rs;
})
router.post('/add',async(req:Request,res:Response)=>{
  try {
    const rs = await TestSampleService.createSample(req);
    return res.status(200).send(rs);
  } catch (error) {
    return res.status(500).send(error);
  }

});

router.post('/addSamples',async(req:Request,res:Response)=>{
  logger.info('aaa')
  try {
    const rs = await TestSampleService.sampleListCreate(req,res);
    return res.status(200).send(rs);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.patch('/edit/:bno',async(req:Request,res:Response)=>{
  try {
    const rs = await TestSampleService.editSample(req);
    return res.status(200).send(rs);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.delete('/delete/:bno',async(req:Request,res:Response)=>{
  try {
    const rs = await TestSampleService.removeSample(req);
    logger.info((rs.list.data as Array<any>).length);
    return res.status(200).send(rs);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post('/pwCheck/:bno',async(req,res)=>{
  try {

    const rs = await TestSampleService.passwordCheck(req);
    return res.status(200).send(rs);
  } catch (error) {
    return res.status(500).send(error);
  }

})

export default router;