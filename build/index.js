"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const logging_1 = require("./config/logging");
const config_1 = require("./config/config");
const mongoose_1 = require("mongoose");
const authRoutes = require("./routes/Auth.route");
const userRoutes = require("./routes/User.route");
const requestRoutes = require("./routes/FriendRequest.route");
const channelRoutes = require("./routes/Channel.route");
const messageRoutes = require("./routes/Message.route");
const notifyRoutes = require("./routes/Notification.route");
const postRoutes = require("./routes/Post.route");
const commentRoutes = require("./routes/Comment.route");
const cors = require("cors");
const cloudinary = require("cloudinary");
const socketServer_1 = require("./socketServer");
//------------------------------------
require('./models/Channel.model');
require('./models/User.model');
require('./models/FriendRequest.model');
require('./models/Attachment.model');
require('./models/Message.model');
require('./models/Notification.model');
require('./models/Post.model');
require('./models/SavePost.model');
require('./models/Comment.model');
//------------------------------------
const NAMESPACE = 'Server';
const app = express();
/** Connect Cloudinary */
cloudinary.v2.config({
    cloud_name: 'dhb7ha8no',
    api_key: '478952913943714',
    api_secret: 'Ukrcg0n1MGn9k4kMAH7jmmmIp00'
});
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
let io = require("socket.io")(httpServer);
io.on("connection", (socket) => {
    console.log("Open connection");
    (0, socketServer_1.default)(socket);
});
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
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
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/request', requestRoutes);
app.use('/channel', channelRoutes);
app.use('/message', messageRoutes);
app.use('/notify', notifyRoutes);
app.use('/post', postRoutes);
app.use('/comment', commentRoutes);
/** Error handling */
app.use((req, res, next) => {
    const error = new Error('Not found');
    res.status(404).json({
        message: error.message
    });
});
httpServer.listen(config_1.default.server.port, () => logging_1.default.info(NAMESPACE, `Server is running ${config_1.default.server.hostname}:${config_1.default.server.port}`));
//# sourceMappingURL=index.js.map