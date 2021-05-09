const Room = require('../models/modelRoom');

module.exports = (io, amqpConn) => {
    io.on('connection', socket => {

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
    // }*/
}
