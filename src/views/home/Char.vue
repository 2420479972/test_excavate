<template>

  <div class="flex justify-between items-center mb-4">
    <h2 class="gradient-text text-xl font-bold">GDA预售</h2>
<!--    <div class="flex items-center space-x-1">-->
<!--      <Select :options="dayOptions" v-model="selectDay"></Select>-->
<!--    </div>-->
  </div>
  <LineChart :series-data="chartDayData" :x-axis-data="chartDay"></LineChart>
</template>

<script setup lang="ts">
import LineChart from "../../components/LineChart.vue";
import Select from "../../components/Select.vue";
import {onMounted, ref, watch} from "vue";
import {getPublicVariable} from "../../utils/base.ts";
import dayjs from "dayjs";
import {formatEther} from "viem";

// const selectDay = ref(1)
//
// const dayOptions = [
//   { label: '1天', value: 1 },
//   { label: '2天', value: 2 },
//   { label: '3天', value: 3 },
//   { label: '4天', value: 4 },
//   { label: '5天', value: 5 },
//   { label: '6天', value: 6 },
//   { label: '7天', value: 7 },
// ];

const chartDay = ref<string[]>([])
const chartDayData = ref<{
  data1:any[],
  data2:any[]
}>({
  data1:[],
  data2:[]
})


//
//
// const getDataHistory = (Numb:number)=>{
//   chartDay.value.length = 0
//   for(let i = selectDay.value - 1;i>=0 ;i--){
//     const targetDate = dayjs().subtract(selectDay.value - i, 'day').date()
//     chartDay.value[i] = targetDate + "日"
//   }
//   chartDayData.value.data1 =[]
//   chartDayData.value.data2 =[]
//   setParams([1,Numb])
// }
//
// const {data:presaleInfoData} = getPublicVariable('getPresaleInfo');
//
// const {data,setParams} = getPublicVariable('getPagedDaySales');
//
// watch(data,(res)=>{
//   res?.[0].forEach((item:any,index:number)=>{
//     chartDayData.value.data2[selectDay.value - index - 1] = item.purchased || 0
//     chartDayData.value.data1[index] = formatEther(presaleInfoData.value?.[0] || 0)
//   })
// })
//
// watch(selectDay,(newVal)=>{
//   getDataHistory(newVal as number)
// },{
//   immediate:true
// })

const {data:startTime} = getPublicVariable('startTime');


const getHistoryForGit =async ()=>{
 const response = await fetch('https://raw.githubusercontent.com/EternalProtocol/doc/main/data.json') // 请求指定接口
  const data =await response.json()
    for(let i = 0;i<10 ;i++){
    const targetDate = dayjs().add( i, 'day').date()
    chartDay.value[i] = targetDate + "日"
  }
  data.forEach((item:any,index:number)=>{
    chartDayData.value.data2[index] = 5000 * item
    chartDayData.value.data1[index] = 25000000  || 0
  })
}


onMounted(()=>{
  getHistoryForGit();
})

</script>

<style scoped>
@import "../../assets/css/home.css";
</style>
