const Web3 = require('web3')

const _makeConnection = (rpcurl) => {
    let returner = new Web3(rpcurl)
    return returner
}

module.exports = _makeConnection(process.env.WEB3_URL)
