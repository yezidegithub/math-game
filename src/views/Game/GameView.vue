<template>
  <div class="page-container practice-page">
    <div class="header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>趣味游戏</h1>
    </div>

    <div class="game-list">
      <div
        v-for="game in games"
        :key="game.id"
        class="game-card"
        :style="{ backgroundColor: game.color }"
        @click="startGame(game)"
      >
        <div class="game-icon">{{ game.icon }}</div>
        <div class="game-info">
          <div class="game-name">{{ game.name }}</div>
          <div class="game-desc">{{ game.desc }}</div>
        </div>
        <div class="game-arrow">→</div>
      </div>
    </div>

    <div class="coming-soon">
      <div class="coming-title">更多游戏开发中 🚀</div>
      <div class="coming-list">
        <div class="coming-item" v-for="item in comingGames" :key="item">
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Game {
  id: string
  name: string
  desc: string
  icon: string
  color: string
}

const games = ref<Game[]>([
  {
    id: 'number-catch',
    name: '数字接龙',
    desc: '按顺序点击数字',
    icon: '🔢',
    color: '#FF6B6B',
  },
  {
    id: 'quick-calc',
    name: '快速计算',
    desc: '限时心算挑战',
    icon: '⚡',
    color: '#4ECDC4',
  },
  {
    id: 'shape-match',
    name: '形状匹配',
    desc: '找出相同的形状',
    icon: '🔷',
    color: '#45B7D1',
  },
])

const comingGames = ref(['记忆大挑战', '数学华容道', '时间认知', '钱币练习'])

const startGame = (game: Game) => {
  alert(`「${game.name}」游戏正在开发中，敬请期待！`)
}

const goBack = () => router.push('/')
</script>

<style scoped>
.practice-page {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}
.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.back-btn {
  background: rgba(255, 255, 255, 0.3);
  border: none;
  color: #333;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
.header h1 {
  font-size: 24px;
  color: #333;
}
.game-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.game-card {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.game-card:active {
  transform: scale(0.98);
}
.game-icon {
  font-size: 48px;
  margin-right: 16px;
}
.game-info {
  flex: 1;
}
.game-name {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin-bottom: 4px;
}
.game-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}
.game-arrow {
  font-size: 24px;
  color: white;
  opacity: 0.7;
}
.coming-soon {
  margin-top: 40px;
  text-align: center;
}
.coming-title {
  font-size: 18px;
  font-weight: 600;
  color: #666;
  margin-bottom: 16px;
}
.coming-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}
.coming-item {
  background: rgba(255, 255, 255, 0.8);
  padding: 12px 20px;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
</style>
