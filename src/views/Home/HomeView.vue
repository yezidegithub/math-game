<template>
  <div class="page-container home-page">
    <div class="header">
      <div class="logo">🧮</div>
      <h1>儿童数学思维练习</h1>
      <p class="subtitle">趣味学习，快乐成长</p>
    </div>

    <div class="content">
      <div class="grid grid-2 grid-4">
        <div
          v-for="item in modules"
          :key="item.path"
          class="module-card"
          :style="{ backgroundColor: item.color }"
          @click="goToModule(item.path)"
        >
          <div class="module-icon">{{ item.icon }}</div>
          <div class="module-name">{{ item.name }}</div>
          <div class="module-desc">{{ item.desc }}</div>
        </div>
        <div class="module-card coming-soon">
          <div class="module-icon">🔜</div>
          <div class="module-name">更多模块</div>
          <div class="module-desc">敬请期待</div>
        </div>
      </div>

      <div class="stats-card">
        <div class="stats-title">今日学习</div>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ todayStats.questions }}</div>
            <div class="stat-label">答题数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ todayStats.correct }}%</div>
            <div class="stat-label">正确率</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ todayStats.stars }}</div>
            <div class="stat-label">获得星星</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()

const modules = [
  {
    path: '/addition',
    name: '加减法',
    desc: '练习加减运算',
    icon: '➕',
    color: '#FF6B6B',
  },
  {
    path: '/compare',
    name: '比大小',
    desc: '比较数字大小',
    icon: '⚖️',
    color: '#4ECDC4',
  },
  {
    path: '/pattern',
    name: '找规律',
    desc: '发现数列规律',
    icon: '🔍',
    color: '#45B7D1',
  },
  {
    path: '/money',
    name: '钱币练习',
    desc: '超市购物算账',
    icon: '💰',
    color: '#FFD700',
  },
  {
    path: '/chinese',
    name: '趣味汉字',
    desc: '学习汉字笔顺',
    icon: '🈸',
    color: '#96CEB4',
  },
  {
    path: '/game',
    name: '趣味游戏',
    desc: '数学小游戏',
    icon: '🎮',
    color: '#FFA07A',
  },
]

const todayStats = gameStore.todayStats

const goToModule = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.home-page {
  background: var(--bg-gradient);
}

.header {
  text-align: center;
  padding: 30px 0;
}

.logo {
  font-size: 80px;
  margin-bottom: 10px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.header h1 {
  font-size: 32px;
  color: white;
  margin-bottom: 8px;
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
}

.module-card {
  padding: 24px 16px;
  border-radius: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  min-height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.module-card:active {
  transform: scale(0.95);
}

.module-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.module-name {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin-bottom: 4px;
}

.module-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
}

.stats-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 24px;
  margin-top: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.stats-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #4caf50;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.coming-soon {
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%) !important;
  opacity: 0.7;
}

.coming-soon .module-icon {
  font-size: 40px;
}

.coming-soon .module-name {
  color: #666;
}

.coming-soon .module-desc {
  color: #999;
}
</style>
