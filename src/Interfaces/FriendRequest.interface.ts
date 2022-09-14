import { Document } from "mongoose";
export default interface IFriendRequest extends Document {
    from:[Object];
    to:[Object];
    time:Date;
    status:number;//0.chưa xác nhận,1.đã xác nhận,2.hủy
    status_name:string;
    time_create:Date;
    time_update:Date;
}
