const userModel = require('../models/user')
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(),
    opts.secretOrKey = process.env.JWT_SIGNER,
    opts.passReqToCallback = true


exports.users = (passport) => {
    passport.use("users",
        new JWTStrategy(opts, async function (req, jwt_payload, done) {
            try {
                this.getToken = ExtractJwt.fromHeader('authorization')
                this.token = this.getToken(req)
                let account = await userModel.findById(jwt_payload.userId)
                console.log(jwt_payload);
                if (account) {
                    account.password = ""
                    account.salt = ""
                    return done(null, account);
                }

                return done(null, false)

            } catch (err) {
                console.log(err)
                return done(err, false)
            }
        })
    )
}