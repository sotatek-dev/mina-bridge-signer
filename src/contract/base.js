import { config } from 'dotenv'
import { fetchFiles, fileSystem } from './cache.js'
import { Mina } from 'o1js';
import { Bridge } from '../abis/Bridge.js';
import { FungibleToken } from 'mina-fungible-token';
config()
export class MinaScBuilder {
    constructor() {

        const network = Mina.Network({
            mina: 'https://api.minascan.io/node/mainnet/v1/graphql',
            archive: 'https://api.minascan.io/archive/mainnet/v1/graphql/',
            networkId: 'mainnet'
        });
        Mina.setActiveInstance(network);
    }
    async compileBridgeContract() {
        console.log('compiling bridge');
        await Bridge.compile({
            cache: fileSystem(fetchFiles('bridge'))
        })
        console.log('compiling bridge done');
    }
    async compileTokenContract() {
        console.log('compiling token');
        await FungibleToken.compile({
            cache: fileSystem(fetchFiles('token'))
        })
        console.log('compiling token done');
    }
}