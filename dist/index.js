"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket = void 0;
const http = require("http");
const bodyParser = require("body-parser");
const express = require("express");
const logging_1 = require("./Config/logging");
const config_1 = require("./Config/config");
const mongoose_1 = require("mongoose");
const messageRoutes = require("./Routes/Message.route");
const userRoutes = require("./Routes/User.route");
const channelRoutes = require("./Routes/Channel.route");
const socket_1 = require("./Socket/socket");
const NAMESPACE = 'Server';
const app = express();
/** Connect to Mongo */
mongoose_1.default
    .connect(config_1.default.mongo.url, config_1.default.mongo.options)
    .then((result) => {
    logging_1.default.info(NAMESPACE, 'Mongo Connected');
})
    .catch((error) => {
    logging_1.default.error(NAMESPACE, error.message, error);
});
/** Connect Socket*/
const httpServer = http.createServer(app);
exports.socket = new socket_1.ServerSocket(httpServer);
/** Log the request */
app.use((req, res, next) => {
    /** Log the req */
    logging_1.default.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        /** Log the res */
        logging_1.default.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });
    next();
});
/** Parse the body of the request */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
/** Rules of our API */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
/** Routes */
app.use('/user', userRoutes);
app.use('/channel', channelRoutes);
app.use('/message', messageRoutes);
/** Error handling */
app.use((req, res, next) => {
    const error = new Error('Not found');
    res.status(404).json({
        message: error.message
    });
});
httpServer.listen(config_1.default.server.port, () => logging_1.default.info(NAMESPACE, `Server is running ${config_1.default.server.hostname}:${config_1.default.server.port}`));
//# sourceMappingURL=index.js.map