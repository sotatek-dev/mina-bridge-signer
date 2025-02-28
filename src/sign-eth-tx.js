import { Wallet } from "ethers";
import { config } from 'dotenv'
import { checkAndUpdatedailyQuota } from "./shared/dynamodb.js";
import { getSignerPrivateKey } from "./shared/secret-manager.js";
config()

export async function sign_eth({ dailyQuotaPerUser, dailyQuotaSystem, amount, address, rawTxObj }) {
    const response = {
        success: true,
        signedTx: null,
        message: 'ok',
        isPassedDailyQuota: false
    }
    try {
        const { isPassedDailyQuota, message } = await checkAndUpdatedailyQuota({
            dailyQuotaPerUser, dailyQuotaSystem, amount, systemKey: 'eth-system', userKey: `eth-${address}`
        })
        if (isPassedDailyQuota) {
            response.isPassedDailyQuota = true;
            response.message = message;
            return
        }
        const privateKey = await getSignerPrivateKey('SIGNER_ETH_KEY_ID')
        const wallet = new Wallet(privateKey)

        const signedTx = await wallet.signTransaction(rawTxObj)
        response.signedTx = signedTx
    } catch (error) {
        console.log(error);
        response.success = false;
        response.message = error.message
    } finally {
        return response
    }
}