const web3 = require('../config/Web3Instance')

const createWallet = async () => {
    const account = await web3.eth.accounts.create()
    return account
}

module.exports = createWallet