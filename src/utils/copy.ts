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
