const Web3 = require('web3')
const LoggerAbi = require('../abi/Logger.json')
require('dotenv').config();

module.exports = async function broadcastLogTransaction(card, currency, amount) {

    let senderAddress = process.env.WALLET_ADDRESS
    let senderPrivate = process.env.WALLET_PRIVATE
    let loggerContractAddress = process.env.LOGGER_CONTRACT_ADDRESS
    let ethNodeUrl = process.env.ETHEREUM_NODE_URL

    let web3 = new Web3(ethNodeUrl)
    let networkId = await web3.eth.net.getId()
    let loggerContract = new web3.eth.Contract(
        LoggerAbi,
        loggerContractAddress
    );
    web3.eth.accounts.wallet.add(senderPrivate);

    card = web3.utils.toHex('"'.concat(card).concat('"'))
    currency = web3.utils.toHex('"'.concat(currency).concat('"'))
    amount = web3.utils.toHex('"'.concat(amount).concat('"'))

    let tx = loggerContract.methods.logTransfer(
        card,
        currency,
        amount
    )

    const gas = 50000;
    let gasPrice = await web3.eth.getGasPrice();
    gasPrice = Math.floor(gasPrice * 1.2)
    const data = tx.encodeABI();
    const nonce = await web3.eth.getTransactionCount(senderAddress);

    const signedTx = await web3.eth.accounts.signTransaction(
        {
            from: senderAddress,
            to: loggerContractAddress,
            data: data,
            gas: gas,
            gasPrice: gasPrice,
            nonce: nonce,
            chainId: networkId
        },
        senderPrivate
    );
    return await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
}
