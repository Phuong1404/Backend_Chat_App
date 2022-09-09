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
const NAMESPACE = 'User';
const validateToken = (req, res, next) => {
    logging_1.default.info(NAMESPACE, 'Token validated, user authorized.');
    return res.status(200).json({
        message: 'Token(s) validated'
    });
};
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, email, phone, birthday, gender, password } = req.body;
    //Kiểm tra số điện thoại và email tồn tại
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
                password: hash
            });
            return _user
                .save()
                .then((user) => {
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
const getUser = (req, res, next) => {
    const authHeader = String(req.headers['authorization'] || '');
    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, config_1.default.server.token.secret);
    User_model_1.default.findOne({ email: payload.email })
        .select('-password -contact -channel')
        .exec()
        .then((users) => {
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
const getContactUser = (req, res, next) => {
    const authHeader = String(req.headers['authorization'] || '');
    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, config_1.default.server.token.secret);
    User_model_1.default.findOne({ email: payload.email })
        .select('contact')
        .exec()
        .then((users) => {
        return res.status(200).json({
            data: users.contact,
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
const getChannelUser = (req, res, next) => {
    const authHeader = String(req.headers['authorization'] || '');
    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, config_1.default.server.token.secret);
    User_model_1.default.findOne({ email: payload.email })
        .select('channel')
        .exec()
        .then((users) => {
        return res.status(200).json({
            data: users.channel,
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
const changePassword = (req, res, next) => {
    const authHeader = String(req.headers['authorization'] || '');
    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, config_1.default.server.token.secret);
    let { oldpassword, password, repassword } = req.body;
    if (password == repassword) {
        User_model_1.default.findOne({ email: payload.email })
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
                        User_model_1.default.findOneAndUpdate({ email: payload.email }, { password: hash })
                            .then((users) => {
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
const changeInfomation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = String(req.headers['authorization'] || '');
    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, config_1.default.server.token.secret);
    let { name, birthday, gender } = req.body;
    User_model_1.default.findOneAndUpdate({ email: payload.email }, { name: name, birthday: birthday, gender: gender })
        .then((users) => {
        return res.status(201).json({
            message: "Done"
        });
    });
});
exports.default = { validateToken, register, login, getUser, getContactUser, getChannelUser, changePassword, changeInfomation };
//# sourceMappingURL=User.controller.js.map