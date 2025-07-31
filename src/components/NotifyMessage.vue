<template>
  <Transition name="slide-fade">
    <div
        v-if="visible"
        class="fixed top-10 flex items-center w-full"

    >
      <div class="w-[90vw] max-w-sm p-3 rounded-lg shadow-lg flex items-center justify-center space-x-3 mx-auto" :class="toastTypeClass">
        <div class="flex-shrink-0 text-lg">
          <slot name="icon">{{ icon }}</slot>
        </div>
        <div class="flex-1 text-sm leading-snug">
          <div v-if="title" class="font-semibold">{{ title }}</div>
          <div v-if="description">{{ description }}</div>
        </div>
      </div>

    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{
  title?: string
  description?: string
  type?: 'success' | 'error' | 'info' | 'warning' | 'custom'
  duration?: number
  onClose?: () => void
}>()

const visible = ref(true)

const iconMap = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️',
  custom: '',
}

const icon = iconMap[props.type || 'info']

const toastTypeClass = {
  'bg-green-500 text-white': props.type === 'success',
  'bg-red-500 text-white': props.type === 'error',
  'bg-blue-500 text-white': props.type === 'info',
  'bg-yellow-500 text-black': props.type === 'warning',
  'bg-neutral-800 text-white': props.type === 'custom',
}

onMounted(() => {
  setTimeout(() => {
    visible.value = false
    props.onClose?.()
  }, props.duration || 3000)
})
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
  transform: translateY(-100%);
  opacity: 0;
}
.slide-fade-enter-to {
  transform: translateY(0);
  opacity: 1;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(-50%);
}
</style>
