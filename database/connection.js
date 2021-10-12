const mongoose = require('mongoose');
const mongoURI = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : "mongodb://localhost/skull-king"

mongoose
    .connect(mongoURI)
    .then((instance) => {
        console.log(`Connected to Mongo: ${instance.connections[0].name}`)
    })
    .catch((error) => console.error("Connection error: " + error))

module.exports = mongoose