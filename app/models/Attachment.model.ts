import mongoose, { Schema } from "mongoose";
import IAttachment from '../interfaces/Attachment.interface'

const AttachmentSchema: Schema = new Schema(
    {
        name: { type: String },
        size: { type: String },
        format_type: { type: String },
        type: { type: Number },
        type_name: { type: String },
        link: { type: String },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        res_model: { type: String },
        res_id: { type: String }
    },
    {
        timestamps: true,
    }
)
export default mongoose.model<IAttachment>("Attachment", AttachmentSchema)
