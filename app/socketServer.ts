import chatsocket from './socket/chat.socket'
import User from './models/User.model'
import Channel from './models/Channel.model'
let users = [];

// const EditData = (data, id, call) => {
//     const newData = data.map((item) => {
//         item.id === id ? { ...item, call } : item
//     });
//     return newData;
// }

const SocketServer = (socket, io) => {
    //connect -- disconnect
    socket.on("userJoin", (user) => {
        users.push({
            id: user._id,
            socketId: socket.id,
            friend: user.friend
        })
        console.log(`User ${user._id} was connect socket`)
    })

    //Chat socket
    socket.on('joinchat', async ({ user_id, room }) => {
        const { error, user } = await chatsocket.addUser({ id: socket.id, user_id, room })
        if (!error) {
            await socket.join(user.room)
            console.log(`User ${user_id} join room ${user.room}`)
        }
    })
    //Message
    socket.on("sendMessage", async ({ message, room }) => {
        const user = chatsocket.getUser(socket.id, room)
        if (!user.error) {
            let channel_user = await Channel.findOne({ id: room })['user']
            io.to(user.room).emit('message', { user: user.user_id, message: message })

            for (let u in channel_user) {
                const us = users.find((user) => user.id === channel_user[u])
                if (us) {
                    socket.to(`${us.socketId}`).emit("channel message");
                }
            }
            console.log("send success")
        }
        console.log("send fail")
    })
    socket.on("deleteChat", async ({ message, room }) => {
        const user = chatsocket.getUser(socket.id, room)
        if (!user.error) {
            // let channel_user = await Channel.findOne({ id: room })['user']
            io.to(user.room).emit('message', { user: user.user_id, message: message })

            // for (let u in channel_user) {
            //     const us = users.find((user) => user.id === channel_user[u])
            //     if (us) {
            //         socket.to(`${us.socketId}`).emit("channel message");
            //     }
            // }
            console.log("send success")
        }
        console.log("send fail")
    })
    //Leave chat
    socket.on('leaveChat', ({ room }) => {
        const user = chatsocket.getUser(socket.id, room)
        socket.leave(user.room)
        chatsocket.removeUser(socket.id, room)
        console.log(`User ${user.user_id} was leave room ${user.room}`)
    })
    //Đang nhập
    //Truyền xuống Tên người đang gõ,Phòng và trạng thái
    //Trạng thái 0 là ko gõ 1 là đang gõ
    socket.on('typing_to_server', function (sender, room, typing_status) {
        io.emit('typing_to_client', sender, room, typing_status);
    });

    socket.on("disconnect", () => {
        chatsocket.disconnectRoom(socket.id)
        let u = users.findIndex((user) => user.socketId === socket.id);
        if (u) {
            users.splice(u, 1);
        }
        console.log(`User ${socket.id} was disconnect socket`)
    })

    socket.on('disconnecting', (reason) => {
        chatsocket.disconnectRoom(socket.id)
        let u = users.findIndex((user) => user.socketId === socket.id);
        if (u) {
            users.splice(u, 1);
        }
        console.log(`User ${socket.id} disconnecting socket now`)
    });
    //Notifi tin nhắn

    //Notification
    socket.on("createNotify", (user_id, notify) => {
        const user_receiver = users.find((user) => user_id.includes(user.id));
        user_receiver && socket.to(`${user_id}`).emit("createNotifyToClient", notify);
    })
    socket.on("deleteNotify", (user_id, notify) => {
        const user_receiver = users.find((user) => user_id.includes(user.id));
        user_receiver && socket.to(`${user_id}`).emit("deleteNotifyToClient", notify);
    })
    //like post
    socket.on("likepost", async ({ post, user }) => {
        const user_post = users.find((user) => post.user == user.id);
        console.log(user_post)
        socket.to(`${user_post.socketId}`).emit("likepostclient", post, user);
    })
    //like comment
    socket.on("likecomment", async ({ post, user }) => {
        const user_post = users.find((user) => post.user == user.id);
        console.log(user_post)
        socket.to(`${user_post.socketId}`).emit("likecommentclient", post, user);
    })
    //bình luận post
    socket.on("comment", async ({ post, comment, user }) => {
        const user_post = users.find((user) => post.user == user.id);
        console.log(user_post)
        socket.to(`${user_post.socketId}`).emit("commentpostclient", post, comment, user);
    })
    //trả lời comment
    socket.on("replycomment", async ({ comment, user }) => {
        const user_comment = users.find((user) => comment.user == user.id);
        console.log(user_comment)
        socket.to(`${user_comment.socketId}`).emit("replycommentpostclient", comment, user);
    })

    // //Send friend request
    // socket.on("sendRequest", (msg) => {
    //     const user = users.find((user) => user.id === msg.recipient);
    //     user && socket.to(`${user.socketId}`).emit("addMessageToClient", msg);
    // })
    //Accept friend request
}

export default SocketServer
