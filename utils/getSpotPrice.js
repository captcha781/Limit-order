const assetModel = require('../models/assets')

const getSpotPrice = async (symbol) => {

    let asset = await assetModel.findOne({ symbol })
    return asset.assetPrice

}

module.exports = getSpotPrice