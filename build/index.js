"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const logging_1 = __importDefault(require("./config/logging"));
const config_1 = __importDefault(require("./config/config"));
const mongoose_1 = __importDefault(require("mongoose"));
const Auth_route_1 = __importDefault(require("./routes/Auth.route"));
const User_route_1 = __importDefault(require("./routes/User.route"));
const FriendRequest_route_1 = __importDefault(require("./routes/FriendRequest.route"));
const Channel_route_1 = __importDefault(require("./routes/Channel.route"));
const Message_route_1 = __importDefault(require("./routes/Message.route"));
const Notification_route_1 = __importDefault(require("./routes/Notification.route"));
const Post_route_1 = __importDefault(require("./routes/Post.route"));
const Comment_route_1 = __importDefault(require("./routes/Comment.route"));
const SavePost_route_1 = __importDefault(require("./routes/SavePost.route"));
const shortcut_route_1 = __importDefault(require("./routes/shortcut.route"));
const cors_1 = __importDefault(require("cors"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const socketServer_1 = __importDefault(require("./socketServer"));
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
require('./models/shortcut.model');
//------------------------------------
const NAMESPACE = 'Server';
const app = (0, express_1.default)();
/** Connect Cloudinary */
cloudinary_1.default.v2.config({
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
const httpServer = http_1.default.createServer(app);
let io = require("socket.io")(httpServer, { cors: { origin: "*" } });
io.on("connection", (socket) => {
    console.log("Open connection");
    (0, socketServer_1.default)(socket, io);
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
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
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
app.use('/auth', Auth_route_1.default);
app.use('/user', User_route_1.default);
app.use('/request', FriendRequest_route_1.default);
app.use('/channel', Channel_route_1.default);
app.use('/message', Message_route_1.default);
app.use('/notify', Notification_route_1.default);
app.use('/post', Post_route_1.default);
app.use('/comment', Comment_route_1.default);
app.use('/savepost', SavePost_route_1.default);
app.use('/shortcutRoutes', shortcut_route_1.default);
/** Error handling */
app.use((req, res, next) => {
    const error = new Error('Not found');
    res.status(404).json({
        message: error.message
    });
});
httpServer.listen(config_1.default.server.port, () => logging_1.default.info(NAMESPACE, `Server is running ${config_1.default.server.hostname}:${config_1.default.server.port}`));
//# sourceMappingURL=index.js.map