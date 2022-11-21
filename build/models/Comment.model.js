"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    content: { type: String },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User"
    },
    tag: Object,
    status: { type: Number },
    status_type: { type: String },
    react: [
        {
            user: {
                type: mongoose_1.default.Types.ObjectId,
                ref: "User"
            },
            emoji: { type: String }
        }
    ],
    attachment: [{ type: mongoose_1.default.Types.ObjectId, ref: "Attachment" }],
    post_id: { type: mongoose_1.default.Types.ObjectId, ref: "Post" },
    parent_comment: { type: mongoose_1.default.Types.ObjectId, ref: "Comment" },
});
exports.default = mongoose_1.default.model("Comment", CommentSchema);
//# sourceMappingURL=Comment.model.js.map