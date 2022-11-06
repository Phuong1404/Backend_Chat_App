"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SavePostSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User"
    },
    post: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Post"
    },
    time: { type: Date },
    status: { type: Number },
    status_type: { type: String },
    type: { type: String },
});
exports.default = mongoose_1.default.model("Savepost", SavePostSchema);
//# sourceMappingURL=SavePost.model.js.map