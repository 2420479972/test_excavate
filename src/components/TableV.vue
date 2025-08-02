<template>
  <!-- 外部滚动容器 -->
  <div
      ref="scrollContainer"
      class="overflow-auto"
      style="max-height: 400px;"
  >
    <table class="w-full text-sm text-left text-gray-700">
      <!-- 表头 -->
      <thead class="sticky-header text-[#9CA3AF]">
      <tr>
        <th
            v-for="column in columns"
            :key="column.key"
            :class="['py-2 whitespace-nowrap text-sm font-semibold', column.class]"
            :style="column.style"
        >
          <slot :name="`header-${column.key}`">{{ column.label }}</slot>
        </th>
      </tr>
      </thead>

      <!-- 表体 -->
      <tbody>
      <!-- 数据行 -->
      <tr
          v-for="(item, rowIndex) in data"
          :key="rowIndex"
          class="hover:bg-gray-800 transition-colors"
      >
        <td
            v-for="column in columns"
            :key="column.key"
            :class="['py-2 whitespace-nowrap text-sm font-semibold text-white', column.class]"
        >
          <slot :name="`cell-${column.key}`" :row="item">
            {{ item[column.key] }}
          </slot>
        </td>
      </tr>

      <!-- 空状态 -->
      <tr v-if="!loading && data.length === 0">
        <td :colspan="columns.length" class="text-center text-gray-400 py-4">
          暂无数据
        </td>
      </tr>

      <!-- 加载中状态 -->
      <tr v-if="loading">
        <td :colspan="columns.length" class="text-center text-gray-400 py-3">
          加载中...
        </td>
      </tr>

      <!-- 加载完成状态 -->
      <tr v-if="finished && !loading">
        <td :colspan="columns.length" class="text-center text-gray-500 py-3">
          已加载全部数据
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { CSSProperties, defineProps, ref, watch } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'

// 定义列配置接口
interface Column {
  label: string                           // 表头显示文本
  key: string                             // 字段 key
  style?: CSSProperties                  // 自定义 style
  class?: string | Record<string, any> | any[] // 自定义 class
}

// 组件 props 定义
const props = defineProps<{
  columns: Column[]                       // 表格列配置
  data: Record<string, any>[]            // 表格数据
  loading: boolean                        // 加载状态 (由父组件控制)
  finished: boolean                       // 是否加载完所有数据
}>()

// 定义事件
const emit = defineEmits<{
  (e: 'load-more'): void                 // 触发加载更多
  (e: 'update:loading', value: boolean): void // 可选，父组件双向绑定 loading
}>()

// 滚动容器 DOM 引用
const scrollContainer = ref<HTMLDivElement | null>(null)


// 绑定滚动加载逻辑
useInfiniteScroll(
    scrollContainer,
    async () => {
      if (props.loading || props.finished) return // 防止重复加载
      emit('update:loading', true) // 通知父组件正在加载
      emit('load-more')           // 触发外部加载逻辑
    },
    {
      distance: 80, // 距底部多少触发，按需调整
    }
)
</script>

<style scoped>
thead.sticky-header th {
  position: sticky;
  top: 0;
  background: rgb(30, 30, 32);  /* 深色背景 */
  z-index: 10;
  backdrop-filter: saturate(180%);
}
</style>
