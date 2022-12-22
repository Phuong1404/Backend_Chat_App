import mongoose, { Schema } from "mongoose";
import IPost from "../interfaces/Post.interface";

const PostSchema: Schema = new Schema(
    {
        content: { type: String },
        time: { type: Date },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        // react: [
        //     {
        //         user: {
        //             type: mongoose.Types.ObjectId,
        //             ref: "User"
        //         },
        //         emoji: { type: String }
        //     }
        // ],
        react: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User"
            }

        ],
        comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
        attachment: [{ type: mongoose.Types.ObjectId, ref: "Attachment" }],
        total_react: { type: Number },
        status: { type: Number },
        status_type: { type: String },

    }
    ,
    {
        timestamps: true,
    }
)
export default mongoose.model<IPost>("Post", PostSchema)
