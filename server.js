const express = require('express');
const app = express();
const cors = require('cors');
const http = require("http");
const index = require('./routes/index')
const {handleErrors, handleValidationErrors} = require('./middleware/custom_errors')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).send(message)
})

const userController = require("./controllers/users")
app.use("/api", userController)
app.use(index)

const server = http.createServer(app)
const socketIO = require('socket.io')
const io = socketIO(server, {
    cors: {
        origin: "*"
    }
})

let interval

io.on("connection", (socket) => {
    console.log("Client connection established")
    if (interval) {
        clearInterval(interval)
    }
    interval = setInterval(() => getApiAndEmit(socket), 50)
    socket.on("disconnect", () => {
        console.log("Client disconnected.")
    })
})

const getApiAndEmit = (socket) => {
    const response = new Date()
    socket.emit("FromAPI", response)
}

app.use(handleValidationErrors)
app.use(handleErrors)
app.set("port", process.env.PORT || 8080)
server.listen(app.get("port"), () => {
    console.log("Listening on port ", app.get("port"));
})