<template>
  <!-- 倒计时容器 -->
  <div class="flex justify-center items-center mb-2">
    <!-- 天 -->
    <div class="countdown-box mr-1">{{ time.days[0] }}</div>
    <div class="countdown-box mr-1">{{ time.days[1] }}</div>
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
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

// ⏳ 倒计时时间目标，可以从 props 传入
const targetTime = new Date('2025-08-01T12:00:00').getTime() // 举例为8月1日中午12点

// ⌛ 当前剩余时间（毫秒）
const remaining = ref(targetTime - Date.now())

// 🕒 定时器对象
let timer: number | null = null

// 🧠 把数字补齐两位字符串（如 5 -> '05'）
const formatNumber = (n: number): string => n.toString().padStart(2, '0')

// 📦 计算出每一部分的时间字符串，并拆分成单个字符
const time = computed(() => {
  const total = Math.max(remaining.value, 0)

  const days = Math.floor(total / 1000 / 60 / 60 / 24)
  const hours = Math.floor((total / 1000 / 60 / 60) % 24)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const seconds = Math.floor((total / 1000) % 60)

  return {
    days: formatNumber(days).split(''),
    hours: formatNumber(hours).split(''),
    minutes: formatNumber(minutes).split(''),
    seconds: formatNumber(seconds).split(''),
  }
})

// 🧭 启动倒计时更新
const startCountdown = () => {
  timer = window.setInterval(() => {
    remaining.value = targetTime - Date.now()

    if (remaining.value <= 0 && timer) {
      remaining.value = 0
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

// 生命周期管理
onMounted(startCountdown)
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

