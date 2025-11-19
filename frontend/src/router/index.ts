import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: 'Dashboard' },
      },
      {
        path: 'matches',
        name: 'Matches',
        component: () => import('@/views/Matches/MatchList.vue'),
        meta: { title: 'Matches' },
      },
      {
        path: 'matches/upload',
        name: 'MatchUpload',
        component: () => import('@/views/Matches/MatchUpload.vue'),
        meta: { title: 'Upload Match' },
      },
      {
        path: 'matches/:id',
        name: 'MatchDetail',
        component: () => import('@/views/Matches/MatchDetail.vue'),
        meta: { title: 'Match Details' },
      },
      {
        path: 'matches/:id/analysis',
        name: 'MatchAnalysis',
        component: () => import('@/views/Matches/MatchAnalysis.vue'),
        meta: { title: 'Match Analysis' },
      },
      {
        path: 'players',
        name: 'Players',
        component: () => import('@/views/Players/PlayerList.vue'),
        meta: { title: 'Players' },
      },
      {
        path: 'players/enroll',
        name: 'PlayerEnrollment',
        component: () => import('@/views/Players/PlayerEnrollment.vue'),
        meta: { title: 'Enroll Player' },
      },
      {
        path: 'players/:id',
        name: 'PlayerDetail',
        component: () => import('@/views/Players/PlayerDetail.vue'),
        meta: { title: 'Player Details' },
      },
      {
        path: 'tactical',
        name: 'Tactical',
        component: () => import('@/views/Tactical/TacticalLab.vue'),
        meta: { title: 'Tactical Laboratory' },
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/views/Reports/ReportList.vue'),
        meta: { title: 'Reports' },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/Settings/Profile.vue'),
        meta: { title: 'Settings' },
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/Auth/Login.vue'),
        meta: { title: 'Login' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || 'MouBAI'} | MouBAI Formula`
  next()
})

export default router
