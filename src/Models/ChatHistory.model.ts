import mongoose, { Schema } from "mongoose";
import IChatHistory from "../Interfaces/ChatHistory.interface";

const ChatHistorySchema: Schema = new Schema({
    user_id: { type: String },
    history: [{
        channel_id: { type: String },
        name: { type: String },
        avatar: { type: String },
        last_message: { type: Date },
        state: { type: String }
    }]
})
export default mongoose.model<IChatHistory>('ChatHistory',ChatHistorySchema,'ChatHistory')
