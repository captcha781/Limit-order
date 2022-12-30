const express = require('express')
const authCtrl = require('../controller/index')

const router = express.Router({ caseSensitive: true })

router.route("/signup").post(authCtrl.signup)

module.exports = router