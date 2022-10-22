import { Document } from "mongoose";
export default interface IAttachment extends Document {
    name: string;
    size: string;
    format_type: string;
    type: Number;
    type_name: string;
    link: string;
    user: string;
    res_model: string;
    res_id: string;
}
