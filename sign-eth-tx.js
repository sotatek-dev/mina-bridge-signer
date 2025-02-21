import Web3 from "web3";

// env
const rpc = 'https://ethereum-sepolia.publicnode.com'
// KMS
const privateKey = '9b603dddc852f944a329501ae81b9e1c6f1dcdeabbdcfea8df4c20c515a30fa8'

const provider = new Web3(rpc)
const account = provider.eth.accounts.privateKeyToAccount(privateKey);

export async function sign_eth(params) {
    const response = {
        success: true,
        signedTx: null,
        message: 'ok'
    }
    try {
        const { rawTransaction, transactionHash } = await account.signTransaction(params)
        response.signedTx = { rawTransaction, transactionHash }
    } catch (error) {
        response.success = false;
        response.message = error.message
    } finally {
        return response
    }
}