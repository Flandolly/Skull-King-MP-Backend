const express = require('express')
const User = require('../models/User')
const bcrypt = require('bcrypt')

const router = express.Router()

router.post("/signup", (req, res, next) => {
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
    // User.create(req.body)
    //     .then((user) => res.status(201).json(user))
    //     .catch(next);
})

router.post("/signin", (req, res, next) => {

})

module.exports = router