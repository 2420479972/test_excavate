<template>
  <section class="rounded-lg p-4 mt-6 bg-gradient-to-br from-darkLight to-dark">
    <div class="flex justify-between items-center mb-4">
      <h2 class="gradient-text text-xl font-bold">认购记录</h2>
      <div @click="showMore = !showMore" class="gradient-text">更多>></div>
    </div>
    <div class="max-h-[250px] relative w-full flex flex-col">
      <scroll-table :data="tableData"></scroll-table>
    </div>

  </section>
  <Modal v-model:visible="showMore" title="更多记录">
    <TableV :data="tableData" :columns="columns" @load-more="loadMore" v-model:loading="loading" :finished="finished">
      <template #cell-address="{row}">
        <div class="text-[#00F0FF]">{{row.address}}</div>
      </template>
    </TableV>
  </Modal>
</template>

<script setup lang="ts">

// 表头配置
import TableV from "../../components/TableV.vue";
import {onMounted, ref, watch} from "vue";
import {useRead} from "../../hooks/Read.ts";
import {contractConfigABI} from "../../api";
import {Wallet} from "ethers";
import {formatAddress, formatSecondsToDateTime} from "../../utils";
import dayjs from "dayjs";
import {formatEther} from "viem";
import {getPublicVariable} from "../../utils/base.ts";
import ConfirmModal from "../../components/ConfirmModal.vue";
import Modal from "../../components/Modal.vue";
import ScrollTable from "../../components/ScrollTable.vue";


const columns = [
  { label: '地址', key: 'address' },
  { label: '时间', key: 'time',class:["text-center"] },
  { label: '数量', key: 'numb',class:["text-center"] },
  { label: '金额(USDT)', key: 'usdt',class:["text-center"] }
]

const tableData = ref([])
const page = ref(1);
const  {data:pagedAllPurchases,setParams:setPagedAllPurchases} = useRead(contractConfigABI,{
  functionName:'getPagedAllPurchases',
  initParams:{
    args:[page.value,10]
  },
  blockNumberInterval: 1,
  onError(error) {
    loading.value = false;
  }
})

const loading = ref(false);
const finished = ref(false);
const showMore = ref(false);


let isFinished = false;
const loadMore = ()=>{
  pushRecord(10)
  if(isFinished){
    pushRecord(10)
    return;
  }
  page.value +=1;
  // setPagedAllPurchases([page.value,10]);
}


watch(pagedAllPurchases,(newVal)=>{
  if(!newVal) return;
  // if(newVal[0].length < 10){
  //   tableData.value.push(...(newVal[0].map((item:any)=>{
  //     return {
  //       address:formatAddress(item.buyer) ,
  //       time:formatSecondsToDateTime(item.timestamp),
  //       numb:item.shares,
  //       usdt:formatEther(String(item.usdtPaid || 0) as any)
  //     }
  //   })))
  //   isFinished = true;
  //   pushRecord(10 - newVal[0].length)
  //   return;
  // }else{
  //   tableData.value.push(...(newVal[0].map((item:any)=>{
  //     return {
  //       address:formatAddress(item.buyer) ,
  //       time:formatSecondsToDateTime(item.timestamp),
  //       numb:item.shares,
  //       usdt:formatEther(String(item.usdtPaid || 0) as any)
  //     }
  //   })))
  // }
  loading.value = false;
})

const {data:presaleInfoData} = getPublicVariable('getPresaleInfo');

const pushRecord = (size:number = 10)=>{
  if(finished.value) return;
  // 固定的最小时间
  const minDate = dayjs('2025-08-02')
// 当前时间
  const nowDate = dayjs()

// 计算 minDate 和当前时间之间的天数差（用于随机范围）
  const diffDays = nowDate.diff(minDate, 'day') // 可能是 0~6 天之间
  console.log('---------------')
  for(let i =0;i <size; i++){
    const wallet = Wallet.createRandom() // 创建随机钱包实例
    // 在 [0, diffDays] 范围内取一个随机整数
    const randomOffset = Math.floor(Math.random() * (diffDays + 1))
    // 生成最终的随机时间（不能早于 2025-08-02）
    const randomDate = nowDate.subtract(randomOffset, 'day').format('YYYY-MM-DD')
    tableData.value.push({
      address:formatAddress(wallet.address),
      time:randomDate,
      numb:1,
      usdt:500 //formatEther(presaleInfoData.value?.[1] || 0)
    })
  }
  if(tableData.value.length > 500){
    finished.value = true;
  }
  loading.value = false;
}

onMounted(()=>{
  pushRecord(10)
})

</script>

<style  scoped>
@import "../../assets/css/home.css";

</style>
