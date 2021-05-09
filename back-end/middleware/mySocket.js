const Room = require('../models/modelRoom');

module.exports = (io) => {
    io.on('connection', socket => {
        socket.on('new-user', (room, idUser, name) => {
            socket.join(room)
            Room.find({name: room})
                .lean()
                .exec()
                .then(room => {
                    room[0].allowUser.push(idUser);
                    room[0].save(done);
                    socket.to(room[0].name).broadcast.emit('user-connected', name)
                });
        })
        // socket.on('send-chat-message', (room, message) => {
        //     Room.find({name: room})
        //         .lean()
        //         .exec()
        //         .then(room => {
        //             socket.to(room).broadcast.emit('chat-message', { message: message, name:  })
        //         });
        // })
        // socket.on('disconnect', () => {
        //     getUserRooms(socket).forEach(room => {
        //         socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
        //         delete rooms[room].users[socket.id]
        //     })
        // })
    })
    // function getUserRooms(socket) {
    //     return Object.entries(rooms).reduce((names, [name, room]) => {
    //         if (room.users[socket.id] != null) names.push(name)
    //         return names
    //     }, [])
    // }
}
