<template>
  <main class="pb-4 relative flex-1 overflow-auto">
    <notice></notice>
    <div class="px-5">
      <section class="p-4 mb-6">
        <h1 class="gradient-text text-2xl font-bold text-center mb-4 animate-text">已售罄</h1>
        <Countdown :start-time="startAndEndTime.startTime" :end-time="startAndEndTime.endTime"></Countdown>
        <p class="text-xs text-center gradient-text">GDA社区云集共铸区块链只涨不跌神话</p>
      </section>
      <section class="rounded-lg p-4 mb-6 bg-gradient-to-br from-darkLight to-dark">
        <div class="flex justify-between items-center mb-4">
          <h2 class="gradient-text text-xl font-bold">GDA预售</h2>
        </div>
        <LineChart :series-data="chartDayData" :x-axis-data="chartDay"></LineChart>
        <div class="mb-4 mt-2">
          <p class="text-xs mt-1 text-purple-400">当前余额: {{ formatEther(String(userBalance || 0) as any) }} USDT</p>
        </div>
        <button class="w-full bg-gradient-to-r flex items-center justify-center from-primary to-secondary text-dark font-bold py-2 rounded hover-glow" :style="{background:'gray' || ''}" :disabled="true">
          <span>
            立即认购
          </span>
        </button>
        <div class="mt-4">
          <button class="flex items-center justify-between w-full text-sm" @click="detailShow = !detailShow">
            <span>详细规则</span>
            <i :class="['fas',{'fa-chevron-down':!detailShow,'fa-chevron-up':detailShow}] "></i>
          </button>
          <div class="mt-2 text-xs divide-y divide-gray-600" v-show="detailShow">
            <div class="py-3 grid grid-cols-2 gap-4">
              <div>
                <p class="text-gray-400 mb-1">代币总量</p>
                <p class="text-primary">{{500 * 5000}} 枚</p>
              </div>
              <div>
                <p class="text-gray-400 mb-1">1份价格</p>
                <p class="text-primary">${{ 500 }} USDT</p>
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
                <p class="text-primary">{{'2025-8-2'}}</p>
              </div>
            </div>
            <div class="py-3 grid grid-cols-2 gap-4">
              <div>
                <p class="text-gray-400 mb-1">结束时间</p>
                <p class="text-primary">{{'2025-9-2'}}</p>

              </div>
              <div>
                <p class="text-gray-400 mb-1">已购总量</p>
                <p class="text-primary">{{500}}份</p>
              </div>
            </div>
            <div class="py-3 grid grid-cols-2 gap-4">
              <div>
                <p class="text-gray-400 mb-1">总购次数</p>
                <p class="text-primary">{{500}}</p>
              </div>
              <div>
                <p class="text-gray-400 mb-1">剩余份数</p>
                <p class="text-primary">{{0}}份</p>
              </div>
            </div>
            <div class="py-3 grid grid-cols-2 gap-4">
              <div>
                <p class="text-gray-400 mb-1">每天限购</p>
                <p class="text-primary">{{bigintToNumberSafe(presaleInfoData?.[8])}}份</p>
              </div>
              <div>
                <p class="text-gray-400 mb-1">地址限购</p>
                <p class="text-primary">{{1}}份</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <record></record>
    </div>
  </main>

</template>

<script setup lang="ts">
import PreSaleTime from "./home/PreSaleTime.vue";
import PreSale from "./home/PreSale.vue";
import Earnings from "./home/Earnings.vue";
import Notice from "./home/Notice.vue";
import Record from "./home/Record.vue";
import Countdown from "../components/Countdown.vue";
import {getPublicVariable} from "../utils/base.ts";
import {computed, ref, watch} from "vue";
import {bigintToNumberSafe, copyToClipboard, formatAddress, formatSecondsToDateTime} from "../utils";
import LineChart from "../components/LineChart.vue";
import Select from "../components/Select.vue";
import {formatEther} from "viem";
import Loading from "../components/Loading.vue";
import {useRead} from "../hooks/Read.ts";
import {erc20ConfigABI} from "../api";
import {useAccount} from "@wagmi/vue";
import PreSaleDetail from "./home/PreSaleDetail.vue";
import {Notify} from "../utils/Toast.ts";


const {data:presaleInfoData} = getPublicVariable('getPresaleInfo');

const startAndEndTime = computed(()=>({
  startTime:presaleInfoData.value?.length > 0 ? bigintToNumberSafe(presaleInfoData.value?.[4]) : 0,
  endTime:presaleInfoData.value?.length > 0 ? bigintToNumberSafe(presaleInfoData.value?.[5]):0
}))


const chartDay = ref<string[]>(['2日'])
const chartDayData = ref<{
  data1:any[],
  data2:any[]
}>({
  data1:[],
  data2:[500]
})


watch(presaleInfoData,(res)=>{
  chartDayData.value.data1 = [formatEther(res?.[0] || 0)]
  chartDayData.value.data2 = [500]
})

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

watch(address,(newVal)=>{
  if(!newVal) return;
  setUserBalance([address.value])
})

const detailShow = ref(false);


const copyText = (text:string)=>{
  copyToClipboard(text)
      .then(() => {
        Notify.success('复制成功');
      })
      .catch(err => {
        Notify.error('复制失败');
      });
}

</script>

<style  scoped>
@import "../assets/css/home.css";
</style>
