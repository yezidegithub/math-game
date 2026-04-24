<template>
  <div class="three-container" ref="containerRef">
    <div class="controls-hint">
      <div class="hint-title">操作提示</div>
      <div class="hint-row">⬆️ / W - 前进</div>
      <div class="hint-row">⬇️ / S - 后退</div>
      <div class="hint-row">⬅️ / A - 向左看</div>
      <div class="hint-row">➡️ / D - 向右看</div>
      <div class="hint-row">点击按钮 - 触摸操作</div>
    </div>

    <div class="touch-controls">
      <div class="control-row">
        <button 
          class="control-btn turn-btn" 
          @touchstart.prevent="startTurn(-1)"
          @touchend.prevent="stopTurn"
          @mousedown="startTurn(-1)"
          @mouseup="stopTurn"
          @mouseleave="stopTurn"
        >
          <span>⬅️</span>
        </button>
      </div>
      <div class="control-row">
        <button 
          class="control-btn move-btn"
          @touchstart.prevent="startMove(1)"
          @touchend.prevent="stopMove"
          @mousedown="startMove(1)"
          @mouseup="stopMove"
          @mouseleave="stopMove"
        >
          <span>⬆️</span>
        </button>
        <button 
          class="control-btn move-btn"
          @touchstart.prevent="startMove(-1)"
          @touchend.prevent="stopMove"
          @mousedown="startMove(-1)"
          @mouseup="stopMove"
          @mouseleave="stopMove"
        >
          <span>⬇️</span>
        </button>
      </div>
      <div class="control-row">
        <button 
          class="control-btn turn-btn"
          @touchstart.prevent="startTurn(1)"
          @touchend.prevent="stopTurn"
          @mousedown="startTurn(1)"
          @mouseup="stopTurn"
          @mouseleave="stopTurn"
        >
          <span>➡️</span>
        </button>
      </div>
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
let walkingDirection = 0
let currentShelfIndex = 0
let keysPressed: Set<string> = new Set()
let characterRotation = 0
let targetRotation = 0
let touchMoveDirection = 0
let touchTurnDirection = 0

const shelfPositions = [
  { z: -6, name: '水果区 🍎', action: '去购物 →' },
  { z: -16, name: '零食区 🍪', action: '去购物 →' },
  { z: -26, name: '饮料区 🥤', action: '去购物 →' },
  { z: -36, name: '收银台 💰', action: '去结账 →' },
]

const initThree = () => {
  if (!containerRef.value) return

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xe8e8e8)

  const bgGeometry = new THREE.SphereGeometry(50, 32, 32)
  const bgMaterial = new THREE.MeshBasicMaterial({
    color: 0xe8e8e8,
    side: THREE.BackSide
  })
  const bgSphere = new THREE.Mesh(bgGeometry, bgMaterial)
  scene.add(bgSphere)

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  )
  camera.position.set(0, 2.5, 8)
  camera.lookAt(0, 2, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0xe8e8e8)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.5
  containerRef.value.appendChild(renderer.domElement)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
  scene.add(ambientLight)

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.0)
  mainLight.position.set(5, 15, 5)
  mainLight.castShadow = true
  mainLight.shadow.mapSize.width = 2048
  mainLight.shadow.mapSize.height = 2048
  mainLight.shadow.camera.near = 0.5
  mainLight.shadow.camera.far = 50
  mainLight.shadow.camera.left = -20
  mainLight.shadow.camera.right = 20
  mainLight.shadow.camera.top = 20
  mainLight.shadow.camera.bottom = -20
  scene.add(mainLight)

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.6)
  fillLight.position.set(-5, 10, -5)
  scene.add(fillLight)

  const frontLight = new THREE.DirectionalLight(0xffffff, 0.5)
  frontLight.position.set(0, 5, 10)
  scene.add(frontLight)

  createFloorAndWalls()
  createShelves()
  createCharacter()
  createEntrance()

  window.addEventListener('resize', onWindowResize)
  animate()
}

