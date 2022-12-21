"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require('dotenv').config();
const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    autoIndex: false,
    retryWrites: true
};
//Data deploy
const MONGO_USERNAME = 'phuong_1404';
const MONGO_PASSWORD = '14042001Aa';
const MONGO_HOST = `cluster0.lt8aq68.mongodb.net`;
//Data local
// const MONGO_USERNAME = 'admin';
// const MONGO_PASSWORD = 'admin';
// const MONGO_HOST = `localhost:27017/Social_Network?authMechanism=DEFAULT&authSource=Social_Network`;
const MONGO = {
    host: MONGO_HOST,
    password: MONGO_PASSWORD,
    username: MONGO_USERNAME,
    options: MONGO_OPTIONS,
    //Deploy
    url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`
    //Local
    // url: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`
};
const SERVER_HOSTNAME = 'localhost' || process.env.SERVER_HOSTNAME;
const SERVER_PORT = process.env.PORT || 8088;
const SERVER_TOKEN_EXPIRETIME = 3600 || process.env.SERVER_TOKEN_EXPIRETIME;
const SERVER_TOKEN_ISSUER = 'coolIssuer' || process.env.SERVER_TOKEN_ISSUER;
const SERVER_TOKEN_SECRET = 'SocialMedia' || process.env.SERVER_TOKEN_SECRET;
const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    token: {
        expireTime: SERVER_TOKEN_EXPIRETIME,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET
    }
};
const config = {
    mongo: MONGO,
    server: SERVER,
};
exports.default = config;
//# sourceMappingURL=config.js.map