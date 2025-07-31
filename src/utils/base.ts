import {useRead} from "../hooks/Read.ts";
import {contractConfigABI} from "../api";
import {useWatchContractEvent} from "@wagmi/vue";
import {Abi} from "viem";
import {useWrite} from "../hooks/useWrite.ts";

export const getPublicVariable = (variable:string,args?:any[])=>{
    const options = {
        functionName:variable,
        blockNumberInterval: 1,
    }
    return useRead(contractConfigABI,options)
}

export const watchEvent = (eventName:string,onLogs:(data:any)=>void)=>{
    useWatchContractEvent({
        address:contractConfigABI.address as `0x${string}`,
        abi:contractConfigABI.abi as Abi,
        eventName:eventName,
        onLogs
    })
}

export const writeContract = (functionName:string)=>{
    const {write} = useWrite(contractConfigABI,{
        functionName: functionName,
        waitForConfirmation: true,
        onError(err) {
            console.error('更新失败:', err);
        }
    })
    return {
        write
    }
}