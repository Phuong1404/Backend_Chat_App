"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
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
    attachment: [{
            _id: { type: String },
            type: { type: Number },
            file: { type: String }
        }],
    react: [{
            user_id: { type: String },
            emoji: { type: Number },
        }],
    visible_to: [{ type: String }],
    foward: { type: String },
    status: { type: Number },
    status_name: { type: String },
    time_create: { type: Date },
    time_update: { type: Date },
});
exports.default = mongoose_1.default.model('Message', MessageSchema, 'Messages');
//# sourceMappingURL=Message.model.js.map