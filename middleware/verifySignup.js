const User = require('../models/User')

/*
    Sourced from: https://www.bezkoder.com/node-js-mongodb-auth-jwt/
 */

const checkDupes = (req, res, next) => {
    User.findOne({username: req.body.username})
        .exec((err, user) => {
            if (user) {
                res.status(422).json({response: "Username already in use."})
                return
            }
            User.findOne({email: req.body.email})
                .exec((err, user) => {
                    if (user) {
                        res.status(422).send({response: "Email already in use."})
                        return
                    }
                    next()
                })
        })
}

module.exports = {
    checkDupes
}