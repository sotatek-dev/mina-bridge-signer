import { Mina } from "o1js";
import Client from "mina-signer";
// env
const networkType = 'testnet'
// KMS
const signerPrivateKeyString = 'EKEkFcCTX5upE1cyM3KuUveXWx8Mpk5ubDCDp3VqK83CtZaegdRX'
const network = Mina.Network({
    mina: 'https://proxy.devnet.minaexplorer.com/graphql'
})
Mina.setActiveInstance(network);
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
    let parsedJson
    try {
        parsedJson = JSON.parse(params.jsonTx)
    } catch (error) {
        response.message = error.message;
        response.success = false;
        response.signedTx = null;
        return response;
    }
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
    return respone;
    // const [zkAppResponse, err] = await sendZkapp(JSON.stringify(res.data.zkappCommand), 'https://proxy.devnet.minaexplorer.com/graphql')
    // console.log(zkAppResponse,err);

    // console.log(zkAppResponse.data.sendZkapp.zkapp.hash, err);
    // tx.send()
    // return response
    // const res1 = await Mina.Transaction.fromJSON(res.data.zkappCommand).send()
    // console.log(res1);

    // await res1.wait()
    // console.log('done');
};