const createFloorAndWalls = () => {
  const floorGeo = new THREE.PlaneGeometry(20, 70)
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xdcdcdc,
    roughness: 0.8,
    metalness: 0.1,
  })
  const floor = new THREE.Mesh(floorGeo, floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.position.set(0, 0, -17)
  floor.receiveShadow = true
  scene.add(floor)

  const ceilingGeo = new THREE.PlaneGeometry(20, 70)
  const ceilingMat = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    metalness: 0.1
  })
  const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat)
  ceiling.rotation.x = Math.PI / 2
  ceiling.position.set(0, 4, -17)
  scene.add(ceiling)

  const wallMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    roughness: 0.9
  })
  
  const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 5),
    wallMaterial
  )
  backWall.position.set(0, 2, -45)
  backWall.receiveShadow = true
  scene.add(backWall)

  const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(70, 5),
    wallMaterial
  )
  leftWall.rotation.y = Math.PI / 2
  leftWall.position.set(-10, 2, -17)
  leftWall.receiveShadow = true
  scene.add(leftWall)

  const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(70, 5),
    wallMaterial
  )
  rightWall.rotation.y = -Math.PI / 2
  rightWall.position.set(10, 2, -17)
  rightWall.receiveShadow = true
  scene.add(rightWall)

  const frontWallLeft = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 5),
    wallMaterial
  )
  frontWallLeft.rotation.y = Math.PI / 2
  frontWallLeft.position.set(-10, 2, 6)
  scene.add(frontWallLeft)

  const frontWallRight = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 5),
    wallMaterial
  )
  frontWallRight.rotation.y = -Math.PI / 2
  frontWallRight.position.set(10, 2, 6)
  scene.add(frontWallRight)

  const frontWall = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 5),
    wallMaterial
  )
  frontWall.position.set(0, 2, 11)
  scene.add(frontWall)

  const aisleLight = new THREE.PointLight(0xffffff, 1.5, 15)
  aisleLight.position.set(0, 3.5, -5)
  scene.add(aisleLight)
  const aisleLight2 = new THREE.PointLight(0xffffff, 1.5, 15)
  aisleLight2.position.set(0, 3.5, -15)
  scene.add(aisleLight2)
  const aisleLight3 = new THREE.PointLight(0xffffff, 1.5, 15)
  aisleLight3.position.set(0, 3.5, -25)
  scene.add(aisleLight3)
  const aisleLight4 = new THREE.PointLight(0xffffff, 1.5, 15)
  aisleLight4.position.set(0, 3.5, -35)
  scene.add(aisleLight4)

  const lightFixtureGeo = new THREE.BoxGeometry(1.5, 0.1, 0.4)
  const lightFixtureMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 1.0,
  })
  for (let z = -3; z > -40; z -= 10) {
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
    { emoji: '🍉', color: 0xff6347 },
    { emoji: '🍒', color: 0xdc143c },
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
    { emoji: '🍯', color: 0xffd700 },
    { emoji: '🍭', color: 0xff69b4 },
  ]

  const drinks = [
    { emoji: '🥤', color: 0xff6b6b },
    { emoji: '🍹', color: 0x4ecdc4 },
    { emoji: '🍺', color: 0xffd700 },
    { emoji: '🥛', color: 0xffffff },
    { emoji: '🧃', color: 0x90ee90 },
    { emoji: '☕', color: 0x8b4513 },
    { emoji: '🍵', color: 0x90ee90 },
    { emoji: '🍶', color: 0xadd8e6 },
  ]

  const shelfMat = new THREE.MeshStandardMaterial({ 
    color: 0x8b4513,
    roughness: 0.7,
  })
  const shelfLegMat = new THREE.MeshStandardMaterial({ 
    color: 0x666666,
    roughness: 0.6,
  })

  const sections = [
    { zPos: -6, products: products, name: '水果区' },
    { zPos: -16, products: snacks, name: '零食区' },
    { zPos: -26, products: drinks, name: '饮料区' },
  ]

  sections.forEach(section => {
    const leftShelf = createFlatShelfGroup(
      shelfMat,
      shelfLegMat,
      section.products,
      'left'
    )
    leftShelf.position.set(-3.5, 0, section.zPos)
    scene.add(leftShelf)

    const rightShelf = createFlatShelfGroup(
      shelfMat,
      shelfLegMat,
      section.products,
      'right'
    )
    rightShelf.position.set(3.5, 0, section.zPos)
    rightShelf.rotation.y = Math.PI
    scene.add(rightShelf)

    const sectionSign = new THREE.Mesh(
      new THREE.BoxGeometry(2, 0.6, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x2196f3 })
    )
    sectionSign.position.set(0, 1.5, section.zPos - 1.5)
    scene.add(sectionSign)

    const priceTagMat = new THREE.MeshStandardMaterial({ color: 0xffd700 })
    const priceTag = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.3, 0.05),
      priceTagMat
    )
    priceTag.position.set(0, 0.8, section.zPos - 1.5)
    scene.add(priceTag)
  })

  createCheckoutCounter()
  createShoppingCarts()
  createPromotionPosters()
}

