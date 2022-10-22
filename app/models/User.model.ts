import mongoose, { Schema } from "mongoose";
import IUser from "../interfaces/User.interface";

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true, maxlength: 25 },
        email: { type: String, require: true, unique: true },
        phone: { type: String, require: true, unique: true, maxlength: 12 },
        birthday: { type: Date, min: '1900-01-01', max: '2200-12-31' },
        gender: { type: String, required: true },
        avatar: {
            type: mongoose.Types.ObjectId,
            ref: "Attachment"
        },
        address: { type: String, maxlength: 300 },
        job: { type: String },
        password: { type: String },
        friend: [{
            type: mongoose.Types.ObjectId,
            ref: "User",
        }],
        channel: [{
            type: mongoose.Types.ObjectId,
            ref: "Channel"
        }],
        page: [{
            type: mongoose.Types.ObjectId,
            ref: "Page"
        }],
        group: [{
            type: mongoose.Types.ObjectId,
            ref: "Group"
        }],
        friend_request: [{
            type: mongoose.Types.ObjectId,
            ref: "FriendRequest"
        }],
        status: { type: Number },
        status_name: { type: String },
        time_create: { type: Date },
        time_update: { type: Date }
    },
    {
        timestamps: true,
    }
)
export default mongoose.model<IUser>("User", UserSchema)
