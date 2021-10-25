const Room = require("../models/Room")
const Player = require("../Game/Player")
const Deck = require("../Game/Deck")
const Trick = require("../Game/Trick")
const Game = require("../Game/Game")

module.exports = function (io) {

    let rooms = []
    const games = []

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

        socket.on("cleanRoomList", () => {
            Room.deleteMany({players: []})
                .then(() => {
                    Room.find({})
                        .populate("owner", "username")
                        .then((roomList) => {
                            rooms = rooms.filter(room => !roomList.includes(room))
                            console.log(rooms)
                        })
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

            const newGame = {room: room.id, data: new Game(playerList, deck), gamePhase: 0, playerBids: 0, playerCards: 1, graveyard: []}
            games.push(newGame)

            io.to(room.id).emit("redirectToGameRoom")

            newGame.data.dealCards()
            //
            const connectedClients = [...io.sockets.adapter.rooms.get(room.id)]
            console.log([...io.sockets.adapter.rooms.get(room.id)])

            for (let i = 0; i < connectedClients.length; i++) {
                io.to(connectedClients[i]).emit("gameStarted", [newGame.data.players[i]])
            }
        })

        socket.on("sendBid", (playerName, bid, roomID, socketID) => {

            const foundRoomID = rooms.findIndex((room) => room._id.toString() === roomID )
            const foundRoom = games.find((game) => game.room === rooms[foundRoomID].id)

            if (foundRoom.gamePhase !== 0) {
                return
            }
            console.log(`Got bid from player ${playerName} in room ${foundRoom.room}! The bid is ${bid}`)
            io.to(parseInt(roomID)).emit("message", `${playerName} bid ${bid}.`)

            foundRoom.playerBids++
            foundRoom.data.players.find((player) => player.name === playerName).bid = bid

            const connectedClients = [...io.sockets.adapter.rooms.get(foundRoom.room)]
            io.to(socketID).emit("updateBid", bid)

            if (foundRoom.playerBids === connectedClients.length) {
                foundRoom.gamePhase++
                io.to(connectedClients[0]).emit("playerCanPlay")
            }
        })

        socket.on("sendPlayedCard", (gameState, roomID, playedCard, socketID) => {
            const foundRoomID = rooms.findIndex((room) => room._id.toString() === roomID)
            const foundRoom = games.find((game) => game.room === rooms[foundRoomID].id)
            const connectedClients = [...io.sockets.adapter.rooms.get(foundRoom.room)]

            if (foundRoom.gamePhase !== 1) {
                return
            }

            foundRoom.graveyard.push({suit: playedCard.suit, value: playedCard.value})
            foundRoom.data.players.find((player) => player.name === gameState.name).hand = gameState.hand

            console.log(`Got a card from player ${gameState.name} in room ${foundRoom.room}! The card played was ${playedCard.suit} ${playedCard.value}`)
            console.log("Current graveyard: ", foundRoom.graveyard)

            io.to(foundRoom.room).emit("message", `${gameState.name} played ${playedCard.suit} ${playedCard.value}`)

            socket.to(foundRoom.room).emit("updatePlayedCard", playedCard)

            console.log("Count: ", foundRoom.playerCards)

            if (foundRoom.playerCards !== foundRoom.data.players.length) {
                io.to(connectedClients[foundRoom.playerCards]).emit("playerCanPlay")
                foundRoom.playerCards++
            } else {
                console.log("All players have played a card.")

                const trick = new Trick(foundRoom.graveyard, foundRoom.data.players)
                const winner = trick.determineWinner()
                console.log("Winner: ", trick.determineWinner())
                foundRoom.data.players.find((player) => player.name === trick.determineWinner()).tricks++

                io.to(socketID).emit("updateTricks", foundRoom.data.players.find((player) => player.name === trick.determineWinner()).tricks)

                foundRoom.playerCards = 1
                foundRoom.graveyard = []

                io.to(foundRoom.room).emit("playerWonTrick", winner)
                io.to(foundRoom.room).emit("message", `${winner} won this trick.`)
                io.to(foundRoom.room).emit("clearLeadSuit")

                if (foundRoom.data.players.every((player) => player.hand.length !== 0)) {
                    setTimeout(() => {
                        io.to(connectedClients[0]).emit("playerCanPlay")
                    }, 5000)
                } else {
                    console.log(foundRoom.data)
                    const sortedLeaderboard = foundRoom.data.calculatePoints().sort(function (a, b) {
                        return a.points < b.points
                    })
                    io.to(foundRoom.room).emit("showLeaderboard", sortedLeaderboard)

                    if (foundRoom.data.round === foundRoom.data.rounds) {
                        setTimeout(() => {
                            io.to(foundRoom.room).emit("gameOver")
                        }, 5000)

                        setTimeout(() => {
                            io.to(foundRoom.room).emit("redirectToLobby")
                            for (let i = 0; i < connectedClients; i++) {
                                socket.leave(foundRoom.room)
                            }
                        }, 15000)
                        return
                    }

                    foundRoom.gamePhase = 0
                    foundRoom.playerBids = 0
                    foundRoom.data.round++
                    foundRoom.data.dealCards()

                    setTimeout(() => {
                        for (let i = 0; i < connectedClients.length; i++) {
                            io.to(connectedClients[i]).emit("newRoundStarted", [foundRoom.data.players[i]])
                            io.to(foundRoom.room).emit("message", `Round ${foundRoom.data.round} has started.`)
                        }

                        for (let i = 0; i < connectedClients.length; i++) {
                            io.to(connectedClients[i]).emit("getBid", [foundRoom.data.players[i], foundRoom.room])
                        }
                    }, 5000)
                }
            }
        })

        console.log(io.of("/").sockets.size)
    })
}