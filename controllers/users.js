const express = require('express')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const {createUserToken} = require("../middleware/auth")
const {checkDupes} = require("../middleware/verifySignup");

const router = express.Router()


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

router.get("/", (req, res, next) => {
    User.find({})
        .then((users) => res.json(users))
        .catch(next)
})

router.get("/signin/:id", (req, res, next) => {
    User.findById(req.params.id)
        .then((user) => res.json(user))
        .catch(next)
})

module.exports = router