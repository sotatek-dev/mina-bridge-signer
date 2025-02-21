import { assert, Wallet } from "ethers";
import { config } from 'dotenv'
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
config()

const getSignerPrivateKey = async () => {
    const region = process.env['AWS_REGION']
    const SecretId = process.env['SIGNER_ETH_KEY_ID']
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
        return JSON.parse(data.SecretString)['SIGNER_PRIVATE_KEY']
    } throw new Error("cannot decrypt signer key")
}
export async function sign_eth(params) {
    const response = {
        success: true,
        signedTx: null,
        message: 'ok'
    }
    try {

        const privateKey = await getSignerPrivateKey()
        const wallet = new Wallet(privateKey)

        const rawTx = await wallet.signTransaction(params)
        response.signedTx = rawTx
    } catch (error) {
        console.log(error);
        response.success = false;
        response.message = error.message
    } finally {
        return response
    }
}
console.log(await sign_eth({}))