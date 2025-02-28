// src/sign-eth-tx.js
import { Wallet } from "../node_modules/ethers/lib.esm/index.js";
import { config as config4 } from "../node_modules/dotenv/lib/main.js";

// src/shared/dynamodb.js
import { DynamoDBDocumentClient, GetCommand, PutCommand, TransactWriteCommand } from "../node_modules/@aws-sdk/lib-dynamodb/dist-cjs/index.js";

// src/shared/bignumber.js
import BigNumber from "../node_modules/bignumber.js/bignumber.mjs";
BigNumber.set({
  EXPONENTIAL_AT: 1e9
});
var isGreaterThan = (left, right) => BigNumber(left).isGreaterThan(right);

// src/shared/dynamodb.js
import BigNumber2 from "../node_modules/bignumber.js/bignumber.mjs";
import { config as config2 } from "../node_modules/dotenv/lib/main.js";
import assert2 from "assert";
import { DynamoDBClient } from "../node_modules/@aws-sdk/client-dynamodb/dist-cjs/index.js";

// src/shared/time.js
import moment from "../node_modules/moment/moment.js";
var getTTL = () => {
  return moment().add(5, "days").unix();
};

// src/shared/dynamodb.js
import moment2 from "../node_modules/moment/moment.js";

// src/shared/credentials.js
import { config } from "../node_modules/dotenv/lib/main.js";
import assert from "assert";
config();
var getAwsCredentials = () => {
  const nodeEnv = process.env.NODE_ENV;
  assert(!!nodeEnv, "invalid node env");
  const region2 = process.env.AWS_REGION;
  assert(!!region2, "invalid aws region");
  if (nodeEnv === "local") {
    const accessKeyId = process.env["TEMP_ACCESS_KEY_ID"];
    const secretAccessKey = process.env["TEMP_ACCESS_KEY_SCRT"];
    assert(!!accessKeyId && !!secretAccessKey, "local needs arn keys");
    return {
      region: region2,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    };
  }
  return { region: region2 };
};

// src/shared/dynamodb.js
config2();
var region = process.env["AWS_REGION"];
assert2(typeof region === "string" && region.length > 0, "invalid aws region");
var dynamodb = new DynamoDBClient(getAwsCredentials());
var ddbClient = DynamoDBDocumentClient.from(dynamodb);
var checkAndUpdatedailyQuota = async ({ dailyQuotaPerUser, dailyQuotaSystem, amount, systemKey, userKey }) => {
  const today = moment2().format("YYYY/MM/DD");
  systemKey = `${systemKey}-${today}`;
  userKey = `${userKey}-${today}`;
  const response = {
    isPassedDailyQuota: false,
    message: "ok"
  };
  const TableName = "DAILY_QUOTA";
  const systemQuota = new GetCommand({
    TableName,
    Key: {
      ID: systemKey
    }
  });
  const userQuota = new GetCommand({
    TableName,
    Key: {
      ID: userKey
    }
  });
  const [{ Item: curUserQuota = {} }, { Item: curSystemQuota = {} }] = await Promise.all([
    ddbClient.send(userQuota),
    ddbClient.send(systemQuota)
  ]);
  if (curSystemQuota?.ID && isGreaterThan(curSystemQuota.amount, dailyQuotaSystem)) {
    response.message = "over system daily quota";
    response.isPassedDailyQuota = true;
    return reponse;
  }
  if (curUserQuota?.ID && isGreaterThan(curUserQuota.amount, dailyQuotaPerUser)) {
    response.message = "over user daily quota";
    response.isPassedDailyQuota = true;
    return reponse;
  }
  const res = await ddbClient.send(new TransactWriteCommand({
    TransactItems: [
      {
        Put: {
          TableName,
          Item: {
            ID: systemKey,
            ttl: curSystemQuota?.ttl ?? getTTL(),
            amount: BigNumber2(curSystemQuota?.amount ?? 0).plus(amount).toString()
          }
        }
      },
      {
        Put: {
          TableName,
          Item: {
            ID: userKey,
            ttl: curSystemQuota?.ttl ?? getTTL(),
            amount: BigNumber2(curSystemQuota?.amount ?? 0).plus(amount).toString()
          }
        }
      }
    ]
  }));
  assert2(res.$metadata.httpStatusCode === 200, "failed to update ddb daily quota");
  return response;
};

// src/shared/secret-manager.js
import { config as config3 } from "../node_modules/dotenv/lib/main.js";
import assert3 from "assert";
import { GetSecretValueCommand, SecretsManagerClient } from "../node_modules/@aws-sdk/client-secrets-manager/dist-cjs/index.js";
config3();
var getSignerPrivateKey = async (key) => {
  const SecretId = process.env[key];
  assert3(typeof SecretId === "string" && SecretId.length > 0, "invalid SecretId");
  const client = new SecretsManagerClient(getAwsCredentials());
  const command = new GetSecretValueCommand({
    SecretId
  });
  const data = await client.send(command);
  if (data !== void 0 && data.SecretString !== void 0) {
    return Object.entries(JSON.parse(data.SecretString))[0][1];
  }
  throw new Error("cannot decrypt signer key");
};

// src/sign-eth-tx.js
config4();
async function sign_eth({ dailyQuotaPerUser, dailyQuotaSystem, amount, address, rawTxObj }) {
  const response = {
    success: true,
    signedTx: null,
    message: "ok",
    isPassedDailyQuota: false
  };
  try {
    const { isPassedDailyQuota, message } = await checkAndUpdatedailyQuota({
      dailyQuotaPerUser,
      dailyQuotaSystem,
      amount,
      systemKey: "eth-system",
      userKey: `eth-${address}`
    });
    if (isPassedDailyQuota) {
      response.isPassedDailyQuota = true;
      response.message = message;
      return;
    }
    const privateKey = await getSignerPrivateKey("SIGNER_ETH_KEY_ID");
    const wallet = new Wallet(privateKey);
    const signedTx = await wallet.signTransaction(rawTxObj);
    response.signedTx = signedTx;
  } catch (error) {
    console.log(error);
    response.success = false;
    response.message = error.message;
  } finally {
    return response;
  }
}
export {
  sign_eth
};
