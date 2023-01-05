const assetModel = require("../models//assets")

const USDTconversion = async (body) => {
    let rcvdType = body.exchangeType.replace(body.for, "")
    let recvAssetPrice = await assetModel.findOne({ symbol: rcvdType })
    return body.limitPrice * recvAssetPrice.assetPrice
}

module.exports = USDTconversion