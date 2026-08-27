import {
    createRouter,
    createWebHistory
} from 'vue-router'

import LoginView
    from '@/presentation/views/auth/LoginView.vue'

import RegisterView
    from '@/presentation/views/auth/RegisterView.vue'

import AuthenticatedLayout
    from '@/presentation/components/layouts/AuthenticatedLayout.vue'

import api from '@/shared/http/api'

const router = createRouter({

    history: createWebHistory(),

    routes: [
        {
            path: '/',
            component: AuthenticatedLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    redirect: { name: 'dashboard' }
                },
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    component: () =>
                        import('@/presentation/views/DashboardView.vue')
                }
            ]
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

    ]
})

router.beforeEach(async to => {

    if (!to.matched.some(route => route.meta.requiresAuth)) {
        return true
    }

    try {
        await api.get('/auth/me')

        return true

    } catch {
        return {
            name: 'login',
            query: { redirect: to.fullPath }
        }
    }
})

export default router