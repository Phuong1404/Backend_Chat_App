import { Document } from "mongoose";
export default interface IGroup extends Document {
    name: string;
    avatar?: string;
    time_create: Date;
    time_update: Date;
    user_create: string;
    user_update: string;
    num_member: number;
    member: [string];
    manager: [Object];
    content: [string];
    description: string;
    type: string;
    visible: string;//hiển thị với tất cả 
}
