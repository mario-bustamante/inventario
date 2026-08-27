import {
    createRouter,
    createWebHistory
} from 'vue-router'

import LoginView
    from '@/presentation/views/auth/LoginView.vue'

import RegisterView
    from '@/presentation/views/auth/RegisterView.vue'

const router = createRouter({

    history: createWebHistory(),

    routes: [
        {
            path: '/',
            name: 'home',
            component: () =>
                import('@/presentation/views/DashboardView.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },

        {
            path: '/register',
            name: 'register',
            component: RegisterView
        },

        {
            path: '/dashboard',
            name: 'dashboard',
            component: () =>
                import('@/presentation/views/DashboardView.vue')
        }

    ]
})

export default router