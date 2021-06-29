import { Schema,model,PassportLocalSchema} from "mongoose";
import bcrypt from 'bcrypt';
import passportLocalMongoose from 'passport-local-mongoose'

const UserSchema = new Schema({
    email:{type:String,required:true,unique:true,index:true},
    nickname:{type:String,required:true,unique:true},
    joinAt:{type:Date,default:new Date()},
    password:{type: String,required:true},
    salt:{type:String}
}); 

UserSchema.pre('save',function (next) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPwd = bcrypt.hashSync(this.get("password",String),salt );
    this.set("salt",salt);
    this.set("password",hashedPwd);
    this.set('joinAt',new Date());

    next();
});

UserSchema.plugin(passportLocalMongoose,{usernameField:'nickname',populateFields:'nickname' /* passwordValidator: (password:string,cb:Function)=>{
    
} */});

export default model('User',UserSchema as PassportLocalSchema,'User');