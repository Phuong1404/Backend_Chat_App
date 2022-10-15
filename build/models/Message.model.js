"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    content: { type: String },
    time: { type: Date },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User"
    },
    status: { type: Number },
    status_name: { type: String },
    time_create: { type: Date },
    time_update: { type: Date },
    react: [
        {
            user: {
                type: mongoose_1.default.Types.ObjectId,
                ref: "User"
            },
            emoji: { type: String }
        }
    ],
    reply: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Message"
    },
    invisible_to: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: "User"
        }],
    attachment: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: "Attachment"
        }],
    channel: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Channel"
    }
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Message", MessageSchema);
//# sourceMappingURL=Message.model.js.map