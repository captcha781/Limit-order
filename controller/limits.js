const expressAsyncHandler = require("express-async-handler");
const exchangeModel = require("../models/exchange")
const assetModel = require("../models/assets");
const orderModel = require("../models/orderbook")
const getSpotPrice = require("../utils/getSpotPrice");
const findStatus = require("../utils/findStatus");
const USDTconversion = require("../utils/usdtConversion");
const USDTstopPrice = require("../utils/usdtStopPrice");
const transferToAdmin = require("../utils/transferToAdmin");

exports.getBase = expressAsyncHandler(async (req, res) => {
    try {
        const base = await exchangeModel.findOne({})

        return res.json({ success: true, baseCurrency: base })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
})

exports.getAssets = expressAsyncHandler(async (req, res) => {
    try {
        let assets = await assetModel.find({})
        return res.json({ success: true, assets })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
})

exports.makeRequest = expressAsyncHandler(async (req, res) => {
    try {

        const body = req.body
        const asset = await assetModel.findOne({ symbol: body.for })
        const spotPrice = asset.assetPrice
        if (!body.exchangeType.endsWith("USDT")) {
            body.limitPrice = await USDTconversion(body)
        }

        if (body.type === "buy") {
            let tokenShift = await transferToAdmin(body.limitPrice * body.value, req.user.address)
            console.log(tokenShift);
        }

        if (body.orderType === "limit") {
            const createOrder = await orderModel.create({
                exchangeType: body.exchangeType,
                tradedFor: body.for,
                type: body.type,
                orderType: 'limit',
                value: body.value,
                status: 'open',
                requestedPrice: body.limitPrice,
                userId: req.user._id
            })
            return res.json({ success: true, message: "Your order was received successfully" })
        } else if (body.orderType === "market") {
            const createOrder = await orderModel.create({
                exchangeType: body.exchangeType,
                tradedFor: body.for,
                type: body.type,
                orderType: 'market',
                value: body.value,
                status: "open",
                requestedPrice: spotPrice,
                userId: req.user._id
            })
            return res.json({ success: true, message: "Your order was received successfully" })
        } else if (body.orderType === "stop-limit") {
            if (!body.exchangeType.endsWith("USDT")) {
                body.stop = await USDTstopPrice(body)
            }
            const createOrder = await orderModel.create({
                exchangeType: body.exchangeType,
                tradedFor: body.for,
                type: body.type,
                orderType: 'stop-limit',
                value: body.value,
                status: body.stop === spotPrice ? "open" : "unplaced",
                requestedPrice: body.limitPrice,
                stopPrice: body.stop,
                userId: req.user._id
            })
            return res.json({ success: true, message: "Your order was received successfully", type: "stop-limit" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
})
