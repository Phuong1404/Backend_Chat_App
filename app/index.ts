import http from 'http'
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser'
import express from 'express';
import logging from './config/logging';
import config from './config/config';
import mongoose from 'mongoose'
import authRoutes from './routes/Auth.route'
import userRoutes from './routes/User.route'
import requestRoutes from './routes/FriendRequest.route'
import channelRoutes from './routes/Channel.route'
import messageRoutes from './routes/Message.route'
import notifyRoutes from './routes/Notification.route'
import postRoutes from './routes/Post.route'
import commentRoutes from './routes/Comment.route'
import savePostRoutes from './routes/SavePost.route'
import shortcutRoutes from './routes/shortcut.route'
import path from 'path'
import cors from 'cors';
import cloudinary from 'cloudinary'
import socketio from "socket.io"
import SocketServer from "./socketServer"
//------------------------------------
require('./models/Channel.model')
require('./models/User.model')
require('./models/FriendRequest.model')
require('./models/Attachment.model')
require('./models/Message.model')
require('./models/Notification.model')
require('./models/Post.model')
require('./models/SavePost.model')
require('./models/Comment.model')
require('./models/shortcut.model')
//------------------------------------

const NAMESPACE = 'Server';
const app = express()
/** Connect Cloudinary */
cloudinary.v2.config({
    cloud_name: 'dhb7ha8no',
    api_key: '478952913943714',
    api_secret: 'Ukrcg0n1MGn9k4kMAH7jmmmIp00'
});
/** Connect to Mongo */
mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then((result) => {
        logging.info(NAMESPACE, 'Mongo Connected');
    })
    .catch((error) => {
        logging.error(NAMESPACE, error.message, error);
    })

/** Connect Socket*/
const httpServer = http.createServer(app);
let io = require("socket.io")(httpServer, { cors: { origin: "*" } });


io.on("connection", (socket) => {
    console.log("Open connection")
    SocketServer(socket, io);
});

/** Log the request */
app.use((req, res, next) => {
    /** Log the req */
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        /** Log the res */
        logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
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
app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/request', requestRoutes)
app.use('/channel', channelRoutes)
app.use('/message', messageRoutes)
app.use('/notify', notifyRoutes)
app.use('/post', postRoutes)
app.use('/comment', commentRoutes)
app.use('/savepost', savePostRoutes)
app.use('/shortcutRoutes', shortcutRoutes)
/** Error handling */
app.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});


httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`));


