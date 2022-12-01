const users = []

const addUser = ({ id, user_id, room }) => {
    user_id = user_id.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const exstingUser = users.find((user) => user.room === room && user.user_id === user_id)
    if (exstingUser) {
        return { error: 'User has taken' };
    }
    const user = { id, user_id, room }
    users.push(user);
    return { user }
}
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id == id)
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}
const getUser = (id) => {
    return users.find((user) => user.id === id)
}
const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}
export default {
    addUser, removeUser, getUser, getUsersInRoom
}
