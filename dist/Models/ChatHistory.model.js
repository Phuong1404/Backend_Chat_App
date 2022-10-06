"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChatHistorySchema = new mongoose_1.Schema({
    user_id: { type: String },
    history: [{
            channel_id: { type: String },
            name: { type: String },
            avatar: { type: String },
            last_message: { type: Date },
            state: { type: String }
        }]
});
exports.default = mongoose_1.default.model('ChatHistory', ChatHistorySchema, 'ChatHistory');
//# sourceMappingURL=ChatHistory.model.js.map