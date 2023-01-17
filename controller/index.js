const expressAsyncHandler = require('express-async-handler')
const userModel = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const createWallet = require('../utils/createWallet')
const wallet = require('../models/wallet')
const { encrypt } = require('../utils/cryptos')
const makeWalletNum = require('../utils/makeWalletNum')


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

        const account = await createWallet()

        const ourWallet = await wallet.create({
            walletId: Math.random().toString(10).slice(2),
            walletAddress: account.address,
            assets: [
                {
                    name: "Binance",
                    symbol: "BNB",
                    network: "Binance Testnet",
                    balance: 0
                },
                {
                    name: "Binance USDT",
                    symbol: "USDT",
                    network: "Binance Testnet",
                    balance: 0
                }
            ]
        })

        const result = await userModel.create({
            name: body.name,
            username: body.username,
            email: body.email,
            password: passwordHash,
            salt: passSalt,
            username: body.username,
            address: account.address,
            privateKey: encrypt(account.privateKey),
            walletId: ourWallet.walletId
        })

        result.password = ""
        result.salt = ""
        result.privateKey = ""
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

exports.getUser = expressAsyncHandler(async (req, res) => {
    try {
        const account = await userModel.findById(req.user._id)
        account.password = ""
        account.salt = ""

        return res.json({ success: true, user: account })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
})