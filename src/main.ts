import { Buffer } from 'buffer'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { WagmiPlugin } from '@wagmi/vue'
import { createApp } from 'vue'
import "./assets/css/base.css"
import "tailwindcss/tailwind.css"
import '@fortawesome/fontawesome-free/css/all.min.css'
import {vue3ScrollSeamless} from "vue3-scroll-seamless";
import router from "./router"
// `@coinbase-wallet/sdk` uses `Buffer`
(globalThis as any).Buffer = Buffer
const queryClient = new QueryClient()
import App from './App.vue'
import './style.css'
import { config } from './wagmi'
// console.log = ()=>{};
const app = createApp(App).use(router)

app.use(WagmiPlugin, { config }).use(VueQueryPlugin, {queryClient}).component('vue3ScrollSeamless',vue3ScrollSeamless)

app.mount('#app')