const createProductTexture = (emoji: string, size: number = 128): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)
  
  ctx.font = `${size * 0.7}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(emoji, size / 2, size / 2)
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

const createProductWithEmoji = (
  emoji: string,
  position: { x: number; y: number; z: number },
  scale: number = 1
): THREE.Group => {
  const group = new THREE.Group()
  
  const geometry = new THREE.SphereGeometry(0.2 * scale, 16, 16)
  const texture = createProductTexture(emoji, 128)
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.5,
  })
  const mesh = new THREE.Mesh(geometry, material)
  group.add(mesh)
  
  group.position.set(position.x, position.y, position.z)
  group.castShadow = true
  
  return group
}

const createFlatShelfGroup = (
  shelfMat: THREE.MeshStandardMaterial,
  legMat: THREE.MeshStandardMaterial,
  products: { emoji: string; color: number }[],
  _side: string
) => {
  const group = new THREE.Group()

  const tableTop = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.1, 4),
    shelfMat
  )
  tableTop.position.set(0, 0.8, 0)
  tableTop.castShadow = true
  tableTop.receiveShadow = true
  group.add(tableTop)

  const legGeo = new THREE.BoxGeometry(0.1, 0.8, 0.1)
  
  const positions = [
    { x: -1.1, z: 1.8 },
    { x: 1.1, z: 1.8 },
    { x: -1.1, z: -1.8 },
    { x: 1.1, z: -1.8 },
  ]
  
  positions.forEach(pos => {
    const leg = new THREE.Mesh(legGeo, legMat)
    leg.position.set(pos.x, 0.4, pos.z)
    leg.castShadow = true
    group.add(leg)
  })

  const productSpacing = 0.6
  const productsPerRow = 4
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    const row = Math.floor(i / productsPerRow)
    const col = i % productsPerRow
    
    const startX = -(productsPerRow - 1) * productSpacing / 2
    const startZ = -1.5
    
    const productGroup = createProductWithEmoji(
      product.emoji,
      {
        x: startX + col * productSpacing,
        y: 1.0,
        z: startZ + row * 0.7
      },
      0.8
    )
    group.add(productGroup)

    const labelCanvas = document.createElement('canvas')
    labelCanvas.width = 128
    labelCanvas.height = 64
    const ctx = labelCanvas.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 128, 64)
    ctx.fillStyle = '#333333'
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${(Math.random() * 5 + 1).toFixed(1)}元`, 64, 32)
    
    const labelTexture = new THREE.CanvasTexture(labelCanvas)
    const labelGeo = new THREE.PlaneGeometry(0.3, 0.15)
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTexture,
      side: THREE.DoubleSide,
    })
    const label = new THREE.Mesh(labelGeo, labelMat)
    label.position.set(
      startX + col * productSpacing,
      0.85,
      startZ + row * 0.7 + 0.25
    )
    label.rotation.x = -Math.PI / 6
    group.add(label)
  }

  return group
}

const createCheckoutCounter = () => {
  const counterMat = new THREE.MeshStandardMaterial({ 
    color: 0x8b4513,
    roughness: 0.7,
  })
  
  const counter = new THREE.Mesh(
    new THREE.BoxGeometry(8, 1, 2),
    counterMat
  )
  counter.position.set(0, 0.5, -36)
  counter.castShadow = true
  scene.add(counter)

  const register = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.8, 0.4),
    new THREE.MeshStandardMaterial({ color: 0x333333 })
  )
  register.position.set(0, 1, -35)
  scene.add(register)

  const scanner = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.1, 0.1),
    new THREE.MeshStandardMaterial({ color: 0xadd8e6 })
  )
  scanner.position.set(0, 1.4, -35)
  scene.add(scanner)

  const checkoutLight = new THREE.PointLight(0xffffff, 1.2, 10)
  checkoutLight.position.set(0, 3.5, -36)
  scene.add(checkoutLight)
}

