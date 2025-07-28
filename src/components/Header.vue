<template>
  <!-- 顶部导航栏 -->
  <nav class="flex items-center justify-between px-4 py-3 bg-dark text-white">
    <div class="flex items-center">
      <button class="hover:text-primary transition" @click="onMenuClick">
        <i class="fas fa-bars text-xl mr-2"></i>
      </button>
      <span v-if="status == 'connected'" class="text-sm font-mono">{{ truncatedAddress }}</span>
      <button
          v-else
          class="ml-2 text-sm hover:text-primary transition border border-primary px-2 py-1 rounded"
          @click="connectWallet"
      >
        连接钱包
      </button>
    </div>

    <div class="flex items-center">
      <div class="dropdown relative">
        <button class="flex items-center text-sm hover:text-primary transition">
          <i class="fas fa-globe mr-1"></i>
          <span>{{ currentLang }}</span>
          <i class="fas fa-chevron-down ml-1 text-xs"></i>
        </button>
        <div class="dropdown-content absolute right-0 bg-dark rounded mt-1 shadow z-10">
          <a
              v-for="lang in langs"
              :key="lang"
              class="block px-4 py-2 hover:bg-darkLight cursor-pointer"
              @click="changeLang(lang)"
          >
            {{ lang }}
          </a>
        </div>
      </div>
      <button
          class="ml-4 text-sm hover:text-primary transition"
          v-if="status !== 'disconnected'" @click="disconnect()"
      >
        <i class="fas fa-sign-out-alt"></i>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
// 引入 wagmi 钩子
import {useConnect, useAccount, useDisconnect} from '@wagmi/vue'
import { injected } from '@wagmi/vue/connectors'
import {computed, onMounted, ref, watch} from "vue";
import {storage} from "../store/connect.ts"
// 钱包连接状态
const { address, status,isConnected } = useAccount()
const { connect } = useConnect()
const { disconnect } = useDisconnect()
// 钱包连接逻辑
const connectWallet = async () => {
   connect({ connector: injected() })
}


// 地址截断展示
const truncatedAddress = computed(() => {
  if (!address) return ''
  return `${address.value?.slice(0, 6)}...${address.value?.slice(-4)}`
})

// 菜单点击事件（可根据需要绑定）
const onMenuClick = () => {
  console.log('菜单点击')
}

// 多语言支持
const currentLang = ref('中文')
const langs = ['中文', 'English']
const changeLang = (lang: string) => {
  currentLang.value = lang
}

onMounted(async () => {
  const wasConnected = await storage.getItem('wallet-connected');
  if (wasConnected && !isConnected.value) {
    connect({ connector: injected() })
  }
})

watch(isConnected, (value) => {
  storage.setItem('wallet-connected', value) // 缓存连接状态
})
</script>

<style  scoped>
.dropdown-content {
  display: none;
  min-width: 100px;
}
.dropdown:hover .dropdown-content {
  display: block;
}
.bg-dark {
  background-color: #1f1f1f;
}
</style>
