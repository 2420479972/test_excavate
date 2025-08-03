<template>
  <section class="p-4 mb-6">
    <h1 class="gradient-text text-2xl font-bold text-center mb-4 animate-text" v-if="isSellout">已售罄</h1>
    <h1 class="gradient-text text-2xl font-bold text-center mb-4 animate-text" v-else-if="isCounting">GDA预售中......</h1>
    <Countdown :start-time="startAndEndTime.startTime" :end-time="startAndEndTime.endTime"></Countdown>
    <p class="text-xs text-center gradient-text">GDA社区云集共铸区块链只涨不跌神话</p>
  </section>
</template>

<script setup lang="ts">
import {getPublicVariable} from "../../utils/base.ts";
import {computed, onMounted, ref, watch} from "vue";
import {bigintToNumberSafe} from "../../utils";
import Countdown from "../../components/Countdown.vue";
import dayjs from "dayjs";

const {data:presaleInfoData} = getPublicVariable('getPresaleInfo');

const startAndEndTime = computed(()=>({
  startTime:presaleInfoData.value?.length > 0 ? bigintToNumberSafe(presaleInfoData.value?.[4]) : 0,
  endTime:presaleInfoData.value?.length > 0 ? bigintToNumberSafe(presaleInfoData.value?.[5]):0
}))

const now = ref(Math.floor(Date.now() / 1000))
const isCounting = computed(() => {
  return now.value >= startAndEndTime.value.startTime && now.value < startAndEndTime.value.endTime
})


const {data:startTime} = getPublicVariable('startTime');

const isSellout = ref(false);
const dataItems = ref([]);
const getHistoryForGit =async ()=>{
  const response = await fetch('https://raw.githubusercontent.com/EternalProtocol/doc/main/data.json') // 请求指定接口
  dataItems.value =await response.json()
}


watch(startTime,(newVal)=>{
  if(!newVal) return;
  const now = dayjs();
  const diffDays = now.diff(Number(newVal) * 1000, 'day'); // 精确到天
  isSellout.value = dataItems.value[diffDays] % 500 == 0;
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
