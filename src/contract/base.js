import { config } from 'dotenv'
import { fetchFiles, fileSystem } from './cache.js'
import { Mina } from 'o1js';
import { Bridge } from '../abis/Bridge.js';
import { FungibleToken } from 'mina-fungible-token';
config()
export class MinaScBuilder {
    constructor() {
        const testnet = {
            mina: 'https://api.minascan.io/node/devnet/v1/graphql',
            archive: 'https://api.minascan.io/archive/devnet/v1/graphql/',
            networkId: 'testnet'
        }
        const mainnet = {
            mina: 'https://api.minascan.io/node/mainnet/v1/graphql',
            archive: 'https://api.minascan.io/archive/mainnet/v1/graphql/',
            networkId: 'mainnet'
        }
        const networkType = process.env['MINA_NETWORK_TYPE']
        const network = Mina.Network(networkType === 'mainnet' ? mainnet : testnet);
        Mina.setActiveInstance(network);
    }
    async compileBridgeContract() {
        console.log('compiling bridge');
        await Bridge.compile({
        })
        console.log('compiling bridge done');
    }
    async compileTokenContract() {
        console.log('compiling token');
        await FungibleToken.compile({
        })
        console.log('compiling token done');
    }
}