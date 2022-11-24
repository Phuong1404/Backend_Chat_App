let users = [];

// const EditData = (data, id, call) => {
//     const newData = data.map((item) => {
//         item.id === id ? { ...item, call } : item
//     });
//     return newData;
// }

const SocketServer = (socket) => {
    //connect -- disconnect
    socket.on("userJoin", (user) => {
        users.push({
            id: user._id,
            socketId: socket.id,
            friend: user.friend
        })
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

    //Message
    // socket.on("addMessage", (msg) => {
    //     const user = users.find((user) => user.id === msg.recipient);
    //     user && socket.to(`${user.socketId}`).emit("addMessageToClient", msg);
    // })

    // //Send friend request
    // socket.on("sendRequest", (msg) => {
    //     const user = users.find((user) => user.id === msg.recipient);
    //     user && socket.to(`${user.socketId}`).emit("addMessageToClient", msg);
    // })
    //Accept friend request
}

export default SocketServer
