"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const GroupSchema = new mongoose_1.Schema({
    name: { type: String },
    avatar: { type: String },
    time_create: { type: Date },
    time_update: { type: Date },
    user_create: { type: String },
    user_update: { type: String },
    num_member: { type: Number },
    member: [{ type: String }],
    manager: [{
            user_id: { type: String },
            name: { type: String },
            avatar: { type: String },
            rule: { type: String }
        }],
    content: [{ type: String }],
    description: { type: String },
    type: { type: String },
    visible: { type: String }
});
exports.default = mongoose_1.default.model('Group', GroupSchema, 'Group');
//# sourceMappingURL=Group.model.js.map