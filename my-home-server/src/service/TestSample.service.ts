import TestSampleDao from "@daos/TestSample.dao";
import { exception } from "console";
import { Request, Response } from 'express';
import logger from '@shared/Logger';
import bcrypt from 'bcrypt';
import { Schema } from "mongoose";

const parse = (val:any,init:number)=>{

    try {
        if(!val)throw new Error('undefined');
        return parseInt(val+'');
    } catch (error) {
         return init;
    }
}
const TestSampleService ={
    createSample: async(req:Request,res:Response)=>{
        const created = new TestSampleDao(req.body);
        logger.info(JSON.stringify(created.schema));

        await created.save((err, data) => {
            if (err) return { suceess: false, err };
            return { suceess: true ,data};
          });

    },
    editSample: async(req:Request,res:Response) =>{
        const {bno} = req.params;
        const {content} = req.body;
        let sampleInfo:any = await TestSampleDao.findOne({bno:parseInt(bno)});
        const historys = sampleInfo.history as Array<Schema>;
        const __v :number = (sampleInfo.__v as number) + 1;
        sampleInfo.history = [];
        return await TestSampleDao.updateOne({bno:parseInt(bno)},{content, history: historys.concat([sampleInfo]),__v});
    },
    removeSample: async(req:Request,res:Response) =>{
        const bno = parseInt(req.params.bno);
        return await TestSampleDao.remove({bno})
    }
    ,
    list : async(req:Request,res:Response) =>{
       const dataCnt = await TestSampleDao.count();
       const {type,limit,page } = req.query;
       logger.info(req.query.page);
       logger.info(req.query.limit);
       logger.info(req.query.type);
       const typeVal = type || 'paging';
       const limitVal = parse(limit,20);
       const pageVal = parse(page,1);
       const startAt = limitVal*(pageVal-1);

       if(typeVal.toString().toLowerCase() === 'all'){
          return {
              data: await TestSampleDao.find().select("-salt -password").sort("-bno").sort("-addedAt"),
              type:'All'
          }
       }
       logger.info('lastPage:'+dataCnt);
       let rs:any = {
        type:'paging',
        page:pageVal,
        limit:limitVal,
        descript:'',
        lastPage:Math.ceil(dataCnt/limitVal)
       };



       if(dataCnt<= startAt){
           rs.data = [];
           rs.descript= 'over the last page';
       }
       else if(dataCnt - startAt<=limitVal ){

           rs.data = await TestSampleDao.find().select("-salt -password").sort("-bno").sort("-addedAt").skip(startAt).limit(dataCnt - startAt);
           rs.descript= 'last page';
       }
       else{
           rs.data = await TestSampleDao.find().select("-salt -password").sort("-bno").sort("-addedAt").skip(startAt).limit(limitVal);
           rs.descript= 'normal page';
       }
       return rs;

    }
    ,
    passwordCheck:async(req:Request,res:Response)=>{
        const {bno} = req.params;
        const {password} = req.body;
        const sampleInfo:any = await TestSampleDao.findOne({bno:parseInt(bno)}).select('password');
        if(sampleInfo == null){
            return {success:false , describe:'article is not exist'};
        }
        logger.info(sampleInfo);
        const hashedPwd:string = sampleInfo.password;
        logger.info(hashedPwd);
        logger.info(password);
        const rs = bcrypt.compareSync(password,hashedPwd);
        logger.info(rs);
        return {success:rs};
    }

    ,sampleListCreate: async(req:Request,res:Response) =>{
        const limit = req.body.limit||(Math.floor(Math.random()*100)+200);
        for (let index = 0; index < limit; index++) {
           await new TestSampleDao({writer:`writer${index}`,content:`content${index}`,password:`jmp12#`}).save();
        }
        return res.redirect('../');


     }

}

export default TestSampleService;