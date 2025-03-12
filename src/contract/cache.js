import assert from "assert";
import { readFile } from "fs/promises";




export const HOOK_CACHE_FILE_NAMES = [
    'lagrange-basis-fp-1024',
    'lagrange-basis-fp-2048',
    'lagrange-basis-fp-4096',
    'lagrange-basis-fp-8192',
    'lagrange-basis-fp-16384',
    'lagrange-basis-fp-65536',
    'srs-fp-65536',
    'srs-fq-32768',
    'step-vk-hooks-canadmin',
    'step-vk-hooks-initialize',
    'wrap-vk-hooks',
];
export const TOKEN_CACHE_FILE_NAMES = [
    'lagrange-basis-fp-1024',
    'lagrange-basis-fp-2048',
    'lagrange-basis-fp-4096',
    'lagrange-basis-fp-8192',
    'lagrange-basis-fp-16384',
    'lagrange-basis-fp-65536',
    'srs-fp-65536',
    'srs-fq-32768',
    'step-vk-fungibletoken-approvebase',
    'step-vk-fungibletoken-burn',
    'step-vk-fungibletoken-getbalanceof',
    'step-vk-fungibletoken-getdecimals',
    'step-vk-fungibletoken-initialize',
    'step-vk-fungibletoken-mint',
    'step-vk-fungibletoken-pause',
    'step-vk-fungibletoken-resume',
    'step-vk-fungibletoken-setadmin',
    'step-vk-fungibletoken-transfer',
    'step-vk-fungibletoken-updateverificationkey',
    'step-vk-fungibletokenadmin-canchangeadmin',
    'step-vk-fungibletokenadmin-canchangeverificationkey',
    'step-vk-fungibletokenadmin-canmint',
    'step-vk-fungibletokenadmin-canpause',
    'step-vk-fungibletokenadmin-canresume',
    'step-vk-fungibletokenadmin-updateverificationkey',
    'wrap-vk-fungibletoken',
    'wrap-vk-fungibletokenadmin',
];

export const BRIDGE_CACHE_FILE_NAME = [
    'lagrange-basis-fp-1024',
    'lagrange-basis-fp-2048',
    'lagrange-basis-fp-4096',
    'lagrange-basis-fp-8192',
    'lagrange-basis-fp-16384',
    'lagrange-basis-fp-65536',
    'srs-fp-65536',
    'srs-fq-32768',
    'step-vk-bridge-changemanager',
    'step-vk-bridge-changevalidatormanager',
    'step-vk-bridge-lock',
    'step-vk-bridge-setamountlimits',
    'step-vk-bridge-unlock',
    'step-vk-manager-changeadmin',
    'step-vk-manager-changeminter_1',
    'step-vk-manager-changeminter_2',
    'step-vk-manager-changeminter_3',
    'step-vk-validatormanager-changevalidator',
    'wrap-vk-bridge',
    'wrap-vk-manager',
    'wrap-vk-validatormanager',
];



const mapTypeToCache = {
    'token': TOKEN_CACHE_FILE_NAMES,
    'bridge': BRIDGE_CACHE_FILE_NAME
}
/**
 * 
 * @param {'token' | 'bridge'} type 
 * @returns 
 */
export function fetchFiles(type) {
    const listFiles = mapTypeToCache[type];
    assert(listFiles, 'invalid cache')
    return Promise.all(
        listFiles.map((file) => {
            return Promise.all([
                readFile(`${process.cwd()}/cache/${file}.header`).then((res) => res.toString()),
                readFile(`${process.cwd()}/cache/${file}`).then((res) => res.toString()),
            ]).then(([header, data]) => ({ file, header, data }));
        }),
    ).then((cacheList) =>
        cacheList.reduce((acc, { file, header, data }) => {
            acc[file] = { file, header, data };
            return acc;
        }, {}),
    );
}

export function fileSystem(files) {
    return {
        read({ persistentId, uniqueId, dataType }) {
            // read current uniqueId, return data if it matches
            if (!files[persistentId]) {
                return undefined;
            }

            if (dataType === 'string') {
                return new TextEncoder().encode(files[persistentId].data);
            }

            return undefined;
        },
        write() {
            // console.log('write');
        },
        canWrite: true,
    };
}