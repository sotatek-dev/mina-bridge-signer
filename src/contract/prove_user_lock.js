import { AccountUpdate, fetchAccount, Field, Mina, PublicKey, UInt32, UInt64 } from 'o1js'
import { Bridge } from '../abis/Bridge.js'
import { MinaScBuilder } from './base.js'

export class UserLockBuilder extends MinaScBuilder {
    constructor({
        amount,
        address,
        tokenAddress
    }) {
        super()
        const _bridgePubKey = process.env['MINA_BRIGDE_PUBLIC_ADDRESS']
        console.log('bridge contract', _bridgePubKey);

        this.bridgePubKey = PublicKey.fromBase58(_bridgePubKey)

        this.payload = {
            amount,
            address,
            tokenAddress
        }
        console.log('payload', this.payload);

    }
    async build() {
        await this.compileBridgeContract()
        await this.compileTokenContract()

        const pubKeysToFetch = [this.bridgePubKey, PublicKey.fromBase58(this.payload.tokenAddress)]
        await Promise.all(pubKeysToFetch.map(e => fetchAccount({ publicKey: e })))

        const zkApp = new Bridge(this.bridgePubKey)
        const tx = await Mina.transaction(
            {
                sender: PublicKey.fromBase58(this.payload.address),
                fee: Number(0.1) * 1e9,
            },
            async () => {
                AccountUpdate.fundNewAccount(PublicKey.fromBase58(this.payload.address), 1);
                await zkApp.lock(UInt64.from(this.payload.amount), Field.from(1), PublicKey.fromBase58(this.payload.tokenAddress));
            }
        );
        console.log('proving');
        await tx.prove()
        console.log('proving done');
        return tx.toJSON()
    }
}