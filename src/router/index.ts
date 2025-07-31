// 引入 createRouter 和 createWebHistory 创建路由实例
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

// 定义路由规则，每个 route 对应一个页面
const routes: RouteRecordRaw[] = [
    {
        path: '/', // 首页路径
        name: 'Home', // 路由名称
        component: () => import('../views/Home.vue')
    },
    {
        path: '/back',
        name: 'Back',
        component: () => import('../views/Back.vue')
    },
]

// 创建路由实例，使用 HTML5 history 模式
const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
})

export default router
