const express = require('express')
const authCtrl = require('../controller/index')
const authValid = require("../validations/main")
const passporter = require("../authentication/passport");
const passport = require('passport');

const passportAuth = passport.authenticate("users", { session: false });

const router = express.Router({ caseSensitive: true })

router.route("/signup").post(authValid.signup, authCtrl.signup)
router.route("/signin").post(authValid.signin, authCtrl.signin)
router.route("/viewuser").get(passportAuth, authCtrl.getUser)

module.exports = router