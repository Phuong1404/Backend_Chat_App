import mongoose, { Schema } from "mongoose";
import INotify from "../interfaces/Notification.interface";

const NotifySchema: Schema = new Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        receiver: [mongoose.Types.ObjectId],
        url: String,
        text: String,
        content: String,
        image: String,
        isRead: { type: Boolean, default: false },
    },
    {
        timestamps: true
    }
)
export default mongoose.model<INotify>("Notify", NotifySchema)
