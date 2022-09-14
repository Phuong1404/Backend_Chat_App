import { NextFunction, Request, Response } from "express";
import * as bcrypt from 'bcrypt';
import logging from "../Config/logging";
import Config from "../Config/config";
import mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import moment = require("moment");
import FriendRequest from "../Models/FriendRequest.model";
import User from '../Models/User.model'

const NAMESPACE = 'Friend Request';

const sendRequest = async(req: Request, res: Response, next: NextFunction) => {
    let { receiver_id } = req.body

    const authHeader = String(req.headers['authorization'] || '')
    const token = authHeader.substring(7, authHeader.length);
    const payload = jwt.verify(token, Config.server.token.secret)

    let receiver=await User.findOne({_id:receiver_id}).
    select('_id avatar')
    .exec()
    .then((users)=>{
        return users
    })
    let sender=await User.findOne({email:payload.email}).
    select('_id avatar')
    .exec()
    .then((users)=>{
        return users
    })

}
