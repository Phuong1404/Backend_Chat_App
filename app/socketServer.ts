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
    socket.on('joinchat', ({ user_id, room }) => {
        const { error, user } = chatsocket.addUser({ id: socket.id, user_id, room })
        socket.join(user.room)
    })
    //Message
    socket.on("sendMessage", (message, room) => {
        const user = chatsocket.getUser(socket.id, room)
        io.to(user.room).emit('message', { user: user.user_id, message: message })
    })
    //Leave chat
    socket.on('leaveChat', (room) => {
        const user = chatsocket.getUser(socket.id, room)
        socket.leave(user.room)
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
    socket.on("createNotify", (user_id, notify) => {
        const user_receiver = users.find((user) => user_id.includes(user.id));
        user_receiver && socket.to(`${user_id}`).emit("createNotifyToClient", notify);
    })
    socket.on("deleteNotify", (user_id, notify) => {
        const user_receiver = users.find((user) => user_id.includes(user.id));
        user_receiver && socket.to(`${user_id}`).emit("deleteNotifyToClient", notify);
    })
    // socket.on("createNotify", (msg) => {
    //     const client = users.find((user) => msg.receiver.includes(user.id));
    //     client && socket.to(`${client.socketId}`).emit("createNotifyToClient", msg);
    // });

    // socket.on("deleteNotify", (msg) => {
    //     const client = users.find((user) => msg.receiver.includes(user.id));
    //     client && socket.to(`${client.socketId}`).emit("deleteNotifyToClient", msg);
    // });



    // //Send friend request
    // socket.on("sendRequest", (msg) => {
    //     const user = users.find((user) => user.id === msg.recipient);
    //     user && socket.to(`${user.socketId}`).emit("addMessageToClient", msg);
    // })
    //Accept friend request
}

export default SocketServer
