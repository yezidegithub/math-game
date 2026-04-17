import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home/HomeView.vue'),
    },
    {
      path: '/addition',
      name: 'Addition',
      component: () => import('@/views/Addition/AdditionView.vue'),
    },
    {
      path: '/compare',
      name: 'Compare',
      component: () => import('@/views/Compare/CompareView.vue'),
    },
    {
      path: '/pattern',
      name: 'Pattern',
      component: () => import('@/views/Pattern/PatternView.vue'),
    },
    {
      path: '/game',
      name: 'Game',
      component: () => import('@/views/Game/GameView.vue'),
    },
    {
      path: '/money',
      name: 'MoneyGame',
      component: () => import('@/views/MoneyGame/MoneyGameView.vue'),
    },
  ],
})

export default router
