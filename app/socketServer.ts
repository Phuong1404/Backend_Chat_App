import chatsocket from './socket/chat.socket'
import User from './models/User.model'
import Channel from './models/Channel.model'
let users = []


const SocketServer = (socket, io) => {
    //connect -- disconnect
    socket.on("userJoin", async(user) => {
        users= await users.filter(user1=>user1.id!=user._id)
        await users.push({
            id: user._id,
            socketId: socket.id,
            friend: user.friend
        })
        
        console.log(`User ${user._id} was connect socket`)
        console.log(users)
    })

    //Chat socket
    socket.on('joinchat', async ({ user_id, room }) => {
        const { user } = await chatsocket.addUser({ id: socket.id, user_id, room })
            await socket.join(user.room)
            console.log(`User ${user_id} join room ${user.room}`)
    })
    //Message
    socket.on("sendMessage", async ({ message, room }) => {
        const user = chatsocket.getUser(socket.id, room)
        if (!user.error) {
            let channel_user = await Channel.findOne({ id: room })
            io.to(user.room).emit('message', { user: user.user_id, message: message })

            for (let u in channel_user.user) {
                const us = users.find((user) => user.id === channel_user.user[u])
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

    socket.on("disconnect", async() => {
        chatsocket.disconnectRoom(socket.id)
        users= await users.filter(user1=>user1.socketId!=socket.id)
        console.log(`User ${socket.id} was disconnect socket`)
    })

    socket.on('disconnecting', async(reason) => {
        await chatsocket.disconnectRoom(socket.id)
        chatsocket.disconnectRoom(socket.id)
        users= await users.filter(user1=>user1.socketId!=socket.id)
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
    socket.on("likepost", async ({ post, user,status }) => {
        console.log(users)
        if(users){
            const user_post = users.find((user1) => post.user._id == user1.id);
            if(user_post && status==1){
                socket.to(`${user_post.socketId}`).emit("likepostclient", post, user);
            }
            
        }
    })
    //like comment
    socket.on("likecomment", async ({ comment, user,status }) => {
        const user_comment = users.find((user1) => comment.user._id == user1.id);
        console.log(user_comment)
        if(user_comment && status==1){
            socket.to(`${user_comment.socketId}`).emit("likecommentclient", comment, user);
        }
    })
    //bình luận post
    socket.on("comment", async ({ post, comment, user }) => {
        const user_post = users.find((user1) => post.user._id == user1.id);
        console.log(user_post)
        socket.to(`${user_post.socketId}`).emit("commentpostclient", post, comment, user);
    })
    //trả lời comment
    socket.on("replycomment", async ({ comment, user }) => {
        const user_comment = users.find((user1) => comment.user._id == user1.id);
        console.log(user_comment)
        socket.to(`${user_comment.socketId}`).emit("replycommentpostclient", comment, user);
    })

    //gửi lời mời kết bạn
    socket.on("sendfriendrequest", async ({ request, user }) => {
        const user_send = users.find((user1) => request.recever == user1.id);
        console.log(user_send)
        socket.to(`${user_send.socketId}`).emit("sendfriendrequestclient", request, user);
    })
    //chấp nhận lời mời kết bạn
    socket.on("acceptfriendrequest", async ({ request, user }) => {
        const user_accept = users.find((user1) => request.sender == user1.id);
        console.log(user_accept)
        socket.to(`${user_accept.socketId}`).emit("acceptfriendrequest", request, user);
    })
    // //Send friend request
    // socket.on("sendRequest", (msg) => {
    //     const user = users.find((user) => user.id === msg.recipient);
    //     user && socket.to(`${user.socketId}`).emit("addMessageToClient", msg);
    // })
    //Accept friend request
}

export default SocketServer
