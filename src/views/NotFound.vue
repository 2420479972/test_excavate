<template>
  <!-- 页面容器 -->
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center Not">

    <!-- 图标 -->
    <div class="text-6xl text-red-500 mb-4">
      <i class="fas fa-ban"></i> <!-- FontAwesome 禁止图标 -->
    </div>

    <!-- 状态码 -->
    <h1 class="text-5xl font-bold  mb-2 text-gray-600">
      403
    </h1>

    <!-- 错误信息 -->
    <p class="text-lg text-gray-600 mb-6">
      抱歉，您没有权限访问此页面。
    </p>

    <!-- 返回按钮 -->
    <button
        @click="goBack"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg bg-gradient-to-r from-primary to-secondary text-dark transition"
    >
      返回主页
    </button>
  </div>
</template>

<script setup lang="ts">
// 引入 Vue 路由
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回上一页方法
const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
/* 可选：自定义图标大小或颜色 */
.Not{
  background: linear-gradient(135deg, #121214 0%, #1a1a1f 100%);
}
</style>
