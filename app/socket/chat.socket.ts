const users1 = []

const addUser = ({ id, user_id, room }) => {
    user_id = user_id.trim().toLowerCase();
    room = room.trim().toLowerCase();
    const exstingUser = users1.find((user) => user.room === room && user.user_id === user_id)
    if (exstingUser) {
        return { error: 'User has taken' };
    }
    const user = { id, user_id, room }
    users1.push(user);
    return { user }
}
const removeUser = (id, room) => {
    room = room.trim().toLowerCase();
    const index = users1.findIndex((user) => user.id == id && user.room === room)
    if (index !== -1) {
        return users1.splice(index, 1)[0];
    }
}
const getUser = (id, room) => {
    room = room.trim().toLowerCase();
    const user = users1.find((user) => user.id === id && user.room === room)
    if (user) {
        return user
    }
    return { error: 'User not found' };
}
const getusers1InRoom = (room) => {
    return users1.filter((user) => user.room === room)
}
export default {
    addUser, removeUser, getUser, getusers1InRoom
}
