import { Document } from "mongoose";
export default interface IChannel extends Document {
    name: string;
    avatar?: string;
    time_create: Date;
    time_update: Date;
    user_create: string;
    user_update: string;
    num_member: number;
    nickname: [Object];
    show_from: [Object];
    attachment: [Object];
    alarm: [Object];
    role: [Object];
}
