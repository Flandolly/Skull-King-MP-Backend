const express = require('express');
const Room = require('../models/Room')

const router = express.Router()

router.get("/", (req, res, next) => {
    Room.find({})
        .populate("owner", "username")
        .then((user) => res.json(user))
        .catch(next)
})

router.post("/new", (req, res, next) => {
    Room.create(req.body)
        .then((user) => res.status(201).json(user))
        .catch(next)
})

module.exports = router