import  jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import config from '../config/config';
import User from '../models/User.model'

const NAMESPACE = 'Auth';

const extractJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ message: "Unauthorized." });
        }
        const decoded = jwt.verify(token, config.server.token.secret);
        if (!decoded) {
            return res.status(400).json({ message: "Unauthorized." });
        }
        const user = await User.findOne({ _id: decoded['id'] });
        req.user = user;
        next();
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    }
};

export default extractJWT;
