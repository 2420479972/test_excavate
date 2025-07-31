// utils/Modal.ts
import { createVNode, render } from 'vue'
import ConfirmModal from '../components/ConfirmModal.vue'

// 定义弹窗参数类型
export interface ConfirmOptions {
    title: string
    content: string
    okText?: string
    cancelText?: string
    maskClosable?: boolean
    width?: string
    onOk?: () => void
    onCancel?: () => void
}

// 主 Modal API
export const Modal = {
    confirm(options: ConfirmOptions) {
        const container = document.createElement('div')
        document.body.appendChild(container)

        const vm = createVNode(ConfirmModal, {
            ...options,
            onClose: () => {
                render(null, container)         // 卸载组件
                container.remove()              // 删除 DOM
            },
        })

        render(vm, container)
    },
}
