<template>
  <div class="page-container practice-page">
    <div class="header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>找规律</h1>
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
      <div class="question-title">找规律，填出问号处的数字</div>

      <div class="pattern-display">
        <div
          v-for="(num, index) in displayNumbers"
          :key="index"
          :class="['pattern-num', { missing: index === missingIndex }]"
        >
          {{ num === '?' ? '?' : num }}
        </div>
      </div>

      <div class="answer-buttons">
        <button
          v-for="option in currentOptions"
          :key="option"
          class="option-btn"
          :class="{ selected: selectedAnswer === option }"
          @click="selectAnswer(option)"
        >
          {{ option }}
        </button>
      </div>

      <div class="action-area">
        <button
          class="submit-btn"
          @click="submitAnswer"
          :disabled="!selectedAnswer"
        >
          确认答案
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
  sequence: number[]
  missingIndex: number
  answer: number
  type: string
}

const levels = [
  { label: '简单', value: 1 },
  { label: '中等', value: 2 },
  { label: '困难', value: 3 },
]

const currentLevel = ref(1)
const totalQuestions = ref(10)
const currentQuestionIndex = ref(0)
const questions = ref<Question[]>([])
const selectedAnswer = ref<number | null>(null)
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
const displayNumbers = computed((): (number | string)[] => {
  const seq = [...currentQuestion.value.sequence] as (number | string)[]
  seq.splice(missingIndex.value, 0, '?')
  return seq
})
const missingIndex = computed(() => currentQuestion.value.missingIndex)

const currentOptions = computed(() => {
  const q = currentQuestion.value
  const correct = q.answer
  const options = new Set<number>([correct])
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 10) - 5
    const wrong = correct + (offset === 0 ? 1 : offset)
    if (wrong > 0 && wrong !== correct) options.add(wrong)
  }
  return Array.from(options).sort(() => Math.random() - 0.5)
})

const generateArithmeticSequence = (diff: number): Question => {
  const start = Math.floor(Math.random() * 10) + 1
  const length = 5
  const sequence: number[] = []
  for (let i = 0; i < length; i++) sequence.push(start + i * diff)
  const missingIndex = Math.floor(Math.random() * length)
  const answer = sequence[missingIndex]
  sequence.splice(missingIndex, 1)
  return { sequence, missingIndex, answer, type: 'arithmetic' }
}

const generateMultiplicationSequence = (): Question => {
  const base = Math.floor(Math.random() * 3) + 2
  const length = 5
  const sequence: number[] = []
  for (let i = 0; i < length; i++) sequence.push(Math.pow(base, i + 1))
  const missingIndex = Math.floor(Math.random() * length)
  const answer = sequence[missingIndex]
  sequence.splice(missingIndex, 1)
  return { sequence, missingIndex, answer, type: 'multiplication' }
}

const generateFibonacciLike = (): Question => {
  const start1 = Math.floor(Math.random() * 5) + 1
  const start2 = Math.floor(Math.random() * 5) + 1
  const length = 5
  const sequence: number[] = [start1, start2]
  for (let i = 2; i < length + 1; i++)
    sequence.push(sequence[i - 1] + sequence[i - 2])
  const missingIndex = Math.floor(Math.random() * length)
  const answer = sequence[missingIndex]
  sequence.splice(missingIndex, 1)
  return { sequence, missingIndex, answer, type: 'fibonacci' }
}

const generateQuestion = (): Question => {
  const level = currentLevel.value
  if (level === 1)
    return generateArithmeticSequence(Math.floor(Math.random() * 5) + 2)
  else if (level === 2) {
    const rand = Math.random()
    if (rand < 0.6)
      return generateArithmeticSequence(Math.floor(Math.random() * 8) + 3)
    else return generateMultiplicationSequence()
  } else {
    const rand = Math.random()
    if (rand < 0.4) return generateMultiplicationSequence()
    else return generateFibonacciLike()
  }
}

const generateQuestions = () => {
  questions.value = []
  for (let i = 0; i < totalQuestions.value; i++)
    questions.value.push(generateQuestion())
}

const selectAnswer = (option: number) => {
  selectedAnswer.value = option
}

const submitAnswer = () => {
  if (selectedAnswer.value === null) return
  const correct = selectedAnswer.value === currentQuestion.value.answer
  gameStore.recordAnswer(
    'pattern',
    currentQuestion.value.sequence.join(', ') + ', ?',
    selectedAnswer.value,
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
    selectedAnswer.value = null
    if (currentQuestionIndex.value < totalQuestions.value - 1)
      currentQuestionIndex.value++
    else isFinished.value = true
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
  selectedAnswer.value = null
  generateQuestions()
}
const goBack = () => router.push('/')

onMounted(() => generateQuestions())
</script>

<style scoped>
.practice-page {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
  color: #f5576c;
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
  background: linear-gradient(90deg, #f093fb, #f5576c);
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
.question-title {
  text-align: center;
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
}
.pattern-display {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.pattern-num {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
.pattern-num.missing {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  animation: pulse 1s ease-in-out infinite;
}
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
.answer-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}
.option-btn {
  padding: 16px;
  background: #f8f9fa;
  border: 3px solid transparent;
  border-radius: 12px;
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
  cursor: pointer;
  transition: all 0.3s;
}
.option-btn:active {
  transform: scale(0.95);
}
.option-btn.selected {
  border-color: #f5576c;
  background: #fff0f3;
  color: #f5576c;
}
.action-area {
  margin-bottom: 16px;
}
.submit-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
}
</style>
