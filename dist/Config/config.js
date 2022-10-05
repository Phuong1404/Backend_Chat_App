"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require('dotenv').config();
const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    // poolSize: 50,
    autoIndex: false,
    retryWrites: true
};
const MONGO_USERNAME = 'phuong_1404';
const MONGO_PASSWORD = '14042001Aa';
const MONGO_HOST = `phuongerpdata.krqve.mongodb.net/test`;
// const MONGO_USERNAME = process.env.MONGO_USERNAME || 'admin';
// const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'admin';
// const MONGO_HOST = `localhost:27017/ChatApp?authMechanism=DEFAULT&authSource=chatapp`;
//const MONGO_HOST = process.env.MONGO_HOST || `localhost:27017/ChatApp?authMechanism=DEFAULT&authSource=chatapp`;
const MONGO = {
    host: MONGO_HOST,
    password: MONGO_PASSWORD,
    username: MONGO_USERNAME,
    options: MONGO_OPTIONS,
    url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`
    //url: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}` /*`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`*/
};
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 8088;
const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || 'coolIssuer';
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || 'SocialMedia';
const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    token: {
        expireTime: SERVER_TOKEN_EXPIRETIME,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET
    }
};
const Config = {
    mongo: MONGO,
    server: SERVER
};
exports.default = Config;
//# sourceMappingURL=config.js.map