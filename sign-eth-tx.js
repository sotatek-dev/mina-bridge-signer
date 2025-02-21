import { config } from 'dotenv'
import { Wallet } from "ethers";
config()
// env
// KMS
const privateKey = '9b603dddc852f944a329501ae81b9e1c6f1dcdeabbdcfea8df4c20c515a30fa8'

const wallet = new Wallet(privateKey)

export async function sign_eth(params) {
    const response = {
        success: true,
        signedTx: null,
        message: 'ok'
    }
    try {
        const rawTx = await wallet.signTransaction(params)
        response.signedTx = rawTx
    } catch (error) {
        response.success = false;
        response.message = error.message
    } finally {
        return response
    }
}
