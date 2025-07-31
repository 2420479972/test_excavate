import { useAccount, useBlockNumber, useReadContract, useChainId } from "@wagmi/vue"
import type { Abi } from "viem"
import { ref, watch } from "vue"

type UseReadType = {
    functionName?: string, // 合约函数名
    onSuccess?: (data: any) => void, // 成功回调
    onError?: (error: Error) => void, // 失败回调
    onSettled?: () => void, // 无论成功失败都会调用
    notAutoRun?: boolean, // 是否禁止自动运行
    args?: readonly unknown[], // 合约参数
    blockNumberInterval?: number, // 区块刷新间隔
    cacheTime?: number, // 缓存时间（毫秒）
    enabled?: boolean, // 是否启用
    initParams?: { [key: string]: any }, // 其他初始化参数
}

export const useRead = <RT = any>(config:{address:string,abi:any},options: UseReadType = {}) => {
    const { address } = useAccount()
    const chainId = useChainId()
    const isLoading = ref(false)
    const lastFetchTime = ref(Date.now())
    const hasFetched = ref(false)

    // ✅ 用 ref 而不是 computed，让它可以动态更新
    const contractConfig = ref({
        address: config.address as `0x${string}`, // 合约地址
        abi: config.abi as Abi, // ABI
        functionName: options.functionName as string, // 函数名
        args: options.args, // 参数
        ...options.initParams,
        query: {
            enabled: options.enabled !== undefined ? options.enabled : !options.notAutoRun,
            ...options.initParams?.query,
        }
    })

    // ✅ 读取合约
    const {
        data,
        error,
        refetch,
        status,
        isSuccess,
        isRefetching
    } = useReadContract(contractConfig)

    // ✅ 监听状态变化处理 loading、成功、错误
    watch(() => status.value, (newVal) => {
        if (newVal === 'pending') {
            isLoading.value = true
        } else {
            isLoading.value = false
            hasFetched.value = true
            lastFetchTime.value = Date.now()
            if (newVal === 'success') {
                options.onSuccess?.(data.value)
            } else if (newVal === 'error') {
                options.onError?.(error.value as Error)
            }
            options.onSettled?.()
        }
    }, { immediate: true })

    // ✅ 动态设置参数
    const setParams = async (args: readonly unknown[]) => {
        contractConfig.value = {
            ...contractConfig.value,
            args: args
        }
        await refetch()
    }

    // ✅ 动态设置整体选项（functionName, args等）
    const setOptions = async (newOptions: Partial<UseReadType>) => {
        contractConfig.value = {
            ...contractConfig.value,
            ...newOptions.initParams,
            args: newOptions.args ?? contractConfig.value.args,
            functionName: newOptions.functionName ?? contractConfig.value.functionName,
            query: {
                ...(contractConfig.value.query || {}),
                enabled: newOptions.enabled !== undefined ? newOptions.enabled : contractConfig.value.query?.enabled,
                ...newOptions.initParams?.query
            }
        }
        await refetch()
    }

    // ✅ 区块自动刷新逻辑
    const shouldWatchBlocks = options.blockNumberInterval !== 0
    const { data: blockNumber } = useBlockNumber({
        watch: shouldWatchBlocks,
    })

    if (shouldWatchBlocks) {
        watch(() => blockNumber.value, async (newBlockNumber, oldBlockNumber) => {
            if (newBlockNumber) {
                console.log(`区块更新: ${oldBlockNumber} -> ${newBlockNumber}`)
            }

            const shouldRefetch = isSuccess.value &&
                !isRefetching.value &&
                (options.blockNumberInterval === undefined ||
                    (newBlockNumber !== undefined &&
                        Number(newBlockNumber % BigInt(options.blockNumberInterval || 1)) === 0))

            const cacheExpired = options.cacheTime === undefined ||
                Date.now() - lastFetchTime.value > (options.cacheTime || 0)

            if (shouldRefetch && cacheExpired) {
                console.log(`区块 ${newBlockNumber} 触发刷新`)
                await refetch()
            }
        }, { immediate: false })
    }

    // ✅ 地址变化自动重新获取
    watch(() => address.value, (newVal, oldVal) => {
        if (newVal && newVal !== oldVal && hasFetched.value) {
            refetch()
        }
    }, { immediate: false })

    // ✅ 链 ID 变化自动重新获取
    watch(() => chainId.value, (newVal, oldVal) => {
        if (newVal && newVal !== oldVal && hasFetched.value) {
            refetch()
        }
    }, { immediate: false })

    return {
        refetch,
        isLoading,
        error,
        status,
        data: data as RT,
        isSuccess,
        setParams, // 只更新 args
        setOptions, // 更新 functionName、args、query等
        config: contractConfig,
        hasFetched,
    }
}
