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
