const express = require('express');
const app = express();
const cors = require('cors');
const {createServer} = require("http");
const index = require('./routes/index')
const {handleErrors, handleValidationErrors} = require('./middleware/custom_errors')
const cookieParser = require('cookie-parser')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).send(message)
})

const userController = require("./controllers/users")
const roomController = require("./controllers/rooms")
app.use("/api", userController)
app.use("/api/rooms", roomController)
app.use(index)

const httpServer = createServer(app)
const {Server} = require('socket.io')
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
})

io.on("connection", (socket) => {
    console.log("A user just connected: ", socket.id)
    socket.on("disconnect", () => {
        console.log("A user has disconnected: ", socket.id)
    })
    // socket.on("buttonClicked", (data) => {
    //     io.emit("buttonClicked", data)
    //     cookies.set("buttonPosition", data)
    // })
    console.log(io.of("/").sockets.size)
    // if (cookies.get("buttonPosition")) {
    //     io.emit("buttonPosition", cookies.get("buttonPosition"))
    // }

})

app.use(handleValidationErrors)
app.use(handleErrors)
app.set("port", process.env.PORT || 8080)
httpServer.listen(app.get("port"), () => {
    console.log("Listening on port ", app.get("port"));
})