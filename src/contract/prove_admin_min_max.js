import { fetchAccount, Mina, PublicKey, UInt32 } from 'o1js'
import { Bridge } from '../abis/Bridge.js'
import assert from 'assert'
import { MinaScBuilder } from './base.js'



export class MinaAdminMinMaxBuilder extends MinaScBuilder {
    constructor({
        address,
        min, max
    }) {
        super()
        const _bridgePubKey = process.env['MINA_BRIGDE_PUBLIC_ADDRESS']
        console.log('bridge contract', _bridgePubKey);

        this.bridgePubKey = PublicKey.fromBase58(_bridgePubKey)
        assert(typeof min === 'number' && min > 0, 'min invalid')
        assert(typeof max === 'number' && max > 0 && max > min, 'max invalid')
        this.payload = {
            address, min, max
        }
        console.log('payload', this.payload);

    }
    async build() {
        await this.compileBridgeContract()

        const pubKeysToFetch = [this.bridgePubKey, PublicKey.fromBase58(this.payload.address)]
        await Promise.all(pubKeysToFetch.map(e => fetchAccount({ publicKey: e })))

        const zkApp = new Bridge(this.bridgePubKey)
        const tx = await Mina.transaction(
            {
                sender: PublicKey.fromBase58(this.payload.address),
                fee: Number(0.1) * 1e9,
            },
            async () => {
                await zkApp.setAmountLimits(new UInt32(this.payload.min), new UInt32(this.payload.max));
            }
        );
        console.log('proving');
        await tx.prove()
        console.log('proving done');
        return tx.toJSON()
    }
}