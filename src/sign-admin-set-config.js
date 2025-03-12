import { MinaAdminMinMaxBuilder } from "./contract/prove_admin_min_max.js";
import { responseFormat } from "./shared/response-format.js";

export const sign_admin_set_config = async (payload) => {
    try {
        const data = await (new MinaAdminMinMaxBuilder(payload)).build();
        return responseFormat(data)
    } catch (error) {
        console.log(error);
        return responseFormat(null, false, error.message)
    }
}