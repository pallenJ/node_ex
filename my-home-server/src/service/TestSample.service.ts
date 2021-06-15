import TestSampleSchema from "@daos/TestSample.dao";
import { Request, Response } from 'express';
import logger from './../shared/Logger';

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
       return await TestSampleSchema.find().select("-slat -password").sort({addedAt:"desc"});
    }
    

}

export default TestSampleService;