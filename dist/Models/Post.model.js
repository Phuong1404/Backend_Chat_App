"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    content: { type: String },
    time: { type: Date },
    user: {
        _id: { type: String },
        name: { type: String },
        avatar: { type: String },
        time_create: { type: Date },
        time_update: { type: Date },
        react: [{
                user_id: { type: String },
                emoji: { type: Number },
            }],
        total_react: { type: Number },
        attachment: [{
                _id: { type: String },
                type: { type: Number },
                file: { type: String }
            }],
        status: { type: Number },
        status_name: { type: String },
        page_id: { type: String },
        group_id: { type: String }
    },
});
exports.default = mongoose_1.default.model('Post', PostSchema, 'Post');
//# sourceMappingURL=Post.model.js.map