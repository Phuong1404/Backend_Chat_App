import mongoose, { Schema } from "mongoose";
import IFriendRequest from "../Interfaces/FriendRequest.interface";

const FriendRequestSchema:Schema=new Schema({
    from:[{
        user_id:{type:String},
        avatar:{type:String}
    }],
    to:[{
        user_id:{type:String},
        avatar:{type:String}
    }],
    time:{type:Date},
    status:{type:Number},
    status_name:{type:String},
    time_create:{type:Date},
    time_update:{type:Date}
})

export default mongoose.model<IFriendRequest>('FriendRequest',FriendRequestSchema,'FriendRequests')
