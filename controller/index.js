const expressAsyncHandler = require('express-async-handler')
const userModel = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


exports.signup = expressAsyncHandler(async (req, res) => {
    try {
        const body = req.body

        const userFind = await userModel.findOne({ $or: [{ email: body.email }, { username: body.username }] })

        if (userFind && userFind.email === body.email) {
            return res.status(400).json({ success: false, message: "An account already exists with this email" })
        } else if (userFind && userFind.email === body.username) {
            return res.status(400).json({ success: false, message: "An account already exists with this username" })
        }

        if (body.password !== body.confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords didn't match" })
        }

        console.log(body);
        const passSalt = await bcrypt.genSalt(Number(process.env.SALTER))
        const passwordHash = await bcrypt.hash(body.password, passSalt)
        const result = await userModel.create({
            name: body.name,
            username: body.username,
            email: body.email,
            password: passwordHash,
            salt: passSalt,
            username: body.username
        })
        result.password = ""
        result.salt = ""
        return res.json({ success: true, message: "Account created successfully", user: result })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
})

exports.signin = expressAsyncHandler(async (req, res) => {
    try {
        const body = req.body

        const account = await userModel.findOne({ email: body.email })

        if (!account) {
            return res.status(400).json({ success: false, message: "Account not found" })
        }

        let passhash = await bcrypt.hash(body.password, account.salt)
        if (passhash !== account.password) {
            return res.status(400).json({ success: false, message: "Incorrect Password" })
        }

        let date = new Date()
        account.lastLogin = date.toISOString()
        await account.save()

        account.password = ""
        account.salt = ""
        let token = "Bearer " + jwt.sign({ userId: String(account._id) }, process.env.JWT_SIGNER)

        return res.json({ success: true, message: "Sign in successful", token, user: account })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
})