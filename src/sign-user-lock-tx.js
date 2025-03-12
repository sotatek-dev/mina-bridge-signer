import { UserLockBuilder } from "./contract/prove_user_lock.js";
import { responseFormat } from "./shared/response-format.js";

export const sign_user_lock = async ({ amount, address, tokenAddress }) => {
    try {
        const data = await (new UserLockBuilder({
            address,
            amount, tokenAddress
        })).build();
        return responseFormat(data)
    } catch (error) {
        console.log(error);
        return responseFormat(null, false, error.message)
    }
}
// console.time('a')
// console.log(await sign_user_lock({
//     address: 'B62qqUTCXLfXvnGC9ADezTtqSwAustfrZJtD2yCftcLLtZ7APEkUSJb',
//     amount: 100000000n,
//     tokenAddress: 'B62qoNVDNgu3TAjPWE8DXD44Vgz69CWVSDYgZXFz6kFHTy3Pdy1zYee'
// }));
// console.log(console.timeEnd('a'));
