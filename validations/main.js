const isEmpty = require("../utils/isEmpty")

exports.signup = (req, res, next) => {
    try {
        const { body } = req
        let errors = {}

        if (isEmpty(body.email)) {
            errors.email = "Email cannot be empty"
        }

        if (isEmpty(body.password)) {
            errors.email = "Password cannot be empty"
        }

        if (isEmpty(body.username)) {
            errors.username = "Username cannot be empty"
        } else if (body.username && body.username.length <= 5) {
            errors.username = "Username should have 6 or more characters"
        }

        if (isEmpty(body.confirmPassword)) {
            errors.confirmPassword = "Confirm password is empty."
        }

        if (!isEmpty(errors)) {
            return res.status(400).json({ success: true, message: "Errors on Signup", errors })
        } else {
            return next()
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

exports.signin = (req, res, next) => {
    try {
        const body = req.body
        let errors = {}

        if (isEmpty(body.email)) {
            errors.email = "Email cannot be empty"
        }

        if (isEmpty(body.password)) {
            errors.password = "Password cannot be empty"
        }

        if (!isEmpty(errors)) {
            return res.status(400).json({ success: true, message: "Errors on Signin", errors })
        } else {
            return next()
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}