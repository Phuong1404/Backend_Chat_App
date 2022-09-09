"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const logging_1 = require("../Config/logging");
const config_1 = require("../Config/config");
const NAMESPACE = 'Auth';
const extractJWT = (req, res, next) => {
    var _a;
    logging_1.default.info(NAMESPACE, 'Validating token');
    let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (token) {
        jwt.verify(token, config_1.default.server.token.secret, (error, decoded) => {
            if (error) {
                return res.status(404).json({
                    message: error,
                    error
                });
            }
            else {
                res.locals.jwt = decoded;
                next();
            }
        });
    }
    else {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};
exports.default = extractJWT;
//# sourceMappingURL=extractJWT.js.map