import {useAccount, useWaitForTransactionReceipt, useWriteContract} from "@wagmi/vue";
import {ref, watch} from "vue";
import type {Abi, TransactionReceipt} from "viem";
import {Notify} from "../utils/Toast.ts";

// 创建一个ref来存储当前激活的交易哈希
const activeTransactionHash = ref<`0x${string}` | undefined>(undefined);

type UseWriteType<FT> = {
    functionName?: FT,
    onSuccess?: (receipt: TransactionReceipt) => void,
    onError?: (error: Error|string) => void,
    onSettled?: () => void,
    waitForConfirmation?: boolean,
    args?: readonly unknown[]
}

export const useWrite = <T>(config: { address: string, abi: any }, options: UseWriteType<T> = {}) => {
    const {address} = useAccount();
    const txHash = ref<`0x${string}` | undefined>(undefined);
    const receipt = ref<TransactionReceipt | null>(null);
    const error = ref<Error | null>(null);
    const isSuccess = ref(false);


    const contractConfig = {
        address: config.address as `0x${string}`,
        abi: config.abi as Abi,
        functionName: options.functionName as string
    };

    const {writeContractAsync, isPending, isError, reset} = useWriteContract();

    // 当交易哈希变化时，更新activeTransactionHash
    watch(() => txHash.value, (newHash) => {
        if (newHash) {
            activeTransactionHash.value = newHash;
        }
    });

    // 在setup函数顶层直接使用wagmi hooks，不要在计算属性中创建
    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        data: transactionReceipt,
        status: receiptStatus,
        error: receiptError,
    } = useWaitForTransactionReceipt({
        hash: activeTransactionHash,
    });

    // 监听交易哈希变化
    watch(() => txHash.value, (newHash) => {
        if (newHash) {
            // 如果需要等待确认，则标记为活跃交易
            if (options.waitForConfirmation) {

            }
        } else {
            receipt.value = null;
            isSuccess.value = false;
        }
    });

    // 监听交易接收状态，添加更详细的日志
    watch(() => transactionReceipt.value, (newReceipt) => {
        if (newReceipt) {
            //


            receipt.value = newReceipt;

            // 根据交易状态设置成功标志
            if (newReceipt.status === 'success') {

                isSuccess.value = true;
            } else {
                isSuccess.value = false;
            }

            if (newReceipt.status === 'success') {


                if (options.onSuccess) {
                    try {
                        options.onSuccess(newReceipt);

                    } catch (callbackError) {
                        console.error('执行onSuccess回调时发生错误:', callbackError);
                    }
                } else {
                    console.warn('未提供onSuccess回调函数');
                }
            } else if (newReceipt.status === 'reverted') {
                console.error('交易被回滚');
                const err = new Error('交易被回滚');
                error.value = err;
                options.onError?.(err);
            }
        }
    }, {immediate: true});

    // 额外监听接收状态
    watch(() => receiptStatus.value, (status) => {


        if (status === 'success') {


            // 如果状态成功但没有通过上面的watch触发回调，这里再次尝试
            if (transactionReceipt.value && transactionReceipt.value.status === 'success' && options.waitForConfirmation) {

                options.onSuccess?.(transactionReceipt.value);
            }
        } else if (status === 'error' && receiptError.value) {
            // 有时候交易已经成功了，但监听出错是正常的
            // 特别是当交易已经被确认并且早已完成时


            // 如果已经设置了成功状态，就不再处理这个错误
            if (isSuccess.value || receipt.value) {

                return;
            }

            // 如果交易哈希有效，尝试通过其他方式获取交易结果
            if (txHash.value) {
                options.onError?.(receiptError.value);
                // 保留错误日志但不触发错误回调
                console.error('获取交易收据错误:', receiptError.value);
            } else {
                // 如果没有其他成功迹象，再触发错误回调
                console.error('获取交易收据错误:', receiptError.value);
                error.value = receiptError.value;
                options.onError?.(receiptError.value);
            }
        }
    }, {immediate: true});

    // 执行合约写操作
    const write = async (args?: readonly unknown[]) => {
        error.value = null;
        isSuccess.value = false;
        receipt.value = null;
        txHash.value = undefined; // 重置交易哈希
        activeTransactionHash.value = undefined; // 重置活跃交易哈希
        reset();

        // 检查钱包连接
        if (!address.value) {
            const err = new Error("钱包未连接");
            error.value = err;
            options.onError?.(err);
            Notify.error('请连接钱包')
            return null;
        }

        try {
            // 构建写入参数
            const writeParams = {
                ...contractConfig,
                args: args || options.args
            };

            //
            //     contract: config.address,
            //     function: options.functionName,
            //     waitForConfirmation: options.waitForConfirmation,
            //     args: writeParams.args
            // }, null, 2));

            // 执行合约写入
            const hash = await writeContractAsync(writeParams);


            // 设置一个状态标记，表示交易已成功发送
            const transactionSent = true;

            // 设置交易哈希 - 这会触发 watch 并开始监听交易收据
            txHash.value = hash;
            activeTransactionHash.value = hash; // 直接设置活跃交易哈希

            // 如果不需要等待确认，直接调用成功回调
            if (!options.waitForConfirmation) {

                isSuccess.value = true;

                // 仅当不需要等待确认时，我们在这里调用onSuccess
                // 否则，等待交易确认后在上面的watch中调用
                if (options.onSuccess) {
                    try {
                        const fakeReceipt = {
                            blockNumber: 0n,
                            status: 'success' as const,
                            transactionHash: hash,
                        } as TransactionReceipt;
                        options.onSuccess(fakeReceipt);
                    } catch (callbackError) {
                        console.error('直接调用onSuccess时出错:', callbackError);
                    }
                }
            } else {
                // 设置一个保护措施 - 如果10秒内没有收到交易收据，我们认为交易可能成功了
                // 这是一个保险措施，防止监听失败但交易实际上成功了的情况
                setTimeout(() => {
                    if (transactionSent && txHash.value === hash && !receipt.value && !isSuccess.value) {
                        // 我们不自动触发onSuccess，因为我们不确定交易是否真的成功了
                        // 但我们记录这个情况，以便用户知道要检查
                    }
                }, 10000);
            }

            return hash;
        } catch (_error: any) {
            console.error('合约写入操作失败:', _error);
            error.value = _error;
            if (_error.message.includes('User rejected')) {
                options.onError?.('用户拒绝授权');
                Notify.error('用户已拒绝')
                return null
            }
            return null;
        } finally {
            options.onSettled?.();
        }
    };

    return {
        isPending,
        isError,
        isConfirming,
        isConfirmed,
        isSuccess,
        txHash,
        receipt,
        error,
        write,
        reset,
        transactionReceipt
    };
};