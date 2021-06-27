import mongoose, { Schema,model} from "mongoose";
import autoIncrement from "mongoose-auto-increment"
import dbInfo from "@infos/dbInfo.json"
import bcrypt from 'bcrypt';
const incre_connection = mongoose.createConnection(`${dbInfo.mongoDBUrl}/myHome`);

autoIncrement.initialize(incre_connection);
let currentDate = new Date();
const TestSampleSchema = new Schema({
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
    currentDate = new Date();
    const salt = bcrypt.genSaltSync(10);
    const hashedPwd = bcrypt.hashSync(this.get("password",String),salt );
    this.set("salt",salt);
    this.set("password",hashedPwd);
    this.set('addedAt',currentDate)
    this.set('editedAt',currentDate)
    next();
});
TestSampleSchema.pre('updateOne',function (next) {
    this.set('editedAt',new Date());
    next();
});

TestSampleSchema.plugin(autoIncrement.plugin,{model: 'TestSample',field:'bno',startAt:0,unique:true,incrementBy:1});
export default model('TestSample',TestSampleSchema,'testSample');