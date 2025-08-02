import abis from "./abi.json";
import {reactive} from "vue";
import {erc20Abi} from "viem";

export const contractConfigABI = reactive({
    address:'0x76140F8Aa10cd480E1f3Be13E5fEEd5b9cB94097',
    abi:abis,
})

export const erc20ConfigABI = reactive({
    address:'0x10c12af81ce8Cf7e78cb2E19f773F2236F1B9D5A',
    abi:erc20Abi,
})