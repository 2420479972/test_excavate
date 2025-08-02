<template>
  <div class="w-full overflow-hidden text-white">
    <!-- 表头 -->
    <div class="grid grid-cols-12 text-sm font-medium py-2 px-4">
      <div class="col-span-4">地址</div>
      <div class="col-span-4">时间</div>
      <div class="col-span-2">数量</div>
      <div class="col-span-2">USDT</div>
    </div>

    <!-- 滚动列表 -->
    <div class="h-[240px] overflow-hidden">
      <vue3-scroll-seamless
          :key="reloadKey"
          :classOptions="{
            step:0.3,
            limitScrollNum:10,
          }"
          :dataList="data"
      >
        <div class="grid grid-cols-12 px-4" v-for="(item, index) in data" :key="index">
          <div class="py-2 col-span-4 border-t  text-sm border-gray-700 text-[#00F0FF]">{{ item.address }}</div>
          <div class="py-2 col-span-4 border-t  text-sm border-gray-700">{{ item.time }}</div>
          <div class="py-2 col-span-2 border-t px-4  text-sm border-gray-700">{{ item.numb }}</div>
          <div class="py-2 col-span-2 border-t px-4 text-left text-sm border-gray-700">{{ item.usdt }}</div>
        </div>
      </vue3-scroll-seamless>
    </div>
  </div>
</template>

<script setup lang="ts">
import {nextTick, ref, watch} from "vue";
type Props = {
  data:any[]
}
const props =  withDefaults(defineProps<Props>(),{
  data:()=>[]
});

const reloadKey = ref(0) // key 触发组件重建

watch(props.data,()=>{
  nextTick(() => {
    reloadKey.value+=1;
  })
})
</script>

