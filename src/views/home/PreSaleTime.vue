<template>
  <section class="p-4 mb-6">
    <h1 class="gradient-text text-2xl font-bold text-center mb-4 animate-text" v-if="isCounting">GDA预售中......</h1>
    <Countdown :start-time="startAndEndTime.startTime" :end-time="startAndEndTime.endTime"></Countdown>
    <p class="text-xs text-center gradient-text">GDA社区云集共铸区块链只涨不跌神话</p>
  </section>
</template>

<script setup lang="ts">
import {getPublicVariable} from "../../utils/base.ts";
import {computed, ref} from "vue";
import {bigintToNumberSafe} from "../../utils";
import Countdown from "../../components/Countdown.vue";

const {data:presaleInfoData} = getPublicVariable('getPresaleInfo');

const startAndEndTime = computed(()=>({
  startTime:presaleInfoData.value?.length > 0 ? bigintToNumberSafe(presaleInfoData.value?.[4]) : 0,
  endTime:presaleInfoData.value?.length > 0 ? bigintToNumberSafe(presaleInfoData.value?.[5]):0
}))

const now = ref(Math.floor(Date.now() / 1000))
const isCounting = computed(() => {
  return now.value >= startAndEndTime.value.startTime && now.value < startAndEndTime.value.endTime
})

</script>

<style scoped>
@import "../../assets/css/home.css";
</style>
