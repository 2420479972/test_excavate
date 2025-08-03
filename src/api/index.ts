import abis from "./abi.json";
import {reactive} from "vue";
import {erc20Abi} from "viem";

export const contractConfigABI = reactive({
    address:'0xeC67DD0a9B3Cf6d7eF5b17048706b1f523C705Fe', // 0xeC67DD0a9B3Cf6d7eF5b17048706b1f523C705Fe
    abi:abis,
})

export const erc20ConfigABI = reactive({
    address:'0x55d398326f99059fF775485246999027B3197955', //USDT地址：0x55d398326f99059fF775485246999027B3197955
    abi:erc20Abi,
})
export const erc20GDAConfigABI = reactive({
    address:'0xf7af106c717f3207e642257accd258fcda4f3c7b', //USDT地址：0x55d398326f99059fF775485246999027B3197955
    abi:erc20Abi,
})