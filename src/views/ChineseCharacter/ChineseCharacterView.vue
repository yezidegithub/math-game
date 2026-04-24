<template>
  <div class="chinese-char-view">
    <div class="header">
      <h1>🈸 趣味学汉字</h1>
      <button class="back-btn" @click="goBack">← 返回</button>
    </div>

    <div v-if="!selectedGrade" class="grade-selection">
      <h2>选择年级</h2>
      <div class="grade-grid">
        <div
          v-for="grade in chineseCharacters"
          :key="grade.id"
          class="grade-card"
          @click="selectGrade(grade)"
        >
          <div class="grade-icon">{{ getGradeEmoji(grade.id) }}</div>
          <div class="grade-name">{{ grade.name }}</div>
          <div class="grade-desc">{{ grade.description }}</div>
          <div class="grade-count">{{ grade.characters.length }}个字</div>
        </div>
      </div>
    </div>

    <div v-else-if="!selectedChar" class="char-selection">
      <div class="char-header">
        <button class="back-btn" @click="selectedGrade = null">← 返回</button>
        <h2>{{ selectedGrade.name }} - 选择汉字</h2>
      </div>
      <div class="char-grid">
        <div
          v-for="char in selectedGrade.characters"
          :key="char.char"
          class="char-card"
          @click="selectChar(char)"
        >
          <div class="char-main">{{ char.char }}</div>
          <div class="char-info">
            <span class="char-pinyin">{{ char.pinyin }}</span>
            <span class="char-strokes">{{ char.strokeCount }}笔</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="char-detail">
      <div class="detail-header">
        <button class="back-btn" @click="selectedChar = null">← 返回</button>
        <h2>{{ selectedGrade?.name }}</h2>
      </div>

      <div class="detail-content">
        <div class="char-display">
          <div class="char-huge">{{ selectedChar.char }}</div>
          <div class="char-meta">
            <span class="meta-pinyin">{{ selectedChar.pinyin }}</span>
            <span class="meta-radical">部首：{{ selectedChar.radical }}</span>
            <span class="meta-strokes">笔画：{{ selectedChar.strokeCount }}</span>
          </div>
        </div>

        <div class="hanzi-writer-section">
          <h3>📝 笔顺演示</h3>
          <div ref="hanziWriterContainer" class="hanzi-writer-container"></div>
          <div class="stroke-progress">
            第 {{ currentStroke + 1 }} 笔 / 共 {{ strokeNames.length }} 笔
          </div>
          <div class="stroke-name" v-if="currentStroke >= 0 && strokeNames[currentStroke]">
            {{ strokeNames[currentStroke] }}
          </div>
          <div class="stroke-controls">
            <button @click="startAnimation" :disabled="isAnimating">
              {{ isAnimating ? '播放中...' : '▶ 播放笔顺' }}
            </button>
            <button @click="resetAnimation">🔄 重置</button>
          </div>
          <div class="stroke-list">
            <div
              v-for="(name, index) in strokeNames"
              :key="index"
              class="stroke-item"
              :class="{ active: index === currentStroke, completed: index < currentStroke }"
              @click="playToStroke(index)"
            >
              <span class="stroke-num">{{ index + 1 }}</span>
              <span class="stroke-label">{{ name }}</span>
            </div>
          </div>
        </div>

        <div class="shuowen-section">
          <h3>📜 说文解字</h3>
          <div class="shuowen-content">
            <div class="shuowen-original">
              <span class="label">原文：</span>
              <p>{{ selectedChar.shuowen }}</p>
            </div>
            <div class="shuowen-modern">
              <span class="label">现代释义：</span>
              <p>{{ selectedChar.modernMeaning }}</p>
            </div>
            <div class="shuowen-origin">
              <span class="label">字源：</span>
              <p>{{ selectedChar.origin }}</p>
            </div>
          </div>
        </div>

        <div class="evolution-section" v-if="selectedChar.evolution">
          <h3>📚 汉字演化过程</h3>
          <div class="evolution-timeline">
            <div class="evolution-stage" v-if="selectedChar.evolution.oracle">
              <div class="stage-name">甲骨文</div>
              <div class="stage-char">
                <img 
                  v-if="getImageUrl(selectedChar.evolution.oracle)" 
                  :src="getImageUrl(selectedChar.evolution.oracle)" 
                  :alt="getCharText(selectedChar.evolution.oracle)"
                  class="evolution-image"
                  @error="showTextFallback($event, selectedChar.evolution.oracle)"
                />
                <span v-else>{{ getCharText(selectedChar.evolution.oracle) }}</span>
              </div>
              <div class="stage-period">商代</div>
            </div>
            <div class="evolution-arrow">→</div>
            <div class="evolution-stage" v-if="selectedChar.evolution.bronze">
              <div class="stage-name">金文</div>
              <div class="stage-char">
                <img 
                  v-if="getImageUrl(selectedChar.evolution.bronze)" 
                  :src="getImageUrl(selectedChar.evolution.bronze)" 
                  :alt="getCharText(selectedChar.evolution.bronze)"
                  class="evolution-image"
                  @error="showTextFallback($event, selectedChar.evolution.bronze)"
                />
                <span v-else>{{ getCharText(selectedChar.evolution.bronze) }}</span>
              </div>
              <div class="stage-period">西周</div>
            </div>
            <div class="evolution-arrow">→</div>
            <div class="evolution-stage" v-if="selectedChar.evolution.smallSeal">
              <div class="stage-name">小篆</div>
              <div class="stage-char">
                <img 
                  v-if="getImageUrl(selectedChar.evolution.smallSeal)" 
                  :src="getImageUrl(selectedChar.evolution.smallSeal)" 
                  :alt="getCharText(selectedChar.evolution.smallSeal)"
                  class="evolution-image"
                  @error="showTextFallback($event, selectedChar.evolution.smallSeal)"
                />
                <span v-else>{{ getCharText(selectedChar.evolution.smallSeal) }}</span>
              </div>
              <div class="stage-period">秦代</div>
            </div>
            <div class="evolution-arrow">→</div>
            <div class="evolution-stage" v-if="selectedChar.evolution.clerical">
              <div class="stage-name">隶书</div>
              <div class="stage-char">
                <img 
                  v-if="getImageUrl(selectedChar.evolution.clerical)" 
                  :src="getImageUrl(selectedChar.evolution.clerical)" 
                  :alt="getCharText(selectedChar.evolution.clerical)"
                  class="evolution-image"
                  @error="showTextFallback($event, selectedChar.evolution.clerical)"
                />
                <span v-else>{{ getCharText(selectedChar.evolution.clerical) }}</span>
              </div>
              <div class="stage-period">汉代</div>
            </div>
            <div class="evolution-arrow">→</div>
            <div class="evolution-stage" v-if="selectedChar.evolution.regular">
              <div class="stage-name">楷书</div>
              <div class="stage-char">
                <img 
                  v-if="getImageUrl(selectedChar.evolution.regular)" 
                  :src="getImageUrl(selectedChar.evolution.regular)" 
                  :alt="getCharText(selectedChar.evolution.regular)"
                  class="evolution-image"
                  @error="showTextFallback($event, selectedChar.evolution.regular)"
                />
                <span v-else>{{ getCharText(selectedChar.evolution.regular) }}</span>
              </div>
              <div class="stage-period">魏晋</div>
            </div>
            <div class="evolution-arrow" v-if="selectedChar.evolution.simplified && selectedChar.evolution.simplified !== selectedChar.evolution.regular">→</div>
            <div class="evolution-stage" v-if="selectedChar.evolution.simplified && selectedChar.evolution.simplified !== selectedChar.evolution.regular">
              <div class="stage-name">简化字</div>
              <div class="stage-char">
                <span>{{ getCharText(selectedChar.evolution.simplified) }}</span>
              </div>
              <div class="stage-period">现代</div>
            </div>
          </div>
        </div>

        <div class="meaning-animation-section">
          <h3>🎨 汉字演变动画</h3>
          <div class="animation-container">
            <svg ref="animationSvg" class="meaning-svg" viewBox="0 0 200 200">
              <g v-if="selectedChar.animation === 'sun'">
                <circle cx="100" cy="100" r="40" fill="#FFD700" class="sun-center"/>
                <g v-for="i in 8" :key="i" class="sun-ray" :style="{ transform: `rotate(${(i-1) * 45}deg)`, transformOrigin: '100px 100px' }">
                  <line x1="145" y1="100" x2="170" y2="100" stroke="#FFD700" stroke-width="4" stroke-linecap="round"/>
                </g>
              </g>
              <g v-else-if="selectedChar.animation === 'moon'">
                <path d="M 100 60 Q 130 60 130 100 Q 130 140 100 140 Q 120 140 120 100 Q 120 60 100 60" fill="#F0E68C" class="moon-shape"/>
              </g>
              <g v-else-if="selectedChar.animation === 'water'">
                <path d="M 60 80 Q 80 60 100 80 T 140 80" fill="none" stroke="#4FC3F7" stroke-width="4" class="water-wave"/>
                <path d="M 60 110 Q 80 90 100 110 T 140 110" fill="none" stroke="#4FC3F7" stroke-width="4" class="water-wave"/>
                <path d="M 60 140 Q 80 120 100 140 T 140 140" fill="none" stroke="#4FC3F7" stroke-width="4" class="water-wave"/>
              </g>
              <g v-else-if="selectedChar.animation === 'fire'">
                <ellipse cx="100" cy="120" rx="20" ry="30" fill="#FF5722" class="fire-base"/>
                <ellipse cx="100" cy="100" rx="15" ry="25" fill="#FF9800" class="fire-middle"/>
                <ellipse cx="100" cy="85" rx="10" ry="20" fill="#FFC107" class="fire-top"/>
              </g>
              <g v-else-if="selectedChar.animation === 'person'">
                <circle cx="100" cy="70" r="15" fill="#795548" class="person-head"/>
                <line x1="100" y1="85" x2="100" y2="130" stroke="#795548" stroke-width="6" class="person-body"/>
                <line x1="100" y1="95" x2="70" y2="120" stroke="#795548" stroke-width="5" stroke-linecap="round" class="person-arm"/>
                <line x1="100" y1="95" x2="130" y2="120" stroke="#795548" stroke-width="5" stroke-linecap="round" class="person-arm"/>
                <line x1="100" y1="130" x2="80" y2="160" stroke="#795548" stroke-width="5" stroke-linecap="round" class="person-leg"/>
                <line x1="100" y1="130" x2="120" y2="160" stroke="#795548" stroke-width="5" stroke-linecap="round" class="person-leg"/>
              </g>
              <g v-else-if="selectedChar.animation === 'person-big'">
                <circle cx="100" cy="60" r="18" fill="#795548" class="person-head"/>
                <line x1="100" y1="78" x2="100" y2="130" stroke="#795548" stroke-width="7" class="person-body"/>
                <line x1="100" y1="90" x2="50" y2="110" stroke="#795548" stroke-width="6" stroke-linecap="round" class="person-arm"/>
                <line x1="100" y1="90" x2="150" y2="110" stroke="#795548" stroke-width="6" stroke-linecap="round" class="person-arm"/>
                <line x1="100" y1="130" x2="70" y2="170" stroke="#795548" stroke-width="6" stroke-linecap="round" class="person-leg"/>
                <line x1="100" y1="130" x2="130" y2="170" stroke="#795548" stroke-width="6" stroke-linecap="round" class="person-leg"/>
              </g>
              <g v-else-if="selectedChar.animation === 'line'">
                <rect x="50" y="90" width="100" height="20" rx="10" fill="#667eea" class="line-bar"/>
              </g>
              <g v-else-if="selectedChar.animation === 'lines'">
                <rect x="60" y="70" width="80" height="15" rx="7" fill="#667eea" class="line-bar"/>
                <rect x="60" y="115" width="80" height="15" rx="7" fill="#667eea" class="line-bar"/>
              </g>
              <g v-else-if="selectedChar.animation === 'dots'">
                <circle cx="80" cy="90" r="12" fill="#667eea" class="dot"/>
                <circle cx="120" cy="90" r="12" fill="#667eea" class="dot"/>
                <circle cx="100" cy="130" r="12" fill="#667eea" class="dot"/>
              </g>
              <!-- Mountain animation -->
              <g v-else-if="selectedChar.animation === 'mountain'">
                <path d="M 40 140 L 70 60 L 100 140 L 130 70 L 160 140" fill="#8B4513" stroke="#654321" stroke-width="2"/>
              </g>
              
              <!-- Tree animation -->
              <g v-else-if="selectedChar.animation === 'tree'">
                <rect x="90" y="100" width="20" height="60" fill="#8B4513"/>
                <circle cx="100" cy="80" r="35" fill="#228B22"/>
              </g>
              
              <!-- Ground animation -->
              <g v-else-if="selectedChar.animation === 'ground'">
                <rect x="40" y="120" width="120" height="40" fill="#8B4513"/>
                <path d="M 40 120 Q 70 110 100 120 T 160 120" fill="#228B22"/>
              </g>
              
              <!-- Sky animation -->
              <g v-else-if="selectedChar.animation === 'sky'">
                <circle cx="100" cy="100" r="60" fill="#87CEEB"/>
                <ellipse cx="70" cy="80" rx="20" ry="10" fill="white"/>
                <ellipse cx="130" cy="70" rx="25" ry="12" fill="white"/>
              </g>
              
              <!-- Cloud animation -->
              <g v-else-if="selectedChar.animation === 'cloud'">
                <ellipse cx="80" cy="90" rx="25" ry="15" fill="#E0E0E0"/>
                <ellipse cx="110" cy="85" rx="30" ry="18" fill="#F5F5F5"/>
                <ellipse cx="140" cy="90" rx="25" ry="15" fill="#E0E0E0"/>
              </g>
              
              <!-- Rain animation -->
              <g v-else-if="selectedChar.animation === 'rain'">
                <ellipse cx="100" cy="70" rx="40" ry="20" fill="#B0BEC5"/>
                <line x1="70" y1="90" x2="60" y2="130" stroke="#4FC3F7" stroke-width="2"/>
                <line x1="90" y1="90" x2="80" y2="130" stroke="#4FC3F7" stroke-width="2"/>
                <line x1="110" y1="90" x2="100" y2="130" stroke="#4FC3F7" stroke-width="2"/>
                <line x1="130" y1="90" x2="120" y2="130" stroke="#4FC3F7" stroke-width="2"/>
              </g>
              
              <!-- Wind animation -->
              <g v-else-if="selectedChar.animation === 'wind'">
                <path d="M 40 80 Q 70 70 100 80 T 160 80" fill="none" stroke="#90CAF9" stroke-width="3"/>
                <path d="M 50 110 Q 80 100 110 110 T 150 110" fill="none" stroke="#90CAF9" stroke-width="3"/>
              </g>
              
              <!-- Lightning animation -->
              <g v-else-if="selectedChar.animation === 'lightning'">
                <polygon points="100,40 85,90 95,90 80,150 115,100 105,100" fill="#FFEB3B"/>
              </g>
              
              <!-- Heart animation -->
              <g v-else-if="selectedChar.animation === 'heart'">
                <path d="M 100 130 C 60 100 60 60 100 60 C 140 60 140 100 100 130" fill="#E91E63"/>
              </g>
              
              <!-- Mouth animation -->
              <g v-else-if="selectedChar.animation === 'mouth'">
                <ellipse cx="100" cy="100" rx="30" ry="20" fill="#FFCDD2"/>
              </g>
              
              <!-- Eye animation -->
              <g v-else-if="selectedChar.animation === 'eye'">
                <ellipse cx="100" cy="100" rx="35" ry="25" fill="white" stroke="#333" stroke-width="2"/>
                <circle cx="100" cy="100" r="12" fill="#2196F3"/>
                <circle cx="100" cy="100" r="6" fill="black"/>
              </g>
              
              <!-- Hand animation -->
              <g v-else-if="selectedChar.animation === 'hand'">
                <circle cx="100" cy="110" r="25" fill="#FFCCBC"/>
                <ellipse cx="100" cy="85" rx="8" ry="20" fill="#FFCCBC"/>
                <ellipse cx="115" cy="85" rx="8" ry="20" fill="#FFCCBC"/>
                <ellipse cx="85" cy="85" rx="8" ry="20" fill="#FFCCBC"/>
              </g>
              
              <!-- Foot animation -->
              <g v-else-if="selectedChar.animation === 'foot'">
                <ellipse cx="100" cy="110" rx="35" ry="20" fill="#FFCCBC"/>
                <circle cx="70" cy="100" r="10" fill="#FFCCBC"/>
                <circle cx="130" cy="100" r="10" fill="#FFCCBC"/>
              </g>
              
              <!-- Knife animation -->
              <g v-else-if="selectedChar.animation === 'knife'">
                <path d="M 70 100 L 130 100 L 120 80 Z" fill="#9E9E9E"/>
                <rect x="60" y="95" width="20" height="10" fill="#8B4513"/>
              </g>
              
              <!-- Strength animation -->
              <g v-else-if="selectedChar.animation === 'strength'">
                <rect x="70" y="90" width="60" height="15" fill="#FFCCBC"/>
                <circle cx="60" cy="97" r="12" fill="#FFCCBC"/>
                <circle cx="140" cy="97" r="12" fill="#FFCCBC"/>
              </g>
              
              <!-- Flower animation -->
              <g v-else-if="selectedChar.animation === 'flower'">
                <circle cx="100" cy="90" r="15" fill="#FF69B4"/>
                <circle cx="100" cy="70" r="12" fill="#FFB6C1"/>
                <circle cx="100" cy="110" r="12" fill="#FFB6C1"/>
                <circle cx="80" cy="90" r="12" fill="#FFB6C1"/>
                <circle cx="120" cy="90" r="12" fill="#FFB6C1"/>
              </g>
              
              <!-- Grass animation -->
              <g v-else-if="selectedChar.animation === 'grass'">
                <path d="M 60 130 Q 70 100 80 130" fill="none" stroke="#228B22" stroke-width="3"/>
                <path d="M 90 130 Q 100 90 110 130" fill="none" stroke="#228B22" stroke-width="3"/>
                <path d="M 120 130 Q 130 100 140 130" fill="none" stroke="#228B22" stroke-width="3"/>
              </g>
              
              <!-- Leaf animation -->
              <g v-else-if="selectedChar.animation === 'leaf'">
                <ellipse cx="100" cy="100" rx="30" ry="15" fill="#228B22" transform="rotate(-45 100 100)"/>
                <line x1="80" y1="120" x2="120" y2="80" stroke="#228B22" stroke-width="2"/>
              </g>
              
              <!-- Fruit animation -->
              <g v-else-if="selectedChar.animation === 'fruit'">
                <circle cx="100" cy="110" r="30" fill="#FF6347"/>
                <path d="M 100 80 L 100 60" stroke="#8B4513" stroke-width="3"/>
                <ellipse cx="110" cy="55" rx="10" ry="5" fill="#228B22"/>
              </g>
              
              <!-- Rice animation -->
              <g v-else-if="selectedChar.animation === 'rice'">
                <ellipse cx="80" cy="110" rx="15" ry="10" fill="#F5DEB3"/>
                <ellipse cx="100" cy="100" rx="15" ry="10" fill="#FFE4B5"/>
                <ellipse cx="120" cy="110" rx="15" ry="10" fill="#F5DEB3"/>
              </g>
              
              <!-- Grain animation -->
              <g v-else-if="selectedChar.animation === 'grain'">
                <line x1="100" y1="140" x2="100" y2="70" stroke="#228B22" stroke-width="2"/>
                <ellipse cx="100" cy="60" rx="12" ry="8" fill="#FFD700"/>
                <ellipse cx="85" cy="80" rx="10" ry="6" fill="#FFD700"/>
                <ellipse cx="115" cy="80" rx="10" ry="6" fill="#FFD700"/>
              </g>
              
              <!-- Metal animation -->
              <g v-else-if="selectedChar.animation === 'metal'">
                <rect x="70" y="90" width="60" height="30" fill="#C0C0C0" rx="5"/>
                <circle cx="100" cy="105" r="10" fill="#E8E8E8"/>
              </g>
              
              <!-- Car animation -->
              <g v-else-if="selectedChar.animation === 'car'">
                <rect x="60" y="90" width="80" height="30" fill="#2196F3" rx="5"/>
                <circle cx="75" cy="120" r="10" fill="#333"/>
                <circle cx="125" cy="120" r="10" fill="#333"/>
              </g>
              
              <!-- Home animation -->
              <g v-else-if="selectedChar.animation === 'home'">
                <polygon points="100,50 50,90 150,90" fill="#8B4513"/>
                <rect x="60" y="90" width="80" height="50" fill="#DEB887"/>
                <rect x="90" y="110" width="20" height="30" fill="#654321"/>
              </g>
              
              <!-- Snow animation -->
              <g v-else-if="selectedChar.animation === 'snow'">
                <circle cx="70" cy="80" r="8" fill="white"/>
                <circle cx="100" cy="70" r="8" fill="white"/>
                <circle cx="130" cy="80" r="8" fill="white"/>
                <circle cx="85" cy="110" r="8" fill="white"/>
                <circle cx="115" cy="110" r="8" fill="white"/>
              </g>
              
              <!-- Star animation -->
              <g v-else-if="selectedChar.animation === 'star'">
                <polygon points="100,50 110,85 145,85 117,105 128,140 100,120 72,140 83,105 55,85 90,85" fill="#FFD700"/>
              </g>
              
              <!-- Ocean animation -->
              <g v-else-if="selectedChar.animation === 'ocean'">
                <ellipse cx="100" cy="110" rx="70" ry="30" fill="#1E90FF"/>
                <path d="M 40 100 Q 70 90 100 100 T 160 100" fill="none" stroke="#4FC3F7" stroke-width="2"/>
              </g>
              
              <!-- River animation -->
              <g v-else-if="selectedChar.animation === 'river'">
                <path d="M 40 100 Q 70 90 100 100 T 160 100" fill="none" stroke="#1E90FF" stroke-width="20"/>
              </g>
              
              <!-- Horse animation -->
              <g v-else-if="selectedChar.animation === 'horse'">
                <circle cx="90" cy="90" r="20" fill="#8B4513"/>
                <rect x="110" y="85" width="40" height="25" fill="#8B4513"/>
                <line x1="90" y1="110" x2="80" y2="140" stroke="#8B4513" stroke-width="5"/>
                <line x1="110" y1="110" x2="120" y2="140" stroke="#8B4513" stroke-width="5"/>
              </g>
              
              <!-- Cow animation -->
              <g v-else-if="selectedChar.animation === 'cow'">
                <ellipse cx="100" cy="100" rx="40" ry="30" fill="#333"/>
                <circle cx="70" cy="85" r="12" fill="#333"/>
                <circle cx="130" cy="85" r="12" fill="#333"/>
              </g>
              
              <!-- Sheep animation -->
              <g v-else-if="selectedChar.animation === 'sheep'">
                <ellipse cx="100" cy="100" rx="35" ry="25" fill="white"/>
                <circle cx="100" cy="80" r="18" fill="white"/>
              </g>
              
              <!-- Bird animation -->
              <g v-else-if="selectedChar.animation === 'bird'">
                <ellipse cx="100" cy="100" rx="25" ry="18" fill="#4FC3F7"/>
                <circle cx="130" cy="95" r="8" fill="#4FC3F7"/>
                <polygon points="138,95 150,90 150,100" fill="#FF6347"/>
              </g>
              
              <!-- Fish animation -->
              <g v-else-if="selectedChar.animation === 'fish'">
                <ellipse cx="90" cy="100" rx="30" ry="20" fill="#FF6347"/>
                <polygon points="120,100 140,85 140,115" fill="#FF6347"/>
                <circle cx="80" cy="95" r="5" fill="white"/>
              </g>
              
              <!-- Insect animation -->
              <g v-else-if="selectedChar.animation === 'insect'">
                <ellipse cx="100" cy="100" rx="20" ry="12" fill="#228B22"/>
                <line x1="80" y1="100" x2="60" y2="90" stroke="#228B22" stroke-width="2"/>
                <line x1="80" y1="100" x2="60" y2="110" stroke="#228B22" stroke-width="2"/>
                <line x1="120" y1="100" x2="140" y2="90" stroke="#228B22" stroke-width="2"/>
                <line x1="120" y1="100" x2="140" y2="110" stroke="#228B22" stroke-width="2"/>
              </g>
              
              <!-- Chicken animation -->
              <g v-else-if="selectedChar.animation === 'chicken'">
                <circle cx="100" cy="95" r="20" fill="#FFD700"/>
                <polygon points="120,95 135,90 135,100" fill="#FF6347"/>
                <circle cx="105" cy="90" r="4" fill="black"/>
              </g>
              
              <!-- Duck animation -->
              <g v-else-if="selectedChar.animation === 'duck'">
                <ellipse cx="100" cy="105" rx="30" ry="20" fill="#FFD700"/>
                <circle cx="135" cy="95" r="15" fill="#FFD700"/>
                <polygon points="150,95 165,90 165,100" fill="#FF6347"/>
              </g>
              
              <!-- Goose animation -->
              <g v-else-if="selectedChar.animation === 'goose'">
                <ellipse cx="100" cy="110" rx="25" ry="18" fill="white"/>
                <path d="M 125 110 L 135 80 L 145 85" fill="white" stroke="#FF6347" stroke-width="2"/>
              </g>
              
              <!-- Cat animation -->
              <g v-else-if="selectedChar.animation === 'cat'">
                <circle cx="100" cy="95" r="22" fill="#FFA500"/>
                <polygon points="85,75 90,55 100,75" fill="#FFA500"/>
                <polygon points="100,75 110,55 115,75" fill="#FFA500"/>
              </g>
              
              <!-- Dog animation -->
              <g v-else-if="selectedChar.animation === 'dog'">
                <circle cx="100" cy="95" r="22" fill="#8B4513"/>
                <ellipse cx="80" cy="85" rx="8" ry="15" fill="#8B4513"/>
                <ellipse cx="120" cy="85" rx="8" ry="15" fill="#8B4513"/>
              </g>
              
              <!-- Pig animation -->
              <g v-else-if="selectedChar.animation === 'pig'">
                <ellipse cx="100" cy="100" rx="35" ry="28" fill="#FFB6C1"/>
                <circle cx="100" cy="90" r="12" fill="#FF69B4"/>
                <circle cx="95" cy="88" r="3" fill="black"/>
                <circle cx="105" cy="88" r="3" fill="black"/>
              </g>
              
              <!-- Tiger animation -->
              <g v-else-if="selectedChar.animation === 'tiger'">
                <circle cx="100" cy="95" r="25" fill="#FFA500"/>
                <line x1="85" y1="80" x2="90" y2="90" stroke="black" stroke-width="2"/>
                <line x1="100" y1="75" x2="100" y2="90" stroke="black" stroke-width="2"/>
                <line x1="115" y1="80" x2="110" y2="90" stroke="black" stroke-width="2"/>
              </g>
              
              <!-- Rabbit animation -->
              <g v-else-if="selectedChar.animation === 'rabbit'">
                <circle cx="100" cy="100" r="20" fill="white"/>
                <ellipse cx="85" cy="75" rx="6" ry="20" fill="white"/>
                <ellipse cx="115" cy="75" rx="6" ry="20" fill="white"/>
              </g>
              
              <!-- Vehicle animation -->
              <g v-else-if="selectedChar.animation === 'vehicle'">
                <rect x="55" y="85" width="90" height="35" fill="#4CAF50" rx="5"/>
                <circle cx="75" cy="120" r="12" fill="#333"/>
                <circle cx="125" cy="120" r="12" fill="#333"/>
              </g>
              
              <!-- Door animation -->
              <g v-else-if="selectedChar.animation === 'door'">
                <rect x="70" y="60" width="60" height="80" fill="#8B4513"/>
                <circle cx="120" cy="100" r="4" fill="#FFD700"/>
              </g>
              
              <!-- Ear animation -->
              <g v-else-if="selectedChar.animation === 'ear'">
                <path d="M 80 70 Q 70 100 80 130 Q 100 140 110 130 Q 120 100 110 70 Q 100 60 80 70" fill="#FFCCBC"/>
              </g>
              
              <!-- Bow animation -->
              <g v-else-if="selectedChar.animation === 'bow'">
                <path d="M 70 60 Q 50 100 70 140" fill="none" stroke="#8B4513" stroke-width="4"/>
                <line x1="70" y1="60" x2="70" y2="140" stroke="#654321" stroke-width="2"/>
              </g>
              
              <!-- Arrow animation -->
              <g v-else-if="selectedChar.animation === 'arrow'">
                <line x1="60" y1="100" x2="140" y2="100" stroke="#333" stroke-width="3"/>
                <polygon points="140,100 130,95 130,105" fill="#333"/>
              </g>
              
              <!-- Clothes animation -->
              <g v-else-if="selectedChar.animation === 'clothes'">
                <path d="M 80 60 L 100 80 L 120 60 L 130 80 L 110 140 L 90 140 L 70 80 Z" fill="#2196F3"/>
              </g>
              
              <!-- Food animation -->
              <g v-else-if="selectedChar.animation === 'food'">
                <ellipse cx="100" cy="110" rx="40" ry="20" fill="#DEB887"/>
                <circle cx="85" cy="105" r="8" fill="#8B4513"/>
                <circle cx="100" cy="100" r="8" fill="#8B4513"/>
                <circle cx="115" cy="105" r="8" fill="#8B4513"/>
              </g>
              
              <!-- Shell animation -->
              <g v-else-if="selectedChar.animation === 'shell'">
                <path d="M 70 100 Q 80 70 100 70 Q 120 70 130 100 Q 120 130 100 130 Q 80 130 70 100" fill="#FFDAB9"/>
                <path d="M 80 100 Q 90 80 100 80 Q 110 80 120 100" fill="none" stroke="#DEB887" stroke-width="2"/>
              </g>
              
              <!-- King animation -->
              <g v-else-if="selectedChar.animation === 'king'">
                <polygon points="100,50 120,80 140,80 125,100 135,140 100,120 65,140 75,100 60,80 80,80" fill="#FFD700"/>
              </g>
              
              <!-- Jade animation -->
              <g v-else-if="selectedChar.animation === 'jade'">
                <rect x="70" y="80" width="60" height="50" fill="#00CED1" rx="10"/>
                <circle cx="100" cy="105" r="15" fill="#40E0D0"/>
              </g>
              
              <!-- Grow animation -->
              <g v-else-if="selectedChar.animation === 'grow'">
                <line x1="100" y1="140" x2="100" y2="60" stroke="#228B22" stroke-width="3"/>
                <ellipse cx="100" cy="50" rx="20" ry="12" fill="#228B22"/>
              </g>
              
              <!-- Exit animation -->
              <g v-else-if="selectedChar.animation === 'exit'">
                <rect x="60" y="70" width="80" height="70" fill="none" stroke="#333" stroke-width="3"/>
                <polygon points="110,105 130,105 120,95" fill="#FF6347"/>
                <line x1="90" y1="105" x2="115" y2="105" stroke="#FF6347" stroke-width="3"/>
              </g>
              
              <!-- Enter animation -->
              <g v-else-if="selectedChar.animation === 'enter'">
                <rect x="60" y="70" width="80" height="70" fill="none" stroke="#333" stroke-width="3"/>
                <polygon points="90,105 70,105 80,95" fill="#228B22"/>
                <line x1="110" y1="105" x2="85" y2="105" stroke="#228B22" stroke-width="3"/>
              </g>
              
              <!-- Open animation -->
              <g v-else-if="selectedChar.animation === 'open'">
                <rect x="60" y="70" width="35" height="70" fill="#8B4513"/>
                <rect x="105" y="70" width="35" height="70" fill="#8B4513"/>
              </g>
              
              <!-- Close animation -->
              <g v-else-if="selectedChar.animation === 'close'">
                <rect x="70" y="70" width="60" height="70" fill="#8B4513"/>
                <circle cx="120" cy="105" r="4" fill="#FFD700"/>
              </g>
              
              <!-- Sit animation -->
              <g v-else-if="selectedChar.animation === 'sit'">
                <circle cx="100" cy="90" r="15" fill="#795548"/>
                <path d="M 100 105 L 100 130 L 70 140" fill="none" stroke="#795548" stroke-width="5" stroke-linecap="round"/>
              </g>
              
              <!-- Stand animation -->
              <g v-else-if="selectedChar.animation === 'stand'">
                <circle cx="100" cy="70" r="15" fill="#795548"/>
                <line x1="100" y1="85" x2="100" y2="140" stroke="#795548" stroke-width="6"/>
              </g>
              
              <!-- Walk animation -->
              <g v-else-if="selectedChar.animation === 'walk'">
                <circle cx="100" cy="70" r="15" fill="#795548"/>
                <line x1="100" y1="85" x2="100" y2="120" stroke="#795548" stroke-width="5"/>
                <line x1="100" y1="120" x2="80" y2="140" stroke="#795548" stroke-width="4" stroke-linecap="round"/>
                <line x1="100" y1="120" x2="120" y2="140" stroke="#795548" stroke-width="4" stroke-linecap="round"/>
              </g>
              
              <!-- Run animation -->
              <g v-else-if="selectedChar.animation === 'run'">
                <circle cx="90" cy="65" r="15" fill="#795548"/>
                <line x1="90" y1="80" x2="100" y2="110" stroke="#795548" stroke-width="5"/>
                <line x1="100" y1="110" x2="120" y2="130" stroke="#795548" stroke-width="4" stroke-linecap="round"/>
                <line x1="100" y1="110" x2="80" y2="130" stroke="#795548" stroke-width="4" stroke-linecap="round"/>
              </g>
              
              <!-- Jump animation -->
              <g v-else-if="selectedChar.animation === 'jump'">
                <circle cx="100" cy="50" r="15" fill="#795548"/>
                <line x1="100" y1="65" x2="100" y2="95" stroke="#795548" stroke-width="5"/>
                <ellipse cx="100" cy="130" rx="30" ry="5" fill="#CCC"/>
              </g>
              
              <!-- Fly animation -->
              <g v-else-if="selectedChar.animation === 'fly'">
                <ellipse cx="100" cy="100" rx="25" ry="15" fill="#4FC3F7"/>
                <path d="M 80 95 Q 60 80 70 100" fill="white" stroke="#4FC3F7" stroke-width="2"/>
                <path d="M 120 95 Q 140 80 130 100" fill="white" stroke="#4FC3F7" stroke-width="2"/>
              </g>
              
              <!-- Tall animation -->
              <g v-else-if="selectedChar.animation === 'tall'">
                <rect x="85" y="50" width="30" height="90" fill="#8B4513"/>
              </g>
              
              <!-- Low animation -->
              <g v-else-if="selectedChar.animation === 'low'">
                <rect x="70" y="110" width="60" height="30" fill="#8B4513"/>
              </g>
              
              <!-- Long animation -->
              <g v-else-if="selectedChar.animation === 'long'">
                <rect x="50" y="95" width="100" height="15" fill="#667eea" rx="7"/>
              </g>
              
              <!-- Short animation -->
              <g v-else-if="selectedChar.animation === 'short'">
                <rect x="80" y="95" width="40" height="15" fill="#667eea" rx="7"/>
              </g>
              
              <!-- Many animation -->
              <g v-else-if="selectedChar.animation === 'many'">
                <circle cx="70" cy="90" r="10" fill="#667eea"/>
                <circle cx="100" cy="85" r="10" fill="#667eea"/>
                <circle cx="130" cy="90" r="10" fill="#667eea"/>
                <circle cx="85" cy="115" r="10" fill="#667eea"/>
                <circle cx="115" cy="115" r="10" fill="#667eea"/>
              </g>
              
              <!-- Few animation -->
              <g v-else-if="selectedChar.animation === 'few'">
                <circle cx="80" cy="100" r="10" fill="#667eea"/>
                <circle cx="120" cy="100" r="10" fill="#667eea"/>
              </g>
              
              <!-- White animation -->
              <g v-else-if="selectedChar.animation === 'white'">
                <circle cx="100" cy="100" r="40" fill="white" stroke="#DDD" stroke-width="2"/>
              </g>
              
              <!-- Black animation -->
              <g v-else-if="selectedChar.animation === 'black'">
                <circle cx="100" cy="100" r="40" fill="#333"/>
              </g>
              
              <!-- Red animation -->
              <g v-else-if="selectedChar.animation === 'red'">
                <circle cx="100" cy="100" r="40" fill="#E91E63"/>
              </g>
              
              <!-- Green animation -->
              <g v-else-if="selectedChar.animation === 'green'">
                <circle cx="100" cy="100" r="40" fill="#4CAF50"/>
              </g>
              
              <!-- Yellow animation -->
              <g v-else-if="selectedChar.animation === 'yellow'">
                <circle cx="100" cy="100" r="40" fill="#FFEB3B"/>
              </g>
              
              <!-- Blue animation -->
              <g v-else-if="selectedChar.animation === 'blue'">
                <circle cx="100" cy="100" r="40" fill="#2196F3"/>
              </g>
              
              <!-- Purple animation -->
              <g v-else-if="selectedChar.animation === 'purple'">
                <circle cx="100" cy="100" r="40" fill="#9C27B0"/>
              </g>
              
              <!-- Square animation -->
              <g v-else-if="selectedChar.animation === 'square'">
                <rect x="70" y="70" width="60" height="60" fill="#667eea"/>
              </g>
              
              <!-- Circle animation -->
              <g v-else-if="selectedChar.animation === 'circle'">
                <circle cx="100" cy="100" r="35" fill="#667eea"/>
              </g>
              
              <!-- Horn animation -->
              <g v-else-if="selectedChar.animation === 'horn'">
                <polygon points="70,120 100,60 130,120" fill="#FFD700"/>
              </g>
              
              <!-- Straight animation -->
              <g v-else-if="selectedChar.animation === 'straight'">
                <line x1="60" y1="100" x2="140" y2="100" stroke="#667eea" stroke-width="6" stroke-linecap="round"/>
              </g>
              
              <!-- Curve animation -->
              <g v-else-if="selectedChar.animation === 'curve'">
                <path d="M 60 120 Q 100 80 140 120" fill="none" stroke="#667eea" stroke-width="4"/>
              </g>
              
              <!-- Flat animation -->
              <g v-else-if="selectedChar.animation === 'flat'">
                <rect x="50" y="90" width="100" height="20" fill="#8B4513" rx="3"/>
              </g>
              
              <!-- Safe animation -->
              <g v-else-if="selectedChar.animation === 'safe'">
                <polygon points="100,50 140,80 140,120 100,150 60,120 60,80" fill="#4CAF50"/>
              </g>
              
              <!-- Complete animation -->
              <g v-else-if="selectedChar.animation === 'complete'">
                <circle cx="100" cy="100" r="40" fill="#4CAF50"/>
                <path d="M 80 100 L 95 115 L 120 85" fill="none" stroke="white" stroke-width="5" stroke-linecap="round"/>
              </g>
              
              <!-- Good animation -->
              <g v-else-if="selectedChar.animation === 'good'">
                <circle cx="100" cy="100" r="40" fill="#FFD700"/>
                <path d="M 80 110 Q 100 130 120 110" fill="none" stroke="#333" stroke-width="3" stroke-linecap="round"/>
              </g>
              
              <!-- Beautiful animation -->
              <g v-else-if="selectedChar.animation === 'beautiful'">
                <circle cx="100" cy="100" r="40" fill="#FFB6C1"/>
                <circle cx="85" cy="90" r="5" fill="#333"/>
                <circle cx="115" cy="90" r="5" fill="#333"/>
                <path d="M 85 115 Q 100 130 115 115" fill="none" stroke="#FF69B4" stroke-width="3"/>
              </g>
              
              <!-- Bright animation -->
              <g v-else-if="selectedChar.animation === 'bright'">
                <circle cx="100" cy="100" r="30" fill="#FFEB3B"/>
                <line x1="100" y1="60" x2="100" y2="50" stroke="#FFEB3B" stroke-width="3"/>
                <line x1="100" y1="140" x2="100" y2="150" stroke="#FFEB3B" stroke-width="3"/>
                <line x1="60" y1="100" x2="50" y2="100" stroke="#FFEB3B" stroke-width="3"/>
                <line x1="140" y1="100" x2="150" y2="100" stroke="#FFEB3B" stroke-width="3"/>
              </g>
              
              <!-- Light animation -->
              <g v-else-if="selectedChar.animation === 'light'">
                <circle cx="100" cy="100" r="35" fill="#FFF9C4"/>
                <circle cx="100" cy="100" r="25" fill="#FFEB3B"/>
              </g>
              
              <!-- Culture animation -->
              <g v-else-if="selectedChar.animation === 'culture'">
                <rect x="70" y="70" width="60" height="70" fill="#8B4513"/>
                <line x1="80" y1="90" x2="120" y2="90" stroke="#DEB887" stroke-width="2"/>
                <line x1="80" y1="110" x2="120" y2="110" stroke="#DEB887" stroke-width="2"/>
              </g>
              
              <!-- Character animation -->
              <g v-else-if="selectedChar.animation === 'character'">
                <rect x="65" y="75" width="70" height="60" fill="white" stroke="#333" stroke-width="2"/>
                <text x="100" y="115" text-anchor="middle" fill="#333" font-size="30">字</text>
              </g>
              
              <!-- Book animation -->
              <g v-else-if="selectedChar.animation === 'book'">
                <rect x="60" y="80" width="80" height="60" fill="#2196F3" rx="3"/>
                <line x1="100" y1="80" x2="100" y2="140" stroke="#1976D2" stroke-width="2"/>
              </g>
              
              <!-- Paint animation -->
              <g v-else-if="selectedChar.animation === 'paint'">
                <ellipse cx="100" cy="110" rx="40" ry="25" fill="#DEB887"/>
                <circle cx="80" cy="105" r="8" fill="#E91E63"/>
                <circle cx="100" cy="100" r="8" fill="#2196F3"/>
                <circle cx="120" cy="105" r="8" fill="#4CAF50"/>
              </g>
              
              <!-- Poem animation -->
              <g v-else-if="selectedChar.animation === 'poem'">
                <rect x="70" y="70" width="60" height="70" fill="#FFF8DC"/>
                <line x1="80" y1="90" x2="120" y2="90" stroke="#333" stroke-width="1"/>
                <line x1="80" y1="105" x2="120" y2="105" stroke="#333" stroke-width="1"/>
                <line x1="80" y1="120" x2="110" y2="120" stroke="#333" stroke-width="1"/>
              </g>
              
              <!-- Song animation -->
              <g v-else-if="selectedChar.animation === 'song'">
                <circle cx="90" cy="100" r="15" fill="#2196F3"/>
                <line x1="105" y1="90" x2="105" y2="130" stroke="#333" stroke-width="3"/>
                <ellipse cx="115" cy="130" rx="10" ry="8" fill="#333"/>
              </g>
              
              <!-- Happy animation -->
              <g v-else-if="selectedChar.animation === 'happy'">
                <circle cx="100" cy="100" r="40" fill="#FFEB3B"/>
                <circle cx="85" cy="90" r="5" fill="#333"/>
                <circle cx="115" cy="90" r="5" fill="#333"/>
                <path d="M 75 115 Q 100 140 125 115" fill="#FF6F00"/>
              </g>
              
              <!-- Learn animation -->
              <g v-else-if="selectedChar.animation === 'learn'">
                <rect x="65" y="75" width="70" height="60" fill="#4CAF50"/>
                <text x="100" y="115" text-anchor="middle" fill="white" font-size="24">学</text>
              </g>
              
              <!-- Practice animation -->
              <g v-else-if="selectedChar.animation === 'practice'">
                <circle cx="100" cy="100" r="35" fill="none" stroke="#2196F3" stroke-width="4"/>
                <path d="M 120 100 A 20 20 0 1 1 100 80" fill="none" stroke="#FF6347" stroke-width="3"/>
              </g>
              
              <!-- Old animation -->
              <g v-else-if="selectedChar.animation === 'old'">
                <circle cx="100" cy="90" r="20" fill="#D2B48C"/>
                <path d="M 85 110 Q 100 130 115 110" fill="none" stroke="#8B4513" stroke-width="2"/>
              </g>
              
              <!-- Teacher animation -->
              <g v-else-if="selectedChar.animation === 'teacher'">
                <circle cx="100" cy="75" r="18" fill="#795548"/>
                <rect x="75" y="95" width="50" height="45" fill="#2196F3"/>
              </g>
              
              <!-- Father animation -->
              <g v-else-if="selectedChar.animation === 'father'">
                <circle cx="100" cy="75" r="18" fill="#795548"/>
                <rect x="75" y="95" width="50" height="45" fill="#8B4513"/>
              </g>
              
              <!-- Mother animation -->
              <g v-else-if="selectedChar.animation === 'mother'">
                <circle cx="100" cy="75" r="18" fill="#795548"/>
                <path d="M 75 95 L 100 120 L 125 95 Z" fill="#E91E63"/>
              </g>
              
              <!-- Country animation -->
              <g v-else-if="selectedChar.animation === 'country'">
                <rect x="60" y="80" width="80" height="60" fill="#DEB887"/>
                <polygon points="100,60 80,80 120,80" fill="#FF6347"/>
              </g>
              
              <!-- Love animation -->
              <g v-else-if="selectedChar.animation === 'love'">
                <path d="M 100 130 C 60 100 60 60 100 60 C 140 60 140 100 100 130" fill="#E91E63"/>
              </g>
              
              <!-- Emotion animation -->
              <g v-else-if="selectedChar.animation === 'emotion'">
                <circle cx="100" cy="100" r="40" fill="#FFD700"/>
                <circle cx="85" cy="90" r="6" fill="#333"/>
                <circle cx="115" cy="90" r="6" fill="#333"/>
                <path d="M 80 120 Q 100 110 120 120" fill="none" stroke="#333" stroke-width="3"/>
              </g>
              
              <!-- Friend animation -->
              <g v-else-if="selectedChar.animation === 'friend'">
                <circle cx="85" cy="90" r="18" fill="#795548"/>
                <circle cx="115" cy="90" r="18" fill="#795548"/>
                <line x1="85" y1="108" x2="85" y2="140" stroke="#795548" stroke-width="5"/>
                <line x1="115" y1="108" x2="115" y2="140" stroke="#795548" stroke-width="5"/>
              </g>
              
              <!-- Spring animation -->
              <g v-else-if="selectedChar.animation === 'spring'">
                <circle cx="100" cy="90" r="15" fill="#FF69B4"/>
                <circle cx="100" cy="70" r="12" fill="#FFB6C1"/>
                <circle cx="100" cy="110" r="12" fill="#FFB6C1"/>
                <circle cx="80" cy="90" r="12" fill="#FFB6C1"/>
                <circle cx="120" cy="90" r="12" fill="#FFB6C1"/>
                <line x1="100" y1="105" x2="100" y2="140" stroke="#228B22" stroke-width="3"/>
              </g>
              
              <!-- Summer animation -->
              <g v-else-if="selectedChar.animation === 'summer'">
                <circle cx="100" cy="100" r="35" fill="#FF6347"/>
                <line x1="100" y1="55" x2="100" y2="45" stroke="#FF6347" stroke-width="3"/>
                <line x1="100" y1="145" x2="100" y2="155" stroke="#FF6347" stroke-width="3"/>
                <line x1="55" y1="100" x2="45" y2="100" stroke="#FF6347" stroke-width="3"/>
                <line x1="145" y1="100" x2="155" y2="100" stroke="#FF6347" stroke-width="3"/>
              </g>
              
              <!-- Autumn animation -->
              <g v-else-if="selectedChar.animation === 'autumn'">
                <ellipse cx="100" cy="100" rx="30" ry="20" fill="#FF8C00"/>
                <line x1="100" y1="80" x2="100" y2="60" stroke="#8B4513" stroke-width="2"/>
              </g>
              
              <!-- Winter animation -->
              <g v-else-if="selectedChar.animation === 'winter'">
                <circle cx="70" cy="80" r="10" fill="white"/>
                <circle cx="100" cy="70" r="10" fill="white"/>
                <circle cx="130" cy="80" r="10" fill="white"/>
                <circle cx="85" cy="110" r="10" fill="white"/>
                <circle cx="115" cy="110" r="10" fill="white"/>
              </g>
              
              <!-- Default placeholder -->
              <g v-else class="placeholder-text">
                <text x="100" y="100" text-anchor="middle" fill="#999" font-size="14">{{ selectedChar.char }}</text>
              </g>
            </svg>
          </div>
          <div class="animation-desc">
            <p>{{ getAnimationDescription() }}</p>
          </div>
        </div>

        <div class="example-section">
          <h3>📖 例词</h3>
          <div class="examples">
            <span class="example-tag">{{ selectedChar.example }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { chineseCharacters, type DifficultyLevel, type ChineseChar } from './chineseChars'
import { getCharEvolution, getDefaultEvolution } from './charEvolutionData'
import HanziWriter from 'hanzi-writer'

const router = useRouter()
const selectedGrade = ref<DifficultyLevel | null>(null)
const selectedChar = ref<ChineseChar | null>(null)
const hanziWriterContainer = ref<HTMLElement | null>(null)
const currentStroke = ref(-1)
const isAnimating = ref(false)
const strokeNames = ref<string[]>([])

let hanziWriterInstance: any = null

const getGradeEmoji = (gradeId: number): string => {
  const emojis = ['一', '二', '三', '四', '五', '六']
  return emojis[gradeId - 1] || '📚'
}

const goBack = () => {
  router.back()
}

const selectGrade = (grade: DifficultyLevel) => {
  selectedGrade.value = grade
  selectedChar.value = null
}

const selectChar = (char: ChineseChar) => {
  // 添加演化数据
  const evolution = getCharEvolution(char.char) || getDefaultEvolution(char.char)
  selectedChar.value = { ...char, evolution }
  currentStroke.value = -1
  setTimeout(() => {
    initHanziWriter()
  }, 100)
}

// 获取图片 URL（如果演化数据是对象格式）
const getImageUrl = (data: any): string | undefined => {
  if (typeof data === 'object' && data !== null && data.image) {
    return data.image
  }
  return undefined
}

// 获取字符文本
const getCharText = (data: any): string => {
  if (typeof data === 'object' && data !== null) {
    return data.text || ''
  }
  return String(data || '')
}

// 图片加载失败时显示文字
const showTextFallback = (event: Event, data: any) => {
  const img = event.target as HTMLImageElement
  const parent = img.parentElement
  if (parent) {
    img.style.display = 'none'
    const span = document.createElement('span')
    span.textContent = getCharText(data)
    parent.appendChild(span)
  }
}

const initHanziWriter = () => {
  if (!hanziWriterContainer.value || !selectedChar.value) return

  hanziWriterContainer.value.innerHTML = ''

  const char = selectedChar.value.char

  hanziWriterInstance = HanziWriter.create(hanziWriterContainer.value, char, {
    width: 200,
    height: 200,
    padding: 5,
    showOutline: true,
    strokeAnimationSpeed: 1,
    delayBetweenStrokes: 200,
    radicalColor: '#4CAF50',
    strokeColor: '#2196F3'
  })

  hanziWriterInstance.getCharacterData().then((data: any) => {
    strokeNames.value = data.strokes.map((s: any) => s.name) || []
  }).catch(() => {
    strokeNames.value = Array(selectedChar.value?.strokeCount || 0).fill('')
  })
}

const startAnimation = () => {
  if (!hanziWriterInstance) return
  isAnimating.value = true
  currentStroke.value = -1
  hanziWriterInstance.animateCharacter({
    onComplete: () => {
      isAnimating.value = false
      currentStroke.value = strokeNames.value.length - 1
    },
    onStrokeStart: (index: number) => {
      currentStroke.value = index
    }
  })
}

const resetAnimation = () => {
  currentStroke.value = -1
  isAnimating.value = false
  if (hanziWriterContainer.value && selectedChar.value) {
    hanziWriterContainer.value.innerHTML = ''
    initHanziWriter()
  }
}

const playToStroke = (index: number) => {
  if (!hanziWriterInstance) return
  isAnimating.value = true
  currentStroke.value = index

  hanziWriterInstance.animateStroke(index, {
    onComplete: () => {
      isAnimating.value = false
      currentStroke.value = strokeNames.value.length - 1
    }
  })
}

const getAnimationDescription = (): string => {
  if (!selectedChar.value) return ''
  const animations: Record<string, string> = {
    'sun': '☀️ 太阳像一个圆圆的火球，发出金色的光芒',
    'moon': '🌙 月亮弯弯的，像小船挂在天空',
    'water': '💧 水像波浪一样流动，弯弯曲曲',
    'fire': '🔥 火焰向上燃烧，越烧越旺',
    'person': '🚶 人站着，有头、身体、手臂和腿',
    'person-big': '💪 大人张开双臂，顶天立地',
    'line': '➖ 一横代表数字一，简单而重要',
    'lines': '〓 两横代表数字二，天地相配',
    'dots': '⚫ 小点代表微小的事物',
    'mountain': '⛰️ 山像三座山峰并立，高耸入云',
    'tree': '🌳 树木有树干和树枝，向下生根',
    'ground': '🟫 土地生长万物，孕育生命',
    'sky': '🌌 天空在头顶上方，广阔无边',
    'up': '⬆️ 向上指，表示位置在高处',
    'down': '⬇️ 向下指，表示位置在低处',
    'center': '🎯 中间表示位置在中央',
    'mouth': '👄 嘴巴像张开的口，用来说话吃饭',
    'eye': '👁️ 眼睛像窗口，用来看东西',
    'hand': '✋ 手掌有五根手指，用来抓握',
    'foot': '🦶 脚用来走路，支撑身体',
    'field': '🟩 农田被分成小块，种植庄稼',
    'stone': '🪨 石头在山崖下，坚硬无比',
    'metal': '✨ 金属闪闪发光，珍贵无比',
    'cloud': '☁️ 云朵在天空飘动，变化多端',
    'rain': '🌧️ 雨水从天空落下，滋润大地',
    'wind': '💨 风吹过，空气流动',
    'lightning': '⚡ 闪电划破天空，光芒四射',
    'vehicle': '🚗 车子有轮子，可以行驶',
    'door': '🚪 门像两扇门，可以开关',
    'ear': '👂 耳朵用来听声音',
    'heart': '❤️ 心脏在身体中间，跳动不止',
    'strength': '💪 手臂用力，展现力量',
    'knife': '🔪 刀用来切割东西',
    'bow': '🏹 弓用来射箭',
    'arrow': '➡️ 箭像飞镖，快速射出',
    'clothes': '👕 衣服穿在身上，保暖美观',
    'food': '🍚 食物供养生命',
    'horse': '🐴 马奔跑如飞，四蹄生风',
    'cow': '🐮 牛勤劳耕田，无私奉献',
    'sheep': '🐑 羊温顺可爱，毛茸茸',
    'bird': '🐦 鸟儿在天空飞翔',
    'fish': '🐟 鱼在水中游来游去',
    'insect': '🐛 昆虫虽小，种类繁多',
    'bamboo': '🎋 竹子节节高升，坚韧不拔',
    'grain': '🌾 禾苗茁壮成长，结出果实',
    'rice': '🍚 米粒饱满，养育人民',
    'shell': '🐚 贝壳美丽，曾是货币',
    'king': '👑 王像斧钺，象征权力',
    'jade': '💎 玉石温润，珍贵美丽',
    'grow': '🌱 草木生长，充满生机',
    'exit': '🚶 走出去，迈向新世界',
    'enter': '🚪 进入来，探索未知',
    'open': '🔓 打开门，迎接光明',
    'close': '🔒 关上门，保护安全',
    'sit': '🧘 坐下休息，放松身心',
    'stand': '🧍 站立挺拔，顶天立地',
    'walk': '🚶 行走四方，探索世界',
    'run': '🏃 奔跑如飞，追逐梦想',
    'jump': '🦘 跳跃向前，充满活力',
    'fly': '🕊️ 飞翔天空，自由自在',
    'tall': '🏔️ 高大雄伟，令人敬仰',
    'low': '📉 低处谦逊，蓄势待发',
    'long': '📏 长久永恒，绵延不绝',
    'short': '⚡ 短暂珍贵，把握当下',
    'many': '📚 众多丰富，应有尽有',
    'few': '🔍 稀少珍贵，值得珍惜',
    'white': '⚪ 白色纯洁，如雪如霜',
    'black': '⚫ 黑色深沉，如夜如墨',
    'red': '🔴 红色热烈，如火如血',
    'green': '🟢 绿色生机，如草如叶',
    'yellow': '🟡 黄色明亮，如金如阳',
    'blue': '🔵 蓝色宁静，如天如海',
    'purple': '🟣 紫色高贵，如霞如晶',
    'square': '⬜ 方正规矩，如地如矩',
    'circle': '⭕ 圆满完整，如月如轮',
    'horn': '🦄 角尖锐有力，如矛如剑',
    'straight': '➖ 正直不阿，如尺如绳',
    'curve': '〰️ 弯曲柔和，如波如浪',
    'flat': '📏 平坦宽阔，如地如镜',
    'safe': '🏠 安全温暖，如家如港',
    'complete': '✅ 完整无缺，如圆如满',
    'good': '👍 美好善良，如心如愿',
    'beautiful': '🌸 美丽动人，如花如画',
    'bright': '💡 明亮耀眼，如日如灯',
    'light': '☀️ 光明温暖，如阳如火',
    'culture': '📖 文化传承，如文如字',
    'character': '🔤 文字记录，如书如典',
    'book': '📚 书本知识，如师如友',
    'paint': '🎨 绘画艺术，如美如真',
    'poem': '📝 诗歌抒情，如韵如律',
    'song': '🎵 歌曲悦耳，如音如乐',
    'happy': '😊 快乐幸福，如笑如欢',
    'learn': '📖 学习进步，如勤如奋',
    'practice': '🔄 练习熟练，如复如习',
    'old': '👴 老年智慧，如经如验',
    'teacher': '👨‍🏫 师长教导，如灯如塔',
    'father': '👨 父亲慈爱，如山如柱',
    'mother': '👩 母亲温柔，如水如光',
    'home': '🏠 家庭温暖，如港如湾',
    'country': '🇨🇳 国家强大，如城如墙',
    'love': '❤️ 爱心无限，如情如感',
    'emotion': '💖 情感丰富，如喜如怒',
    'friend': '🤝 友情珍贵，如金如玉',
    'spring': '🌸 春天生机，如花如草',
    'summer': '☀️ 夏天热情，如阳如火',
    'autumn': '🍂 秋天收获，如果如粮',
    'winter': '❄️ 冬天宁静，如雪如冰'
  }
  return animations[selectedChar.value.animation || ''] || selectedChar.value.origin
}

watch(selectedChar, (newChar) => {
  if (newChar) {
    setTimeout(() => {
      initHanziWriter()
    }, 50)
  }
})

onUnmounted(() => {
  if (hanziWriterInstance) {
    hanziWriterInstance = null
  }
})
</script>

<style scoped>
.chinese-char-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 {
  color: white;
  font-size: 28px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  margin: 0;
}

.back-btn {
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.back-btn:hover {
  background: rgba(255,255,255,0.3);
}

.grade-selection h2,
.char-header h2 {
  color: white;
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
}

.grade-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.grade-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.grade-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.3);
}

