import {createConfig, createStorage,http,custom,} from '@wagmi/vue'
import {mainnet, optimism, sepolia,bscTestnet,bsc} from '@wagmi/vue/chains'
import {defineChain,type HttpTransport} from "viem"
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

const transports:Record<number | string, HttpTransport> = {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [optimism.id]: http(),
    [bsc.id]: http(),
    [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545/'),
    [localChain.id]:http("http://202.124.251.169:8545")

}
export const config = createConfig({
    chains: [bscTestnet,mainnet, sepolia, optimism,bsc,localChain],
    connectors: [
        coinbaseWallet({appName: 'Vite Vue Playground', darkMode: true}),
        injected(), metaMask(), safe()
    ],

    storage: createStorage({storage: localStorage, key: 'vite-vue'}),
    transports:transports,
})
declare module '@wagmi/vue' {
    interface Register {
        config: typeof config
    }
}
