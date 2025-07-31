import {createConfig, createStorage,http,custom} from '@wagmi/vue'
import {mainnet, optimism, sepolia} from '@wagmi/vue/chains'
import {defineChain} from "viem"
import {coinbaseWallet, injected, metaMask, safe, walletConnect} from '@wagmi/vue/connectors'

declare module '@wagmi/vue' {
    interface Register {
        config: typeof config
    }
}

const localChain = defineChain({
    id: 1337, // 链ID，必须与你本地链一致
    name: 'Localhost 1337', // 自定义链名称
    nativeCurrency: {
        name: 'Ether',       // 原生币名称
        symbol: 'ETH',       // 原生币符号
        decimals: 18         // 精度（以太坊标准）
    },
    rpcUrls: {
        default: {
            http: ['http://202.124.251.169:8545'], // 本地 RPC 节点
        }
    },
    testnet: true, // 标记为测试链
})

export const config = createConfig({
    chains: [mainnet, sepolia, optimism,localChain],
    connectors: [
        walletConnect({
            projectId: import.meta.env.VITE_WC_PROJECT_ID,
        }),
        coinbaseWallet({appName: 'Vite Vue Playground', darkMode: true}),
        injected(), metaMask(), safe()
    ],

    storage: createStorage({storage: localStorage, key: 'vite-vue'}),
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [optimism.id]: http(),
        // [localChain.id]: custom(
        //     {
        //         async request({ method, params }) {
        //             console.log(method,"请求方法",params);
        //             const res = await fetch('http://202.124.251.169:8545', {
        //                 method: 'POST',
        //                 headers: { 'Content-Type': 'application/json' },
        //                 body: JSON.stringify({
        //                     jsonrpc: '2.0',
        //                     id: 1,
        //                     method,   // ⬅️ 直接使用传入的 JSON-RPC 方法
        //                     params: params ?? [],
        //                 }),
        //             })
        //             const json = await res.json()
        //             // 处理 RPC 错误
        //             if (json.error) throw new Error(json.error.message)
        //
        //             return json.result
        //         }
        //     }
        // ),
        [localChain.id]:http()
    },
})
declare module '@wagmi/vue' {
    interface Register {
        config: typeof config
    }
}
