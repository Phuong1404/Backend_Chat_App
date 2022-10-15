import { NextFunction, Request, Response } from "express";
import mongoose from 'mongoose';
import FriendRequest from '../models/FriendRequest.model'
import Channel from "../models/Channel.model";
import User from '../models/User.model'
//1. Gửi yêu cầu kết bạn
const sendRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { recever_id } = req.body
        const request1 = await FriendRequest.findOne({ $and: [{ 'recever': recever_id }, { 'sender': req.user['_id'] }] })
        if (request1) {
            return res.status(400).json({ message: "Đã gửi lời mời" });
        }
        const newRequest = new FriendRequest({
            _id: new mongoose.Types.ObjectId(),
            sender: req.user['_id'],
            recever: recever_id,
            status: 0,
            status_name: "Send"
        })
        await newRequest.save()
        await User.findOneAndUpdate(
            { _id: req.user['_id'] },
            {
                $push: { friend_request: newRequest._id }
            }
        );
        await User.findOneAndUpdate(
            { _id: recever_id },
            {
                $push: { friend_request: newRequest._id }
            }
        );
        res.json({ message: "Send success!" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
//2. Hủy yêu cầu kết bạn
const RejectRequest = async (req: Request, res: Response, next: NextFunction) => {
    const request = await FriendRequest.findById(req.params.id)
    if (!request) {
        return res.status(400).json({ message: "Request does not exist." });
    }
    if (String(request.recever) != String(req.user['_id'])) {
        return res.status(400).json({ message: "Request is not yours" });
    }
    await FriendRequest.findByIdAndDelete({ _id: req.params.id })
    await User.findOneAndUpdate(
        { _id: request.sender },
        {
            $pull: { friend_request: request.sender }
        }
    );
    await User.findOneAndUpdate(
        { _id: request.recever },
        {
            $pull: { friend_request: request.recever }
        }
    );
    res.json({ message: "Delete Success" })
}
//3. Xóa Bỏ lời mời kết bạn
const CancelRequest = async (req: Request, res: Response, next: NextFunction) => {
    const request = await FriendRequest.findById(req.params.id)
    if (!request) {
        return res.status(400).json({ message: "Request does not exist." });
    }
    if (String(request.sender) != String(req.user['_id'])) {
        return res.status(400).json({ message: "Request is not yours" });
    }
    await FriendRequest.findByIdAndDelete({ _id: req.params.id })
    await User.findOneAndUpdate(
        { _id: request.sender },
        {
            $pull: { friend_request: request.sender }
        }
    );
    await User.findOneAndUpdate(
        { _id: request.recever },
        {
            $pull: { friend_request: request.recever }
        }
    );
    res.json({ message: "Delete Success" })
}
//4. Chấp nhận yêu cầu kết bạn
const AcceptRequest = async (req: Request, res: Response, next: NextFunction) => {
    const request = await FriendRequest.findById(req.params.id)
    if (!request) {
        return res.status(400).json({ message: "Request does not exist." });
    }
    if (String(request.recever) != String(req.user['_id'])) {
        return res.status(400).json({ message: "Request is not yours" });
    }
    if (request.status == 1) {
        return res.status(400).json({ message: "Request was accept" });
    }
    let list_user = []
    list_user.push(request.recever)
    list_user.push(request.sender)
    const newChannel = new Channel({
        _id: new mongoose.Types.ObjectId(),
        num_member: 2,
        user: list_user
    })
    newChannel.save()
    await FriendRequest.findByIdAndUpdate({ _id: req.params.id }, {
        status: 1,
        status_name: 'Accept'
    })
    await User.findOneAndUpdate(
        { _id: request.sender },
        {
            $push: { friend: request.sender, channel: newChannel._id }
        }
    );
    await User.findOneAndUpdate(
        { _id: request.recever },
        {
            $push: { friend: request.recever, channel: newChannel._id }
        }
    );

    res.json({ message: "Accept Success" })
}
export default {
    sendRequest, RejectRequest, CancelRequest, AcceptRequest
}
