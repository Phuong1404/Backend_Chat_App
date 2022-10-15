import { Document } from "mongoose";

export default interface IFriendRequest extends Document {
    sender: string;
    recever: string;
    status: Number;
    status_name: string;
}
