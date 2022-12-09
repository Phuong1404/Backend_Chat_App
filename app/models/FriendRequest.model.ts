import mongoose, { Schema } from "mongoose";
import IFriendRequest from "../interfaces/FriendRequest.interface";

const FriendRequestSchema = new Schema(
    {
        sender: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        recever: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        status: { type: Number },
        status_name: { type: String },
        user: [{
            type: mongoose.Types.ObjectId,
            ref: "User"
        }]
    },
    {
        timestamps: true,
    }
)
export default mongoose.model<IFriendRequest>("FriendRequest", FriendRequestSchema)
