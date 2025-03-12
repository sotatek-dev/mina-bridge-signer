import { sign_admin_set_config } from "../sign-admin-set-config.js";
import { sign_user_lock } from "../sign-user-lock-tx.js";

// console.time('a')
// console.log(await sign_admin_set_config({
//     address: 'B62qqUTCXLfXvnGC9ADezTtqSwAustfrZJtD2yCftcLLtZ7APEkUSJb',
//     max: '100',
//     min: '99'
// }));
// console.timeEnd('a');

console.time('a')
console.log(await sign_user_lock({
    address: 'B62qqUTCXLfXvnGC9ADezTtqSwAustfrZJtD2yCftcLLtZ7APEkUSJb',
    amount: '100000000',
    tokenAddress: 'B62qoNVDNgu3TAjPWE8DXD44Vgz69CWVSDYgZXFz6kFHTy3Pdy1zYee'
}));
console.timeEnd('a');