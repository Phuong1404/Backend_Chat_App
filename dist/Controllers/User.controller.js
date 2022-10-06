"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_model_1 = require("../Models/User.model");
const bcrypt = require("bcrypt");
const mongoose_1 = require("mongoose");
const logging_1 = require("../Config/logging");
const config_1 = require("../Config/config");
const signJWT_1 = require("../Functions/signJWT");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const NAMESPACE = 'User';
//1. Kiểm tra token
const validateToken = (req, res, next) => {
    logging_1.default.info(NAMESPACE, 'Token validated, user authorized.');
    return res.status(200).json({
        message: 'Token(s) validated'
    });
};
//2. Đăng ký
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, email, phone, birthday, gender, password } = req.body;
    let RequestFile = req.files;
    let file = "";
    if (RequestFile.length > 0) {
        file = `http://localhost:8088/${RequestFile[0].path}`;
    }
    let PhoneExist = yield User_model_1.default.exists({ phone })
        .exec()
        .then((phones) => {
        return phones;
    });
    let EmailExist = yield User_model_1.default.exists({ email })
        .exec()
        .then((emails) => {
        return emails;
    });
    if (PhoneExist != null) {
        return res.status(500).json({
            message: "Phone number already exists"
        });
    }
    else if (EmailExist != null) {
        return res.status(500).json({
            message: "Email address already exists"
        });
    }
    else {
        bcrypt.hash(password, 10, (hashError, hash) => {
            if (hashError) {
                return res.status(401).json({
                    message: hashError.message,
                    error: hashError
                });
            }
            const _user = new User_model_1.default({
                _id: new mongoose_1.default.Types.ObjectId(),
                name: name,
                email: email,
                phone: phone,
                birthday: birthday,
                gender: gender,
                password: hash,
                avatar: file,
                time_create: moment()
            });
            return _user
                .save()
                .then((user) => {
                logging_1.default.info(NAMESPACE, 'User created successfully.');
                return res.status(201).json({
                    user
                });
            })
                .catch((error) => {
                return res.status(500).json({
                    message: error.message,
                    error
                });
            });
        });
    }
});
//3. Đăng nhập
const login = (req, res, next) => {
    let { username, password } = req.body;
    User_model_1.default.find({ $or: [{ email: username }, { phone: username }] })
        .exec()
        .then((users) => {
        if (users.length !== 1) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        bcrypt.compare(password, users[0].password, (error, result) => {
            if (error) {
                return res.status(401).json({
                    message: 'Password Mismatch'
                });
            }
            else if (result) {
                (0, signJWT_1.default)(users[0], (_error, token) => {
                    if (_error) {
                        return res.status(500).json({
                            message: _error.message,
                            error: _error
                        });
                    }
                    else if (token) {
                        logging_1.default.info(NAMESPACE, 'User login successfully.');
                        return res.status(200).json({
                            message: 'Auth successful',
                            token: token,
                            user: users[0]
                        });
                    }
                });
            }
            else {
                return res.status(401).json({
                    message: 'Password Mismatch'
                });
            }
        });
    })
        .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
//4. Lấy thông tin người dùng
const getUser = (req, res, next) => {
    const authHeader = String(req.headers['authorization'] || '');
    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, config_1.default.server.token.secret);
    User_model_1.default.findOne({ _id: payload.id })
        .select('-password -contact -channel -friend_request')
        .exec()
        .then((users) => {
        logging_1.default.info(NAMESPACE, 'Get data user.');
        return res.status(200).json({
            data: users,
            count: 1
        });
    })
        .catch((error) => {
        return res.status(500).json({
            message: error.message,
            error
        });
    });
};
//5. Lấy danh sách bạn bè
const getContactUser = (req, res, next) => {
    const authHeader = String(req.headers['authorization'] || '');
    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, config_1.default.server.token.secret);
    User_model_1.default.findOne({ _id: payload.id })
        .select('contact')
        .exec()
        .then((users) => {
        logging_1.default.info(NAMESPACE, 'Get list friend.');
        return res.status(200).json({
            data: users.contact,
            count: users.contact.length
        });
    })
        .catch((error) => {
        return res.status(500).json({
            message: error.message,
            error
        });
    });
};
//6. Lấy danh sách kênh
const getChannelUser = (req, res, next) => {
    const authHeader = String(req.headers['authorization'] || '');
    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, config_1.default.server.token.secret);
    User_model_1.default.findOne({ _id: payload.id })
        .select('channel')
        .exec()
        .then((users) => {
        logging_1.default.info(NAMESPACE, 'Get data channel.');
        return res.status(200).json({
            data: users.channel,
            count: users.channel.length
        });
    })
        .catch((error) => {
        return res.status(500).json({
            message: error.message,
            error
        });
    });
};
//7. Đổi mật khẩu
const changePassword = (req, res, next) => {
    const authHeader = String(req.headers['authorization'] || '');
    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, config_1.default.server.token.secret);
    let { oldpassword, password, repassword } = req.body;
    if (password == repassword) {
        User_model_1.default.findOne({ _id: payload.id })
            .select('password')
            .exec()
            .then((users) => {
            if (!users) {
                return res.status(401).json({
                    message: 'Account does not exist'
                });
            }
            bcrypt.compare(oldpassword, users.password, (error, result) => {
                if (error) {
                    return res.status(401).json({
                        message: 'Password Mismatch'
                    });
                }
                else if (result) {
                    bcrypt.hash(password, 10, (hashError, hash) => {
                        if (hashError) {
                            return res.status(401).json({
                                message: hashError.message,
                                error: hashError
                            });
                        }
                        User_model_1.default.findOneAndUpdate({ _id: payload.id }, { password: hash, time_update: moment() })
                            .then(() => {
                            logging_1.default.info(NAMESPACE, 'Change password user.');
                            return res.status(201).json({
                                message: "Done"
                            });
                        });
                    });
                }
                else {
                    return res.status(401).json({
                        message: 'Password Mismatch'
                    });
                }
            });
        })
            .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
    }
    else {
        return res.status(500).json({
            message: "re-password is incorrect"
        });
    }
};
//8. Đổi thông tin tài khoản
const changeInfomation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = String(req.headers['authorization'] || '');
    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, config_1.default.server.token.secret);
    let { name, birthday, gender } = req.body;
    let RequestFile = req.files;
    let user = yield User_model_1.default.findOne({ _id: payload.id })
        .then((user) => {
        return {
            avatar: user.avatar
        };
    });
    if (!RequestFile) {
        let avatar = user.avatar;
    }
    else {
        let avatar = `http://localhost:8088/${RequestFile[0].path}`;
        console.log(RequestFile[0].path);
    }
    // User.findOneAndUpdate({ _id: payload.id }, { name: name, birthday: birthday, gender: gender, time_update: moment() })
    //   .then(() => {
    //     logging.info(NAMESPACE, 'Change info user.');
    //     return res.status(201).json({
    //       message: "Done"
    //     });
    //   })
});
//9. Lấy danh sách lời mời kết bạn
const getListReceiverFriend = (req, res, next) => {
    const authHeader = String(req.headers['authorization'] || '');
    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, config_1.default.server.token.secret);
    User_model_1.default.findOne({ _id: payload.id })
        .select('friend_request')
        .exec()
        .then((users) => {
        let result = [];
        for (let item in users.friend_request) {
            if (users.friend_request[item]['type'] == 0) {
                result.push(users.friend_request[item]);
            }
        }
        logging_1.default.info(NAMESPACE, 'List friend request send.');
        return res.status(200).json({
            data: result,
            count: result.length
        });
    })
        .catch((error) => {
        return res.status(500).json({
            message: error.message,
            error
        });
    });
};
//10. Lấy danh sách đã gửi lời mờis
const getListSendFriend = (req, res, next) => {
    const authHeader = String(req.headers['authorization'] || '');
    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, config_1.default.server.token.secret);
    User_model_1.default.findOne({ _id: payload.id })
        .select('friend_request')
        .exec()
        .then((users) => {
        let result = [];
        for (let item in users.friend_request) {
            if (users.friend_request[item]['type'] == 1) {
                result.push(users.friend_request[item]);
            }
        }
        logging_1.default.info(NAMESPACE, 'List friend request receiver.');
        return res.status(200).json({
            data: result,
            count: result.length
        });
    })
        .catch((error) => {
        return res.status(500).json({
            message: error.message,
            error
        });
    });
};
//11. Yêu cầu kết bạn
const SendFriendRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = String(req.headers['authorization'] || '');
    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, config_1.default.server.token.secret);
    let { receiver_id } = req.body;
    let receiver = yield User_model_1.default.findOne({ _id: receiver_id }).
        select('_id friend_request')
        .exec()
        .then((users) => {
        return users;
    });
    let sender = yield User_model_1.default.findOne({ _id: payload.id }).
        select('_id friend_request')
        .exec()
        .then((users) => {
        return users;
    });
    if (receiver.friend_request.findIndex((val) => (val['to'] == receiver_id && val['from'] == sender._id)) != -1) {
        return res.status(401).json({
            message: "Was send",
        });
    }
    else {
        let friend_request_1 = {
            from: sender._id,
            to: receiver._id,
            time: moment(),
            status: 0,
            status_name: "Was send",
            type: 1,
            type_name: "Send"
        };
        let friend_request_0 = {
            from: sender._id,
            to: receiver._id,
            time: moment(),
            status: 0,
            status_name: "Was send",
            type: 0,
            type_name: "Receiver"
        };
        let friend_request_send = sender.friend_request;
        let friend_request_receiver = receiver.friend_request;
        friend_request_send.push(friend_request_1);
        friend_request_receiver.push(friend_request_0);
        User_model_1.default.findOneAndUpdate({ _id: payload.id }, { friend_request: friend_request_send })
            .then(() => {
            User_model_1.default.findOneAndUpdate({ _id: receiver_id }, { friend_request: friend_request_receiver })
                .then(() => {
                logging_1.default.info(NAMESPACE, 'Send friend request.');
                return res.status(201).json({
                    message: "Done"
                });
            });
        });
    }
});
//12. Hủy yêu cầu
const CancelFriendRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = String(req.headers['authorization'] || '');
    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, config_1.default.server.token.secret);
    let { send_id } = req.body;
    let receiver = yield User_model_1.default.findOne({ _id: payload.id }).
        select('_id friend_request')
        .exec()
        .then((users) => {
        return users;
    });
    let sender = yield User_model_1.default.findOne({ _id: send_id }).
        select('_id friend_request')
        .exec()
        .then((users) => {
        return users;
    });
    let send_req = sender.friend_request.findIndex((val) => (val['from'] == send_id && val['to'] == receiver._id));
    let rec_req = receiver.friend_request.findIndex((val) => (val['from'] == send_id && val['to'] == receiver._id));
    if (send_req == -1 || rec_req == -1) {
        return res.status(401).json({
            message: "Request not found"
        });
    }
    else {
        let temp1_send = sender.friend_request.slice(0, send_req);
        let temp2_send = sender.friend_request.slice(send_req + 1, sender.friend_request.length);
        let temp_send = temp1_send.concat(temp2_send);
        let temp1_rec = receiver.friend_request.slice(0, rec_req);
        let temp2_rec = receiver.friend_request.slice(rec_req + 1, receiver.friend_request.length);
        let temp_rec = temp1_rec.concat(temp2_rec);
        User_model_1.default.findOneAndUpdate({ _id: sender._id }, { friend_request: temp_send })
            .then(() => {
            User_model_1.default.findOneAndUpdate({ _id: receiver._id }, { friend_request: temp_rec })
                .then(() => {
                logging_1.default.info(NAMESPACE, 'Cancel friend request.');
                return res.status(201).json({
                    message: "Done"
                });
            });
        });
    }
});
//13.Chấp thuận yêu cầu
const AcceptFriendRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = String(req.headers['authorization'] || '');
    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, config_1.default.server.token.secret);
    let { send_id } = req.body;
    let receiver = yield User_model_1.default.findOne({ _id: payload.id }).
        select('_id friend_request')
        .exec()
        .then((users) => {
        return users;
    });
    let sender = yield User_model_1.default.findOne({ _id: send_id }).
        select('_id friend_request')
        .exec()
        .then((users) => {
        return users;
    });
    let send_req = sender.friend_request.findIndex((val) => (val['from'] == send_id && val['to'] == receiver._id));
    let rec_req = receiver.friend_request.findIndex((val) => (val['from'] == send_id && val['to'] == receiver._id));
    if (send_req == -1 || rec_req == -1) {
        return res.status(401).json({
            message: "Request not found"
        });
    }
    else {
        let friend_request_1 = sender.friend_request[send_req];
        let friend_request_0 = receiver.friend_request[rec_req];
        friend_request_1['status'] = 1;
        friend_request_0['status'] = 1;
        friend_request_0['status_name'] = "Was accept";
        friend_request_1['status_name'] = "Was accept";
        let temp1_send = sender.friend_request.slice(0, send_req);
        temp1_send.push(friend_request_1);
        let temp2_send = sender.friend_request.slice(send_req + 1, sender.friend_request.length);
        let temp_send = temp1_send.concat(temp2_send);
        let temp1_rec = receiver.friend_request.slice(0, rec_req);
        temp1_rec.push(friend_request_0);
        let temp2_rec = receiver.friend_request.slice(rec_req + 1, receiver.friend_request.length);
        let temp_rec = temp1_rec.concat(temp2_rec);
        User_model_1.default.findOneAndUpdate({ _id: sender._id }, { friend_request: temp_send })
            .then(() => {
            User_model_1.default.findOneAndUpdate({ _id: receiver._id }, { friend_request: temp_rec })
                .then(() => {
                logging_1.default.info(NAMESPACE, 'Accept friend request.');
                return res.status(201).json({
                    message: "Done"
                });
            });
        });
    }
});
//14. Find user by email ,name, phone
const FindUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { data } = req.body;
    User_model_1.default.find({ $or: [{ name: { $regex: data } }, { 'phone': data }, { 'email': data }] })
        .select('_id name avatar')
        .then((user) => {
        return {
            data: user,
            count: user.length
        };
    });
});
//15. List Friend Chat
const ListChannelChat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = String(req.headers['authorization'] || '');
    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, config_1.default.server.token.secret);
    Mess;
});
exports.default = {
    validateToken, register, login, getUser, changeInfomation,
    getContactUser, getChannelUser, changePassword,
    getListReceiverFriend, getListSendFriend, SendFriendRequest,
    CancelFriendRequest, AcceptFriendRequest, FindUser
};
//# sourceMappingURL=User.controller.js.map