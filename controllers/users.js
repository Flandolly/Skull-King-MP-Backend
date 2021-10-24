const express = require('express')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const {createUserToken} = require("../middleware/auth")
const {checkDupes} = require("../middleware/verifySignup");
const Room = require("../models/Room");

const router = express.Router()

router.get("/", (req, res, next) => {
    User.find({})
        .populate("owner", "username")
        .then((rooms) => res.json(rooms))
        .catch(next)
})

router.get("/:id", (req, res, next) => {
    User.findById(req.params.id)
        .populate("owner", "username")
        .then((room) => res.json(room))
        .catch(next)
})

router.post("/signup", checkDupes, (req, res, next) => {
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) =>
            ({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                email: req.body.email,
                password: hash
            })
        )
        .then((user) => User.create(user))
        .then((user) => res.status(201).json(user))
        .catch(next)
})

router.post("/signin", (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => createUserToken(req, res, user))
        .then((token) => res.json({ token }))
        .catch(next);
})

module.exports = router