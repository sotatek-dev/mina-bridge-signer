import { DynamoDBDocumentClient, GetCommand, PutCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb"
import { isGreaterThan } from "./bignumber.js"
import BigNumber from "bignumber.js"
import { config } from 'dotenv'
import assert from 'assert'
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { getTTL } from "./time.js"
import moment from "moment"
import { getAwsCredentials } from "./credentials.js"
config()
const region = process.env['AWS_REGION']
assert(typeof region === 'string' && region.length > 0, 'invalid aws region')
const dynamodb = new DynamoDBClient(getAwsCredentials())
const ddbClient = DynamoDBDocumentClient.from(dynamodb);

/**
 * 
 * @param {{ dailyQuotaPerUser:string, dailyQuotaSystem:string, amount:string, systemKey:string, userKey:string }} param0 
 */
export const checkAndUpdatedailyQuota = async ({ dailyQuotaPerUser, dailyQuotaSystem, amount, systemKey, userKey }) => {
    const today = moment().format('YYYY/MM/DD')
    systemKey = `${systemKey}-${today}`;
    userKey = `${userKey}-${today}`;
    const response = {
        isPassedDailyQuota: false,
        message: 'ok'
    }
    const TableName = 'DAILY_QUOTA'
    const systemQuota = new GetCommand({
        TableName,
        Key: {
            ID: systemKey,
        },
    })
    const userQuota = new GetCommand({
        TableName,
        Key: {
            ID: userKey,
        },
    })
    const [{ Item: curUserQuota = {} }, { Item: curSystemQuota = {} }] = await Promise.all([
        ddbClient.send(userQuota),
        ddbClient.send(systemQuota)
    ])
    console.log(curSystemQuota?.amount, curUserQuota?.amount, amount);

    if (curSystemQuota?.ID && isGreaterThan(BigNumber(curSystemQuota.amount).plus(amount).toString() ?? 0, dailyQuotaSystem)) {
        response.message = 'over system daily quota'
        response.isPassedDailyQuota = true;
        return response;
    }
    if (curUserQuota?.ID && isGreaterThan(BigNumber(curUserQuota.amount).plus(amount).toString(), dailyQuotaPerUser)) {
        response.message = 'over user daily quota'
        response.isPassedDailyQuota = true;
        return response;
    }
    const res = await ddbClient.send(new TransactWriteCommand({
        TransactItems: [
            {
                Put: {
                    TableName,
                    Item: {
                        ID: systemKey,
                        ttl: curSystemQuota?.ttl ?? getTTL(),
                        amount: BigNumber(curSystemQuota?.amount ?? 0).plus(amount).toString()
                    }
                }
            },
            {
                Put: {
                    TableName,
                    Item: {
                        ID: userKey,
                        ttl: curUserQuota?.ttl ?? getTTL(),
                        amount: BigNumber(curUserQuota?.amount ?? 0).plus(amount).toString()
                    }
                }
            }
        ]
    }))
    assert(res.$metadata.httpStatusCode === 200, 'failed to update ddb daily quota')
    return response;
}

console.log(await checkAndUpdatedailyQuota({
    amount: '1',
    dailyQuotaPerUser: '1',
    dailyQuotaSystem: '1',
    systemKey: 'sdfsdf',
    userKey: '23f123f'
}));
