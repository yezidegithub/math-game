<template>
  <div class="page-container practice-page">
    <div class="header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>加减法练习</h1>
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
        <div class="num num1">{{ currentQuestion.num1 }}</div>
        <div class="operator">{{ currentQuestion.operator }}</div>
        <div class="num num2">{{ currentQuestion.num2 }}</div>
        <div class="operator">=</div>
        <div class="answer-input">
          <input
            v-model="userAnswer"
            type="number"
            inputmode="numeric"
            pattern="[0-9]*"
            @keyup.enter="submitAnswer"
            ref="answerInput"
          />
        </div>
      </div>

      <div class="answer-feedback" :class="feedbackClass" v-if="showFeedback">
        {{ feedbackText }}
      </div>

      <button class="submit-btn" @click="submitAnswer" :disabled="!userAnswer">
        确认答案
      </button>
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
          <div class="stat-value wrong">
            {{ totalQuestions - correctCount }}
          </div>
          <div class="stat-label">错误</div>
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
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()

interface Question {
  num1: number
  num2: number
  operator: string
  answer: number
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
const userAnswer = ref('')
const showFeedback = ref(false)
const feedbackText = ref('')
const feedbackClass = ref('')
const isFinished = ref(false)
const correctCount = ref(0)
const answerInput = ref<HTMLInputElement | null>(null)

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
  const isAddition = Math.random() > 0.5

  const num1 = Math.floor(Math.random() * maxNum) + 1
  const num2 = Math.floor(Math.random() * maxNum) + 1

  if (isAddition) {
    return { num1, num2, operator: '+', answer: num1 + num2 }
  } else {
    const larger = Math.max(num1, num2)
    const smaller = Math.min(num1, num2)
    return {
      num1: larger,
      num2: smaller,
      operator: '-',
      answer: larger - smaller,
    }
  }
}

const generateQuestions = () => {
  questions.value = []
  for (let i = 0; i < totalQuestions.value; i++) {
    questions.value.push(generateQuestion())
  }
}

const submitAnswer = () => {
  if (!userAnswer.value) return

  const correct = parseInt(userAnswer.value) === currentQuestion.value.answer
  gameStore.recordAnswer(
    'addition',
    `${currentQuestion.value.num1} ${currentQuestion.value.operator} ${currentQuestion.value.num2}`,
    parseInt(userAnswer.value),
    correct
  )

  if (correct) {
    correctCount.value++
    feedbackText.value = '回答正确！✨'
    feedbackClass.value = 'correct'
  } else {
    feedbackText.value = `正确答案是 ${currentQuestion.value.answer}`
    feedbackClass.value = 'wrong'
  }

  showFeedback.value = true

  setTimeout(() => {
    showFeedback.value = false
    userAnswer.value = ''
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
      currentQuestionIndex.value++
      nextTick(() => answerInput.value?.focus())
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
  userAnswer.value = ''
  showFeedback.value = false
  generateQuestions()
  nextTick(() => answerInput.value?.focus())
}

const goBack = () => router.push('/')

onMounted(() => {
  generateQuestions()
  nextTick(() => answerInput.value?.focus())
})
</script>

<style scoped>
.practice-page {
  background: var(--bg-gradient);
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
  color: #667eea;
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
  background: linear-gradient(90deg, #4caf50, #8bc34a);
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
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.num {
  font-size: 56px;
  font-weight: 700;
  color: #333;
  min-width: 80px;
  text-align: center;
}
.operator {
  font-size: 40px;
  color: #667eea;
  font-weight: 700;
}
.answer-input input {
  width: 120px;
  height: 80px;
  font-size: 48px;
  text-align: center;
  border: 3px solid #667eea;
  border-radius: 16px;
  outline: none;
  color: #333;
  background: #f8f9fa;
}
.answer-input input:focus {
  border-color: #764ba2;
  background: white;
}
.answer-feedback {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 20px;
}
.answer-feedback.correct {
  background: #e8f5e9;
  color: #4caf50;
}
.answer-feedback.wrong {
  background: #ffebee;
  color: #f44336;
}
.submit-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}
.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.submit-btn:not(:disabled):active {
  transform: scale(0.98);
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
.stat-value.wrong {
  color: #f44336;
}
.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}
.retry-btn {
  padding: 16px 48px;
  background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
}
</style>
