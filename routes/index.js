const express = require('express')
const authCtrl = require('../controller/index')
const authValid = require("../validations/main")

const router = express.Router({ caseSensitive: true })

router.route("/signup").post(authValid.signup, authCtrl.signup)
router.route("/signin").post(authValid.signin, authCtrl.signin)

module.exports = router