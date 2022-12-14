import mongoose, { Schema } from "mongoose";
import IChannel from "../interfaces/Channel.interface"

const ChannelSchema: Schema = new Schema(
    {
        name: { type: String },
        avatar: { type: String },
        time_create: { type: Date },
        time_update: { type: Date },
        user_create: { type: String },
        user_update: { type: String },
        num_member: { type: Number },
        user: [{
            type: mongoose.Types.ObjectId,
            ref: "User"
        }],
        attachment: [{
            type: mongoose.Types.ObjectId,
            ref: "Attachment"
        }]
    },
    {
        timestamps: true,
    }
)
export default  mongoose.model<IChannel>("Channel", ChannelSchema)
