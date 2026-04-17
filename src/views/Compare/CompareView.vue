<template>
  <div class="page-container practice-page">
    <div class="header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>比大小</h1>
    </div>

    <div class="level-selector">
      <button
        v-for="level in levels"
        :key="level.value"
        :class="['level-btn', { active: currentLevel === level.value }]"
        @click="setLevel(level.value)"
      >
        {{ level.label }}
      </button>
    </div>

    <div class="progress-bar" v-if="questions.length > 0">
      <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
      <span class="progress-text"
        >{{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</span
      >
    </div>

    <div class="question-card" v-if="!isFinished && currentQuestion">
      <div class="question-display">
        <div class="num-box">
          <div class="num">{{ currentQuestion.num1 }}</div>
        </div>
        <div class="compare-symbol">?</div>
        <div class="num-box">
          <div class="num">{{ currentQuestion.num2 }}</div>
        </div>
      </div>

      <div class="answer-buttons">
        <button class="compare-btn" @click="submitAnswer('less')">
          <span class="symbol"><</span>
          <span class="label">小于</span>
        </button>
        <button class="compare-btn" @click="submitAnswer('equal')">
          <span class="symbol">=</span>
          <span class="label">等于</span>
        </button>
        <button class="compare-btn" @click="submitAnswer('greater')">
          <span class="symbol">></span>
          <span class="label">大于</span>
        </button>
      </div>

      <div class="answer-feedback" :class="feedbackClass" v-if="showFeedback">
        {{ feedbackText }}
      </div>
    </div>

    <div class="result-card" v-else>
      <div class="result-icon">🎉</div>
      <div class="result-title">太棒了！</div>
      <div class="result-stats">
        <div class="stat">
          <div class="stat-value correct">{{ correctCount }}</div>
          <div class="stat-label">正确</div>
        </div>
        <div class="stat">
          <div class="stat-value">{{ accuracy }}%</div>
          <div class="stat-label">正确率</div>
        </div>
      </div>
      <button class="retry-btn" @click="restart">再来一轮</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()

interface Question {
  num1: number
  num2: number
  correctAnswer: 'less' | 'equal' | 'greater'
}

const levels = [
  { label: '简单', value: 1, maxNum: 10 },
  { label: '中等', value: 2, maxNum: 20 },
  { label: '困难', value: 3, maxNum: 50 },
]

const currentLevel = ref(1)
const totalQuestions = ref(10)
const currentQuestionIndex = ref(0)
const questions = ref<Question[]>([])
const showFeedback = ref(false)
const feedbackText = ref('')
const feedbackClass = ref('')
const isFinished = ref(false)
const correctCount = ref(0)

const currentQuestion = computed(
  () => questions.value[currentQuestionIndex.value]
)
const progress = computed(
  () => (currentQuestionIndex.value / totalQuestions.value) * 100
)
const accuracy = computed(() =>
  Math.round((correctCount.value / totalQuestions.value) * 100)
)

const generateQuestion = (): Question => {
  const levelConfig =
    levels.find(l => l.value === currentLevel.value) || levels[0]
  const maxNum = levelConfig.maxNum
  const num1 = Math.floor(Math.random() * maxNum) + 1
  const num2 = Math.floor(Math.random() * maxNum) + 1

  let correctAnswer: 'less' | 'equal' | 'greater'
  if (num1 < num2) correctAnswer = 'less'
  else if (num1 > num2) correctAnswer = 'greater'
  else correctAnswer = 'equal'

  return { num1, num2, correctAnswer }
}

const generateQuestions = () => {
  questions.value = []
  for (let i = 0; i < totalQuestions.value; i++) {
    questions.value.push(generateQuestion())
  }
}

const submitAnswer = (answer: 'less' | 'equal' | 'greater') => {
  const correct = answer === currentQuestion.value.correctAnswer
  gameStore.recordAnswer(
    'compare',
    `${currentQuestion.value.num1} ? ${currentQuestion.value.num2}`,
    0,
    correct
  )

  if (correct) {
    correctCount.value++
    feedbackText.value = '回答正确！✨'
    feedbackClass.value = 'correct'
  } else {
    const symbols = { less: '<', equal: '=', greater: '>' }
    feedbackText.value = `正确答案是 ${currentQuestion.value.num1} ${
      symbols[currentQuestion.value.correctAnswer]
    } ${currentQuestion.value.num2}`
    feedbackClass.value = 'wrong'
  }

  showFeedback.value = true
  setTimeout(() => {
    showFeedback.value = false
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
      currentQuestionIndex.value++
    } else {
      isFinished.value = true
    }
  }, 1000)
}

const setLevel = (level: number) => {
  currentLevel.value = level
  restart()
}
const restart = () => {
  currentQuestionIndex.value = 0
  correctCount.value = 0
  isFinished.value = false
  showFeedback.value = false
  generateQuestions()
}
const goBack = () => router.push('/')

onMounted(() => generateQuestions())
</script>

<style scoped>
.practice-page {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}
.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
.header h1 {
  font-size: 24px;
  color: white;
}
.level-selector {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}
.level-btn {
  flex: 1;
  padding: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}
.level-btn.active {
  background: rgba(255, 255, 255, 0.9);
  color: #11998e;
  border-color: white;
}
.progress-bar {
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
  position: relative;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #11998e, #38ef7d);
  border-radius: 12px;
  transition: width 0.3s ease;
}
.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: 600;
}
.question-card {
  background: white;
  border-radius: 24px;
  padding: 32px 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}
.question-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 32px;
}
.num-box {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px 32px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}
.num {
  font-size: 56px;
  font-weight: 700;
  color: white;
}
.compare-symbol {
  font-size: 48px;
  color: #667eea;
  font-weight: 700;
}
.answer-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}
.compare-btn {
  flex: 1;
  padding: 20px 12px;
  background: #f8f9fa;
  border: 3px solid transparent;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.compare-btn:active {
  transform: scale(0.95);
  border-color: #667eea;
  background: white;
}
.compare-btn .symbol {
  font-size: 36px;
  font-weight: 700;
  color: #667eea;
}
.compare-btn .label {
  font-size: 14px;
  color: #666;
}
.answer-feedback {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  padding: 12px;
  border-radius: 12px;
}
.answer-feedback.correct {
  background: #e8f5e9;
  color: #4caf50;
}
.answer-feedback.wrong {
  background: #ffebee;
  color: #f44336;
}
.result-card {
  background: white;
  border-radius: 24px;
  padding: 40px 24px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}
.result-icon {
  font-size: 80px;
  margin-bottom: 16px;
}
.result-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 24px;
}
.result-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 32px;
}
.stat-value {
  font-size: 36px;
  font-weight: 700;
}
.stat-value.correct {
  color: #4caf50;
}
.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}
.retry-btn {
  padding: 16px 48px;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
}
</style>
