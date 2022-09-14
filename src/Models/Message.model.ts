import mongoose, { Schema } from "mongoose";
import IMessage from "../Interfaces/Message.interface";

const MessageSchema: Schema = new Schema({
    content: { type: String },
    time: { type: Date },
    user: [{
        _id: { type: String },
        name: { type: String },
        avatar: { type: String }
    }],
    channel: [{
        _id: { type: String },
        name: { type: String },
        avatar: { type: String },
    }],
    attachment:[{
        _id:{type:String},
        type:{type:Number},//0.ảnh,1.video,2.link,3.orther
        file:{type:String}
    }],
    react:[{
        user_id:{type:String},
        emoji:{type:Number},
    }],
    visible_to:[{type:String}],
    foward:{type:String},
    status:{type:Number},
    status_name:{type:String},
    time_create:{type:Date},
    time_update:{type:Date},
})
export default mongoose.model<IMessage>('Message',MessageSchema,'Messages')
