"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    content: { type: String },
    time: { type: Date },
    user: {
        _id: { type: String },
        name: { type: String },
        avatar: { type: String }
    },
    status: { type: Number },
    status_name: { type: String },
    time_create: { type: Date },
    time_update: { type: Date },
    attachment: [{
            _id: { type: String },
            type: { type: Number },
            file: { type: String }
        }],
    react: [{
            user_id: { type: String },
            emoji: { type: Number },
        }],
    post_id: { type: String },
    parent_comment: { type: String }
});
exports.default = mongoose_1.default.model('Comment', CommentSchema, 'Comment');
//# sourceMappingURL=Comment.model.js.map