import mongoose, { Schema } from "mongoose";
import IMessage from "../interfaces/Message.interface";

const MessageSchema: Schema = new Schema(
    {
        content: { type: String },
        time: { type: Date },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        status: { type: Number },
        status_name: { type: String },
        time_create: { type: Date },
        time_update: { type: Date },
        react: [
            {
                user: {
                    type: mongoose.Types.ObjectId,
                    ref: "User"
                },
                emoji: { type: String }
            }
        ],
        reply: {
            type: mongoose.Types.ObjectId,
            ref: "Message"
        },
        invisible_to: [{
            type: mongoose.Types.ObjectId,
            ref: "User"
        }],
        attachment: [{
            type: mongoose.Types.ObjectId,
            ref: "Attachment"
        }],
        channel: {
            type: mongoose.Types.ObjectId,
            ref: "Channel"
        }
    },
    {
        timestamps: true,
    }
)
export default mongoose.model<IMessage>("Message", MessageSchema)
