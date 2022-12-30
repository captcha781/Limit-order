const expressAsyncHandler = require('express-async-handler')
const userModel = require('../models/user')


exports.signup = expressAsyncHandler(async (req, res) => {
    try {
        const { body } = req

        const userFind = await userModel.findOne({ $or: [{ email: body.email }, { username: body.username }] })

        if (userFind && userFind.email === body.email) {
            return res.status(400).json({ success: false, message: "An account already exists with this email" })
        } else if (userFind && userFind.email === body.username) {
            return res.status(400).json({ success: false, message: "An account already exists with this username" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
})