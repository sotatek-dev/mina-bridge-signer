import { Mina } from "o1js";
import Client from "mina-signer";
import { config } from 'dotenv'
import assert from 'assert'
config()
// env
const networkType = process.env['MINA_NETWORK_TYPE'] ?? 'testnet'
// KMS
const signerPrivateKeyString = 'EKEkFcCTX5upE1cyM3KuUveXWx8Mpk5ubDCDp3VqK83CtZaegdRX'

// env assertion
assert(networkType === 'mainnet' || networkType === 'testnet', 'invalid network type')
//
const client = new Client({
    network: networkType
})
/*
 * 
 * @param {{jsonTx:string}} params 
 * @returns 
 */
export async function sign_mina(params) {
    const response = {
        success: true,
        signedTx: undefined,
        message: "ok"
    }
    try {
        const parsedJson = JSON.parse(params.jsonTx)
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
        response.message = error.message;
        response.success = false;
        response.signedTx = null;
    } finally {
        return response
    }
};
