import mongoose, { Schema } from "mongoose";
import autoIncrement from "mongoose-auto-increment"
import dbInfo from "../../dbInfo.json"

const connection = mongoose.createConnection(`${dbInfo.mongoDBUrl}/testSample?retryWrites=true&w=majority`);
autoIncrement.initialize(connection);
const currentDate = new Date();

const TestSampleSchema = new Schema({
    writer:{type:String,required:true},
    content:{type:String, required:true},
    addedAt:{type:Date,default:currentDate},
    editedAt:{type:Date,default:currentDate},
    password:{type: String,required:true},
    salt:{type:String,default:20}
});
TestSampleSchema.plugin(autoIncrement.plugin,'TestSampleSchema');
export default mongoose.model('TestSampleSchema',TestSampleSchema);