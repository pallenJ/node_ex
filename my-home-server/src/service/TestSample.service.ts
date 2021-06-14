import TestSampleSchema from "@daos/TestSample.dao";
import { Request, Response } from 'express';
import  bcrypt  from 'bcryptjs';
import logger from './../shared/Logger';

const TestSampleService ={
    createSample: async(req:Request,res:Response)=>{
        const {writer,content,password} = req.body;
        const salt = Math.floor(Math.random()*20+20);//await bcrypt.genSalt(Math.floor(Math.random()*20+20));
        logger.info(salt);
        const hashedPwd = await bcrypt.hash(password,salt);
        const created = new TestSampleSchema({
            writer,
            content,
            password:hashedPwd,
            salt
        });
        const saved = await created.save((err, userInfo) => {
            // 에러면 false 반환
            if (err) return res.json({ suceess: false, err });
            // 성공적이면 200 상태 코드 날리고 true 값 돌려주기
            return res.status(200).json({ suceess: true });
          });
        logger.info(saved)
        return saved;

    }
}

export default TestSampleService;