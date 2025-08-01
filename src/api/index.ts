import abis from "./abi.json";
import {reactive} from "vue";
import {erc20Abi} from "viem";

export const contractConfigABI = reactive({
    address:'0x10eac150F7Aa1Ee3fEf1758D4c996082ba875c84',
    abi:abis,
})

export const erc20ConfigABI = reactive({
    address:'0x10c12af81ce8Cf7e78cb2E19f773F2236F1B9D5A',
    abi:erc20Abi,
})