const createShoppingCarts = () => {
  const cartMat = new THREE.MeshStandardMaterial({ 
    color: 0xff6347,
    roughness: 0.6,
  })
  
  const createCart = (x: number, z: number, rotation: number) => {
    const cart = new THREE.Group()
    
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.6, 0.6),
      cartMat
    )
    body.position.set(0, 0.3, 0)
    cart.add(body)
    
    const handle = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.8, 0.1),
      cartMat
    )
    handle.position.set(0, 0.8, -0.3)
    cart.add(handle)
    
    const wheelGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 8)
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x333333 })
    
    const wheels = [
      { x: 0.3, z: 0.25 },
      { x: -0.3, z: 0.25 },
      { x: 0.3, z: -0.25 },
      { x: -0.3, z: -0.25 },
    ]
    
    wheels.forEach(wheel => {
      const wheelMesh = new THREE.Mesh(wheelGeo, wheelMat)
      wheelMesh.rotation.z = Math.PI / 2
      wheelMesh.position.set(wheel.x, 0.05, wheel.z)
      cart.add(wheelMesh)
    })
    
    cart.position.set(x, 0, z)
    cart.rotation.y = rotation
    scene.add(cart)
  }
  
  createCart(2, -5, 0)
  createCart(-2, -15, Math.PI / 4)
  createCart(3, -25, Math.PI / 2)
}

const createPromotionPosters = () => {
  const posterMat = new THREE.MeshStandardMaterial({ 
    color: 0xff4444,
    roughness: 0.8,
  })
  
  const createPoster = (x: number, z: number, rotation: number) => {
    const poster = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 1, 0.05),
      posterMat
    )
    poster.position.set(x, 1.5, z)
    poster.rotation.y = rotation
    poster.castShadow = true
    scene.add(poster)
  }
  
  createPoster(-5, -10, Math.PI / 2)
  createPoster(5, -20, -Math.PI / 2)
  createPoster(-5, -30, Math.PI / 2)
}

const createCharacter = () => {
  character = new THREE.Group()

  const bodyGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.8, 8)
  const bodyMat = new THREE.MeshStandardMaterial({ 
    color: 0x4169e1,
    roughness: 0.7,
  })
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  body.position.y = 0.9
  body.castShadow = true
  character.add(body)

  const headGeo = new THREE.SphereGeometry(0.22, 16, 16)
  const headMat = new THREE.MeshStandardMaterial({ 
    color: 0xffdbac,
    roughness: 0.8,
  })
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

  const armGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8)
  const armMat = new THREE.MeshStandardMaterial({ color: 0x4169e1 })
  const leftArm = new THREE.Mesh(armGeo, armMat)
  leftArm.position.set(-0.25, 1.2, 0)
  leftArm.rotation.z = -Math.PI / 4
  leftArm.name = 'leftArm'
  character.add(leftArm)
  const rightArm = new THREE.Mesh(armGeo, armMat)
  rightArm.position.set(0.25, 1.2, 0)
  rightArm.rotation.z = Math.PI / 4
  rightArm.name = 'rightArm'
  character.add(rightArm)

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

const handleKeyDown = (event: KeyboardEvent) => {
  if (props.gamePhase !== 'entrance') return
  keysPressed.add(event.key)
}

const handleKeyUp = (event: KeyboardEvent) => {
  keysPressed.delete(event.key)
}

const startTurn = (direction: number) => {
  if (props.gamePhase !== 'entrance') return
  touchTurnDirection = direction
}

const stopTurn = () => {
  touchTurnDirection = 0
}

const startMove = (direction: number) => {
  if (props.gamePhase !== 'entrance') return
  touchMoveDirection = direction
}

const stopMove = () => {
  touchMoveDirection = 0
}

