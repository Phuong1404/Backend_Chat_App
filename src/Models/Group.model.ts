import mongoose, { Schema } from "mongoose";
import IGroup from "../Interfaces/Group.interface";

const GroupSchema: Schema = new Schema({
    name: { type: String },
    avatar: { type: String },
    time_create: { type: Date },
    time_update: { type: Date },
    user_create: { type: String },
    user_update: { type: String },
    num_member: { type: Number },
    member: [{ type: String }],
    manager: [{
        user_id: { type: String },
        name: { type: String },
        avatar: { type: String },
        rule: { type: String }
    }],
    content: [{ type: String }],
    description: { type: String },
    type: { type: String },
    visible: { type: String }
})
export default mongoose.model<IGroup>('Group', GroupSchema, 'Group')
