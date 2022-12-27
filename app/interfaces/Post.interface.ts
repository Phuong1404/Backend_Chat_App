import { Document } from "mongoose";
export default interface IPost extends Document {
    content: string;
    time: Date;
    user: Object;
    time_create: Date;
    time_update: Date;
    react: [Object];
    comments: [Object]
    attachment: [Object];
    total_react: Number;
    status: Number;
    status_type: string;
    page_id: string;
    group_id: string;
    isnotify: Boolean;
    ispublic: Boolean;
    share: [Object];
    url: string;
    post_share:[Object]
}
