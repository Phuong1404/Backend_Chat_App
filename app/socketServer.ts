import chatsocket from './socket/chat.socket'
import User from './models/User.model'
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
    })

    //Chat socket
    socket.on('joinchat', ({ user_id, room }, callback) => {
        const { error, user } = chatsocket.addUser({ id: socket.id, user_id, room })

        if (error) {
            return callback(error);
        }
        socket.join(user.room)
        callback();
    })
    //Message
    socket.on("sendMessage", (message,room, callback) => {
        const user = chatsocket.getUser(socket.id,room)
        io.to(user.room).emit('message', { user: user.user_id, message: message })
        callback()
    })
    //Leave chat
    socket.on('leaveChat',(room,callback)=>{
        const user = chatsocket.getUser(socket.id,room)
        socket.leave(user.room)
        callback()
    })


    socket.on("disconnect", () => {
        const data = users.find((user) => user.socketId === socket.id);
        if (data) {
            const clients = users.filter((user) =>
                data.friend.find((item) => item._id === user.id)
            );

            if (clients.length > 0) {
                clients.forEach((client) => {
                    socket.to(`${client.socketId}`).emit("CheckUserOffline", data.id);
                });
            }
        }
        users = users.filter((user) => user.socketId !== socket.id);
    })

    //Check user Online / Offline
    socket.on("checkUserOnline", (data) => {
        const friend = users.filter((user) =>
            data.friend.find((item) => item._id === user.id)
        )
        socket.emit("checkUserOnlineToMe", friend);
        const clients = users.filter((user) =>
            data.friend.find((item) => item._id === user.id)
        );
        if (clients.length > 0) {
            clients.forEach((client) => {
                socket
                    .to(`${client.socketId}`)
                    .emit("checkUserOnlineToClient", data._id)
            })
        }
    })
    //Notification
    socket.on("createNotify", (msg) => {
        const client = users.find((user) => msg.receiver.includes(user.id));
        client && socket.to(`${client.socketId}`).emit("createNotifyToClient", msg);
    });

    socket.on("deleteNotify", (msg) => {
        const client = users.find((user) => msg.receiver.includes(user.id));
        client && socket.to(`${client.socketId}`).emit("deleteNotifyToClient", msg);
    });



    // //Send friend request
    // socket.on("sendRequest", (msg) => {
    //     const user = users.find((user) => user.id === msg.recipient);
    //     user && socket.to(`${user.socketId}`).emit("addMessageToClient", msg);
    // })
    //Accept friend request
}

export default SocketServer