.grade-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.grade-name {
  font-size: 22px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.grade-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.grade-count {
  font-size: 12px;
  color: #999;
}

.char-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.char-header h2 {
  margin: 0;
}

.char-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 15px;
  max-width: 600px;
  margin: 0 auto;
}

.char-card {
  background: white;
  border-radius: 15px;
  padding: 20px 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.char-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);
}

.char-main {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.char-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.char-pinyin {
  font-size: 12px;
  color: #666;
}

.char-strokes {
  font-size: 11px;
  color: #999;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.detail-header h2 {
  color: white;
  margin: 0;
}

.detail-content {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.char-display {
  text-align: center;
  margin-bottom: 30px;
}

.char-huge {
  font-size: 120px;
  font-weight: bold;
  color: #333;
  line-height: 1;
  margin-bottom: 15px;
}

.char-meta {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.meta-pinyin {
  font-size: 24px;
  color: #666;
}

.meta-radical,
.meta-strokes {
  font-size: 16px;
  color: #999;
}

.stroke-animation {
  margin-bottom: 30px;
}

.hanzi-writer-section h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
}

.hanzi-writer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f9f9f9;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 15px;
}

.stroke-progress {
  font-size: 14px;
  color: #666;
}

.stroke-name {
  font-size: 18px;
  color: #333;
  font-weight: bold;
}

.stroke-controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 15px;
}

