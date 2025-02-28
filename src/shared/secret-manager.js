import { config } from 'dotenv'
import assert from 'assert'
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { getAwsCredentials } from './credentials.js';
config()
/**
 * 
 * @param {'SIGNER_MINA_KEY_ID' | 'SIGNER_ETH_KEY_ID'} key 
 * @returns 
 */
export const getSignerPrivateKey = async (key) => {
    const SecretId = process.env[key]
    assert(typeof SecretId === 'string' && SecretId.length > 0, 'invalid SecretId')
    const client = new SecretsManagerClient(getAwsCredentials());

    const command = new GetSecretValueCommand({
        SecretId,
    });
    const data = await client.send(command);

    if (data !== undefined && data.SecretString !== undefined) {
        return Object.entries(JSON.parse(data.SecretString))[0][1]
    } throw new Error("cannot decrypt signer key")
}
