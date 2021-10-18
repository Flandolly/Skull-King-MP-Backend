const express = require('express');
const Room = require('../models/Room')

const router = express.Router()

router.get("/", (req, res, next) => {
    Room.find({})
        .then((user) => res.json(user))
        .catch(next)
})

module.exports = router