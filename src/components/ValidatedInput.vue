<template>
  <div class="input-wrapper">
    <!-- 输入框 -->
    <input
        class="input-field w-full px-3 py-2 rounded-button text-sm border"
        :class="{ 'border-red-500': errorMessage }"
        :type="type"
        :placeholder="placeholder"
        v-model="innerValue"
        @blur="validate"
        @input="validate"
    />

    <!-- 错误信息 -->
    <p v-if="errorMessage" class="text-red-500 text-xs mt-1">{{ errorMessage }}</p>
    <slot :validate="validate"/>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

/**
 * 验证规则类型定义
 */
type ValidationRule =
    | { type: 'required'; message?: string }
    | { type: 'min'; value: number; message?: string }
    | { type: 'max'; value: number; message?: string }
    | { type: 'custom'; validator: (val: string) => boolean; message: string }

const props = defineProps<{
  modelValue: string | number
  type?: string
  placeholder?: string
  rules?: ValidationRule[]
}>()

const emit = defineEmits(['update:modelValue'])

const innerValue = ref(props.modelValue) // 输入框内部值
const errorMessage = ref('') // 验证错误信息

// 父组件 v-model 改变，内部同步
watch(() => props.modelValue, (val) => {
  innerValue.value = val
})

// 内部输入变化，发射给父组件
watch(innerValue, (val) => {
  emit('update:modelValue', val)
})

/**
 * 执行验证并返回是否通过
 */
function validate(): boolean {
  errorMessage.value = ''

  for (const rule of props.rules ?? []) {
    const val = innerValue.value
    if (rule.type === 'required') {
      if (val === '' || val === null || val === undefined) {
        errorMessage.value = rule.message || '该字段是必填项'
        return false
      }
    }

    if (rule.type === 'min') {
      const num = Number(val)
      if (isNaN(num) || num < rule.value) {
        errorMessage.value = rule.message || `不能小于 ${rule.value}`
        return false
      }
    }

    if (rule.type === 'max') {
      const num = Number(val)
      if (isNaN(num) || num > rule.value) {
        errorMessage.value = rule.message || `不能大于 ${rule.value}`
        return false
      }
    }

    if (rule.type === 'custom') {
      if (!rule.validator(String(val))) {
        errorMessage.value = rule.message
        return false
      }
    }
  }

  return true
}

// 暴露 validate 方法给父组件调用
defineExpose({
  validate,
})
</script>
