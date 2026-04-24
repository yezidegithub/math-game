<template>
  <div class="page-container money-game-page">
    <ThreeScene
      v-if="gamePhase === 'entrance'"
      :gamePhase="gamePhase"
      @arrive="handleArrive"
      @enter="handleEnter"
    />
    <div class="super-market-bg" v-if="gamePhase !== 'entrance'"></div>

    <div class="header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>钱币练习</h1>
      <div class="mode-toggle">
        <button
          :class="['mode-btn', { active: gameMode === 'addition' }]"
          @click="setMode('addition')"
        >
          凑十法
        </button>
        <button
          :class="['mode-btn', { active: gameMode === 'subtraction' }]"
          @click="setMode('subtraction')"
        >
          破十法
        </button>
      </div>
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

    <div
      class="game-container"
      v-if="!isFinished && currentQuestion && gamePhase !== 'entrance'"
    >
      <div class="character-area">
        <div
          class="character"
          :class="{ thinking: isThinking, happy: showSuccess, sad: showError }"
        >
          <div class="character-body">🧒</div>
          <div class="thought-bubble" v-if="showHint">
            <span>{{ hintText }}</span>
          </div>
        </div>
        <div class="speech-bubble" v-if="showFeedback">
          <span>{{ feedbackText }}</span>
        </div>
      </div>

      <div class="shelf-scene" v-if="!showCheckout">
        <div class="shelf-header">
          <div class="shelf-title">🛒 请选择商品</div>
        </div>
        <div class="shelf-items">
          <div
            v-for="item in shopItems"
            :key="item.name"
            class="shelf-item"
            @click="selectItem(item)"
          >
            <div class="shelf-emoji">{{ item.emoji }}</div>
            <div class="shelf-name">{{ item.name }}</div>
            <div class="shelf-price">¥{{ item.price }}</div>
          </div>
        </div>
        <button
          class="checkout-btn"
          @click="goToCheckout"
          :disabled="!selectedItem"
        >
          去结账 →
        </button>
      </div>

      <div class="shopping-scene" v-if="showCheckout && selectedItem">
        <div class="shop-header">
          <div class="shop-sign">🏪 小超市 - 结账台</div>
        </div>

        <div class="checkout-area">
          <div class="item-display">
            <div class="item-card">
              <div class="item-emoji">{{ currentQuestion.item.emoji }}</div>
              <div class="item-name">{{ currentQuestion.item.name }}</div>
              <div class="item-price">{{ currentQuestion.item.price }} 元</div>
            </div>
          </div>

          <div class="vs-symbol">-</div>

          <div class="change-display" v-if="gameMode === 'subtraction'">
            <div class="change-label">找零计算</div>
            <div class="change-equation">
              <span class="calc-num">{{
                currentQuestion.breakMethod.showEquation
              }}</span>
            </div>
          </div>
        </div>

        <div class="money-wallet">
          <div class="wallet-label">
            {{ gameMode === 'addition' ? '你有的钱' : '付了多少钱' }}
          </div>
          <div class="money-display">
            <div class="money-list">
              <div
                v-for="(money, idx) in flatMoneyList"
                :key="idx"
                :class="['money-piece', money.type]"
              >
                <img :src="money.img" :alt="money.label" class="money-img" />
              </div>
            </div>
          </div>
          <div class="total-money">
            共 {{ calculateTotal(currentQuestion.playerMoney) }} 元
          </div>
        </div>

        <div class="calculation-area" v-if="gameMode === 'subtraction'">
          <div class="calc-title">💰 破十法计算 - 先算找零</div>
          <div class="calc-equation">
            <span class="calc-num primary">{{
              currentQuestion.breakMethod.hint1
            }}</span>
            <span class="calc-op">-</span>
            <span class="calc-num">{{ currentQuestion.item.price }}</span>
            <span class="calc-op">=</span>
            <span class="calc-num highlight">{{ currentQuestion.answer }}</span>
          </div>
          <div class="calc-hint">
            {{ currentQuestion.breakMethod.hint2 }}
          </div>
        </div>

        <div class="calculation-area" v-else>
          <div class="calc-title">💰 凑十法计算 - 补齐差额</div>
          <div class="calc-equation">
            <span class="calc-num">{{ currentQuestion.makeMethod.have }}</span>
            <span class="calc-op">+</span>
            <span class="calc-num highlight">{{
              currentQuestion.makeMethod.give
            }}</span>
            <span class="calc-op">=</span>
            <span class="calc-num primary">{{
              currentQuestion.item.price
            }}</span>
          </div>
          <div class="calc-hint">
            {{ currentQuestion.makeMethod.hint }}
          </div>
        </div>

        <div class="answer-section">
          <div class="answer-label" v-if="gameMode === 'subtraction'">
            用破十法计算：{{ currentQuestion.breakMethod.hint1 }} -
            {{ currentQuestion.item.price }} = ?
          </div>
          <div class="answer-label" v-else>
            凑成 {{ currentQuestion.item.price }} 元，还差多少？
          </div>
          <div class="answer-buttons">
            <button
              v-for="opt in currentQuestion.options"
              :key="opt"
              class="answer-btn"
              :class="{ selected: selectedAnswer === opt }"
              @click="selectAnswer(opt)"
            >
              {{ opt }}
            </button>
          </div>
        </div>

        <div class="action-buttons">
          <button class="hint-btn" @click="showHint = !showHint">
            💡 提示
          </button>
          <button
            class="submit-btn"
            @click="submitAnswer"
            :disabled="!selectedAnswer"
          >
            确认答案
          </button>
        </div>
      </div>

      <div class="answer-feedback" :class="feedbackClass" v-if="showFeedback">
        {{ feedbackText }}
      </div>
    </div>

    <div class="result-card" v-else-if="isFinished">
      <div class="result-icon" :class="{ great: accuracy >= 80 }">🎉</div>
      <div class="result-title">
        {{ accuracy >= 80 ? '太棒了！' : '继续加油！' }}
      </div>
      <div class="result-message">
        {{ resultMessage }}
      </div>
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
      <div class="result-actions">
        <button class="retry-btn" @click="restart">再来一轮</button>
        <button class="back-home-btn" @click="goBack">返回首页</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import ThreeScene from '@/components/ThreeScene.vue'

