import TestSampleDao from "@daos/TestSample.dao";
import { Request, Response } from 'express';
import logger from '@shared/Logger';
import bcrypt from 'bcrypt';
import { Schema } from "mongoose";

const parse = (val: any, init: number, valName = '') => {

    try {
        if (val !== 0 && !val) throw new Error(`${valName} undefined`);
        return parseInt(val + '');
    } catch (error) {
        logger.err(error)
        return init;
    }
}

const getList = async (params: any) => {
    const search = (params.search as string)||'';
    const keyword = (params.keyword as string)||'writer|content';
    let searchParam:Array<any> = [];
    keyword.split('|').forEach(e =>{
        let temp:any = {};
        temp[e] = {$regex:search};
        searchParam.push(temp);
    })
    logger.info('keyword:'+keyword);
    logger.info('search:'+search);
    const pageCnt = 10;
    const limitVal = parse(params.limit, 10 * pageCnt, 'limit');
    const startAt = parse(params.start, 0, 'start');
    const dataCnt = await TestSampleDao.find({$or:searchParam }).count();
    logger.info('start:'+startAt);
    logger.info('limit:'+limitVal);
    let rs: any = {
        type: 'paging',
        limit: limitVal,
        pageCnt: pageCnt,
        lastPage: Math.ceil(dataCnt / limitVal),
        allCount: dataCnt
    };
    if (dataCnt <= startAt) {
        rs.data = [];
    } else {
        rs.data = await TestSampleDao.find({$or:searchParam })
            .select("-salt -password").sort("-bno").sort("-addedAt")
            .skip(startAt).limit(Math.min(limitVal));
    }
    return rs;

}

const TestSampleService = {
    createSample: async (req: Request, res: Response) => {
        const created = new TestSampleDao(req.body);
        const rs = await created.save();
        const list = await getList(req.body);
        return { rs, list };
    },
    editSample: async (req: Request, res: Response) => {
        const { bno } = req.params;
        const { content } = req.body;
        let sampleInfo: any = await TestSampleDao.findOne({ bno: parseInt(bno) }).select("-salt -password -addedAt");
        const historys = sampleInfo.history as Array<Schema>;
        const __v: number = (sampleInfo.__v as number) + 1;
        sampleInfo.history = [];
        const rs = await TestSampleDao.updateOne({ bno: parseInt(bno) }, { content, history: historys.concat([sampleInfo]), __v })
        const list = await getList(req.body);
        return { rs, list };
    },
    removeSample: async (req: Request, res: Response) => {
        const bno = parseInt(req.params.bno);
        const rs = await TestSampleDao.remove({ bno });
        const list = await getList(req.body);
        return { rs, list };
    }
    ,
    list: async (req: Request, res: Response) => {
        return getList(req.query);

    }
    ,
    passwordCheck: async (req: Request, res: Response) => {
        const { bno } = req.params;
        const { password } = req.body;
        const sampleInfo: any = await TestSampleDao.findOne({ bno: parseInt(bno) }).select('password');
        if (sampleInfo == null) {
            return { success: false, describe: 'article is not exist' };
        }
        const hashedPwd: string = sampleInfo.password;
        const rs = bcrypt.compareSync(password, hashedPwd);
        return { success: rs };
    }

    , sampleListCreate: async (req: Request, res: Response) => {
        const limit = req.body.limit || (Math.floor(Math.random() * 100) + 200);
        for (let index = 0; index < limit; index++) {
            await new TestSampleDao({ writer: `writer${index}`, content: `content${index}`, password: `jmp12#` }).save();
        }
        return res.redirect('../');


    }

}

export default TestSampleService;