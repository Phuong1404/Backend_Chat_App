import { Document } from "mongoose";
export default interface IPost extends Document {
    content:string;
    time:Date;
    user:Object;
    time_create:Date;
    time_update:Date;
    react:[Object];
    comment:[Object];
    attachment:[Object];
    total_react:Number;
    total_comment:Number;
    status:Number;
    status_type:string;
    page:Object;
    group:Object;
}
