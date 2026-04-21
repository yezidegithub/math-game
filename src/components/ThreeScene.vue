<template>
  <div class="three-container" ref="containerRef" @click="handleClick">
    <div class="walk-hint" v-if="showHint">
      <div class="hint-icon">👆</div>
      <div class="hint-text">点击屏幕向前走</div>
    </div>
    <div class="arrive-info" v-if="arrivedAtShelf">
      <div class="arrive-text">{{ shelfName }}</div>
      <div class="arrive-action" @click.stop="enterArea">{{ actionText }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps<{
  gamePhase: 'entrance' | 'shopping' | 'checkout'
}>()

const emit = defineEmits<{
  (e: 'arrive', location: string): void
  (e: 'enter'): void
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const showHint = ref(true)
const arrivedAtShelf = ref(false)
const shelfName = ref('')
const actionText = ref('')

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let character: THREE.Group
let animationId: number
let currentZ = 8
let isWalking = false
let currentShelfIndex = 0

const shelfPositions = [
  { z: -8, name: '水果区 🍎', action: '去购物 →' },
  { z: -22, name: '零食区 🍪', action: '去购物 →' },
  { z: -36, name: '收银台 💰', action: '去结账 →' },
]

const initThree = () => {
  if (!containerRef.value) return

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffe4c4)
  scene.fog = new THREE.Fog(0xffe4c4, 5, 25)

  camera = new THREE.PerspectiveCamera(
    80,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  )
  camera.position.set(0, 2.2, 8)
  camera.lookAt(0, 1.5, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  containerRef.value.appendChild(renderer.domElement)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const mainLight = new THREE.DirectionalLight(0xffffff, 0.8)
  mainLight.position.set(5, 10, 5)
  mainLight.castShadow = true
  mainLight.shadow.mapSize.width = 2048
  mainLight.shadow.mapSize.height = 2048
  scene.add(mainLight)

  createFloorAndWalls()
  createShelves()
  createCharacter()
  createEntrance()

  window.addEventListener('resize', onWindowResize)
  animate()
}

const createFloorAndWalls = () => {
  const floorGeo = new THREE.PlaneGeometry(8, 60)
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xd3d3d3,
    roughness: 0.8,
  })
  const floor = new THREE.Mesh(floorGeo, floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.position.set(0, 0, -20)
  floor.receiveShadow = true
  scene.add(floor)

  const ceilingGeo = new THREE.PlaneGeometry(8, 60)
  const ceilingMat = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat)
  ceiling.rotation.x = Math.PI / 2
  ceiling.position.set(0, 4, -20)
  scene.add(ceiling)

  const aisleLight = new THREE.PointLight(0xffffcc, 0.8, 15)
  aisleLight.position.set(0, 3.5, -5)
  scene.add(aisleLight)
  const aisleLight2 = new THREE.PointLight(0xffffcc, 0.8, 15)
  aisleLight2.position.set(0, 3.5, -18)
  scene.add(aisleLight2)
  const aisleLight3 = new THREE.PointLight(0xffffcc, 0.8, 15)
  aisleLight3.position.set(0, 3.5, -31)
  scene.add(aisleLight3)

  const lightFixtureGeo = new THREE.BoxGeometry(1.5, 0.15, 0.4)
  const lightFixtureMat = new THREE.MeshStandardMaterial({
    color: 0xffffcc,
    emissive: 0xffffcc,
    emissiveIntensity: 0.5,
  })
  for (let z = -3; z > -40; z -= 12) {
    const fixture = new THREE.Mesh(lightFixtureGeo, lightFixtureMat)
    fixture.position.set(0, 3.9, z)
    scene.add(fixture)
  }
}

