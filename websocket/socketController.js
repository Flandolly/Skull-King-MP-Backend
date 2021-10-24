const Room = require("../models/Room")
const Player = require("../Game/Player")
const Deck = require("../Game/Deck")
const Trick = require("../Game/Trick")
const Game = require("../Game/Game")

module.exports = function (io) {

    const rooms = []
    const games = []
    let bidMade = false

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
                    // console.log("SyncRoom: ", room)
                    console.log(socket.rooms)
                    io.to(roomID).emit("syncRoom", room)
                })
        })

        socket.on("userJoined", (user, room) => {
            Room.findOneAndUpdate({_id: room._id}, {$push: {players: user.username}}, {new: true})
                .then((room) => {
                    // console.log("userJoin: ", room)
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
            const deck = new Deck()
            const playerList = []

            for (const player of room.players) {
                playerList.push(new Player(player))
            }
            deck.build()

            //const newGame = new Game(playerList, deck)

            games.push({room: room.id, data: new Game(playerList, deck)})

            // console.log(games[0].data.players)
            // console.log(room.players)
            const foundRoom = games.find((game) => game.room === room.id)
            //console.log(foundRoom.data)

            io.to(room.id).emit("redirectToGameRoom")

            foundRoom.data.dealCards()
            //
            const connectedClients = [...io.sockets.adapter.rooms.get(room.id)]
            console.log([...io.sockets.adapter.rooms.get(room.id)])

            for (let i = 0; i < connectedClients.length; i++) {
                io.to(connectedClients[i]).emit("gameStarted", [foundRoom.data.players[i], foundRoom.data.graveyard])
            }

            setTimeout(() => {
                for (let i = 0; i < connectedClients.length; i++) {
                    io.to(connectedClients[i]).emit("getBid", [foundRoom.data.players[i], foundRoom.room])
                }
            }, 20000)
        })


        socket.on("sendBid", (gameState, roomID, socketID) => {
            let count = 0
            const foundRoomID = rooms.findIndex((room) => room._id.toString() === roomID )
            const foundRoom = games.find((game) => game.room === rooms[foundRoomID].id)
            console.log(gameState)
            console.log(`Got bid from player ${gameState.name} in room ${foundRoom.room}! The bid is ${gameState.bid}`)

            foundRoom.data.players.find((player) => player.name === gameState.name).bid = gameState.bid

            //console.log(foundRoom.data)

            const connectedClients = [...io.sockets.adapter.rooms.get(foundRoom.room)]

            if (socketID !== connectedClients[0]) {
                return
            }
            console.log("sendBid emitted")
            io.to(connectedClients[count]).emit("playerCanPlay")

            const cardTimer = setInterval(() => {
                io.to(connectedClients[count]).emit("getPlayedCard", [foundRoom.data.players[count], foundRoom.room])
                count++

                if (count === connectedClients.length) {
                    clearInterval(cardTimer)
                    io.to(connectedClients[0]).emit("trickFinished")
                } else {
                    io.to(connectedClients[count]).emit("playerCanPlay")
                }
            }, 10000)
        })

        socket.on("sendPlayedCard", (gameState, roomID, playedCard) => {
            const foundRoomID = rooms.findIndex((room) => room._id.toString() === roomID )
            const foundRoom = games.find((game) => game.room === rooms[foundRoomID].id)
            console.log(`Got a card from player ${gameState.name} in room ${foundRoom.room}! The card played was ${playedCard[0].suit} ${playedCard[0].value}`)
            socket.to(foundRoom.room).emit("updatePlayedCard", playedCard)
        })

        console.log(io.of("/").sockets.size)
    })
}