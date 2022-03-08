import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/Home.vue'
import { getLoggedIn } from '@/helpers/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { auth: true }
    },
    {
      path: '/:id',
      name: 'project',
      props: true,
      component: () => import('@/views/Project.vue'),
      meta: { auth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { onlyGuest: true }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('@/views/Signup.vue'),
      meta: { onlyGuest: true }
    },
  ]
})

router.beforeEach((to, from) => {
  if (to.meta.auth && !getLoggedIn()) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.meta.onlyGuest && getLoggedIn()) {
    return { path: '/' }
  }
})


export default router
