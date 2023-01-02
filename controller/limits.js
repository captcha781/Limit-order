const expressAsyncHandler = require("express-async-handler");
const exchangeModel = require("../models/exchange")
const assetModel = require("../models/assets");
const orderModel = require("../models/orderbook")
const getSpotPrice = require("../utils/getSpotPrice");
const findStatus = require("../utils/findStatus");

exports.getBase = expressAsyncHandler(async (req, res) => {
    try {
        const base = await exchangeModel.findOne({})

        return res.json({ success: true, baseCurrency: base })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
})

exports.makeRequest = expressAsyncHandler(async (req, res) => {
    try {

        const body = req.body
        let spotPrice = await getSpotPrice(body.for)
        let base = await exchangeModel.findOne({})

        let findMatch = await orderModel.findOne({
            type: body.type === "sell" ? "buy" : "sell",
            orderType: body.orderType,
            value: body.value,
            requestedPrice: body.requestedPrice,
            status: "open",
            userId: { $ne: req.user._id }
        })

        if (!findMatch) {
            if (body.type === "buy") {
                let pup = body.requestedPrice;
                if (!body.exchangeType.endsWith(base.baseCurrency)) {
                    let bytype = body.exchangeType.replace(body.for, "")
                    let getByTypePrice = await assetModel.findOne({ symbol: bytype })
                    if (!getByTypePrice) {
                        return res.status(400).json({ success: false, message: "The requested Exchange method is not available" })
                    }
                    pup = getByTypePrice.assetPrice * body.requestedPrice
                }
                const statusFinder = findStatus(body, spotPrice)
                let createOrder = await orderModel.create({
                    exhangeType: body.exchangeType,
                    tradedFor: body.for,
                    type: body.type,
                    orderType: body.orderType,
                    value: body.value,
                    requestedPrice: pup,
                    status: statusFinder,
                    limitPrice: body.orderType !== "market" ? body.limit : 0,
                    stopPrice: body.orderType === "stop-limit" ? body.stop : 0,
                    userId: req.user._id
                })
                return res.json({ success: true, message: `Your order of ${body.type} for ${body.value} ${body.for} is successfully placed!`, result: createOrder })
            } else {

            }
        } else {
            
        }

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