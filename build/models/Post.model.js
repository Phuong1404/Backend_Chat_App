"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    content: { type: String },
    time: { type: Date },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User"
    },
    react: [
        {
            user: {
                type: mongoose_1.default.Types.ObjectId,
                ref: "User"
            },
            emoji: { type: String }
        }
    ],
    comments: [{ type: mongoose_1.default.Types.ObjectId, ref: "Comment" }],
    attachment: [{ type: mongoose_1.default.Types.ObjectId, ref: "Attachment" }],
    total_react: { type: Number },
    status: { type: Number },
    status_type: { type: String },
});
exports.default = mongoose_1.default.model("Post", PostSchema);
//# sourceMappingURL=Post.model.js.map