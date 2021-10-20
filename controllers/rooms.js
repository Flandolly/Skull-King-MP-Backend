const express = require('express');
const Room = require('../models/Room')

const router = express.Router()

router.get("/", (req, res, next) => {
    Room.find({})
        .populate("owner", "username")
        .then((rooms) => res.json(rooms))
        .catch(next)
})

router.get("/:id", (req, res, next) => {
    Room.findById(req.params.id)
        .populate("owner", "username")
        .then((room) => res.json(room))
        .catch(next)
})

router.post("/new", (req, res, next) => {
    Room.create(req.body)
        .then((user) => res.status(201).json(user))
        .catch(next)
})

router.put("/:id", (req, res, next) => {
    // console.log(req)
    // Room.findById(req.params.id)
    //     .then((room) => room.set(req.body).update())
    //     .then((room) => res.json(room))
    //     .catch(next)
    Room.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})
        .then((room) => res.json(room))
        .catch(next)
})

module.exports = router