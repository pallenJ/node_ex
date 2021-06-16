import TestSampleDao from "@daos/TestSample.dao";
import { exception } from "console";
import { Request, Response } from 'express';
import logger from './../shared/Logger';
import bcrypt from 'bcrypt';

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
        const {content,password} = req.body;
        const pwInfo:any = await TestSampleDao.findOne({bno:parseInt(bno)}).select("password");
        const hashedPwd:string = pwInfo.password;
        if(bcrypt.compareSync(password,hashedPwd)){
            return await TestSampleDao.updateOne({bno:parseInt(bno)},{content});
        }else{
            return {error:"password is wrong"};
        }
      
        
    },
    list : async(req:Request,res:Response) =>{
       const dataCnt = await TestSampleDao.count();
       const {type,limit,page } = req.query;
       logger.info(req.query.page);
       logger.info(req.query.limit);
       logger.info(req.query.type);
       const typeVal = type || 'paging';
       const limitVal = parse(limit,20);
       const pageVal = parse(page,1);
       const pagingCnt = 10;
       const startAt = limitVal*(pageVal-1);

       if(typeVal.toString().toLowerCase() === 'all'){
          return {
              data: await TestSampleDao.find().select("-salt -password").sort("-bno").sort("-addedAt"),
              type:'All'
          }
       }

       const pageStart = pagingCnt * Math.floor(pageVal/pagingCnt)+1;
       const pageEnd = pagingCnt * (Math.floor(pageVal/pagingCnt)+1);
       let rs:any = {
        type:'paging',
        page:pageVal,
        limit:limitVal,
        descript:'',
        pageStart,
        pageEnd
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
    

    ,sampleListCreate: async(req:Request,res:Response) =>{
        const limit = req.body.limit||(Math.floor(Math.random()*100)+200);
        for (let index = 0; index < limit; index++) {
           await new TestSampleDao({writer:`writer${index}`,content:`content${index}`,password:`jmp12#`}).save();
        }
        return res.redirect('/');
        
        
     }

}

export default TestSampleService;