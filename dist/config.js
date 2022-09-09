"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    poolSize: 50,
    autoIndex: false,
    retryWrites: false
};
const MONGO_USERNAME = process.env.MONGO_USERNAME || 'superuser';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'superuserpassword';
const MONGO_HOST = process.env.MONGO_HOST || 'mongodb://localhost:27017';
const MONGO = {
    host: MONGO_HOST,
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    url: 'mongodb://localhost:27017'
};
const config = {
    mongo: MONGO
};
//# sourceMappingURL=config.js.map