const createShelves = () => {
  const products = [
    { emoji: '🍎', color: 0xff0000 },
    { emoji: '🍊', color: 0xffa500 },
    { emoji: '🍋', color: 0xffff00 },
    { emoji: '🍇', color: 0x800080 },
    { emoji: '🍓', color: 0xff0000 },
    { emoji: '🍑', color: 0xffdab9 },
    { emoji: '🥝', color: 0x228b22 },
    { emoji: '🍌', color: 0xffff00 },
  ]

  const snacks = [
    { emoji: '🍪', color: 0x8b4513 },
    { emoji: '🍿', color: 0xffff00 },
    { emoji: '🍫', color: 0x8b4513 },
    { emoji: '🥛', color: 0xffffff },
    { emoji: '🍬', color: 0xff69b4 },
    { emoji: '🧃', color: 0x90ee90 },
    { emoji: '🍩', color: 0xff69b4 },
    { emoji: '🥜', color: 0xdeb887 },
  ]

  const shelfMat = new THREE.MeshStandardMaterial({ color: 0x4a4a4a })
  const shelfPanelMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5 })

  for (let row = 0; row < 4; row++) {
    const zPos = -6 - row * 14

    const leftShelf = createShelfGroup(
      shelfMat,
      shelfPanelMat,
      products,
      'left'
    )
    leftShelf.position.set(-2.8, 0, zPos)
    scene.add(leftShelf)

    const rightShelf = createShelfGroup(
      shelfMat,
      shelfPanelMat,
      snacks,
      'right'
    )
    rightShelf.position.set(2.8, 0, zPos)
    rightShelf.rotation.y = Math.PI
    scene.add(rightShelf)

    const priceTagMat = new THREE.MeshStandardMaterial({ color: 0xffd700 })
    const priceTag = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.3, 0.05),
      priceTagMat
    )
    priceTag.position.set(0, 3.2, zPos - 0.5)
    scene.add(priceTag)
  }
}

const createShelfGroup = (
  shelfMat: THREE.MeshStandardMaterial,
  panelMat: THREE.MeshStandardMaterial,
  products: { emoji: string; color: number }[],
  side: string
) => {
  const group = new THREE.Group()

  const backPanel = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3, 0.1), panelMat)
  backPanel.position.set(0, 1.5, -0.4)
  backPanel.castShadow = true
  group.add(backPanel)

  const basePanel = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.1, 1.2),
    shelfMat
  )
  basePanel.position.set(0, 0.05, 0.1)
  basePanel.castShadow = true
  group.add(basePanel)

  for (let level = 0; level < 4; level++) {
    const shelfPlate = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.08, 1),
      shelfMat
    )
    shelfPlate.position.set(0, 0.6 + level * 0.75, 0.1)
    shelfPlate.castShadow = true
    group.add(shelfPlate)

    const numProducts = side === 'left' ? 4 : 4
    for (let i = 0; i < numProducts; i++) {
      const product = products[(level * numProducts + i) % products.length]

      const productGeo = new THREE.BoxGeometry(0.25, 0.4, 0.2)
      const productMat = new THREE.MeshStandardMaterial({
        color: product.color,
      })
      const productMesh = new THREE.Mesh(productGeo, productMat)
      productMesh.position.set(-0.5 + i * 0.33, 0.95 + level * 0.75, 0.1)
      productMesh.castShadow = true
      group.add(productMesh)

      const labelGeo = new THREE.BoxGeometry(0.2, 0.15, 0.02)
      const labelMat = new THREE.MeshStandardMaterial({ color: 0xffffff })
      const label = new THREE.Mesh(labelGeo, labelMat)
      label.position.set(-0.5 + i * 0.33, 0.65 + level * 0.75, 0.22)
      group.add(label)
    }
  }

  return group
}

