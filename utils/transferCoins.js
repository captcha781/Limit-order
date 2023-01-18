const Web3 = require('web3')
const EthAccounts = require('web3-eth-accounts');
const adminstrator = require('../models/adminstrator');
const Transaction = require('../models/Transaction');
const user = require('../models/user');
const wallet = require('../models/wallet');



const transferCoins = async (from, to, value, privateKey, txType) => {
    try {
        const accounts = new EthAccounts(process.env.WEB3_URL);
        const web3 = new Web3(process.env.WEB3_URL)
        let result = { status: '', message: '' };
        const txCount = await web3.eth.getTransactionCount(from)
        const suggestion_gas = await web3.eth.getGasPrice();
        const estimate_gas = await web3.eth.estimateGas({
            'from': from,
            'nonce': txCount,
            'to': to,
            'value': web3.utils.toHex(web3.utils.toWei(String(value), 'ether')),
        });

        const txObject = {
            nonce: txCount,
            to: to,
            value: web3.utils.toHex(web3.utils.toWei(String(value), 'ether')),
            gasPrice: web3.utils.toHex(suggestion_gas),
            gasLimit: web3.utils.toHex(estimate_gas),
            chainId: 97,
        };

        let admin = await adminstrator.findOne({})
        let wallets = await wallet.findOne({
            $or: [
                { walletAddress: from },
                { walletAddress: to }
            ]
        })
        if (to === process.env.SERVER_ADDRESS) {
            if (parseFloat(wallets.assets[0].balance) <= value) {
                return { status: false, message: 'Insufficient funds' }
            }
        } else {
            if (parseFloat(admin.BNB) <= value) {
                return { status: false, message: 'Insufficient funds' }
            }
        }

        const signedTransaction = await accounts.signTransaction(txObject, privateKey);
        console.log(estimate_gas, suggestion_gas);
        let trx = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
            .on('receipt', async (receipt) => {
                console.log("Transfer of trade amount success.");
                result = { status: true, message: 'Trade of BNB is successful' }
                let transactHistory = {
                    from: from,
                    to: to,
                    amount: value,
                    isToken: false,
                    tokenName: 'BNB',
                    txHash: receipt.transactionHash,
                    type: txType
                }
                await Transaction.create(transactHistory)


                let asset = wallets.assets
                if (to === process.env.SERVER_ADDRESS) {
                    admin.BNB = parseFloat(admin.BNB) + value
                    asset[0].balance = parseFloat(asset[0].balance) - (value + parseFloat(web3.utils.fromWei(String(estimate_gas), 'ether')))

                } else {
                    admin.BNB = parseFloat(admin.BNB) - (value + parseFloat(web3.utils.fromWei(String(estimate_gas), 'ether')))
                    asset[0].balance = parseFloat(asset[0].balance) + value
                }
                await admin.save()
                await wallets.save()
                return result
            })
            .on('error', (error) => {
                console.log(error);
                result = { status: false, message: 'Transfer of funds to account failed' }
                return result
            })
        return result
    } catch (error) {
        console.log(error);
        return { status: false, message: 'Something went wrong' }
    }
}

module.exports = transferCoins