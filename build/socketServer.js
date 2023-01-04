"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_socket_1 = __importDefault(require("./socket/chat.socket"));
const Channel_model_1 = __importDefault(require("./models/Channel.model"));
let users = [];
const SocketServer = (socket, io) => {
    //connect -- disconnect
    socket.on("userJoin", (user) => __awaiter(void 0, void 0, void 0, function* () {
        users = yield users.filter(user1 => user1.id != user._id);
        yield users.push({
            id: user._id,
            socketId: socket.id,
            friend: user.friend
        });
        console.log(`User ${user._id} was connect socket`);
        console.log(users);
    }));
    //Chat socket
    socket.on('joinchat', ({ user_id, room }) => __awaiter(void 0, void 0, void 0, function* () {
        const { user } = yield chat_socket_1.default.addUser({ id: socket.id, user_id, room });
        yield socket.join(user.room);
        console.log(`User ${user_id} join room ${user.room}`);
    }));
    //Message
    socket.on("sendMessage", ({ message, room }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = chat_socket_1.default.getUser(socket.id, room);
        if (!user.error) {
            let channel_user = yield Channel_model_1.default.findOne({ id: room });
            io.to(user.room).emit('message', { user: user.user_id, message: message });
            for (let u in channel_user.user) {
                const us = users.find((user) => user.id === channel_user.user[u]);
                if (us) {
                    socket.to(`${us.socketId}`).emit("channel message");
                }
            }
            console.log("send success");
        }
        console.log("send fail");
    }));
    socket.on("deleteChat", ({ message, room }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = chat_socket_1.default.getUser(socket.id, room);
        if (!user.error) {
            io.to(user.room).emit('deletemessage', { user: user.user_id, message: message });
            console.log("send success");
        }
        console.log("send fail");
    }));
    //Leave chat
    socket.on('leaveChat', ({ room }) => {
        const user = chat_socket_1.default.getUser(socket.id, room);
        socket.leave(user.room);
        chat_socket_1.default.removeUser(socket.id, room);
        console.log(`User ${user.user_id} was leave room ${user.room}`);
    });
    //Đang nhập
    //Truyền xuống Tên người đang gõ,Phòng và trạng thái
    //Trạng thái 0 là ko gõ 1 là đang gõ
    socket.on('typing_to_server', function (sender, room, typing_status) {
        io.emit('typing_to_client', sender, room, typing_status);
    });
    socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
        chat_socket_1.default.disconnectRoom(socket.id);
        users = yield users.filter(user1 => user1.socketId != socket.id);
        console.log(`User ${socket.id} was disconnect socket`);
    }));
    socket.on('disconnecting', (reason) => __awaiter(void 0, void 0, void 0, function* () {
        yield chat_socket_1.default.disconnectRoom(socket.id);
        chat_socket_1.default.disconnectRoom(socket.id);
        users = yield users.filter(user1 => user1.socketId != socket.id);
        console.log(`User ${socket.id} disconnecting socket now`);
    }));
    //Notifi tin nhắn
    //Notification
    socket.on("createNotify", (user_id, notify) => {
        const user_receiver = users.find((user) => user_id.includes(user.id));
        user_receiver && socket.to(`${user_id}`).emit("createNotifyToClient", notify);
    });
    socket.on("deleteNotify", (user_id, notify) => {
        const user_receiver = users.find((user) => user_id.includes(user.id));
        user_receiver && socket.to(`${user_id}`).emit("deleteNotifyToClient", notify);
    });
    //like post
    socket.on("likepost", ({ post, user, status }) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(users);
        if (users) {
            const user_post = users.find((user1) => post.user._id == user1.id);
            if (user_post && status == 1) {
                socket.to(`${user_post.socketId}`).emit("likepostclient", post, user);
            }
        }
    }));
    //like comment
    socket.on("likecomment", ({ comment, user, status }) => __awaiter(void 0, void 0, void 0, function* () {
        const user_comment = users.find((user1) => comment.user._id == user1.id);
        console.log(user_comment);
        if (user_comment && status == 1) {
            socket.to(`${user_comment.socketId}`).emit("likecommentclient", comment, user);
        }
    }));
    //bình luận post
    socket.on("comment", ({ post, comment, user }) => __awaiter(void 0, void 0, void 0, function* () {
        const user_post = users.find((user1) => post.user._id == user1.id);
        console.log(user_post);
        socket.to(`${user_post.socketId}`).emit("commentpostclient", post, comment, user);
    }));
    //trả lời comment
    socket.on("replycomment", ({ comment, user }) => __awaiter(void 0, void 0, void 0, function* () {
        const user_comment = users.find((user1) => comment.user._id == user1.id);
        console.log(user_comment);
        socket.to(`${user_comment.socketId}`).emit("replycommentpostclient", comment, user);
    }));
    //gửi lời mời kết bạn
    socket.on("sendfriendrequest", ({ request, user }) => __awaiter(void 0, void 0, void 0, function* () {
        const user_send = users.find((user1) => request.recever == user1.id);
        user_send && socket.to(`${user_send.socketId}`).emit("sendfriendrequestclient", request, user);
    }));
    //chấp nhận lời mời kết bạn
    socket.on("acceptfriendrequest", ({ request, user }) => __awaiter(void 0, void 0, void 0, function* () {
        const user_accept = users.find((user1) => request.sender == user1.id);
        user_accept && socket.to(`${user_accept.socketId}`).emit("acceptfriendrequest", request, user);
    }));
    // //Send friend request
    // socket.on("sendRequest", (msg) => {
    //     const user = users.find((user) => user.id === msg.recipient);
    //     user && socket.to(`${user.socketId}`).emit("addMessageToClient", msg);
    // })
    //Accept friend request
};
exports.default = SocketServer;
//# sourceMappingURL=socketServer.js.map