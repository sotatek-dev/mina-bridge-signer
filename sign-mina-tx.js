import { Mina } from "o1js";
import Client from "mina-signer";
import { config } from 'dotenv'
import assert from 'assert'
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
config()
// env

const getSignerPrivateKey = async () => {
    const region = process.env['AWS_REGION']
    const SecretId = process.env['SIGNER_MINA_KEY_ID']
    assert(typeof region === 'string' && region.length > 0, 'invalid aws region')
    assert(typeof SecretId === 'string' && SecretId.length > 0, 'invalid SecretId')

    const client = new SecretsManagerClient({
        region,
    });

    const command = new GetSecretValueCommand({
        SecretId,
    });
    const data = await client.send(command);

    if (data !== undefined && data.SecretString !== undefined) {
        return JSON.parse(data.SecretString)['SIGNER_MINA_PRIVATE_KEY']
    } throw new Error("cannot decrypt signer key")
}
const initClient = async () => {
    const networkType = process.env['MINA_NETWORK_TYPE']
    assert(networkType === 'mainnet' || networkType === 'testnet', 'invalid network type')
    
    const signerPrivateKeyString = await getSignerPrivateKey()

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
export async function sign_mina(params) {
    const response = {
        success: true,
        signedTx: undefined,
        message: "ok"
    }
    try {

        const { client, signerPrivateKeyString } = await initClient()

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
        console.log(error)
        response.message = error.message;
        response.success = false;
        response.signedTx = null;
    } finally {
        return response
    }
};