import mongoose, { Schema } from "mongoose";
import IComment from "../interfaces/Comment.interface";

const CommentSchema: Schema = new Schema(
    {
        content: { type: String },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        tag:Object,
        status: { type: Number },
        status_type: { type: String },
        react: [
            {
                user: {
                    type: mongoose.Types.ObjectId,
                    ref: "User"
                },
                emoji: { type: String }
            }
        ],
        attachment: [{ type: mongoose.Types.ObjectId, ref: "Attachment" }],
        post_id: { type: mongoose.Types.ObjectId, ref: "Post" },
        parent_comment: { type: mongoose.Types.ObjectId, ref: "Comment" },
    }
)
export default mongoose.model<IComment>("Comment", CommentSchema)