const updateMovement = () => {
  if (props.gamePhase !== 'entrance') return
  
  let moveDirection = 0
  let turnDirection = 0
  
  if (keysPressed.has('ArrowUp') || keysPressed.has('w') || keysPressed.has('W')) {
    moveDirection = 1
  } else if (keysPressed.has('ArrowDown') || keysPressed.has('s') || keysPressed.has('S')) {
    moveDirection = -1
  }
  
  if (keysPressed.has('ArrowLeft') || keysPressed.has('a') || keysPressed.has('A')) {
    turnDirection = 1
  } else if (keysPressed.has('ArrowRight') || keysPressed.has('d') || keysPressed.has('D')) {
    turnDirection = -1
  }
  
  if (touchTurnDirection !== 0) {
    turnDirection = touchTurnDirection
  }
  
  if (touchMoveDirection !== 0) {
    moveDirection = touchMoveDirection
  }

  if (turnDirection !== 0) {
    targetRotation += turnDirection * 0.05
  }
  
  const rotationDiff = targetRotation - characterRotation
  characterRotation += rotationDiff * 0.15
  character.rotation.y = characterRotation
  
  const lookAtX = Math.sin(characterRotation) * 5
  const lookAtZ = currentZ + Math.cos(characterRotation) * 5
  camera.lookAt(lookAtX, 1.5, lookAtZ)

  if (moveDirection !== 0 && !isWalking) {
    isWalking = true
    walkingDirection = moveDirection
  }

  if (isWalking) {
    const speed = 0.15
    currentZ -= speed * walkingDirection * Math.cos(characterRotation)
    
    const sideSpeed = speed * walkingDirection * Math.sin(characterRotation)
    
    character.position.x += sideSpeed
    character.position.z = currentZ
    camera.position.z = currentZ
    camera.position.x = character.position.x

    const leftLeg = character.getObjectByName('leftLeg')
    const rightLeg = character.getObjectByName('rightLeg')
    const leftArm = character.getObjectByName('leftArm')
    const rightArm = character.getObjectByName('rightArm')
    
    const walkCycle = Date.now() * 0.015
    
    if (leftLeg && rightLeg) {
      const legSwing = Math.sin(walkCycle) * 0.4
      leftLeg.rotation.x = legSwing * walkingDirection
      rightLeg.rotation.x = -legSwing * walkingDirection
    }
    
    if (leftArm && rightArm) {
      const armSwing = Math.sin(walkCycle + Math.PI) * 0.3
      leftArm.rotation.x = armSwing * walkingDirection
      rightArm.rotation.x = -armSwing * walkingDirection
    }

    const currentShelf = shelfPositions.find(
      shelf => Math.abs(currentZ - shelf.z) < 1
    )
    
    if (currentShelf && currentShelfIndex !== shelfPositions.indexOf(currentShelf)) {
      currentShelfIndex = shelfPositions.indexOf(currentShelf)
      arrivedAtShelf.value = true
      shelfName.value = currentShelf.name
      actionText.value = currentShelf.action
      emit('arrive', currentShelf.name)
    } else if (!currentShelf) {
      arrivedAtShelf.value = false
    }

    if (currentZ > 12 || currentZ < -42) {
      isWalking = false
      walkingDirection = 0
    }

    if (moveDirection === 0) {
      isWalking = false
      walkingDirection = 0
    }
  }
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

const enterArea = () => {
  emit('enter')
}

const animate = () => {
  animationId = requestAnimationFrame(animate)
  
  updateMovement()
  
  if (!isWalking && character) {
    const head = character.children.find(child => child instanceof THREE.Mesh && child.geometry.type === 'SphereGeometry')
    if (head) {
      head.rotation.y = Math.sin(Date.now() * 0.001) * 0.1
    }
  }
  
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
      characterRotation = 0
      targetRotation = 0
      character.position.set(0, 0, 8)
      character.rotation.y = 0
      camera.position.set(0, 2.5, 8)
      arrivedAtShelf.value = false
      keysPressed.clear()
      touchMoveDirection = 0
      touchTurnDirection = 0
    }
  }
)

onMounted(() => {
  initThree()
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
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
  z-index: 1;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #e8e8e8;
}

.three-container canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
  margin: 0;
  padding: 0;
}

.controls-hint {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 16px 20px;
  border-radius: 12px;
  font-size: 14px;
  z-index: 100;
  pointer-events: none;
}

.hint-title {
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 8px;
  color: #ffd700;
}

.hint-row {
  margin: 6px 0;
  opacity: 0.9;
}

.arrive-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  animation: fadeIn 0.5s ease-out;
  z-index: 100;
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

.touch-controls {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 100;
}

.control-row {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.control-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(145deg, #4a90d9, #357abd);
  color: white;
  font-size: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.1s ease;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  user-select: none;
}

.control-btn:active {
  transform: scale(0.95);
  background: linear-gradient(145deg, #357abd, #2a6ab0);
}

.control-btn span {
  pointer-events: none;
}

.move-btn {
  width: 70px;
  height: 70px;
  font-size: 32px;
}

.turn-btn {
  width: 55px;
  height: 55px;
  font-size: 26px;
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

@media (max-width: 768px) {
  .touch-controls {
    bottom: 20px;
  }
  
  .control-btn {
    width: 50px;
    height: 50px;
    font-size: 22px;
  }
  
  .move-btn {
    width: 60px;
    height: 60px;
    font-size: 26px;
  }
  
  .turn-btn {
    width: 45px;
    height: 45px;
    font-size: 20px;
  }
  
  .controls-hint {
    top: 10px;
    right: 10px;
    padding: 10px 14px;
    font-size: 12px;
  }
  
  .hint-title {
    font-size: 14px;
  }
}
</style>
