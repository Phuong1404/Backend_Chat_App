"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChannelSchema = new mongoose_1.Schema({
    name: { type: String },
    avatar: { type: String },
    time_create: { type: Date },
    time_update: { type: Date },
    user_create: { type: String },
    user_update: { type: String },
    num_member: { type: Number },
    nickname: [{
            _id: { type: String },
            name: { type: String },
            nickname: { type: String },
            avatar: { type: String },
        }],
    show_from: [{
            user_id: { type: String },
            from_time: { type: Date }
        }],
    attachment: [{
            _id: { type: String },
            type: { type: Number },
            file: { type: String }
        }],
    alarm: [{
            user_id: { type: String },
            off_alarm: { type: Boolean },
            time_off: { type: String },
        }],
    role: [{
            user_id: { type: String },
            name: { type: String },
            kick_member: { type: Boolean },
            add_member: { type: Boolean },
            change_name: { type: Boolean },
            set_role: { type: Boolean }
        }]
});
exports.default = mongoose_1.default.model('Channel', ChannelSchema, 'Channels');
//# sourceMappingURL=Channel.model.js.map