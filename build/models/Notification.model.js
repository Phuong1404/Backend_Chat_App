"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NotifySchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User"
    },
    receiver: [mongoose_1.default.Types.ObjectId],
    url: String,
    text: String,
    content: String,
    image: String,
    isRead: { type: Boolean, default: false },
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model("Notify", NotifySchema);
//# sourceMappingURL=Notification.model.js.map