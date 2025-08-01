<template>
<div class="flex flex-col h-screen">
  <Header></Header>
    <div class="glass-effect py-2 px-4 mb-2" v-if="notification">
      <div class="flex items-center">
        <div class="flex items-center mr-2">
          <i class="fas fa-bullhorn text-primary announcement-icon"></i>
        </div>
        <div class="overflow-hidden flex-1">
          <div class="announcement-text whitespace-nowrap text-sm">
            {{notification}}
          </div>
        </div>
      </div>
  </div>
  <main class="pb-4 px-4 relative flex-1 overflow-auto">
    <div class="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
    <!-- 时间模块 -->
    <section class="p-4 mb-6">
      <h1 class="gradient-text text-2xl font-bold text-center mb-4 animate-text" v-if="isCounting">GDA预售中......</h1>
      <Countdown :start-time="startAndEndTime.startTime" :end-time="startAndEndTime.endTime"></Countdown>
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
      <LineChart :series-data="chartDayData" :x-axis-data="chartDay"></LineChart>
      <div class="rounded-lg p-4">
        <div class="mb-4">
          <p class="text-xs mt-1 text-purple-400">当前余额: {{formatEther(String(userBalance || 0))}} USDT</p>
        </div>
        <button class="w-full bg-gradient-to-r from-primary to-secondary text-dark font-bold py-2 rounded hover-glow" :style="{background:isBuyDisabled  && 'gray' || ''}" @click="buyShares" :disabled="isBuyDisabled">立即认购</button>
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
                <p class="text-primary">{{formatSecondsToDateTime(presaleInfoData?.[5])}}</p>

              </div>
              <div>
                <p class="text-gray-400 mb-1">已购总量</p>
                <p class="text-primary">{{bigintToNumberSafe(userInfoData?.[0] || 0)}}枚</p>
              </div>
            </div>
            <div class="py-3 grid grid-cols-2 gap-4">
              <div>
                <p class="text-gray-400 mb-1">总购次数</p>
                <p class="text-primary">{{bigintToNumberSafe(presaleInfoData?.[7])}}</p>
              </div>
              <div>
                <p class="text-gray-400 mb-1">剩余份数</p>
                <p class="text-primary">{{bigintToNumberSafe(presaleInfoData?.[7])}}份</p>
              </div>
            </div>
            <div class="py-3 grid grid-cols-2 gap-4">
              <div>
                <p class="text-gray-400 mb-1">每天限购</p>
                <p class="text-primary">{{bigintToNumberSafe(presaleInfoData?.[8])}}份</p>
              </div>
              <div>
                <p class="text-gray-400 mb-1">地址限购</p>
                <p class="text-primary">{{bigintToNumberSafe(presaleInfoData?.[9])}}份</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="rounded-lg p-4 mb-6 bg-gradient-to-br from-darkLight to-dark">
      <div class="flex justify-between items-center mb-4">
        <h2 class="gradient-text text-xl font-bold">GDA收益</h2>
      </div>
      <Proceed
          :gdaAmount="bigintToNumberSafe(userInfoData?.[1])"
          :pendingGDA="bigintToNumberSafe(availableRewardsData)"
          :releaseGDA="bigintToNumberSafe(userInfoData?.[2])"
          :progress="bigintToNumberSafe(userInfoData?.[1]) == 0 ? 0 : Math.floor(bigintToNumberSafe(userInfoData?.[2])  / bigintToNumberSafe(userInfoData?.[1]))"
          :multiple="rewardMultiplier"
          themeColor="primary"
          @receive="receive"
          :disabled="bigintToNumberSafe(availableRewardsData) < 1"
      />
    </section>
    <!-- 收益模块 -->
    <section class="rounded-lg p-4 mt-6 bg-gradient-to-br from-darkLight to-dark">
      <div class="flex justify-between items-center mb-4">
        <h2 class="gradient-text text-xl font-bold">认购记录</h2>
      </div>
      <Table :data="tableData" :columns="columns" @load-more="loadMore" v-model:loading="tableLoading" :isLoadAll="isLoadAll">
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
import {useRead} from "../hooks/Read.ts";
import {computed, onMounted, ref, watch} from "vue";
import {bigintToNumberSafe, copyToClipboard, formatAddress, formatSecondsToDateTime} from "../utils";
import Proceed from "../components/Proceed.vue";
import Table from "../components/Table.vue";
import Header from "../components/Header.vue";
import {formatEther, parseEther} from "viem"
import {useAccount, useWatchContractEvent} from "@wagmi/vue"
import {useWrite} from "../hooks/useWrite.ts";
import {contractConfigABI, erc20ConfigABI} from "../api"
import {Notify} from "../utils/Toast.ts"
import {getPublicVariable} from "../utils/base.ts";
import dayjs from 'dayjs'  // 导入 dayjs 库


