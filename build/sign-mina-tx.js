// src/sign-mina-tx.js
import { Mina } from "../node_modules/o1js/dist/node/index.js";
import Client from "../node_modules/mina-signer/dist/node/mina-signer/mina-signer.js";
import { config as config4 } from "../node_modules/dotenv/lib/main.js";
import assert4 from "assert";

// src/shared/secret-manager.js
import { config as config2 } from "../node_modules/dotenv/lib/main.js";
import assert2 from "assert";
import { GetSecretValueCommand, SecretsManagerClient } from "../node_modules/@aws-sdk/client-secrets-manager/dist-cjs/index.js";

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

// src/shared/secret-manager.js
config2();
var getSignerPrivateKey = async (key) => {
  const SecretId = process.env[key];
  assert2(typeof SecretId === "string" && SecretId.length > 0, "invalid SecretId");
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
import { config as config3 } from "../node_modules/dotenv/lib/main.js";
import assert3 from "assert";
import { DynamoDBClient } from "../node_modules/@aws-sdk/client-dynamodb/dist-cjs/index.js";

// src/shared/time.js
import moment from "../node_modules/moment/moment.js";
var getTTL = () => {
  return moment().add(5, "days").unix();
};

// src/shared/dynamodb.js
import moment2 from "../node_modules/moment/moment.js";
config3();
var region = process.env["AWS_REGION"];
assert3(typeof region === "string" && region.length > 0, "invalid aws region");
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
    return response;
  }
  if (curUserQuota?.ID && isGreaterThan(curUserQuota.amount, dailyQuotaPerUser)) {
    response.message = "over user daily quota";
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
  assert3(res.$metadata.httpStatusCode === 200, "failed to update ddb daily quota");
  return response;
};

// src/sign-mina-tx.js
config4();
var initClient = async () => {
  const networkType = process.env["MINA_NETWORK_TYPE"];
  assert4(networkType === "mainnet" || networkType === "testnet", "invalid network type");
  const signerPrivateKeyString = await getSignerPrivateKey("SIGNER_MINA_KEY_ID");
  const client = new Client({
    network: networkType
  });
  return { client, signerPrivateKeyString };
};
async function sign_mina({ jsonTx, dailyQuotaPerUser, dailyQuotaSystem, amount, address }) {
  const response = {
    success: true,
    signedTx: void 0,
    message: "ok",
    isPassedDailyQuota: false
  };
  try {
    response.isPassedDailyQuota = await checkAndUpdatedailyQuota({
      amount,
      dailyQuotaPerUser,
      dailyQuotaSystem,
      systemKey: "mina-system",
      userKey: `mina-${address}`
    });
    if (response.isPassedDailyQuota) {
      response.success = false;
      response.message = "over daily quota";
      return response;
    }
    const { client, signerPrivateKeyString } = await initClient();
    const parsedJson = JSON.parse(jsonTx);
    const tx = Mina.Transaction.fromJSON(parsedJson);
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
        memo
      }
    };
    const res = client.signTransaction(minaSignerPayload, signerPrivateKeyString);
    response.signedTx = res.data.zkappCommand;
  } catch (error) {
    console.log(error);
    response.message = error.message;
    response.success = false;
    response.signedTx = null;
  } finally {
    return response;
  }
}
export {
  sign_mina
};
