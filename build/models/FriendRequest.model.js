"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FriendRequestSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User"
    },
    recever: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User"
    },
    status: { type: Number },
    status_name: { type: String },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("FriendRequest", FriendRequestSchema);
//# sourceMappingURL=FriendRequest.model.js.map