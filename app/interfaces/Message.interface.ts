import { Document } from "mongoose";
export default interface IMessage extends Document {
    content:string;
    time:Date;
    user:Object;//từ người dùng đến channel
    status:number;//0.Chưa gửi,1.Đã gửi,2.Đã gõ bỏ với người dùng,3.Đã gỡ bỏ,
    status_name:string;
    time_create:Date;
    time_update:Date;
    invisible_to:[string];//hiển thị với người dùng
    react:[Object];
    foward:string;//trả lời với tin nhắn
    attachment:[Object];//tệp đính kèm
    channel_id:string;//kênh chat
    unread:[Object]
}
