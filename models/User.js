const mongoose = require('../database/connection');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
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
        toJSON: {
            virtuals: true,
            transform: (_document, ret) => {
                delete ret.password
                return ret
            },
        }
    }
)

module.exports = mongoose.model('User', userSchema)