import mongoose, { Schema } from "mongoose";
import IAttachment from '../interfaces/Attachment.interface'

const AttachmentSchema: Schema = new Schema(
    {
        name: { type: String },
        size: { type: String },
        format_type: { type: String },
        type: { type: Number },
        type_name: { type: String },
        time_upload: { type: Date }
    },
    {
        timestamps: true,
    }
)
module.exports = mongoose.model<IAttachment>("Attachment", AttachmentSchema)
