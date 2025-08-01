<template>
  <div
      ref="scrollContainer"
      class="overflow-auto"
      style="max-height: 400px;"
      @scroll="handleScroll"
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

      <!-- 加载中提示 -->
      <tr v-if="isLoading">
        <td :colspan="columns.length" class="text-center text-gray-500 py-2">加载中...</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>




<script lang="ts" setup>
import { CSSProperties, defineProps, ref } from 'vue'

interface Column {
  label: string
  key: string
  style?: CSSProperties
  class?: string | Record<string, any> | any[]
}

// 定义 props
const props = defineProps<{
  columns: Column[]                    // 表头配置
  data: Record<string, any>[]         // 表格数据
  onLoadMore?: () => Promise<void>    // 加载更多回调
  loading?: boolean                   // 父组件传入的加载状态
  isLoadAll?:boolean
}>()

const emit = defineEmits(['update:loading'])

const isLoading = ref(props.loading)
// 滚动容器引用
const scrollContainer = ref<HTMLDivElement | null>(null)

function handleScroll() {
  if(props.isLoadAll) return;
  const container = scrollContainer.value
  if (!container || props.loading || !props.onLoadMore) return

  const scrollThreshold = 50
  const isBottom =
      container.scrollTop + container.clientHeight >= container.scrollHeight - scrollThreshold
  if (isBottom && !props.loading) {
    emit('update:loading',true);
    props.onLoadMore()
  }
}
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
