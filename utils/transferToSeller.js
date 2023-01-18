const web3C = require("../config/Web3ContractInstance");
const Web3 = require("web3");
const adminstrator = require("../models/adminstrator");
const Transaction = require("../models/Transaction");
const user = require("../models/user");
const wallet = require("../models/wallet");
const EthAccounts = require('web3-eth-accounts');

const web3 = new Web3('https://data-seed-prebsc-1-s3.binance.org:8545/')
const accounts = new EthAccounts('https://data-seed-prebsc-1-s3.binance.org:8545/');

const transferToSeller = async (toAddr, tokens) => {
    try {

        let success;
        const data = web3C.methods.transfer(toAddr, web3.utils.toWei(String(tokens), 'ether')).encodeABI()
        const txCount = await web3.eth.getTransactionCount(process.env.SERVER_ADDRESS)
        const userFind = await user.findOne({ address: toAddr })
        let privateKey = process.env.SERVER_PRIVKEY

        const suggestion_gas = await web3.eth.getGasPrice();
        const estimate_gas = await web3.eth.estimateGas({
            'from': process.env.SERVER_ADDRESS,
            'nonce': txCount,
            'to': process.env.USDT_CONTRACT_ADDRESS,
            'data': data,
        });

        const txObject = {
            to: process.env.USDT_CONTRACT_ADDRESS,
            data,
            gasPrice: web3.utils.toHex(suggestion_gas),
            gasLimit: web3.utils.toHex(estimate_gas),
            chainId: 97,
        };

        let wall = await adminstrator.findOne()
        if (wall.USDT < tokens) {
            return { status: false, message: "Insufficient tokens in administrator account" }
        }

        const signedTransaction = await accounts.signTransaction(txObject, privateKey);

        let trx = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
        .on('receipt', async (receipt) => {
            console.log("-----------------------------TRANSACTION TO ADMIN RECEIPT-----------------------------")
            console.log('Transaction receipt:', receipt);
            console.log("-----------------------------xxxxxxxxxxxxxxxxxxxxxxxxxxxx-----------------------------")
            success = true

            let transactHistory = {
                from: process.env.SERVER_ADDRESS,
                to: toAddr,
                amount: tokens,
                isToken: true,
                tokenName: 'USDT',
                txHash: receipt.transactionHash,
                type: 'server-withdraw'
            }
            await Transaction.create(transactHistory)

            let wall = await wallet.findOne({ walletAddress: toAddr })
            let assets = wall.assets
            assets[1].balance = Number(assets[1].balance) + Number(tokens)
            await wallet.updateOne({ walletAddress: toAddr }, { $set: { assets: assets } })

            let serverData = await adminstrator.findOne({})
            // console.log(serverData);
            serverData.USDT = serverData.USDT - Number(tokens)
            await serverData.save()

            return "Successful transaction"

        })
        .on('error', (error) => {
            console.log("Transaction errro", error)
            success = false
            return "Failed Transaction"
        })

    } catch (error) {
        console.log(error)
        return { status: false, message: 'Something went wrong.' }
    }
}

module.exports = transferToSeller