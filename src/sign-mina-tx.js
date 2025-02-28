import { Mina } from "o1js";
import Client from "mina-signer";
import { config } from 'dotenv'
import assert from 'assert'
import { getSignerPrivateKey } from "./shared/secret-manager.js";
import { checkAndUpdatedailyQuota } from "./shared/dynamodb.js";
import { readFile } from "fs/promises";
config()
// env
const initClient = async () => {
    const networkType = process.env['MINA_NETWORK_TYPE']
    assert(networkType === 'mainnet' || networkType === 'testnet', 'invalid network type')

    const signerPrivateKeyString = await getSignerPrivateKey('SIGNER_MINA_KEY_ID')

    const client = new Client({
        network: networkType
    })
    return { client, signerPrivateKeyString };
}
/*
 * 
 * @param {{jsonTx:string}} params 
 * @returns 
 */
export async function sign_mina({ jsonTx, dailyQuotaPerUser, dailyQuotaSystem, amount, address }) {
    const response = {
        success: true,
        signedTx: undefined,
        message: "ok",
        isPassedDailyQuota: false
    }
    try {
        const { isPassedDailyQuota, message } = await checkAndUpdatedailyQuota({
            amount, dailyQuotaPerUser, dailyQuotaSystem, systemKey: 'mina-system', userKey: `mina-${address}`
        })
        if (isPassedDailyQuota) {
            response.isPassedDailyQuota = isPassedDailyQuota
            response.success = false;
            response.message = message;
            return response;
        }
        const { client, signerPrivateKeyString } = await initClient()

        const parsedJson = JSON.parse(jsonTx)
        const tx = Mina.Transaction.fromJSON(parsedJson)

        const fee = tx.transaction.feePayer.body.fee.toJSON();
        const sender = tx.transaction.feePayer.body.publicKey.toBase58();
        const nonce = Number(tx.transaction.feePayer.body.nonce.toBigint());
        const memo = tx.transaction.memo;
        const minaSignerPayload = {
            zkappCommand: parsedJson,
            feePayer: {
                feePayer: sender,
                fee,
                nonce,
                memo,
            },
        };

        const res = client.signTransaction(minaSignerPayload, signerPrivateKeyString)
        response.signedTx = res.data.zkappCommand;
    } catch (error) {
        console.log(error)
        response.message = error.message;
        response.success = false;
        response.signedTx = null;
    } finally {
        return response
    }
};