let users = [];

//add user

const addUser = ({ id, userName, userImg, roomId}) => {
    if (!userName || !roomId) {
        return {
            error: "Username and room are required"
        }
    }

    const existingUser = users.find((user) => {
        return user.roomId == roomId && user.userName === userName;
    })

    // if (existingUser) {
    //     return {
    //         error: "Username is already in use!"
    //     }
    // }

    const user = {id,userName, userImg, roomId};
    
    if (!existingUser)
        users.push(user);
    return {
        user
    }
}

const removeUser = (id) => {
    const user = users.filter(user => user.id === id);
    users = users.filter(user => user.id !== id);
    return user[0];
}

const getUser = (id) => {
    return users.find((user) => user.id === id);
}

const getUsersInRoom = (roomId) => {
    return users.filter((user) => user.roomId === roomId);
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}