import { config } from 'dotenv'
import assert from 'assert'
config()

export const getAwsCredentials = () => {
    const nodeEnv = process.env.NODE_ENV
    assert(!!nodeEnv, 'invalid node env')
    const region = process.env.AWS_REGION
    assert(!!region, 'invalid aws region')

    if (nodeEnv === 'local') {
        const accessKeyId = process.env['TEMP_ACCESS_KEY_ID']
        const secretAccessKey = process.env['TEMP_ACCESS_KEY_SCRT']

        assert(!!accessKeyId && !!secretAccessKey, 'local needs arn keys')
        return {
            region,
            credentials: {
                accessKeyId,
                secretAccessKey
            }
        }
    }
    return { region }
}