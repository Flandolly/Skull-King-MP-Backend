const passport = require('passport')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const secret = process.env.SECRET || "J+[xrk_7rW{j*;}@/HJud2X;a*87SAdX+4Rhz4m2M:)kJ(nyx."

const {Strategy, ExtractJwt} = require('passport-jwt')

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
}

const strategy = new Strategy(options, function (jwt_payload, done) {
    User.findById(jwt_payload.id)
        .then((user) => done(null, user))
        .catch((err) => done(err))
})

passport.use(strategy)
passport.initialize()

const requireToken = passport.authenticate("jwt", {session: true})
const createUserToken = (req, res, user) => {
    if (!user || !req.body.password || !bcrypt.compareSync(req.body.password, user.password)) {
        const err = new Error("Username or password is incorrect.")
        err.statusCode = 422
        throw err
    }
    const token = jwt.sign({id: user._id}, secret, {expiresIn: 36000})
    res.cookie("token", token, {httpOnly: true})
    return token
}

module.exports = {
    requireToken,
    createUserToken
}