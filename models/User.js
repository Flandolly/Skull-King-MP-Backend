const mongoose = require('../database/connection');

const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('User', userSchema)