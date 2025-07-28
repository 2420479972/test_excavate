import {createConfig, createStorage, http} from '@wagmi/vue'
import {mainnet, optimism, sepolia} from '@wagmi/vue/chains'
import {coinbaseWallet, injected, metaMask, safe, walletConnect} from '@wagmi/vue/connectors'

declare module '@wagmi/vue' {
    interface Register {
        config: typeof config
    }
}

export const config = createConfig({
    chains: [mainnet, sepolia, optimism],
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
    },
})

declare module '@wagmi/vue' {
    interface Register {
        config: typeof config
    }
}
