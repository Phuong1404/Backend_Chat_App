"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AttachmentSchema = new mongoose_1.Schema({
    name: { type: String },
    size: { type: String },
    format_type: { type: String },
    type: { type: Number },
    type_name: { type: String },
    time_upload: { type: Date }
}, {
    timestamps: true,
});
module.exports = mongoose_1.default.model("Attachment", AttachmentSchema);
//# sourceMappingURL=Attachment.model.js.map