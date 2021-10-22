const Room = require("../models/Room")
const Player = require("../Game/Player")
const Deck = require("../Game/Deck")
const Card = require("../Game/Card")
const Trick = require("../Game/Trick")
const Game = require("../Game/Game")

module.exports = function (io) {

    const rooms = []
    let players = []
    const deck = new Deck()
    deck.build()

    io.on("connection", (socket) => {
        console.log("A user just connected: ", socket.id)

        socket.on("disconnect", () => {
            console.log("A user has disconnected: ", socket.id)
        })

        socket.on("roomCreated", (room) => {
            Room.create(room)
                .then((newRoom) => {
                    socket.join(newRoom.id)
                    rooms.push(newRoom)
                    io.to(newRoom.id).emit("roomCreated", newRoom)
                    io.to(newRoom.id).emit("syncRoom", newRoom)
                    io.emit("roomList", rooms)
                })
        })

        socket.on("syncRoom", (roomID) => {
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
                    io.emit("roomList", rooms)
                })
        })

        socket.on("userLeft", (room, user) => {
            Room.findOneAndUpdate({_id: room._id}, {$pull: {players: user.username}}, {new: true})
                .then((room) => {
                    io.to(room.id).emit("syncRoom", room)
                    io.emit("roomList", rooms)
                    socket.leave(room.id)
                })
        })

        socket.on("chatMessage", (roomID, message) => {
            console.log("roomID: ", roomID)
            console.log("message: ", message)
            io.to(parseInt(roomID)).emit("message", message)
        })

        socket.on("startGame", (room) => {
            for (const player of room.players) {
                players.push(player)
            }
            socket.join(`${room.id}_PLAYING`)
            io.to(room.id).emit("redirectToGameRoom")
        })

        socket.on("initializeGame", () => {
            const playerList = []
            for (const player of players) {
                playerList.push(new Player(player))
            }
            console.log("game initializing")
            deck.shuffle()
            console.log(deck.show())
        })

        console.log(io.of("/").sockets.size)
    })
}