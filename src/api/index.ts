import abis from "./abi.json";
import {reactive} from "vue";
import {erc20Abi} from "viem";
export const contractConfigABI = reactive({
    address:'0xcCf27643fa6C4FC844a8945b7c2F8bd562153649',
    abi:abis,
})

export const erc20ConfigABI = reactive({
    address:'0xDf3Cf8b9978c9c5639E06da3bfF5014ab5c055d1',
    abi:erc20Abi,
})