const mongoose = require("../database/connection")
const autoSequence = require("mongoose-sequence")(mongoose)

const roomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: "New Game"
        },
        players: {
            type: [String],
            ref: "User",
        },
        maxPlayers: {
            type: Number,
            required: true
        },
        isPublic: {
            type: Boolean,
            default: true
        },
        status: {
            type: String,
            default: "Waiting for Players"
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
)

roomSchema.plugin(autoSequence, {inc_field: "id"})
module.exports = mongoose.model("Room", roomSchema)