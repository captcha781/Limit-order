const express = require('express')
const limtCtrl = require('../controller/limits')
const passport = require('passport')

const router = express.Router({ caseSensitive: true })
const passportAuth = passport.authenticate("users", { session: false })

router.route("/assets").get(limtCtrl.getAssets)
router.route("/getBaseCurrency").get(limtCtrl.getBase)
router.route("/makeRequest").post(passportAuth, limtCtrl.makeRequest)

module.exports = router