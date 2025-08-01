<template>
  <!-- 倒计时容器 -->
  <div class="flex justify-center items-center mb-2" v-if="isCounting">
    <!-- 天 -->
    <div class="countdown-box mr-1" v-for="item in time.days" :key="item">{{ item }}</div>
    <span class="mx-2 text-primary">天</span>

    <!-- 时 -->
    <div class="countdown-box mr-1">{{ time.hours[0] }}</div>
    <div class="countdown-box mr-1">{{ time.hours[1] }}</div>
    <span class="mx-2 text-primary">时</span>

    <!-- 分 -->
    <div class="countdown-box mr-1">{{ time.minutes[0] }}</div>
    <div class="countdown-box mr-1">{{ time.minutes[1] }}</div>
    <span class="mx-2 text-primary">分</span>

    <!-- 秒 -->
    <div class="countdown-box mr-1">{{ time.seconds[0] }}</div>
    <div class="countdown-box">{{ time.seconds[1] }}</div>
    <span class="mx-2 text-primary">秒</span>
  </div>
  <div v-else class="text-center text-gray-500">活动未开始或已结束</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'

// ✅ 定义父组件传入的 props：开始时间、结束时间（单位：秒）
const props = defineProps<{
  startTime: number  // 单位：秒（Unix 时间戳）
  endTime: number    // 单位：秒（Unix 时间戳）
}>()

// 当前时间（秒）
const now = ref(Math.floor(Date.now() / 1000))

// 每秒更新当前时间
let timer: number | null = null

// ⏳ 是否在倒计时区间
const isCounting = computed(() => {
  return now.value >= props.startTime && now.value < props.endTime
})

// ⌛ 计算剩余时间（秒）
const remaining = computed(() => {
  if (now.value < props.startTime) return props.endTime - props.startTime
  if (now.value >= props.endTime) return 0
  return props.endTime - now.value
})

// 📦 格式化为两位数
const formatNumber = (n: number): string => n.toString().padStart(2, '0')

// 📊 拆分时间
const time = computed(() => {
  const total = Math.max(remaining.value, 0)
  const days = Math.floor(total / 60 / 60 / 24)
  const hours = Math.floor((total / 60 / 60) % 24)
  const minutes = Math.floor((total / 60) % 60)
  const seconds = Math.floor(total % 60)

  return {
    days: formatNumber(days).split(''),
    hours: formatNumber(hours).split(''),
    minutes: formatNumber(minutes).split(''),
    seconds: formatNumber(seconds).split(''),
  }
})

// 🕒 启动定时器
const startTimer = () => {
  timer = setInterval(() => {
    now.value = Math.floor(Date.now() / 1000)
  }, 1000)
}

// 生命周期钩子
onMounted(startTimer)
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
