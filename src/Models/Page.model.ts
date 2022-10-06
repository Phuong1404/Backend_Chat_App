import mongoose, { Schema } from "mongoose";
import IPage from "../Interfaces/Page.interface";

const PageSchema: Schema = new Schema({
    name: { type: String },
    avatar: { type: String },
    time_create: { type: Date },
    time_update: { type: Date },
    user_create: { type: String },
    user_update: { type: String },
    num_member_like: { type: Number },
    num_member_follow: { type: Number },
    member_like: [{ type: String }],
    member_follow: [{ type: String }],
    content: [{ type: String }],
    description: { type: String },
    manager: [{
        user_id: { type: String },
        name: { type: String },
        avatar: { type: String },
        role: { type: String }
    }]
})
export default mongoose.model<IPage>('Page', PageSchema, 'Page')
