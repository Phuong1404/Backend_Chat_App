import mongoose, { Schema } from "mongoose";
import IShortcut from "../interfaces/shortcut.interface";

const ShortcutSchema: Schema = new Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        shortcut: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model<IShortcut>("Shortcut", ShortcutSchema)
