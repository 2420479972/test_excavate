<!-- ValidatedForm.vue -->
<template>
  <form @submit.prevent="onSubmit">
    <slot :register="registerField" />
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const fields = ref<(() => Promise<boolean>)[]>([])
const emit = defineEmits(['success'])
// 注册字段验证方法
function registerField(fieldInstance: any) {
  if (fieldInstance && typeof fieldInstance.validate === 'function') {
    fields.value.push(() => Promise.resolve(fieldInstance.validate()))
  }
}

// 表单统一验证
async function onSubmit() {
  let allValid = true
  for (const validateFn of fields.value) {
    const valid = await validateFn()
    if (!valid) allValid = false
  }
  if (allValid) {
    emit('success');
  }
}
</script>