const router = useRouter()
const gameStore = useGameStore()

const getBillSVG = (value: number): string => {
  const colors: { [key: number]: string } = {
    1: '#90EE90',
    2: '#98FB98',
    5: '#87CEEB',
    10: '#DDA0DD',
  }
  const color = colors[value] || '#90EE90'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="70" height="35" viewBox="0 0 70 35">
    <rect x="2" y="2" width="66" height="31" rx="3" fill="${color}" stroke="#333" stroke-width="2"/>
    <rect x="5" y="5" width="25" height="25" rx="2" fill="white" stroke="#ccc"/>
    <text x="17" y="22" font-size="14" font-weight="bold" text-anchor="middle" fill="#333">¥</text>
    <text x="50" y="22" font-size="18" font-weight="bold" text-anchor="middle" fill="#333">${value}</text>
    <text x="50" y="30" font-size="8" text-anchor="middle" fill="#666">¥</text>
  </svg>`
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
}

const getCoinSVG = (value: number): string => {
  const colors: { [key: number]: string } = {
    1: '#FFD700',
    2: '#C0C0C0',
    5: '#CD7F32',
  }
  const coinColor = colors[value] || '#FFD700'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="18" fill="${coinColor}" stroke="#DAA520" stroke-width="3"/>
    <circle cx="20" cy="20" r="14" fill="none" stroke="#DAA520" stroke-width="1"/>
    <text x="20" y="26" font-size="16" font-weight="bold" text-anchor="middle" fill="#8B4513">${value}</text>
  </svg>`
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
}

interface Item {
  emoji: string
  name: string
  price: number
}

interface MoneyItem {
  value: number
  type: 'bill' | 'coin'
  count: number
}

interface FlatMoney {
  type: 'bill' | 'coin'
  img: string
  label: string
}

interface BreakMethod {
  hint1: number
  showEquation: string
  hint2: string
}

interface MakeMethod {
  give: number
  have: number
  hint: string
}

interface Question {
  item: Item
  playerMoney: MoneyItem[]
  flatMoney: FlatMoney[]
  breakMethod: BreakMethod
  makeMethod: MakeMethod
  answer: number
  options: number[]
}

