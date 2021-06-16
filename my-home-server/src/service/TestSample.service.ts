import TestSampleSchema from "@daos/TestSample.dao";
import { exception } from "console";
import { Request, Response } from 'express';
import logger from './../shared/Logger';

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
        const created = new TestSampleSchema(req.body);
        logger.info(JSON.stringify(created.schema));

        await created.save((err, data) => {
            // 에러면 false 반환
            if (err) return { suceess: false, err };
            // 성공적이면 200 상태 코드 날리고 true 값 돌려주기
            return { suceess: true ,data};
          });
        
    },
    list : async(req:Request,res:Response) =>{
       const dataCnt = await TestSampleSchema.count();
       //  await TestSampleSchema.find().select("-salt -password").sort("-bno").sort("-addedAt")
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
              data: await TestSampleSchema.find().select("-salt -password").sort("-bno").sort("-addedAt"),
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

           rs.data = await TestSampleSchema.find().select("-salt -password").sort("-bno").sort("-addedAt").skip(startAt).limit(dataCnt - startAt);
           rs.descript= 'last page';
       }
       else{
           rs.data = await TestSampleSchema.find().select("-salt -password").sort("-bno").sort("-addedAt").skip(startAt).limit(limitVal);
           rs.descript= 'normal page';
       }
       return rs;
       
    }
    

    ,sampleListCreate: async(req:Request,res:Response) =>{
        const limit = req.body.limit||(Math.floor(Math.random()*100)+200);
        for (let index = 0; index < limit; index++) {
           await new TestSampleSchema({writer:`writer${index}`,content:`content${index}`,password:`jmp12#`}).save();
        }
        return res.redirect('/');
        
        
     }

}

export default TestSampleService;