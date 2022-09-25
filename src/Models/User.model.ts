import mongoose, { Schema } from "mongoose";
import IUser from "../Interfaces/User.interface";

const UserSchema:Schema=new Schema({
    name:{type:String,require:true},
    email:{type:String,require:true},
    phone:{type:String,require:true},
    birthday:{type:Date},
    gender:{type:String},
    avatar:{type:String},
    password:{type:String},
    contact:[{
      _id:{type:String},
      name:{type:String},
      avatar:{type:String}
    }],
    channel:[{
      _id:{type:String},
      name:{type:String},
      avatar:{type:String},
    }],
    friend_request:[{
      from:{type:String},
      to:{type:String},
      time:{type:Date},
      status:{type:Number},
      status_name:{type:String},
      type:{type:Number},//0 receive, 1 send
      type_name:{type:String}
    }],
    status:{type:Number},//0.Chờ xác nhận,1.Đã xác nhận,2.Bị Khóa
    status_name:{type:String},
    time_create:{type:Date},
    time_update:{type:Date},
    signup_token:{type:String},
    is_online:{type:Boolean}
})
export default mongoose.model<IUser>('User',UserSchema,'users')