const items: Item[] = [
  { emoji: '🍎', name: '苹果', price: 3 },
  { emoji: '🍌', name: '香蕉', price: 4 },
  { emoji: '🍞', name: '面包', price: 5 },
  { emoji: '🥚', name: '鸡蛋', price: 2 },
  { emoji: '🍪', name: '饼干', price: 7 },
  { emoji: '🥛', name: '牛奶', price: 6 },
  { emoji: '🌭', name: '热狗', price: 8 },
  { emoji: '🍰', name: '蛋糕', price: 9 },
]

const levels = [
  { label: '简单', value: 1, maxPrice: 10 },
  { label: '中等', value: 2, maxPrice: 15 },
  { label: '困难', value: 3, maxPrice: 20 },
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
const gameMode = ref<'addition' | 'subtraction'>('subtraction')
const showHint = ref(false)
const isThinking = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const showCheckout = ref(false)
const selectedItem = ref<{ name: string; emoji: string; price: number } | null>(
  null
)
const gamePhase = ref<'entrance' | 'shopping' | 'checkout'>('entrance')

const handleArrive = (_location: string) => {}

const handleEnter = () => {
  if (gamePhase.value === 'entrance') {
    gamePhase.value = 'shopping'
    if (questions.value.length === 0) {
      generateQuestions()
    }
  }
}

const shopItems = [
  { name: '苹果', emoji: '🍎', price: 3 },
  { name: '面包', emoji: '🍞', price: 5 },
  { name: '牛奶', emoji: '🥛', price: 6 },
  { name: '蛋糕', emoji: '🍰', price: 9 },
  { name: '香蕉', emoji: '🍌', price: 4 },
  { name: '鸡蛋', emoji: '🥚', price: 2 },
]

const selectItem = (item: { name: string; emoji: string; price: number }) => {
  selectedItem.value = item
}

const goToCheckout = () => {
  if (selectedItem.value && currentQuestion.value) {
    currentQuestion.value.item = selectedItem.value
    showCheckout.value = true
  }
}

const currentQuestion = computed(
  () => questions.value[currentQuestionIndex.value]
)
const progress = computed(
  () => (currentQuestionIndex.value / totalQuestions.value) * 100
)
const accuracy = computed(() =>
  Math.round((correctCount.value / totalQuestions.value) * 100)
)

const flatMoneyList = computed(() => {
  if (!currentQuestion.value) return []
  return currentQuestion.value.flatMoney
})

const hintText = computed(() => {
  if (gameMode.value === 'subtraction') {
    return currentQuestion.value.breakMethod.hint2
  } else {
    return currentQuestion.value.makeMethod.hint
  }
})

const resultMessage = computed(() => {
  if (accuracy.value >= 90) return '你是购物小达人！💰'
  if (accuracy.value >= 70) return '算得又快又准！🧾'
  if (accuracy.value >= 50) return '继续练习，你会更好！📚'
  return '多练习几次就能掌握了！💪'
})

const calculateTotal = (money: MoneyItem[]) => {
  return money.reduce((sum, item) => sum + item.value * item.count, 0)
}

const getRandomMoney = (amount: number): MoneyItem[] => {
  const money: MoneyItem[] = []
  const denominations = [10, 5, 2, 1]
  let remaining = amount

  for (const denom of denominations) {
    if (remaining >= denom) {
      const count = Math.floor(remaining / denom)
      money.push({ value: denom, type: denom >= 5 ? 'bill' : 'coin', count })
      remaining %= denom
    }
  }

  return money
}

const flattenMoney = (money: MoneyItem[]): FlatMoney[] => {
  const flat: FlatMoney[] = []
  for (const item of money) {
    for (let i = 0; i < item.count; i++) {
      flat.push({
        type: item.type,
        img:
          item.type === 'bill'
            ? getBillSVG(item.value)
            : getCoinSVG(item.value),
        label: `${item.value}元${item.type === 'bill' ? '纸币' : '硬币'}`,
      })
    }
  }
  return flat
}

const generateSubtractionQuestion = (): Question => {
  const levelConfig =
    levels.find(l => l.value === currentLevel.value) || levels[0]
  const maxPrice = levelConfig.maxPrice
  const item = items[Math.floor(Math.random() * items.length)]
  const price = Math.min(item.price, maxPrice)

  const paidAmounts: number[] = []
  if (price >= 5) paidAmounts.push(10)
  if (price >= 10) paidAmounts.push(20)
  if (price < 10) paidAmounts.push(10)
  if (price < 20) paidAmounts.push(price + Math.floor(Math.random() * 5) + 1)

  const paid = paidAmounts[Math.floor(Math.random() * paidAmounts.length)]
  const change = paid - price

  const breakMethod: BreakMethod = {
    hint1: paid,
    showEquation: `${paid} - ${price}`,
    hint2: `付了${paid}元，商品${price}元，找零${paid}-${price}=${change}元`,
  }

  const answer = change

  const options = new Set<number>([answer])
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 3) + 1
    const wrong = answer + (Math.random() > 0.5 ? offset : -offset)
    if (wrong >= 0 && wrong <= 10 && wrong !== answer) options.add(wrong)
  }

  const playerMoney = getRandomMoney(paid)
  const flatMoney = flattenMoney(playerMoney)

  return {
    item: { ...item, price },
    playerMoney,
    flatMoney,
    breakMethod,
    makeMethod: { give: 0, have: 0, hint: '' },
    answer,
    options: Array.from(options).sort(() => Math.random() - 0.5),
  }
}

