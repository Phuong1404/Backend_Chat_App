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
    status:number;//0.Chờ xác nhận,1.Đã xác nhận,2.Bị Khóa
    status_name:string;
    date_create:Date;
    date_update:Date;
    signup_token:string;
    is_online:boolean;
  }