const {address} = useAccount();
const selectDay = ref("7")
const detailShow = ref(false);
const {data:presaleInfoData} = useRead<any[]>(contractConfigABI,{
  functionName:'getPresaleInfo',
  blockNumberInterval: 1,
  onSuccess(data) {
    console.log(data);
  },
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

const {data:userInfoData,setParams:userInfoSetData} = useRead<any[]>(contractConfigABI,{
  functionName:'getUserInfo',
  initParams:{
    args:[address.value]
  },
  blockNumberInterval: 1,

  onError(error) {
    console.error('合约调用失败:', error);
  }
})

const {data:availableRewardsData,setParams:availableRewardsSetData} = useRead<any>(contractConfigABI,{
  functionName:'getAvailableRewards',
  initParams:{
    args:[address.value]
  },
  blockNumberInterval: 1,
  onError(error) {
    console.error('合约调用失败:', error);
  }
})



const {data:rewardMultiplier} = getPublicVariable('rewardMultiplier')
const {data:notification} = getPublicVariable('notification')
const {data:addressLimit} = getPublicVariable('addressLimit')
const {data:userPurchasedShares,setParams:setUserPurchasedShares} = getPublicVariable('userPurchasedShares');
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

const {write:erc20Approve,isPending:isAppPending} = useWrite(erc20ConfigABI,{
  functionName: 'approve',
  waitForConfirmation: true,
  onError(err) {
    Notify.error("出错了！")
    console.error('更新失败:', err);
  }
})

const {write:buySharesWrite,isPending:isBuyPending} = useWrite(contractConfigABI,{
  functionName: 'buyShares',
  waitForConfirmation: true,
  onError(err) {
    Notify.error("出错了！")
    console.error('出错了', err);
  }
})


const {write:claimRewardsWrite} = useWrite(contractConfigABI,{
  functionName: 'claimRewards',
  waitForConfirmation: true,
  onError(err) {
    Notify.error("出错了！")
    console.error('出错了', err);
  }
})


const isBuyDisabled = computed(()=>{
  return userPurchasedShares.value >= addressLimit.value
  // || isAppPending.value || isBuyPending.value || !isCounting.value
})

const buyShares = ()=>{
  if(userPurchasedShares.value >= addressLimit.value){
    Notify.error('您已超过地址限购')
    return
  }
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
    console.log("用户已授权")
    if(Number(formatEther(data[0].args.value)) == Number(formatEther(presaleInfoData.value[1]))){
      buySharesWrite([1])
    }
  }
})

useWatchContractEvent({
  address:contractConfigABI.address,
  abi:contractConfigABI.abi,
  eventName: 'SharesPurchased',
  onLogs(){
    Notify.success("购买成功！")
  }
})


const dayOptions = [
  { label: '1天', value: '1' },
  { label: '2天', value: '2' },
  { label: '3天', value: '3' },
  { label: '4天', value: '4' },
  { label: '5天', value: '5' },
  { label: '6天', value: '6' },
  { label: '7天', value: '7' },
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
})
const isLoadAll = ref(false);
const tableLoading = ref(false);
const page = ref(1);
function loadMore() {
  page.value+=1;
  setPagedAllPurchases([page.value,10])
}
const  {data:pagedAllPurchases,setParams:setPagedAllPurchases} = useRead(contractConfigABI,{
  functionName:'getPagedAllPurchases',
  initParams:{
    args:[page.value,10]
  },
  blockNumberInterval: 1,
  onError(error) {
    console.error('合约调用失败:', error);
  }
})


watch(pagedAllPurchases,(newVal)=>{
  tableLoading.value = false;
  if(newVal?.[0].length < 10){
    isLoadAll.value = true;
  }
})


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

watch(selectDay,(neVal)=>{
  getDataHistory(neVal)
})

const  {data:purchasedShares,setParams:setPurchasedShares} = getPublicVariable('userPurchasedShares');
const  {data:dailyPurchased,setParams:setDailyPurchased} = getPublicVariable('dailyPurchased');



watch(dailyPurchased,(newVal)=>{
  console.log(newVal)
})


const receive = ()=>{
  if(userInfoData.value?.[5]){
    Notify.warning('您的领取资格已被暂停')
    return
  }
  claimRewardsWrite()
}

useWatchContractEvent({
  address:contractConfigABI.address,
  abi:contractConfigABI.abi,
  eventName: 'RewardsClaimed',
  onLogs(){
    Notify.success("领取成功！")
  }
})


watch(address,(newVal)=>{
  if(!newVal)return;
  availableRewardsSetData([newVal]);
  userInfoSetData([newVal]);
  setAllowanceData([newVal,contractConfigABI.address]);
  setUserBalance([newVal])
  setPurchasedShares([newVal])
  setUserPurchasedShares([newVal])
},{
  deep:true,
  immediate:true
})

const chartDay = ref([])
const chartDayData = ref({
  data1:[],
  data2:[]
})
const getDataHistory = (Numb:number)=>{
  chartDay.value.length = Numb;
  chartDayData.value.data1 =[]
  chartDayData.value.data2 =[]
  setParams([1,Numb])
}

const {data,setParams} = getPublicVariable('getPagedDaySales');
watch(data,(res)=>{
  for(let i = selectDay.value - 1;i>=0 ;i--){
    const targetDate = dayjs().subtract(selectDay.value - i, 'day').date()
    chartDay.value[i] = targetDate + "日"
    console.log(chartDay.value)
  }
  res?.[0].forEach((item,index)=>{
    chartDayData.value.data2[selectDay.value - index - 1] = item.purchased
    chartDayData.value.data1[index] = formatEther(presaleInfoData.value?.[0] || 0)
  })
})

onMounted(()=>{
  setParams([1,7])
})
</script>

<style lang="scss" scoped>

</style>