const generateAdditionQuestion = (): Question => {
  const levelConfig =
    levels.find(l => l.value === currentLevel.value) || levels[0]
  const maxPrice = levelConfig.maxPrice
  const item = items[Math.floor(Math.random() * items.length)]
  const price = Math.min(item.price, maxPrice)

  const possibleGives: { give: number; have: number }[] = []
  for (let give = 1; give < price; give++) {
    possibleGives.push({ give, have: price - give })
  }

  const makeMethod =
    possibleGives.length > 0
      ? possibleGives[Math.floor(Math.random() * possibleGives.length)]
      : { give: 1, have: price - 1 }

  const hint = `商品${price}元，你出了${makeMethod.have}元，还差${makeMethod.give}元（${makeMethod.have}+${makeMethod.give}=${price}）`

  const answer = makeMethod.give

  const options = new Set<number>([answer])
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 3) + 1
    const wrong = answer + (Math.random() > 0.5 ? offset : -offset)
    if (wrong >= 1 && wrong <= 9) options.add(wrong)
  }

  const playerMoney = getRandomMoney(makeMethod.have)
  const flatMoney = flattenMoney(playerMoney)

  return {
    item: { ...item, price },
    playerMoney,
    flatMoney,
    breakMethod: { hint1: 0, showEquation: '', hint2: '' },
    makeMethod: { ...makeMethod, hint },
    answer,
    options: Array.from(options).sort(() => Math.random() - 0.5),
  }
}

const generateQuestions = () => {
  questions.value = []
  for (let i = 0; i < totalQuestions.value; i++) {
    if (gameMode.value === 'subtraction') {
      questions.value.push(generateSubtractionQuestion())
    } else {
      questions.value.push(generateAdditionQuestion())
    }
  }
}

const selectAnswer = (opt: number) => {
  selectedAnswer.value = opt
}

const submitAnswer = () => {
  if (selectedAnswer.value === null) return

  isThinking.value = true
  setTimeout(() => {
    isThinking.value = false
    const correct = selectedAnswer.value === currentQuestion.value.answer

    gameStore.recordAnswer(
      'money',
      `钱币练习-${gameMode.value === 'subtraction' ? '破十' : '凑十'}`,
      selectedAnswer.value!,
      correct
    )

    if (correct) {
      correctCount.value++
      feedbackText.value =
        gameMode.value === 'subtraction' ? '找零算对了！💰' : '凑十法真棒！✨'
      feedbackClass.value = 'correct'
      showSuccess.value = true
      showError.value = false
    } else {
      feedbackText.value = `正确答案是 ${currentQuestion.value.answer}`
      feedbackClass.value = 'wrong'
      showSuccess.value = false
      showError.value = true
    }

    showHint.value = false
    showFeedback.value = true

    setTimeout(() => {
      showFeedback.value = false
      showSuccess.value = false
      showError.value = false
      selectedAnswer.value = null
      if (currentQuestionIndex.value < totalQuestions.value - 1) {
        currentQuestionIndex.value++
      } else {
        isFinished.value = true
      }
    }, 2000)
  }, 500)
}

