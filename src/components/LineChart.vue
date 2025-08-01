<template>
  <div ref="chartRef" class="w-full h-full" />
</template>

<script setup>
// 引入依赖
import * as echarts from 'echarts/core'
import {
  BarChart,
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 注册组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer
])

// 接收父组件传参
const props = defineProps({
  xAxisData: {
    type: Array,
    default: () => []
  },
  seriesData: {
    type: Object,
    default: () => {
      return {
        data1:[],
        data2:[]
      }
    }
  },
  legend: {
    type: Object,
    default: () => ({
      data: ['代币总量', '已售数量'],
      textStyle: { color: '#fff' },
      right: 10,
      top: 0
    })
  }
})

import { onMounted, ref, watch, onBeforeUnmount } from 'vue'

const chartRef = ref(null)
let chartInstance = null

// 初始化图表
const initChart = () => {
  if (chartInstance) chartInstance.dispose()
  chartInstance = echarts.init(chartRef.value)

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: props.legend,
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: props.xAxisData,
      axisLine: {
        lineStyle: { color: 'rgba(255, 255, 255, 0.3)' }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.7)'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: { color: 'rgba(255, 255, 255, 0.3)' }
      },
      splitLine: {
        lineStyle: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.7)'
      }
    },
    series: [
      {
        name: '代币总量',
        type: 'bar',
        barWidth: '30%',
        data: props.seriesData.data1,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 240, 255, 0.8)' },
            { offset: 1, color: 'rgba(0, 240, 255, 0.2)' }
          ])
        }
      },
      {
        name: '已售数量',
        type: 'bar',
        barWidth: '30%',
        data: props.seriesData.data2,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 51, 102, 0.8)' },
            { offset: 1, color: 'rgba(255, 51, 102, 0.2)' }
          ])
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

// 生命周期挂载
onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

// 监听数据变化，自动更新图表
watch(() => [props.xAxisData, props.seriesData], () => {
  initChart()
}, { deep: true })

// 图表自适应
const resizeChart = () => {
  chartInstance?.resize()
}

// 清理资源
onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<style scoped>
/* 可根据需要定义容器尺寸 */
div {
  width: 100%;
  height: 250px;
}
</style>
