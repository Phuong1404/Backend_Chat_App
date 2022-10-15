import { Document } from "mongoose";
export default interface IPage extends Document {
    name: string;
    avatar?: string;
    time_create: Date;
    time_update: Date;
    user_create: string;
    user_update: string;
    num_member_like: number;
    num_member_follow: number;
    member_like: [string];
    member_follow: [string];
    manager: [Object];
    content: [string];
    description:string;
}