.stroke-controls button {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.stroke-controls button:hover:not(:disabled) {
  background: #5a6fd6;
}

.stroke-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.stroke-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.stroke-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  background: #f0f0f0;
}

.stroke-item:hover {
  background: #e0e0e0;
}

.stroke-item.active {
  background: #667eea;
  color: white;
}

.stroke-item.completed {
  background: #4caf50;
  color: white;
}

.stroke-num {
  font-size: 14px;
  font-weight: bold;
}

.stroke-label {
  font-size: 14px;
}

.shuowen-section {
  margin-bottom: 30px;
}

.shuowen-section h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
}

.shuowen-content {
  background: #f9f9f9;
  border-radius: 15px;
  padding: 20px;
}

.shuowen-original,
.shuowen-modern,
.shuowen-origin {
  margin-bottom: 15px;
}

.shuowen-original:last-child,
.shuowen-modern:last-child,
.shuowen-origin:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: bold;
  color: #667eea;
  font-size: 14px;
}

.shuowen-content p {
  margin: 8px 0 0 0;
  color: #333;
  line-height: 1.6;
}

.evolution-section {
  margin-bottom: 30px;
}

.evolution-section h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
}

.evolution-timeline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.evolution-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 15px;
  min-width: 80px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s;
}

.evolution-stage:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.stage-name {
  font-size: 12px;
  color: #667eea;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
}

