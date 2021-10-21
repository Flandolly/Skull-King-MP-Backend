const Room = require("../models/Room")

module.exports = function (io) {

    io.on("connection", (socket) => {
        console.log("A user just connected: ", socket.id)

        socket.on("disconnect", () => {
            console.log("A user has disconnected: ", socket.id)
        })

        socket.on("roomCreated", (room) => {
            Room.create(room)
                .then((newRoom) => {
                    socket.join(newRoom.id)
                    io.to(newRoom.id).emit("roomCreated", newRoom)
                    io.to(newRoom.id).emit("syncRoom", newRoom)
                })
        })

        socket.on("syncRooms", (roomID) => {
            Room.findById(roomID)
                .populate("owner", "username")
                .then((room) => {
                    console.log("SyncRoom: ", room)
                    console.log(socket.rooms)
                    io.to(roomID).emit("syncRoom", room)
                })
        })

        socket.on("userJoined", (user, room) => {
            Room.findOneAndUpdate({_id: room._id}, {$push: {players: user.username}}, {new: true})
                .then((room) => {
                    console.log("userJoin: ", room)
                    socket.join(room.id)
                    io.to(room.id).emit("syncRoom", room)
                })
        })

        socket.on("userLeft", (room, user) => {
            Room.findOneAndUpdate({_id: room._id}, {$pull: {players: user.username}}, {new: true})
                .then((room) => {
                    io.to(room.id).emit("syncRoom", room)
                    socket.leave(room.id)
                })
        })

        socket.on("chatMessage", (roomID, message) => {
            console.log("roomID: ", roomID)
            console.log("message: ", message)
            io.to(parseInt(roomID)).emit("message", message)
        })

        console.log(io.of("/").sockets.size)
    })
}