const createCharacter = () => {
  character = new THREE.Group()

  const bodyGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.8, 8)
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x4169e1 })
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  body.position.y = 0.9
  body.castShadow = true
  character.add(body)

  const headGeo = new THREE.SphereGeometry(0.22, 16, 16)
  const headMat = new THREE.MeshStandardMaterial({ color: 0xffdbac })
  const head = new THREE.Mesh(headGeo, headMat)
  head.position.y = 1.45
  head.castShadow = true
  character.add(head)

  const eyeGeo = new THREE.SphereGeometry(0.03, 8, 8)
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x000000 })
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat)
  leftEye.position.set(-0.08, 1.5, 0.18)
  character.add(leftEye)
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat)
  rightEye.position.set(0.08, 1.5, 0.18)
  character.add(rightEye)

  const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 8)
  const legMat = new THREE.MeshStandardMaterial({ color: 0x333333 })
  const leftLeg = new THREE.Mesh(legGeo, legMat)
  leftLeg.position.set(-0.1, 0.25, 0)
  leftLeg.name = 'leftLeg'
  character.add(leftLeg)
  const rightLeg = new THREE.Mesh(legGeo, legMat)
  rightLeg.position.set(0.1, 0.25, 0)
  rightLeg.name = 'rightLeg'
  character.add(rightLeg)

  character.position.set(0, 0, 8)
  character.scale.set(1.5, 1.5, 1.5)
  scene.add(character)
}

const createEntrance = () => {
  const doorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(6, 4, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x808080 })
  )
  doorFrame.position.set(0, 2, 11)
  scene.add(doorFrame)

  const glassDoor = new THREE.Mesh(
    new THREE.BoxGeometry(5, 3.5, 0.05),
    new THREE.MeshStandardMaterial({
      color: 0xadd8e6,
      transparent: true,
      opacity: 0.4,
    })
  )
  glassDoor.position.set(0, 2, 11.2)
  scene.add(glassDoor)

  const signBoard = new THREE.Mesh(
    new THREE.BoxGeometry(5, 1.5, 0.2),
    new THREE.MeshStandardMaterial({ color: 0xff4444 })
  )
  signBoard.position.set(0, 4.5, 10.5)
  scene.add(signBoard)

  const awning = new THREE.Mesh(
    new THREE.BoxGeometry(7, 0.2, 2),
    new THREE.MeshStandardMaterial({ color: 0xff4444 })
  )
  awning.position.set(0, 4, 9)
  scene.add(awning)
}

const handleClick = () => {
  if (props.gamePhase !== 'entrance') return
  if (isWalking) return
  if (currentShelfIndex >= shelfPositions.length) return

  isWalking = true
  showHint.value = false
  arrivedAtShelf.value = false

  const nextShelf = shelfPositions[currentShelfIndex]

  const walkInterval = setInterval(() => {
    currentZ -= 0.3
    character.position.z = currentZ
    camera.position.z = currentZ

    const leftLeg = character.getObjectByName('leftLeg')
    const rightLeg = character.getObjectByName('rightLeg')
    if (leftLeg && rightLeg) {
      const swing = Math.sin(currentZ * 0.5) * 0.4
      leftLeg.rotation.x = swing
      rightLeg.rotation.x = -swing
    }

    if (currentZ <= nextShelf.z) {
      clearInterval(walkInterval)
      isWalking = false
      arrivedAtShelf.value = true
      shelfName.value = nextShelf.name
      actionText.value = nextShelf.action
      currentShelfIndex++
      emit('arrive', nextShelf.name)
    }
  }, 16)
}

const enterArea = () => {
  emit('enter')
}

const animate = () => {
  animationId = requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

const onWindowResize = () => {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

watch(
  () => props.gamePhase,
  newPhase => {
    if (newPhase === 'entrance') {
      currentZ = 8
      currentShelfIndex = 0
      character.position.z = currentZ
      camera.position.z = currentZ
      camera.lookAt(0, 1.5, 0)
      showHint.value = true
      arrivedAtShelf.value = false
    }
  }
)

onMounted(() => {
  initThree()
})

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
  }
})
</script>

<style scoped>
.three-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 1;
}

.walk-hint {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  animation: bounce 1.5s infinite;
  pointer-events: none;
}

.hint-icon {
  font-size: 40px;
  margin-bottom: 8px;
}

.hint-text {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
}

.arrive-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  animation: fadeIn 0.5s ease-out;
}

.arrive-text {
  background: rgba(0, 0, 0, 0.8);
  color: #ffd700;
  padding: 16px 32px;
  border-radius: 16px;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}

.arrive-action {
  background: linear-gradient(135deg, #4caf50, #8bc34a);
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: inline-block;
  animation: pulse 2s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-10px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(76, 175, 80, 0);
  }
}
</style>
