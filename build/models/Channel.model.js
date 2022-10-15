"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChannelSchema = new mongoose_1.Schema({
    name: { type: String },
    avatar: { type: String },
    time_create: { type: Date },
    time_update: { type: Date },
    user_create: { type: String },
    user_update: { type: String },
    num_member: { type: Number },
    user: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: "User"
        }],
    attachment: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: "Attachment"
        }]
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Channel", ChannelSchema);
//# sourceMappingURL=Channel.model.js.map