.stage-char {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  font-family: 'KaiTi', 'STKaiti', serif;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
}

.evolution-image {
  max-width: 50px;
  max-height: 50px;
  object-fit: contain;
}

.stage-period {
  font-size: 10px;
  color: #999;
  text-align: center;
}

.evolution-arrow {
  font-size: 24px;
  color: #667eea;
  font-weight: bold;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.hanzi-writer-section {
  margin-bottom: 30px;
}

.hanzi-writer-section h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
}

.hanzi-writer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f9f9f9;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 15px;
}

.hanzi-writer-controls button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.hanzi-writer-controls button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.meaning-animation-section {
  margin-bottom: 30px;
}

.meaning-animation-section h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
}

.animation-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 15px;
  min-height: 250px;
}

.meaning-svg {
  width: 200px;
  height: 200px;
}

.animation-desc {
  background: #f9f9f9;
  border-radius: 15px;
  padding: 15px 20px;
}

.animation-desc p {
  margin: 0;
  color: #555;
  font-size: 15px;
  line-height: 1.6;
  text-align: center;
}

.sun-center {
  animation: sunPulse 2s ease-in-out infinite;
}

.sun-ray {
  animation: sunRayRotate 10s linear infinite;
}

@keyframes sunPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

@keyframes sunRayRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.moon-shape {
  animation: moonGlow 3s ease-in-out infinite;
}

