import logger from "@shared/Logger";
import mongoose, { Schema,model } from "mongoose";
import autoIncrement from "mongoose-auto-increment"
import dbInfo from "../../dbInfo.json"

//const connection = mongoose.createConnection(`${dbInfo.mongoDBUrl}/testSample`);
//autoIncrement.initialize(connection);
const currentDate = new Date();
logger.info('aaa')
const TestSampleSchema = new Schema({
    writer:{type:String,required:true},
    content:{type:String, required:true},
    addedAt:{type:Date,default:currentDate},
    editedAt:{type:Date,default:currentDate},
    password:{type: String,required:true},
    salt:{type:String,default:20}
});
logger.info('aaaaaa')
// TestSampleSchema.plugin(autoIncrement.plugin,'TestSampleSchema');
export default model<Schema>('TestSampleSchema',TestSampleSchema);