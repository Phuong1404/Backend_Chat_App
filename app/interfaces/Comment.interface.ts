import { Document } from "mongoose";
export default interface IComment extends Document {
    content: string;
    time: Date;
    user: Object;
    status: number;
    status_name: string;
    time_create: Date;
    time_update: Date;
    react: [Object];
    attachment: [Object];
    post_id: Object;
    parent_comment: Object;
}
