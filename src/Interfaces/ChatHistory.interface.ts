import { Document } from "mongoose";
export default interface IChatHistory extends Document {
    user_id: string;
    history: [Object];
}
