import abis from "./abi.json";
import {reactive} from "vue";
import {erc20Abi} from "viem";

export const contractConfigABI = reactive({
    address:'0x2cdD4eeAa51C3AA8BDBa1bA77DfF13066F1b1725',
    abi:abis,
})

export const erc20ConfigABI = reactive({
    address:'0x10c12af81ce8Cf7e78cb2E19f773F2236F1B9D5A',
    abi:erc20Abi,
})