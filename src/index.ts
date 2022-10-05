import * as http from 'http'
import * as bodyParser from "body-parser";
import * as express from 'express'
import logging from './Config/logging'
import Config from './Config/config';
import mongoose from 'mongoose'
import * as messageRoutes from './Routes/Message.route'
import * as userRoutes from './Routes/User.route'
import * as channelRoutes from './Routes/Channel.route'
import { ServerSocket } from './Socket/socket';
import * as path from 'path'
import * as cors from 'cors';

const NAMESPACE = 'Server';
const app = express()

/** Connect to Mongo */
console.log(Config.mongo.url)
mongoose
    .connect(Config.mongo.url, Config.mongo.options)
    .then((result) => {
        logging.info(NAMESPACE, 'Mongo Connected');
    })
    .catch((error) => {
        logging.error(NAMESPACE, error.message, error);
    })

/** Connect Socket*/
const httpServer = http.createServer(app);
export const socket = new ServerSocket(httpServer);


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
app.use('/user', userRoutes)
app.use('/channel', channelRoutes)
app.use('/message', messageRoutes)
/** Error handling */
app.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});


httpServer.listen(Config.server.port, () => logging.info(NAMESPACE, `Server is running ${Config.server.hostname}:${Config.server.port}`));
