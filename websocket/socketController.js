const Room = require("../models/Room")

module.exports = function (io) {

    io.on("connection", (socket) => {
        console.log("A user just connected: ", socket.id)

        socket.on("disconnect", () => {
            console.log("A user has disconnected: ", socket.id)
        })

        socket.on("roomCreated", (room, user) => {
            Room.create(room)
                .then((newRoom) => {
                    socket.join(room._id)
                    io.emit("roomCreated", newRoom)
                    io.to(room._id).emit("syncRoom", newRoom)
                })
        })

        socket.on("syncRoom", (roomID) => {
            Room.findById(roomID)
                .populate("owner", "username")
                .then((room) => {
                    io.emit("syncRoom", room)
                })
        })

        socket.on("userJoined", (user, room) => {
            Room.findOneAndUpdate({_id: room._id}, {$push: {players: user.username}})
                .then((room) => {
                    socket.join(room._id)
                    io.emit("syncRoom", room)
                })
        })

        socket.on("userLeft", (room, user) => {
            Room.findOneAndUpdate({_id: room._id}, {$pull: {players: user.username}})
                .then((room) => {
                    io.emit("syncRoom", room)
                })
        })

        // socket.on("userJoined", (user, room) => {
        //     // console.log(rooms)
        //     console.log(room)
        //     // console.log(user)
        //     const findRoom = rooms.find(rm => rm.id === room.id)
        //     if (!findRoom) {
        //         io.emit("RoomJoinResponse", "Failure")
        //         return
        //     }
        //     io.emit("RoomJoinResponse", "Success")
        //     socket.join(room.id)
        //     findRoom.players.push(user._id)
        //     io.to(room.id).emit("syncRoom", findRoom)
        //     //console.log("Client is in rooms: ", socket.rooms)
        // })
        //
        // socket.on("userLeft", (user, room) => {
        //     const findRoom = rooms.find(rm => rm._id === room._id)
        //     if (!findRoom) {
        //         io.emit("RoomLeaveResponse", "Room Failure")
        //         return
        //     }
        //     if (!room.players.includes(user._id)) {
        //         io.emit("RoomLeaveResponse", "Player Failure")
        //         return
        //     }
        //     io.emit("RoomLeaveResponse", "Success")
        //     findRoom.players.pop(players.indexOf(user._id))
        //     io.to(room.id).emit("syncRoom", findRoom)
        //     socket.leave(room.id)
        // })

        console.log(io.of("/").sockets.size)
    })
}