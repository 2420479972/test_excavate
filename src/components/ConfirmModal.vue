<template>
  <Teleport to="body">
    <Transition name="fade-zoom">
      <div
          v-if="visible"
          class="fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center"
          @click.self="maskClosable ? close() : null"
      >
        <div
            class="bg-[#1a1a1a] text-white rounded-2xl w-[90vw] max-h-[80vh] overflow-auto shadow-xl p-4"
            :style="{ width }"
        >
          <!-- 头部 -->
          <div class="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
            <h3 class="text-lg font-semibold">{{ title }}</h3>
            <button @click="handleCancel" class="text-white text-xl">×</button>
          </div>

          <!-- 内容 -->
          <div class="text-sm leading-relaxed" v-html="content" />

          <!-- 底部按钮 -->
          <div class="mt-6 flex justify-end space-x-3 border-t border-white/10 pt-4">
            <button
                @click="handleCancel"
                class="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
            >
              {{ cancelText || '取消' }}
            </button>
            <button
                @click="handleOk"
                class="px-4 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-sm text-white"
            >
              {{ okText || '确定' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

/**
 * 定义组件的 props，用于动态传参
 */
const props = defineProps<{
  title: string
  content: string
  okText?: string
  cancelText?: string
  maskClosable?: boolean
  width?: string
  onOk?: () => void
  onCancel?: () => void
  onClose?: () => void
}>()

// 控制弹窗显示/隐藏
const visible = ref(true)

/**
 * 关闭弹窗并触发销毁
 */
const close = () => {
  visible.value = false
  props.onClose?.()
}

/**
 * 确认操作
 */
const handleOk = () => {
  props.onOk?.()
  close()
}

/**
 * 取消操作
 */
const handleCancel = () => {
  props.onCancel?.()
  close()
}
</script>

<style scoped>
.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: all 0.25s ease;
}
.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
