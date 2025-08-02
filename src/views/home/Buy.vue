<template>
  <div class="mb-4 mt-2">
    <p class="text-xs mt-1 text-purple-400">当前余额: {{ formatEther(String(userBalance || 0) as any) }} USDT</p>
  </div>
  <button class="w-full bg-gradient-to-r flex items-center justify-center from-primary to-secondary text-dark font-bold py-2 rounded hover-glow" :style="{background:isBuyDisabled  && 'gray' || ''}" @click="buyShares" :disabled="isBuyDisabled">
    <Loading v-if="buyLoading"></Loading>
    <span v-else>
            立即认购
          </span>
  </button>
</template>

<script setup lang="ts">
import {formatEther} from "viem";
import Loading from "../../components/Loading.vue";
import {useRead} from "../../hooks/Read.ts";
import {contractConfigABI, erc20ConfigABI} from "../../api";
import {computed, ref, watch} from "vue";
import {useAccount, useWatchContractEvent} from "@wagmi/vue";
import {Notify} from "../../utils/Toast.ts";
import {getPublicVariable} from "../../utils/base.ts";
import {useWrite} from "../../hooks/useWrite.ts";
import {bigintToNumberSafe} from "../../utils";


const {address} = useAccount();
const  {data:userBalance,setParams:setUserBalance} = useRead(erc20ConfigABI,{
  functionName:'balanceOf',
  initParams:{
    args:[address.value]
  },
  blockNumberInterval: 1,
  onError(error) {
    console.error('合约调用失败:', error);
  }
})

const startAndEndTime = computed(()=>({
  startTime:presaleInfoData.value?.length > 0 ? bigintToNumberSafe(presaleInfoData.value?.[4]) : 0,
  endTime:presaleInfoData.value?.length > 0 ? bigintToNumberSafe(presaleInfoData.value?.[5]):0
}))

const now = ref(Math.floor(Date.now() / 1000))
const isCounting = computed(() => {
  return now.value >= startAndEndTime.value.startTime && now.value < startAndEndTime.value.endTime
})

const isBuyDisabled = computed(()=>{
  return userPurchasedShares.value >= addressLimit.value || isAppPending.value || isBuyPending.value || buyLoading.value || !isCounting.value
})

const {data:allowanceData,setParams:setAllowanceData} = useRead(erc20ConfigABI,{
  functionName:'allowance',
  initParams:{
    args:[address.value,contractConfigABI.address]
  },
  blockNumberInterval: 1,
  onError(error) {
    Notify.error("出错了！")
    console.error('合约调用失败:', error);
  }
})

const {data:userPurchasedShares,setParams:setUserPurchasedShares} = getPublicVariable('userPurchasedShares');
const {data:addressLimit} = getPublicVariable('addressLimit')
const {data:presaleInfoData} = getPublicVariable('getPresaleInfo');


const buyLoading = ref(false);

const {write:erc20Approve,isPending:isAppPending} = useWrite(erc20ConfigABI,{
  functionName: 'approve',
  waitForConfirmation: true,
  onError(err) {
    Notify.error("出错了！")
    console.error('更新失败:', err);
    buyLoading.value = false;
  }
})

const {write:buySharesWrite,isPending:isBuyPending} = useWrite(contractConfigABI,{
  functionName: 'buyShares',
  waitForConfirmation: true,
  onError(err) {
    Notify.error("出错了！")
    console.error('出错了', err);
    buyLoading.value = false;
  },
})

const buyShares = ()=>{
  if(userPurchasedShares.value >= addressLimit.value){
    Notify.error('您已超过地址限购')
    return
  }
  buyLoading.value = true;
  if(Number(formatEther(allowanceData.value)) < Number(formatEther(presaleInfoData.value[1]))){
    erc20Approve([contractConfigABI.address,String(presaleInfoData.value[1])]);
    return;
  }else{
    buySharesWrite([1])
  }
}

useWatchContractEvent({
  address:erc20ConfigABI.address,
  abi:erc20ConfigABI.abi,
  eventName:'Approval',
  onLogs(data){
    console.log("用户已授权");
    if(Number(formatEther(data[0].args.value)) == Number(formatEther(presaleInfoData.value[1])) && data[0].args.owner === address.value){
      buySharesWrite([1])
    }
  }
})

useWatchContractEvent({
  address:contractConfigABI.address,
  abi:contractConfigABI.abi,
  eventName: 'SharesPurchased',
  onLogs(data){
    console.log("购买成功");
    if(data[0].args.buyer === address.value){
      Notify.success("购买成功！")
      buyLoading.value = false;
    }
  }
})

watch(address,(newVal)=>{
  if(!newVal)return;
  setUserBalance([newVal])
  setAllowanceData([newVal,contractConfigABI.address])
  setUserPurchasedShares([newVal])
},{
  immediate:true
})

</script>

<style  scoped>
@import "../../assets/css/home.css";

</style>
