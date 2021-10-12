const express = require('express');
const app = express();
const cors = require('cors');
const { handleErrors, handleValidationErrors } = require('./middleware/custom_errors')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).send(message)
})

app.get('/', (req, res) => {
    res.send("Hello, world!")
})

app.use(handleValidationErrors)
app.use(handleErrors)
app.set("port", process.env.PORT || 8080)
app.listen(app.get("port"), () => {
    console.log("Listening on port ", app.get("port"));
})