const setMode = (mode: 'addition' | 'subtraction') => {
  gameMode.value = mode
  restart()
}

const setLevel = (level: number) => {
  currentLevel.value = level
  restart()
}

const restart = () => {
  currentQuestionIndex.value = 0
  correctCount.value = 0
  isFinished.value = false
  selectedAnswer.value = null
  showFeedback.value = false
  showHint.value = false
  showSuccess.value = false
  showError.value = false
  showCheckout.value = false
  selectedItem.value = null
  gamePhase.value = 'entrance'
  generateQuestions()
}

const goBack = () => router.push('/')

onMounted(() => {})
</script>

<style scoped>
.money-game-page {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}
.super-market-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  pointer-events: none;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='wall' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23f5f5f5'/%3E%3Cstop offset='100%25' style='stop-color:%23e0e0e0'/%3E%3C/linearGradient%3E%3ClinearGradient id='floor' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23d4af37'/%3E%3Cstop offset='100%25' style='stop-color:%23b8860b'/%3E%3C/linearGradient%3E%3ClinearGradient id='counter' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%238b4513'/%3E%3Cstop offset='100%25' style='stop-color:%23654321'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='0' y='0' width='1200' height='550' fill='url(%23wall)'/%3E%3Crect x='0' y='550' width='1200' height='250' fill='url(%23floor)'/%3E%3Crect x='0' y='530' width='1200' height='20' fill='%23a0522d'/%3E%3Crect x='100' y='400' width='1000' height='130' rx='10' fill='url(%23counter)' stroke='%234a2c0a' stroke-width='3'/%3E%3Crect x='150' y='340' width='380' height='150' rx='10' fill='%232a2a2a' stroke='%23333' stroke-width='3'/%3E%3Crect x='160' y='350' width='360' height='30' fill='%23003300'/%3E%3Ctext x='340' y='372' font-family='Courier New' font-size='16' fill='%2300ff00' text-anchor='middle'%3E***%20SUPERMARKET%20***%3C/text%3E%3Crect x='160' y='390' width='360' height='25' fill='%23003300'/%3E%3Ctext x='170' y='408' font-family='Courier New' font-size='12' fill='%23ffff00'%3EITEM%3C/text%3E%3Ctext x='450' y='408' font-family='Courier New' font-size='12' fill='%23ffff00' text-anchor='end'%3E¥3.00%3C/text%3E%3Crect x='160' y='420' width='360' height='25' fill='%23003300'/%3E%3Ctext x='170' y='438' font-family='Courier New' font-size='12' fill='%2300ff00'%3EDUE%3C/text%3E%3Ctext x='450' y='438' font-family='Courier New' font-size='12' fill='%2300ff00' text-anchor='end'%3E¥10.00%3C/text%3E%3Crect x='160' y='450' width='360' height='2' fill='%2300ff00'/%3E%3Crect x='160' y='460' width='360' height='25' fill='%23003300'/%3E%3Ctext x='170' y='478' font-family='Courier New' font-size='14' fill='%23ff6600' font-weight='bold'%3ECHANGE%3C/text%3E%3Ctext x='450' y='478' font-family='Courier New' font-size='14' fill='%23ff6600' font-weight='bold' text-anchor='end'%3E¥7.00%3C/text%3E%3Crect x='560' y='340' width='440' height='150' rx='10' fill='%232a2a2a' stroke='%23333' stroke-width='3'/%3E%3Crect x='570' y='350' width='420' height='30' fill='%23000000'/%3E%3Ctext x='780' y='372' font-family='Arial' font-size='14' fill='%2300ff00' text-anchor='middle'%3E2024-01-15%2014:30%3C/text%3E%3Crect x='570' y='390' width='420' height='90' fill='%23000000'/%3E%3Ctext x='780' y='420' font-family='Courier New' font-size='12' fill='%23999' text-anchor='middle'%3ESCAN%20BARCODE%20HERE%3C/text%3E%3Crect x='600' y='430' width='120' height='35' rx='5' fill='%23333' stroke='%23555'/%3E%3Ctext x='660' y='455' font-family='Arial' font-size='10' fill='%23999' text-anchor='middle'%3EVOID%3C/text%3E%3Crect x='740' y='430' width='120' height='35' rx='5' fill='%23333' stroke='%23555'/%3E%3Ctext x='800' y='455' font-family='Arial' font-size='10' fill='%23999' text-anchor='middle'%3ECLEAR%3C/text%3E%3Crect x='880' y='430' width='90' height='35' rx='5' fill='%23333' stroke='%23555'/%3E%3Ctext x='925' y='455' font-family='Arial' font-size='10' fill='%23999' text-anchor='middle'%3EENTER%3C/text%3E%3Crect x='600' y='480' width='370' height='100' fill='%23000000'/%3E%3Ctext x='780' y='510' font-family='Arial' font-size='11' fill='%23999' text-anchor='middle'%3E***%20THANK%20YOU%20***%3C/text%3E%3Ctext x='780' y='535' font-family='Arial' font-size='14' fill='%23ffff00' text-anchor='middle'%3E1-8888-8888%3C/text%3E%3Crect x='50' y='200' width='150' height='200' fill='%23fafafa' stroke='%23ddd' stroke-width='2'/%3E%3Crect x='60' y='210' width='130' height='80' fill='%23fff' stroke='%23eee'/%3E%3Ctext x='125' y='260' font-size='40' text-anchor='middle'%3E🍎%3C/text%3E%3Ctext x='125' y='380' font-size='14' text-anchor='middle' fill='%23333'%3E¥3%3C/text%3E%3Crect x='230' y='200' width='150' height='200' fill='%23fafafa' stroke='%23ddd' stroke-width='2'/%3E%3Crect x='240' y='210' width='130' height='80' fill='%23fff' stroke='%23eee'/%3E%3Ctext x='305' y='260' font-size='40' text-anchor='middle'%3E🍌%3C/text%3E%3Ctext x='305' y='380' font-size='14' text-anchor='middle' fill='%23333'%3E¥4%3C/text%3E%3Crect x='410' y='200' width='150' height='200' fill='%23fafafa' stroke='%23ddd' stroke-width='2'/%3E%3Crect x='420' y='210' width='130' height='80' fill='%23fff' stroke='%23eee'/%3E%3Ctext x='485' y='260' font-size='40' text-anchor='middle'%3E🍞%3C/text%3E%3Ctext x='485' y='380' font-size='14' text-anchor='middle' fill='%23333'%3E¥5%3C/text%3E%3Crect x='590' y='200' width='150' height='200' fill='%23fafafa' stroke='%23ddd' stroke-width='2'/%3E%3Crect x='600' y='210' width='130' height='80' fill='%23fff' stroke='%23eee'/%3E%3Ctext x='665' y='260' font-size='40' text-anchor='middle'%3E🥚%3C/text%3E%3Ctext x='665' y='380' font-size='14' text-anchor='middle' fill='%23333'%3E¥2%3C/text%3E%3Crect x='770' y='200' width='150' height='200' fill='%23fafafa' stroke='%23ddd' stroke-width='2'/%3E%3Crect x='780' y='210' width='130' height='80' fill='%23fff' stroke='%23eee'/%3E%3Ctext x='845' y='260' font-size='40' text-anchor='middle'%3E🍪%3C/text%3E%3Ctext x='845' y='380' font-size='14' text-anchor='middle' fill='%23333'%3E¥7%3C/text%3E%3Crect x='950' y='200' width='150' height='200' fill='%23fafafa' stroke='%23ddd' stroke-width='2'/%3E%3Crect x='960' y='210' width='130' height='80' fill='%23fff' stroke='%23eee'/%3E%3Ctext x='1025' y='260' font-size='40' text-anchor='middle'%3E🥛%3C/text%3E%3Ctext x='1025' y='380' font-size='14' text-anchor='middle' fill='%23333'%3E¥6%3C/text%3E%3C/svg%3E")
    no-repeat center center;
  background-size: cover;
}
.header {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.back-btn {
  background: rgba(255, 255, 255, 0.3);
  border: none;
  color: #333;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}
.header h1 {
  font-size: 20px;
  color: #333;
  flex: 1;
}
.mode-toggle {
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.5);
  padding: 4px;
  border-radius: 10px;
}
.mode-btn {
  padding: 6px 12px;
  border: none;
  background: transparent;
  color: #666;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}
.mode-btn.active {
  background: #ff6b6b;
  color: white;
}
.level-selector {
  position: relative;
  z-index: 10;
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.level-btn {
  flex: 1;
  padding: 10px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.3);
  color: #333;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.level-btn.active {
  background: #ff6b6b;
  border-color: #ff6b6b;
  color: white;
}
.progress-bar {
  position: relative;
  z-index: 10;
  height: 20px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 16px;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #ff8e53);
  border-radius: 10px;
  transition: width 0.3s ease;
}
.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #333;
  font-size: 11px;
  font-weight: 600;
}
.game-container {
  position: relative;
  z-index: 10;
}
.character-area {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 16px;
  min-height: 100px;
}
.character {
  position: relative;
  font-size: 60px;
  animation: idle 2s ease-in-out infinite;
}
.character.thinking {
  animation: thinking 1s ease-in-out infinite;
}
.character.happy {
  animation: celebrate 0.5s ease-in-out;
}
.character.sad {
  animation: shake 0.5s ease-in-out;
}
@keyframes idle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
@keyframes thinking {
  0%,
  100% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-8px) rotate(5deg);
  }
}
@keyframes celebrate {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0);
  }
}
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}
.thought-bubble {
  position: absolute;
  top: -50px;
  left: 50px;
  background: white;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 12px;
  color: #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}
.thought-bubble::before {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 20px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid white;
}
.speech-bubble {
  position: absolute;
  top: 0;
  right: 20px;
  background: white;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 14px;
  color: #333;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  animation: popIn 0.3s ease-out;
  max-width: 200px;
}
@keyframes popIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.shelf-scene {
  background: linear-gradient(180deg, #8b4513 0%, #654321 100%);
  border-radius: 16px;
  padding: 16px;
  margin: 10px auto;
  max-width: 600px;
}
.shelf-header {
  text-align: center;
  margin-bottom: 16px;
}
.shelf-title {
  background: #ffd700;
  color: #333;
  padding: 10px 24px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 700;
  display: inline-block;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.shelf-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}
.shelf-item {
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 3px solid transparent;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.shelf-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
.shelf-item.selected {
  border-color: #ff6b6b;
  background: #fff3f3;
}
.shelf-emoji {
  font-size: 40px;
  margin-bottom: 4px;
}
.shelf-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}
.shelf-price {
  font-size: 16px;
  font-weight: 700;
  color: #ff6b6b;
}
.checkout-btn {
  display: block;
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #4caf50, #8bc34a);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}
.checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.checkout-btn:not(:disabled):active {
  transform: scale(0.98);
}
.shopping-scene {
  position: relative;
  background: #001100;
  border-radius: 12px;
  padding: 16px;
  font-family: 'Courier New', monospace;
  color: #00ff00;
  border: 4px solid #333;
  box-shadow: inset 0 0 20px rgba(0, 255, 0, 0.1);
}
.shop-header {
  text-align: center;
  margin-bottom: 12px;
}
.shop-sign {
  display: inline-block;
  background: #003300;
  color: #00ff00;
  padding: 6px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  border: 2px solid #00ff00;
  text-shadow: 0 0 10px #00ff00;
}
.checkout-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px;
  background: #001a00;
  border-radius: 8px;
  border: 1px solid #004400;
}
.item-display {
  flex: 1;
}
.item-card {
  background: #002200;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  border: 2px solid #00ff00;
}
.item-emoji {
  font-size: 32px;
  margin-bottom: 4px;
}
.item-name {
  font-size: 12px;
  font-weight: 700;
  color: #00ff00;
  margin-bottom: 4px;
}
.item-price {
  font-size: 14px;
  color: #ffff00;
  font-weight: 700;
  text-shadow: 0 0 5px #ffff00;
}
.vs-symbol {
  font-size: 24px;
  font-weight: bold;
  color: #ff6600;
  text-shadow: 0 0 10px #ff6600;
}
.change-display {
  flex: 1;
  background: #001a00;
  padding: 8px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #006600;
}
.change-label {
  font-size: 10px;
  color: #00ff00;
  margin-bottom: 4px;
}
.change-equation {
  font-size: 14px;
  font-weight: bold;
  color: #00ff00;
}
.money-wallet {
  background: #001a00;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  border: 1px solid #004400;
}
.wallet-label {
  font-size: 12px;
  color: #00ff00;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
  text-shadow: 0 0 5px #00ff00;
}
.money-display {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}
.money-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}
.money-piece {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2px;
  background: #002200;
  border-radius: 4px;
  border: 1px solid #00ff00;
}
.money-piece.bill {
  border-color: #00ff00;
}
.money-piece.coin {
  border-color: #ffd700;
}
.money-img {
  display: block;
}
.total-money {
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  color: #ffff00;
  padding-top: 6px;
  border-top: 1px dashed #004400;
  text-shadow: 0 0 5px #ffff00;
}
.calculation-area {
  background: #001a00;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  text-align: center;
  border: 1px solid #004400;
}
.calc-title {
  font-size: 12px;
  font-weight: 600;
  color: #ff6600;
  margin-bottom: 6px;
  text-shadow: 0 0 5px #ff6600;
}
.calc-equation {
  font-size: 18px;
  font-weight: 700;
  color: #00ff00;
  margin-bottom: 6px;
}
.calc-num {
  display: inline-block;
  padding: 4px 8px;
  background: #003300;
  border-radius: 4px;
  margin: 0 4px;
  min-width: 30px;
  border: 1px solid #00ff00;
}
.calc-num.primary {
  background: #004400;
  color: #00ffff;
  border-color: #00ffff;
}
.calc-num.highlight {
  background: #660000;
  color: #ff0000;
  border-color: #ff0000;
}
.calc-op {
  color: #ff6600;
  margin: 0 4px;
  font-weight: 700;
}
.calc-hint {
  font-size: 10px;
  color: #00ff00;
  line-height: 1.4;
  background: #002200;
  padding: 6px;
  border-radius: 4px;
}
.answer-section {
  margin-bottom: 12px;
}
.answer-label {
  font-size: 14px;
  font-weight: 600;
  color: #00ff00;
  text-align: center;
  margin-bottom: 8px;
  text-shadow: 0 0 5px #00ff00;
}
.answer-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.answer-btn {
  padding: 12px;
  background: linear-gradient(135deg, #003300, #004400);
  border: 2px solid #00ff00;
  border-radius: 8px;
  color: #00ff00;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 5px #00ff00;
}
.answer-btn:active {
  transform: scale(0.95);
  background: #005500;
}
.answer-btn.selected {
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}
.action-buttons {
  display: flex;
  gap: 12px;
}
.hint-btn {
  flex: 1;
  padding: 12px;
  background: #002200;
  border: 2px solid #ff6600;
  border-radius: 8px;
  color: #ff6600;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Courier New', monospace;
}
.submit-btn {
  flex: 2;
  padding: 12px;
  background: linear-gradient(135deg, #003300, #004400);
  border: 2px solid #00ff00;
  border-radius: 8px;
  color: #00ff00;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Courier New', monospace;
}
.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.answer-feedback {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px 32px;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  z-index: 100;
  animation: popIn 0.3s ease-out;
  max-width: 300px;
}
.answer-feedback.correct {
  background: #e8f5e9;
  color: #4caf50;
  border: 3px solid #4caf50;
}
.answer-feedback.wrong {
  background: #ffebee;
  color: #f44336;
  border: 3px solid #f44336;
}
.loading-state {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}
.loading-character {
  font-size: 100px;
  animation: bounce 1s ease-in-out infinite;
}
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
.loading-text {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 20px 0;
}
.start-btn {
  padding: 16px 48px;
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.6);
  }
}
.result-card {
  position: relative;
  z-index: 10;
  background: white;
  border-radius: 24px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}
.result-icon {
  font-size: 80px;
  margin-bottom: 16px;
}
.result-icon.great {
  animation: celebrate 1s ease-in-out infinite;
}
.result-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
}
.result-message {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
}
.result-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 24px;
}
.stat-value {
  font-size: 32px;
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
.result-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.retry-btn {
  padding: 14px 32px;
  background: linear-gradient(135deg, #4caf50, #8bc34a);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
.back-home-btn {
  padding: 14px 32px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
</style>
