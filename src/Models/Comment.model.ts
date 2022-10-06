import mongoose, { Schema } from "mongoose";
import IComment from "../Interfaces/Comment.interface";

const CommentSchema: Schema = new Schema({
    content: { type: String },
    time: { type: Date },
    user: {
        _id: { type: String },
        name: { type: String },
        avatar: { type: String }
    },
    status: { type: Number },
    status_name: { type: String },
    time_create: { type: Date },
    time_update: { type: Date },
    attachment: [{
        _id: { type: String },
        type: { type: Number },//0.ảnh,1.video,2.link,3.orther
        file: { type: String }
    }],
    react: [{
        user_id: { type: String },
        emoji: { type: Number },
    }],
    post_id: { type: String },
    parent_comment: { type: String }
})
export default mongoose.model<IComment>('Comment', CommentSchema, 'Comment')
