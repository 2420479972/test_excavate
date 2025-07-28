<template>
<div class="flex flex-col h-screen">
  <Header></Header>
    <div class="glass-effect py-2 px-4 mb-2">
      <div class="flex items-center">
        <div class="flex items-center mr-2">
          <i class="fas fa-bullhorn text-primary announcement-icon"></i>
        </div>
        <div class="overflow-hidden flex-1">
          <div class="announcement-text whitespace-nowrap text-sm">
            GDA代币预售正式开启！
            聚币交易所GDA和HI交易兑
            全球限购5000份限时优惠，先到先得！马上参与预售，抢占先机。更多惊喜等你来！
          </div>
        </div>
      </div>
  </div>
  <main class="pb-4 px-4 relative flex-1 overflow-auto">
    <div class="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
    <!-- 时间模块 -->
    <section class="p-4 mb-6">
      <h1 class="gradient-text text-2xl font-bold text-center mb-4 animate-text">GDA预售中......</h1>
      <Countdown></Countdown>
      <p class="text-xs text-center gradient-text">GDA社区云集共铸区块链只涨不跌神话</p>
    </section>
    <!-- 预售模块 -->
    <section class="rounded-lg p-4 mb-6 bg-gradient-to-br from-darkLight to-dark">
      <div class="flex justify-between items-center mb-4">
        <h2 class="gradient-text text-xl font-bold">GDA预售</h2>
        <div class="flex items-center space-x-1">
         <Select :options="dayOptions" v-model="selectDay"></Select>
        </div>
      </div>
      <LineChart></LineChart>
      <div class="rounded-lg p-4">
        <div class="mb-4">
          <p class="text-xs mt-1 text-purple-400">当前余额: 12,000 USDT</p>
        </div>
        <button class="w-full bg-gradient-to-r from-primary to-secondary text-dark font-bold py-2 rounded hover-glow">立即认购</button>
        <div class="mt-4">
          <button class="flex items-center justify-between w-full text-sm" @click="detailShow = !detailShow">
            <span>详细规则</span>
            <i :class="['fas',{'fa-chevron-down':!detailShow,'fa-chevron-up':detailShow}] "></i>
          </button>
          <div class="mt-2 text-xs divide-y divide-gray-600" v-show="detailShow">
            <div class="py-3 grid grid-cols-2 gap-4">
              <div>
                <p class="text-gray-400 mb-1">代币总量</p>
                <p class="text-primary">25,000,000枚</p>
              </div>
              <div>
                <p class="text-gray-400 mb-1">1份价格</p>
                <p class="text-primary">$500 USDT</p>
              </div>
            </div>
            <div class="py-3 grid grid-cols-2 gap-4">
              <div>
                <p class="text-gray-400 mb-1">代币地址</p>
                <div class="flex items-center">
                  <span class="text-primary">0x8f2...3a4b</span>
                  <button @click="copyText('123')" class="ml-2 text-gray-400 hover:text-primary">
                    <i class="fas fa-copy"></i>
                  </button>
                </div>
              </div>
              <div>
                <p class="text-gray-400 mb-1">开放时间</p>
                <p class="text-primary">2025.07.24 14:30</p>
              </div>
            </div>
            <div class="py-3 grid grid-cols-2 gap-4">
              <div>
                <p class="text-gray-400 mb-1">结束时间</p>
                <p class="text-primary">2025.08.04 14:30</p>
              </div>
              <div>
                <p class="text-gray-400 mb-1">已购总量</p>
                <p class="text-primary">280,000枚</p>
              </div>
            </div>
            <div class="py-3 grid grid-cols-2 gap-4">
              <div>
                <p class="text-gray-400 mb-1">总购次数</p>
                <p class="text-primary">1,564</p>
              </div>
              <div>
                <p class="text-gray-400 mb-1">剩余份数</p>
                <p class="text-primary">50份</p>
              </div>
            </div>
            <div class="py-3 grid grid-cols-2 gap-4">
              <div>
                <p class="text-gray-400 mb-1">每天限购</p>
                <p class="text-primary">500份</p>
              </div>
              <div>
                <p class="text-gray-400 mb-1">地址限购</p>
                <p class="text-primary">1份</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- 收益模块 -->
    <Proceed
        :gdaAmount="15000"
        :pendingGDA="423"
        :releaseGDA="5.1258"
        :progress="50"
        :multiple="2"
        themeColor="primary"
    />
    <section class="rounded-lg p-4 mt-6 bg-gradient-to-br from-darkLight to-dark">
      <div class="flex justify-between items-center mb-4">
        <h2 class="gradient-text text-xl font-bold">认购记录</h2>
      </div>
      <Table :data="tableData" :columns="columns">
        <template #cell-address="{row}">
          <div class="text-[#00F0FF]">{{row.address}}</div>
        </template>
      </Table>
    </section>
  </main>
</div>
</template>

<script setup lang="ts">
import "../assets/css/home.css"
import Countdown from "../components/Countdown.vue";
import LineChart from "../components/LineChart.vue";
import Select from "../components/Select.vue";

import {ref} from "vue";
import {copyToClipboard} from "../utils/copy.ts";
import Proceed from "../components/Proceed.vue";
import Table from "../components/Table.vue";
import Header from "../components/Header.vue";
const selectDay = ref('1')
const detailShow = ref(false);
const dayOptions = [
  { label: '1天', value: '1' },
  { label: '2天', value: '2' },
  { label: '3天', value: '3' },
  { label: '4天', value: '4' },
  { label: '5天', value: '5' },
  { label: '6天', value: '6' },
  { label: '7天', value: '7' },
  { label: '8天', value: '8' },
  { label: '9天', value: '9' },
  { label: '10天', value: '10' }
];

const copyText = (text:string)=>{
  copyToClipboard(text)
      .then(() => {
        console.log('复制成功');
      })
      .catch(err => {
        console.error('复制失败', err);
      });
}

// 表头配置
const columns = [
  { label: '地址', key: 'address' },
  { label: '时间', key: 'time',class:["text-center"] },
  { label: '数量', key: 'status',class:["text-center"] },
  { label: '金额(USDT)', key: 'createdAt',class:["text-center"] }
]

// 表格数据
const tableData = new Array(40).fill({
  address: '0x1231231232',
  time: '7/18',
  status: '20份',
  createdAt: '200'
},)

</script>

<style lang="scss" scoped>

</style>
