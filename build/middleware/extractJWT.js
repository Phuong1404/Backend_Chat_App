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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logging_1 = __importDefault(require("../Config/logging"));
const config_1 = __importDefault(require("../Config/config"));
const User_model_1 = __importDefault(require("../models/User.model"));
const NAMESPACE = 'Auth';
const extractJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    logging_1.default.info(NAMESPACE, 'Validating token');
    try {
        let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return res.status(400).json({ message: "Unauthorized." });
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.server.token.secret);
        if (!decoded) {
            return res.status(400).json({ message: "Unauthorized." });
        }
        const user = yield User_model_1.default.findOne({ _id: decoded['id'] });
        req.user = user;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
});
exports.default = extractJWT;
//# sourceMappingURL=extractJWT.js.map