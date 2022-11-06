import mongoose, { Schema } from "mongoose";
import ISavePost from "../interfaces/SavePost.interface";

const SavePostSchema: Schema = new Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        post: {
            type: mongoose.Types.ObjectId,
            ref: "Post"
        },
        time: { type: Date },
        status: { type: Number },
        status_type: { type: String },
        type: { type: String },
    }
)
export default mongoose.model<ISavePost>("Savepost", SavePostSchema)
