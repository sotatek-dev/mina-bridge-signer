import { Wallet } from "ethers";

export async function sign_eth(params) {
    const response = {
        success: true,
        signedTx: null,
        message: 'ok'
    }
    try {
        
        // get private key from kms
        const privateKey='69af57709d4ecd41e5241ad65221a082eba6ef96c55b7f03bdb805fd10218f60'
        const wallet = new Wallet(privateKey)

        const rawTx = await wallet.signTransaction(params)
        response.signedTx = rawTx
    } catch (error) {
        response.success = false;
        response.message = error.message
    } finally {
        return response
    }
}
