import { Buffer } from 'buffer'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { WagmiPlugin } from '@wagmi/vue'
import { createApp } from 'vue'
import "./assets/css/base.css"
import "tailwindcss/tailwind.css"
import '@fortawesome/fontawesome-free/css/all.min.css'

// `@coinbase-wallet/sdk` uses `Buffer`
(globalThis as any).Buffer = Buffer
const queryClient = new QueryClient()
import App from './App.vue'
import './style.css'
import { config } from './wagmi'

const app = createApp(App)

app.use(WagmiPlugin, { config }).use(VueQueryPlugin, {queryClient})

app.mount('#app')
