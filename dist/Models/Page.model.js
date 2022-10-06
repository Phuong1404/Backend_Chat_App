"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PageSchema = new mongoose_1.Schema({
    name: { type: String },
    avatar: { type: String },
    time_create: { type: Date },
    time_update: { type: Date },
    user_create: { type: String },
    user_update: { type: String },
    num_member_like: { type: Number },
    num_member_follow: { type: Number },
    member_like: [{ type: String }],
    member_follow: [{ type: String }],
    content: [{ type: String }],
    description: { type: String },
    manager: [{
            user_id: { type: String },
            name: { type: String },
            avatar: { type: String },
            role: { type: String }
        }]
});
exports.default = mongoose_1.default.model('Page', PageSchema, 'Page');
//# sourceMappingURL=Page.model.js.map