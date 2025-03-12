import { MinaAdminMinMaxBuilder } from "./contract/prove_admin_min_max.js";
import { responseFormat } from "./shared/response-format.js";

export const sign_admin_set_config = async ({ address, max, min }) => {
    try {
        const data = await (new MinaAdminMinMaxBuilder({ address, max, min })).build();
        return responseFormat(data)
    } catch (error) {
        console.log(error);
        return responseFormat(null, false, error.message)
    }
}
// console.time('a')
// console.log(await sign_admin_set_config({
//     address: 'B62qqUTCXLfXvnGC9ADezTtqSwAustfrZJtD2yCftcLLtZ7APEkUSJb',
//     max: 100,
//     min: 99
// }));
// console.log(console.timeEnd('a'));