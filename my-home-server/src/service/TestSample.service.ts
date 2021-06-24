import TestSampleDao from "@daos/TestSample.dao";
import { exception } from "console";
import { Request, Response } from 'express';
import logger from '@shared/Logger';
import bcrypt from 'bcrypt';
import { Schema } from "mongoose";

const parse = (val:any,init:number,valName = '')=>{

    try {
        if(val!==0 && !val)throw new Error(`${valName} undefined`);
        return parseInt(val+'');
    } catch (error) {
        logger.err(error)
         return init;
    }
}

const getList = async({limit,start}:any)=>{
       const dataCnt = await TestSampleDao.count();
       const pageCnt = 10;
       const limitVal = parse(limit,10*pageCnt,'limit');
       const startAt = parse(start,0,'start');
       let rs:any = {
        type:'paging',
        limit:limitVal,
        pageCnt:pageCnt,
        lastPage:Math.ceil(dataCnt/limitVal),
        allCount:dataCnt
       };
       if(dataCnt<=startAt){
           rs.data = [];
       }else{
           rs.data = await TestSampleDao.find()
           .select("-salt -password").sort("-bno").sort("-addedAt")
           .skip(startAt).limit(Math.min(limitVal) );
       }
       return rs;

}

const TestSampleService ={
    createSample: async(req:Request,res:Response)=>{
        const created = new TestSampleDao(req.body);
        logger.info(JSON.stringify(created.schema));
        const rs = await created.save();
        const list = await getList(req.body);
        return {rs,list};
    },
    editSample: async(req:Request,res:Response) =>{
        const {bno} = req.params;
        const {content} = req.body;
        let sampleInfo:any = await TestSampleDao.findOne({bno:parseInt(bno)}).select("-salt -password -addedAt");
        const historys = sampleInfo.history as Array<Schema>;
        const __v :number = (sampleInfo.__v as number) + 1;
        sampleInfo.history = [];
        const rs = await TestSampleDao.updateOne({bno:parseInt(bno)},{content, history: historys.concat([sampleInfo]),__v})
        const list = await getList(req.body);
        return {rs,list};
    },
    removeSample: async(req:Request,res:Response) =>{
        const bno = parseInt(req.params.bno);
        const rs = await TestSampleDao.remove({bno});
        logger.info(req.body.start);
        logger.info(req.body.limit);
        const list = await getList(req.body);
        return {rs,list};
    }
    ,
    list : async(req:Request,res:Response) =>{
       return getList(req.query);

    }
    ,
    passwordCheck:async(req:Request,res:Response)=>{
        const {bno} = req.params;
        const {password} = req.body;
        logger.info(bno+'/'+password)
        const sampleInfo:any = await TestSampleDao.findOne({bno:parseInt(bno)}).select('password');
        if(sampleInfo == null){
            return {success:false , describe:'article is not exist'};
        }
        const hashedPwd:string = sampleInfo.password;
        const rs = bcrypt.compareSync(password,hashedPwd);
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