const User = require('../models/User')

const checkDupes = (req, res, next) => {
    User.findOne({username: req.body.username})
        .exec((err, user) => {
            if (user) {
                return res.status(422).json({response: "Username already in use."})
            }
            User.findOne({email: req.body.email})
                .exec((err, user) => {
                    if (user) {
                        return res.status(422).send({response: "Email already in use."})
                    }
                    next()
                })
        })
}

module.exports = {
    checkDupes
}