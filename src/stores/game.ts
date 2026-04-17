import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGameStore = defineStore('game', () => {
  const totalQuestions = ref(0)
  const correctAnswers = ref(0)
  const totalStars = ref(0)
  const history = ref<
    Array<{
      type: string
      question: string
      answer: number
      correct: boolean
      timestamp: number
    }>
  >([])

  const todayStats = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayQuestions = history.value.filter(
      h => h.timestamp >= today.getTime()
    )

    return {
      questions: todayQuestions.length,
      correct:
        todayQuestions.length > 0
          ? Math.round(
              (todayQuestions.filter(h => h.correct).length /
                todayQuestions.length) *
                100
            )
          : 0,
      stars: totalStars.value,
    }
  })

  const recordAnswer = (
    type: string,
    question: string,
    answer: number,
    correct: boolean
  ) => {
    totalQuestions.value++
    if (correct) {
      correctAnswers.value++
      totalStars.value += 10
    }
    history.value.push({
      type,
      question,
      answer,
      correct,
      timestamp: Date.now(),
    })
  }

  const reset = () => {
    totalQuestions.value = 0
    correctAnswers.value = 0
    totalStars.value = 0
    history.value = []
  }

  return {
    totalQuestions,
    correctAnswers,
    totalStars,
    history,
    todayStats,
    recordAnswer,
    reset,
  }
})
