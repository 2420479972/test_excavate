<template>
    <div class="mt-4">
      <button class="flex items-center justify-between w-full text-sm" @click="detailShow = !detailShow">
        <span>详细规则</span>
        <i :class="['fas',{'fa-chevron-down':!detailShow,'fa-chevron-up':detailShow}] "></i>
      </button>
      <div class="mt-2 text-xs divide-y divide-gray-600" v-show="detailShow">
        <div class="py-3 grid grid-cols-2 gap-4">
          <div>
            <p class="text-gray-400 mb-1">代币总量</p>
            <p class="text-primary">{{formatEther(presaleInfoData?.[0] || 0)}} 枚</p>
          </div>
          <div>
            <p class="text-gray-400 mb-1">1份价格</p>
            <p class="text-primary">${{ formatEther(presaleInfoData?.[1] || 0) }} USDT</p>
          </div>
        </div>
        <div class="py-3 grid grid-cols-2 gap-4">
          <div>
            <p class="text-gray-400 mb-1">代币地址</p>
            <div class="flex items-center">
              <span class="text-primary">{{formatAddress(presaleInfoData?.[2])}}</span>
              <button @click="copyText(String(presaleInfoData?.[2]))" class="ml-2 text-gray-400 hover:text-primary">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>
          <div>
            <p class="text-gray-400 mb-1">开放时间</p>
            <p class="text-primary">{{formatSecondsToDateTime(presaleInfoData?.[4])}}</p>
          </div>
        </div>
        <div class="py-3 grid grid-cols-2 gap-4">
          <div>
            <p class="text-gray-400 mb-1">结束时间</p>
            <p class="text-primary">{{formatSecondsToDateTime(presaleInfoData?.[5] || 0)}}</p>

          </div>
          <div>
            <p class="text-gray-400 mb-1">已购总量</p>
            <p class="text-primary">{{buyAllEd}}份</p>
          </div>
        </div>
        <div class="py-3 grid grid-cols-2 gap-4">
          <div>
            <p class="text-gray-400 mb-1">总购次数</p>
            <p class="text-primary">{{buyCount}}次</p>
          </div>
          <div>
            <p class="text-gray-400 mb-1">剩余份数</p>
            <p class="text-primary">{{bigintToNumberSafe(presaleInfoData?.[7] || 0)}}份</p>
          </div>
        </div>
        <div class="py-3 grid grid-cols-2 gap-4">
          <div>
            <p class="text-gray-400 mb-1">每天限购</p>
            <p class="text-primary">{{bigintToNumberSafe(presaleInfoData?.[8] || 0)}}份</p>
          </div>
          <div>
            <p class="text-gray-400 mb-1">地址限购</p>
            <p class="text-primary">{{bigintToNumberSafe(presaleInfoData?.[9] || 0)}}份</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import {formatEther} from "viem";
import {bigintToNumberSafe, copyToClipboard, formatAddress, formatSecondsToDateTime} from "../../utils";
import {onMounted, ref, watch} from "vue";
import {getPublicVariable} from "../../utils/base.ts";
import {useAccount} from "@wagmi/vue";
import {Notify} from "../../utils/Toast.ts";
import dayjs from "dayjs";

const {address} = useAccount();
const detailShow = ref(false);

const {data:userInfoData,setParams:userInfoSetData} = getPublicVariable('getUserInfo',[address.value]);
const {data:presaleInfoData} = getPublicVariable('getPresaleInfo');

watch(address,(newVal)=>{
  if(!newVal)return;
  userInfoSetData([newVal]);
},{
  immediate:true
})

const copyText = (text:string)=>{
  copyToClipboard(text)
      .then(() => {
        Notify.success('复制成功');
      })
      .catch(err => {
        Notify.error('复制失败');
      });
}

const buyAllEd = ref(false);
const buyCount = ref(0);
const dataItems = ref([]);
const getHistoryForGit =async ()=>{
  const response = await fetch('https://raw.githubusercontent.com/EternalProtocol/doc/main/data.json') // 请求指定接口
  dataItems.value = await response.json()
}

const {data:startTime} = getPublicVariable('startTime');

watch(startTime,(newVal)=>{
  if(!newVal) return;
  const now = dayjs();
  const diffDays = now.startOf('day').diff(dayjs(Number(newVal) * 1000).startOf('day'), 'day');
  buyAllEd.value = dataItems.value[diffDays] * 5000 || 0;
  buyCount.value = dataItems.value[diffDays] || 0
},{
  immediate:true
})

onMounted(()=>{
  getHistoryForGit();
})

</script>

<style scoped>
@import "../../assets/css/home.css";
</style>
