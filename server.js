const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set("port", process.env.PORT || 8080)
app.listen(app.get("port"), () => {
    console.log("Listening on port ", app.get("port"));
})