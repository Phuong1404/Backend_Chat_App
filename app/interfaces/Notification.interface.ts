import { Document } from "mongoose";
export default interface INotify extends Document {
    user:Object;
    receiver:[string];
    url: string;
    text: string;
    content: string,
    image: string,
    isRead:Boolean
}
