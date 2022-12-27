import { Document } from "mongoose";
export default interface IShortcut extends Document {
    user:string
    shortcut:string
}
