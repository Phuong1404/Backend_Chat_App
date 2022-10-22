"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AttachmentSchema = new mongoose_1.Schema({
    name: { type: String },
    size: { type: String },
    format_type: { type: String },
    type: { type: Number },
    type_name: { type: String },
    link: { type: String },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User"
    },
    res_model: { type: String },
    res_id: { type: String }
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Attachment", AttachmentSchema);
//# sourceMappingURL=Attachment.model.js.map