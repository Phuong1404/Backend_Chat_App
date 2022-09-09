"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    phone: { type: String, require: true },
    birthday: { type: Date },
    gender: { type: String },
    avatar: { type: String },
    password: { type: String },
    contact: [{
            _id: { type: String },
            name: { type: String },
            avatar: { type: String }
        }],
    channel: [{
            _id: { type: String },
            name: { type: String },
            total_user: { type: String },
        }],
    status: { type: Number },
    status_name: { type: String },
    date_create: { type: Date },
    date_update: { type: Date },
    signup_token: { type: String },
    is_online: { type: Boolean }
});
exports.default = mongoose_1.default.model('User', UserSchema, 'users');
//# sourceMappingURL=User.model.js.map