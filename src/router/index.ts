// 引入 createRouter 和 createWebHistory 创建路由实例
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import {localAddress, ownerAddress} from "../store/address.ts";

// 定义路由规则，每个 route 对应一个页面
const routes: RouteRecordRaw[] = [
    {
        path: '/', // 首页路径
        name: 'Home', // 路由名称
        component: () => import('../views/home/index.vue')
    },
    {
        path: '/back',
        name: 'Back',
        component: () => import('../views/Back.vue')
    },
    {
        path:'/notFound',
        name:'notFound',
        component: () => import('../views/NotFound.vue')

    }
]

// 创建路由实例，使用 HTML5 history 模式
const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    },
})
// 全局前置守卫：在路由跳转前执行
router.beforeEach((to, from, next) => {
    if(to.name == 'Back' && ownerAddress.value != localAddress.value){
        next({ name: 'notFound' });
        return
    }
    next()
})

export default router
