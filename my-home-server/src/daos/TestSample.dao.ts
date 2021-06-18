import logger from "@shared/Logger";
import { json } from "express";
import mongoose, { Schema,model, Types } from "mongoose";
import autoIncrement from "mongoose-auto-increment"
import path from "path/posix";
import dbInfo from "@infos/dbInfo.json"
import bcrypt from 'bcrypt';
const incre_connection = mongoose.createConnection(`${dbInfo.mongoDBUrl}/myHome`);

autoIncrement.initialize(incre_connection);

const currentDate = new Date();
let TestSampleSchema = new Schema({
    bno:{type:Number , defult:0},
    writer:{type:String,required:true},
    content:{type:String, required:true},
    addedAt:{type:Date,default:currentDate},
    editedAt:{type:Date,default:currentDate},
    password:{type: String,required:true},
    salt:{type:String},
    history:{type:Array,default:[]}
});
TestSampleSchema.pre('save',function(next){
    const salt = bcrypt.genSaltSync(10);
    const hashedPwd = bcrypt.hashSync(this.get("password",String),salt );
    this.set("salt",salt);
    this.set("password",hashedPwd);
    next();
});
TestSampleSchema.pre('updateOne',function (next) {

    this.set('editedAt',new Date());
    next();
});

TestSampleSchema.plugin(autoIncrement.plugin,{model: 'TestSample',field:'bno',startAt:0,unique:true,incrementBy:1});
logger.info('=========TestSample=========');
export default model('TestSample',TestSampleSchema,'testSample');