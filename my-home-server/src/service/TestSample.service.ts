import TestSampleSchema from "@daos/TestSample.dao";
import { Request, Response } from 'express';
import logger from './../shared/Logger';
import crypto, { createCipheriv, KeyObject, randomUUID, scryptSync } from 'crypto';

const TestSampleService ={
    createSample: async(req:Request,res:Response)=>{
        const {writer,content,password} = req.body;
        const salt = crypto.randomBytes(12);
        /* const iv = crypto.randomBytes(12);
        const key = scryptSync(password,salt,16);
        const cipher = crypto.createCipheriv('aes-128-gcm',salt,iv);
        const hashedPwd = cipher; */

        logger.info('=====================');

        const created = new TestSampleSchema({
            writer,
            content,
            password,
            salt
        });
        logger.info(created);

        await created.save((err, userInfo) => {
            // 에러면 false 반환
            if (err) return res.json({ suceess: false, err });
            // 성공적이면 200 상태 코드 날리고 true 값 돌려주기
            return res.status(200).json({ suceess: true });
          });
        return created.schema;

    }
}

export default TestSampleService;