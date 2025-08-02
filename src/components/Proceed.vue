<template>
  <div class="glass-effect rounded-lg p-3 flex items-center hover-glow">
    <!-- 左侧图标与描述 -->
    <div class="flex flex-col items-center mr-4">
      <div
          class="w-8 h-8 bg-primary rounded flex items-center justify-center mining-animation"
          :class="iconBgClass"
      >
        <i :class="['text-dark', randomIcon]" />
      </div>
      <p class="text-xs mt-1 text-center">{{ multiple }}倍收益</p>
      <p class="text-xs" :class="textColorClass">{{ gdaAmount }}枚GDA</p>
    </div>

    <!-- 右侧信息 -->
    <div class="flex-1">
      <div class="flex justify-between text-xs mb-1">
        <span>待提 GDA: {{ pendingGDA }}枚</span>
        <span :class="textColorClass">{{ progress }}%</span>
      </div>

      <!-- 进度条 -->
      <div class="h-1.5 bg-darkLight rounded-full w-full mb-2">
        <div
            class="h-1.5 rounded-full"
            :style="{
            width: progress + '%',
            background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
          }"
        />
      </div>

      <!-- 当前释放与按钮 -->
      <div class="flex justify-between items-center">
        <span class="text-xs">当前释放 GDA: {{ releaseGDA }}枚</span>
        <button
            :disabled="disabled"
            class="text-dark text-xs px-2 py-1 rounded hover-glow flex items-center justify-center"
            :style="{ backgroundColor: disabled ?'gray' :buttonColor }"
            @click="handleClaim"
        >
          <Loading v-if="loading"></Loading>
          <span v-else>
            提取
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import Loading from "./Loading.vue";

// 定义Props并提供默认值
const props = withDefaults(
    defineProps<{
      multiple: number
      gdaAmount: string
      pendingGDA: string
      releaseGDA: string
      progress: number
      buttonColor?: "#00BFFF" | "#FF69B4"
      themeColor?: 'primary' | 'secondary'
      disabled?:boolean
      loading?:boolean
    }>(),
    {
      themeColor: 'primary',
      buttonColor:"#00BFFF"
    }
)
const emit = defineEmits(['receive'])
// 图标列表（三选一）
const icons = ['fas fa-hammer', 'fas fa-coins', 'fas fa-gem']
const randomIcon = ref('')
onMounted(() => {
  // 随机获取图标
  randomIcon.value = icons[Math.floor(Math.random() * icons.length)]
})

// 根据主题颜色动态设置样式类
const iconBgClass = computed(() =>
    props.themeColor === 'primary' ? 'bg-primary' : 'bg-secondary'
)
const textColorClass = computed(() =>
    props.themeColor === 'primary' ? 'text-primary' : 'text-secondary'
)

// 设置渐变色起止色
const gradientFrom = computed(() =>
    props.themeColor === 'primary' ? '#00FFD1' : '#FFD700'
)
const gradientTo = computed(() =>
    props.themeColor === 'primary' ? '#00BFFF' : '#FF69B4'
)

// 点击提取按钮
const handleClaim = () => {
  emit('receive');
}
</script>

<style scoped>
.mining-animation {
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}
</style>