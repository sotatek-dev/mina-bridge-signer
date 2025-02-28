import moment from "moment"

export const getTTL = () => {
    return moment().add(5, 'days').unix()
}