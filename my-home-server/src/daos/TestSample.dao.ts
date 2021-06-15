import logger from "@shared/Logger";
import { json } from "express";
import mongoose, { Schema,model, Types } from "mongoose";
import autoIncrement from "mongoose-auto-increment"
import path from "path/posix";
import dbInfo from "../../dbInfo.json"
import bcrypt from 'bcrypt';
const incre_connection = mongoose.createConnection(`${dbInfo.mongoDBUrl}/myHome`);

autoIncrement.initialize(incre_connection);
const currentDate = new Date();
logger.info('aaa');
let TestSampleSchema = new Schema({
    writer:{type:String,required:true},
    content:{type:String, required:true},
    addedAt:{type:Date,default:currentDate},
    editedAt:{type:Date,default:currentDate},
    password:{type: String,required:true},
    salt:{type:String},
    // test:{type:Types.Map,default:new Types.Map() }
});
TestSampleSchema.pre('save',function(next){
    const salt = bcrypt.genSaltSync(10);
    const hashedPwd = bcrypt.hashSync(this.get("password",String),salt );
    this.set("salt",salt);
    this.set("password",hashedPwd);
    next();
});


//TestSampleSchema.plugin(bcrypt,{fields:['password'],round:10});
logger.info('aaaaaa');
export default model('TestSampleSchema',TestSampleSchema,'testSample');