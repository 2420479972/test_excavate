<template>
  <!-- 蒙层 -->
  <transition name="fade">
    <div
        v-if="visible"
        class="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center"
        @click.self="close"
    >
      <!-- 弹窗区域 -->
      <transition name="popup">
        <div
            class="bg-[#1e1e1e] rounded-2xl p-5 max-w-[90%] w-full relative text-white shadow-xl"
            v-show="visible"
        >
          <!-- 标题栏 -->
          <div class="flex justify-between items-center mb-4">
            <h2 class="gradient-text text-xl font-bold">{{title}}</h2>
            <button
                class="text-gray-400 hover:text-white transition"
                @click="close"
            >
              ✕
            </button>
          </div>

          <!-- 内容插槽 -->
          <slot />
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
// 接收 props
const props = defineProps<{
  visible: boolean  // 是否可见，v-model 控制
  title?: string    // 弹窗标题（可选）
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

// 关闭方法
const close = () => {
  emit('update:visible', false)
}

// 滚动锁定逻辑
import { watch } from 'vue'

watch(
    () => props.visible,
    (newVal) => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = newVal ? 'hidden' : ''
      }
    }
)
</script>

<style scoped>
/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 弹窗缩放动画 */
.popup-enter-active,
.popup-leave-active {
  transition: transform 0.25s ease;
}
.popup-enter-from,
.popup-leave-to {
  transform: scale(0.95);
}

.gradient-text {
  background: linear-gradient(90deg, #00F0FF, #FF3366);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>
