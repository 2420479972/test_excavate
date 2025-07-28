<template>
  <div class="overflow-auto" style="max-height: 400px;">
    <table class="w-full text-sm text-left text-gray-700" :columns="columns.length" :data="data">
      <!-- 表头 -->
      <thead class="sticky-header text-[#9CA3AF]">
      <tr>
        <th
            v-for="column in columns"
            :key="column.key"
            :class="['py-2 whitespace-nowrap text-sm font-semibold', column.class]"
            :style="column.style"
        >
          <!-- 插槽支持表头自定义 -->
          <slot :name="`header-${column.key}`">{{ column.label }}</slot>
        </th>
      </tr>
      </thead>
      <!-- 表体 -->
      <tbody>
      <tr
          v-for="(item, rowIndex) in data"
          :key="rowIndex"
          class="hover:bg-gray-800 transition-colors"
      >
        <td
            v-for="column in columns"
            :key="column.key"
            :class="['py-2 whitespace-nowrap text-sm font-semibold text-[#fff]', column.class]"
        >
          <!-- 插槽支持单元格自定义 -->
          <slot :name="`cell-${column.key}`" :row="item">
            {{ item[column.key] }}
          </slot>
        </td>
      </tr>

      <!-- 空状态 -->
      <tr v-if="data.length === 0">
        <td :colspan="columns.length" class="text-center text-gray-400 py-4">
          暂无数据
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { CSSProperties, defineProps } from 'vue'

interface Column {
  label: string
  key: string
  style?: CSSProperties
  class?: string | Record<string, any> | any[]
}

defineProps<{
  columns: Column[]
  data: Record<string, any>[]
}>()
</script>

<style scoped>
thead.sticky-header th {
  position: sticky;
  top: 0;
  background: rgb(30, 30, 32);
  z-index: 10;
  /* 下面这行防止表头内容被遮挡或模糊 */
  backdrop-filter: saturate(180%);
}
</style>
