const cron = require('node-cron')
const assetModel = require('../models/assets')

module.exports = () => {
    cron.schedule("*/1 * * * * *", async () => {
        const asset = await assetModel.findOne({ symbol: "BNB" })
        const upPrice = Math.floor(Math.random() * 2)
        const sign = Math.round(Math.random() * 1) === 1 ? "+" : "-"
        await assetModel.findOneAndUpdate({ symbol: "BNB" }, { $set: { assetPrice: asset.assetPrice + Number(sign + upPrice) } })
        console.log("spot price cron", "Price: ",asset.assetPrice + Number(sign + upPrice));
    })
}