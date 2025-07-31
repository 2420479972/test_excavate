
export function bigintToNumberSafe(value: bigint): number {
    if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
        throw new Error('bigint 超出 JavaScript number 可安全表示的范围')
    }
    return Number(value)
}

/**
 * 复制文本到剪贴板的函数
 * @param {string} text 需要复制的文本内容
 * @returns {Promise<void>} 返回一个 Promise，复制成功时 resolve，失败时 reject
 */
export  function copyToClipboard(text:string) {
    // 优先使用现代异步 Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    }
    // 兼容旧版写法：创建隐藏的 textarea，执行 document.execCommand('copy')
    return new Promise((resolve, reject) => {
        try {
            const textarea = document.createElement('textarea');   // 创建临时 textarea 元素
            textarea.value = text;                                  // 设置要复制的文本内容
            textarea.style.position = 'fixed';                      // 防止页面滚动
            textarea.style.top = '-9999px';                         // 移出可视区域
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);                    // 将 textarea 添加到文档中
            textarea.focus();                                       // 聚焦 textarea
            textarea.select();                                      // 选中内容

            const successful = document.execCommand('copy');       // 执行复制命令
            document.body.removeChild(textarea);                    // 复制后移除 textarea

            if (successful) {
                resolve(true);
            } else {
                reject(new Error('复制失败'));
            }
        } catch (err) {
            reject(err);
        }
    });
}

// 将秒数格式化为 "YYYY-MM-DD HH:mm:ss"
export function formatSecondsToDateTime(seconds: number | bigint): string {
    // 将 bigint 转换为 number（安全转换）
    const timestamp = typeof seconds === 'bigint' ? Number(seconds) : seconds

    // 创建 Date 对象，JS 的 Date 使用毫秒为单位
    const date = new Date(timestamp * 1000)

    // 提取年、月、日、时、分、秒，填充 0 补齐
    const YYYY = date.getFullYear()
    const MM = String(date.getMonth() + 1).padStart(2, '0')     // 月份从 0 开始
    const DD = String(date.getDate()).padStart(2, '0')
    // const HH = String(date.getHours()).padStart(2, '0')
    // const mm = String(date.getMinutes()).padStart(2, '0')
    // const ss = String(date.getSeconds()).padStart(2, '0')

    // 拼接成完整格式
    return `${YYYY}-${MM}-${DD}`
}

/**
 * 格式化地址，显示前 6 位和后 4 位，中间使用省略号 "..."
 * @param address 区块链地址（字符串）
 * @returns 格式化后的地址
 */
export function formatAddress(address: string): string {
    if (!address || address.length < 10) return '--' // 如果地址不合法，直接返回原值

    const prefix = address.slice(0, 6)        // 提取前 6 位
    const suffix = address.slice(-4)          // 提取后 4 位
    return `${prefix}...${suffix}`            // 拼接格式化字符串
}
