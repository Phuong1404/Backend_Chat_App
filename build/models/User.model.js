"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true, maxlength: 25 },
    email: { type: String, require: true, unique: true },
    phone: { type: String, require: true, unique: true, maxlength: 12 },
    birthday: { type: Date, min: '1900-01-01', max: '2200-12-31' },
    gender: { type: String, required: true },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/abc123124/image/upload/v1644652997/test/avatar_uom8nm.png"
    },
    address: { type: String, maxlength: 300 },
    job: { type: String },
    password: { type: String },
    friend: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: "User",
        }],
    channel: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: "Channel"
        }],
    page: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: "Page"
        }],
    group: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: "Group"
        }],
    friend_request: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: "FriendRequest"
        }],
    status: { type: Number },
    status_name: { type: String },
    time_create: { type: Date },
    time_update: { type: Date }
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("User", UserSchema);
//# sourceMappingURL=User.model.js.map