@keyframes moonGlow {
  0%, 100% { filter: brightness(1); transform: scale(1); }
  50% { filter: brightness(1.2); transform: scale(1.05); }
}

.water-wave {
  animation: waterFlow 2s ease-in-out infinite;
}

.water-wave:nth-child(1) {
  animation-delay: 0s;
}

.water-wave:nth-child(2) {
  animation-delay: 0.3s;
}

.water-wave:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes waterFlow {
  0%, 100% { d: path("M 60 80 Q 80 60 100 80 T 140 80"); }
  50% { d: path("M 60 85 Q 80 65 100 85 T 140 85"); }
}

.fire-base,
.fire-middle,
.fire-top {
  animation: fireFlicker 0.5s ease-in-out infinite alternate;
}

.fire-middle {
  animation-delay: 0.1s;
}

.fire-top {
  animation-delay: 0.2s;
}

@keyframes fireFlicker {
  from { transform: scaleY(1); opacity: 1; }
  to { transform: scaleY(1.1); opacity: 0.9; }
}

.person-head,
.person-body,
.person-arm,
.person-leg {
  animation: personBreathe 2s ease-in-out infinite;
}

@keyframes personBreathe {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.02); }
}

.line-bar,
.dot {
  animation: elementAppear 0.5s ease-out;
}

@keyframes elementAppear {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

.example-section h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
}

.examples {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.example-tag {
  background: #e8eaf6;
  color: #333;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
}

.animation-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
  background: #f9f9f9;
  border-radius: 15px;
}

.anim-char {
  font-size: 80px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@media (max-width: 600px) {
  .chinese-char-view {
    padding: 15px;
  }

  .header h1 {
    font-size: 22px;
  }

  .char-huge {
    font-size: 80px;
  }

  .meta-pinyin {
    font-size: 18px;
  }

  .detail-content {
    padding: 20px;
  }

  .grade-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .char-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .hanzi-writer-container {
    padding: 10px;
  }
}
</style>
