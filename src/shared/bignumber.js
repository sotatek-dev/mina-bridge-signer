import BigNumber from "bignumber.js";

BigNumber.set({
    EXPONENTIAL_AT: 1e9
})

export const isGreaterThan = (left, right) => BigNumber(left).isGreaterThan(right)