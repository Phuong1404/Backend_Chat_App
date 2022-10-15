import { Document } from "mongoose";
export default interface IAttachment extends Document {
    name: string;
    size: string;
    format_type: string;
    type: Number;
    type_name: string;
    time_upload: Date;
}
