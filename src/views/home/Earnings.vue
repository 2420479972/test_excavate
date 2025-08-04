<template>
  <section class="rounded-lg p-4 mb-6 bg-gradient-to-br from-darkLight to-dark">
    <div class="flex justify-between items-center mb-4">
      <h2 class="gradient-text text-xl font-bold">GDA收益</h2>
    </div>
    <Proceed
        :buy-count="String(bigintToNumberSafe(userInfoData?.[0] || 0))"
        :first-buy-time="formatSecondsToDateTime(userInfoData?.[3] || 0)"
        :pre-time="formatSecondsToDateTime(userInfoData?.[4] || 0)"
        :gdaAmount="Number(formatEther(String(userInfoData?.[1] || 0))).toFixed(2)"
        :pendingGDA="Number(formatEther(String(availableRewardsData || 0) as any)).toFixed(2)"
        :releaseGDA="Number(formatEther(String(userInfoData?.[2] || 0) as any)).toFixed(2)"
        :progress="formatEther(String(userInfoData?.[1] || 0)) == 0 ? 0 : Math.floor(formatEther(String(userInfoData?.[2] || 0))  / formatEther(String(userInfoData?.[1] || 0)))"
        :multiple="rewardMultiplier"
        themeColor="primary"
        @receive="receive"
        :loading="proceedLoading"
        :disabled="Number(formatEther(String(availableRewardsData || 0)) as any) == 0"
    />
  </section>
</template>

<script setup lang="ts">
import {formatEther} from "viem";
import Proceed from "../../components/Proceed.vue";
import {getPublicVariable} from "../../utils/base.ts";
import {useAccount, useWatchContractEvent} from "@wagmi/vue";
import {ref, watch} from "vue";
import {useWrite} from "../../hooks/useWrite.ts";
import {contractConfigABI} from "../../api";
import {Notify} from "../../utils/Toast.ts";
import {bigintToNumberSafe, formatSecondsToDateTime} from "../../utils";

const {address} = useAccount();
const {data:userInfoData,setParams:userInfoSetData} = getPublicVariable('getUserInfo',[address.value]);

const {data:availableRewardsData,setParams:availableRewardsSetData} = getPublicVariable('getAvailableRewards',[address.value])

const {data:rewardMultiplier} = getPublicVariable('rewardMultiplier')

const proceedLoading = ref(false);

watch(address,(newVal)=>{
  if(!newVal)return;
  userInfoSetData([newVal]);
  availableRewardsSetData([newVal])
},{
  immediate:true
})


const {write:claimRewardsWrite} = useWrite(contractConfigABI,{
  functionName: 'claimRewards',
  waitForConfirmation: true,
  onError(err) {
    Notify.error("出错了！")
    console.error('出错了', err);
    proceedLoading.value = false;

  }
})

const receive = ()=>{
  if(userInfoData.value?.[5]){
    Notify.warning('您的领取资格已被暂停')
    return
  }
  proceedLoading.value = true;
  if(Number(formatEther(String(availableRewardsData.value || 0))).toFixed(2) > 0) {
    claimRewardsWrite()
  }
}

useWatchContractEvent({
  address:contractConfigABI.address,
  abi:contractConfigABI.abi,
  eventName: 'RewardsClaimed',
  onLogs(data){
    if(data[0].args.user === address.value){
      Notify.success("领取成功！")
      proceedLoading.value = false;
    }
  }
})

</script>

<style scoped>
@import "../../assets/css/home.css";

</style>
