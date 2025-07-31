import { createVNode, render } from 'vue'
import NotifyMessage from '../components/NotifyMessage.vue'

interface NotifyOptions {
    title?: string
    description?: string
    type?: 'success' | 'error' | 'info' | 'warning' | 'custom'
    duration?: number
}

// 通用创建函数
function notify(options: NotifyOptions) {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const vnode = createVNode(NotifyMessage, {
        ...options,
    })

    render(vnode, container)

    // 卸载
    setTimeout(() => {
        render(null, container)
        container.remove()
    }, (options.duration || 3000) + 300) // 动画延迟
}

// 快捷函数
export const Notify = {
    success(msg: string, duration = 3000) {
        notify({ title: msg, type: 'success', duration })
    },
    error(msg: string, duration = 3000) {
        notify({ title: msg, type: 'error', duration })
    },
    info(msg: string, duration = 3000) {
        notify({ title: msg, type: 'info', duration })
    },
    warning(msg: string, duration = 3000) {
        notify({ title: msg, type: 'warning', duration })
    },
    custom(options: NotifyOptions) {
        notify({ ...options, type: 'custom' })
    },
}
