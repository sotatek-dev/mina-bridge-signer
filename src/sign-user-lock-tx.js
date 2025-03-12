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