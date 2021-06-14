import dateFormat from "dateformat";
import mongoose, { Schema } from "mongoose";
import autoIncrement from "mongoose-auto-increment"
import dbInfo from "../../../dbInfo.json"

const connection = mongoose.createConnection(`${dbInfo.mongoDBUrl}/example`);
autoIncrement.initialize(connection);
const currentDate = new Date();
const aaa = new Text('aaa');

const articleSchema = new Schema({
    writer:String,
    content:String,
    addedAt:{type:Date,default:currentDate},
    editedAt:{type:Date,default:currentDate},
    password:String
});

export default articleSchema;