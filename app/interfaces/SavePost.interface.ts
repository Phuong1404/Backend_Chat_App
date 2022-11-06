import { Document } from "mongoose";
export default interface ISavePost extends Document {
    user: Object,
    post: Object,
    time: Date,
    status: Number,
    status_type: string,
    type: string,
}
