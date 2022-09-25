import { Server as HttpServer } from 'http';
import { Socket, Server } from 'socket.io';
import { v4 } from 'uuid';

export class ServerSocket {
    public static instance: ServerSocket;
    public io: Server

    //List connected users
    public users: { [uid: string]: string };

    constructor(server: HttpServer) {
        ServerSocket.instance = this;
        this.users = {};
        this.io = new Server(server, {
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false,
            cors: {
                origin: '*'
            }
        });

        this.io.on('connect', this.StartListeners)
    }
    StartListeners = (socket: Socket) => {
        console.log(socket.handshake.headers)
        console.log('Message received from ' + socket.id);

        socket.on('handshake', (callback: (uid: string, users: string[]) => void) => {
            console.log('Handshake received from: ' + socket.id);

            const reconnected = Object.values(this.users).includes(socket.id);

            if (reconnected) {
                console.log('This user has reconnected.');

                const uid = this.GetUidFromSocketID(socket.id);
                const users = Object.values(this.users);

                if (uid) {
                    console.log('Sending callback for reconnect ...');
                    callback(uid, users);
                    return;
                }
            }

            const uid = v4();
            this.users[uid] = socket.id;

            const users = Object.values(this.users);
            console.log('Sending callback ...');
            callback(uid, users);

            this.SendMessage(
                'user_connected',
                users.filter((id) => id !== socket.id),
                users
            );
        });

        socket.on('disconnect', () => {
            console.log('Disconnect received from: ' + socket.id);

            const uid = this.GetUidFromSocketID(socket.id);

            if (uid) {
                delete this.users[uid];

                const users = Object.values(this.users);

                this.SendMessage('user_disconnected', users, socket.id);
            }
        });
    };

    GetUidFromSocketID = (id: string) => {
        return Object.keys(this.users).find((uid) => this.users[uid] === id);
    };

    SendMessage = (name: string, users: string[], payload?: Object) => {
        console.log('Emitting event: ' + name + ' to', users);
        users.forEach((id) => (payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name)));
    };
}
