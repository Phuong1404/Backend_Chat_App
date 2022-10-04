import { Document } from "mongoose";

export default interface IUser extends Document {
    name:string;
    email:string;
    phone:string;
    birthday:Date;
    gender:string;
    avatar?:string;
    password:string;
    contact:[Object];
    channel:[Object];
    page:[Object];
    group:[Object];
    friend_request:[Object];
    status:number;//0.Chờ xác nhận,1.Đã xác nhận,2.Bị Khóa
    status_name:string;
    time_create:Date;
    time_update:Date;
    signup_token:string;
    is_online:boolean;
  }
