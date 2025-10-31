<script setup>
/* eslint-disable no-unused-vars, vue/no-unused-vars */
import { ref, computed } from 'vue'
const idA = ref('')
const idB = ref('')
const profileA = ref(null)
const profileB = ref(null)
const compat = ref(0)
const isLoading = ref(false)
const showResult = ref(false)

// 计算属性：根据契合度获取等级和颜色
const compatibilityLevel = computed(() => {
  if (compat.value >= 80) return { label: '灵魂伴侣', color: 'bg-gradient-to-r from-purple-500 to-pink-500' }
  if (compat.value >= 65) return { label: '高度契合', color: 'bg-gradient-to-r from-blue-500 to-accent' }
  if (compat.value >= 50) return { label: '默契伙伴', color: 'bg-gradient-to-r from-accent to-secondary' }
  if (compat.value >= 35) return { label: '互补型', color: 'bg-gradient-to-r from-secondary to-amber-500' }
  return { label: '有待磨合', color: 'bg-gradient-to-r from-amber-500 to-orange-500' }
})

// 获取历史记录列表（供提示使用）
const savedTests = computed(() => {
  return JSON.parse(localStorage.getItem('mm_history') || '[]')
    .map(item => ({ id: item.id, date: new Date(item.date).toLocaleString() }))
    .slice(0, 5)
})

function loadFromIds() {
  // 表单验证
  if (!idA.value || !idB.value) {
    showNotification('请输入两位用户的ID', 'error')
    return
  }
  
  isLoading.value = true
  
  // 模拟处理延迟以提升用户体验
  setTimeout(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('mm_history') || '[]')
      const a = findProfile(idA.value, saved)
      const b = findProfile(idB.value, saved)
      
      if (!a || !b) {
        showNotification('未找到对应记录，请确认ID或先在历史记录中保存测试', 'error')
        isLoading.value = false
        return
      }
      
      profileA.value = a
      profileB.value = b
      compat.value = Math.round(cosineSimilarity(Object.values(a), Object.values(b)) * 100)
      
      // 平滑显示结果
      setTimeout(() => {
        showResult.value = true
        isLoading.value = false
      }, 300)
    } catch (error) {
      showNotification('匹配过程中出现错误', 'error')
      console.error('匹配错误:', error)
      isLoading.value = false
    }
  }, 500)
}

function findProfile(id, saved) {
  if (!id) return null
  const it = saved.find(s => s.id === id)
  return it ? it.profile : null
}

function clear() {
  idA.value = ''
  idB.value = ''
  profileA.value = null
  profileB.value = null
  compat.value = 0
  showResult.value = false
}

function cosineSimilarity(v1, v2) {
  const dot = v1.reduce((s, x, i) => s + x * v2[i], 0)
  const n1 = Math.sqrt(v1.reduce((s, x) => s + x * x, 0))
  const n2 = Math.sqrt(v2.reduce((s, x) => s + x * x, 0))
  if (n1 === 0 || n2 === 0) return 0
  return dot / (n1 * n2)
}

// 显示通知
function showNotification(message, type = 'info') {
  const notification = document.createElement('div')
  notification.className = `notification ${type}`
  notification.textContent = message
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.classList.add('show')
    setTimeout(() => {
      notification.classList.remove('show')
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }, 100)
}

// 自动填充示例ID
function fillExampleId(slot) {
  const saved = JSON.parse(localStorage.getItem('mm_history') || '[]')
  if (saved.length >= 1) {
    if (slot === 'a') idA.value = saved[0].id
    if (slot === 'b') idB.value = saved.length > 1 ? saved[1].id : saved[0].id
  }
}
</script>

<template>
  <div class="match-container">
    <!-- 背景装饰 -->
    <div class="match-decoration"></div>
    <div class="match-decoration-2"></div>
    
    <div class="card match-card p-6 shadow-lg">
      <h1 class="match-title mb-2">双人匹配分析</h1>
      <p class="match-subtitle text-muted mb-8">输入两位用户的历史记录ID，分析性格契合度和互补优势</p>

      <!-- 输入表单 -->
      <div class="match-form">
        <div class="row gap-4 mb-6">
          <div class="col-12 col-md-6">
            <label class="form-label font-medium mb-2">用户 A 历史 ID</label>
            <div class="input-group">
              <input 
                v-model="idA" 
                class="form-control match-input" 
                placeholder="例如 res-1600000000000"
              />
              <button 
                class="btn btn-outline-secondary input-group-text"
                @click="fillExampleId('a')"
                :disabled="savedTests.length === 0"
                title="自动填充最近的测试ID"
              >
                <i class="bi bi-magic"></i>
              </button>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label font-medium mb-2">用户 B 历史 ID</label>
            <div class="input-group">
              <input 
                v-model="idB" 
                class="form-control match-input"
                placeholder="例如 res-1600000000001"
              />
              <button 
                class="btn btn-outline-secondary input-group-text"
                @click="fillExampleId('b')"
                :disabled="savedTests.length === 0"
                title="自动填充最近的测试ID"
              >
                <i class="bi bi-magic"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="d-flex flex-wrap gap-3 mb-8">
          <button 
            class="btn btn-primary btn-lg rounded-lg px-6 py-2 font-medium transition-all shadow-hover"
            :class="{ 'bg-gradient-to-r from-accent to-secondary': !isLoading }"
            @click="loadFromIds"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="loading-spinner-small mr-2"></span>
            {{ isLoading ? '分析中...' : '开始匹配分析' }}
            <i v-if="!isLoading" class="bi bi-arrow-right ml-2"></i>
          </button>
          <button 
            class="btn btn-outline-secondary btn-lg rounded-lg px-6 py-2 font-medium transition-all shadow-hover"
            @click="clear"
            :disabled="isLoading"
          >
            <i class="bi bi-x-circle mr-2"></i> 清空
          </button>
        </div>

        <!-- 最近测试提示 -->
        <div v-if="savedTests.length > 0" class="recent-tests mb-8">
          <h3 class="recent-tests-title text-sm font-medium text-gray-500 mb-2">最近的测试记录：</h3>
          <div class="recent-tests-list">
            <div 
              v-for="test in savedTests" 
              :key="test.id"
              class="recent-test-item text-sm d-flex justify-content-between items-center p-2 rounded"
            >
              <span>{{ test.id }}</span>
              <span class="text-gray-500">{{ test.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 匹配结果 -->
      <div 
        v-if="showResult && profileA && profileB" 
        class="match-results"
      >
        <!-- 契合度展示 -->
        <div class="compatibility-card card p-6 shadow-md border-0 bg-white rounded-xl mb-8 transform-on-hover">
          <div class="compatibility-header text-center mb-6">
            <h2 class="compatibility-title text-2xl font-bold mb-3">性格契合度分析</h2>
            <div class="compatibility-percentage" :class="compatibilityLevel.color">
              <span class="compatibility-value">{{ compat }}%</span>
              <span class="compatibility-label">{{ compatibilityLevel.label }}</span>
            </div>
          </div>
          
          <div class="compatibility-bar-container">
            <div class="compatibility-bar bg-gray-100 rounded-full h-4">
              <div 
                class="compatibility-progress h-full rounded-full transition-all duration-1500 ease-out"
                :style="{ 
                  width: compat + '%',
                  backgroundImage: `linear-gradient(to right, var(--accent), ${compat > 70 ? '#10b981' : '#f59e0b'})`
                }"
              ></div>
            </div>
            <div class="compatibility-scale flex justify-between mt-1 text-xs text-gray-500">
              <span>低</span>
              <span>中</span>
              <span>高</span>
            </div>
          </div>
          
          <p class="compatibility-description text-center text-sm text-muted mt-4">
            契合度基于两人性格维度的余弦相似度计算，数值越高表示性格特质越相似
          </p>
        </div>

        <!-- 维度对比 -->
        <div class="dimensions-comparison">
          <h3 class="comparison-title text-lg font-semibold mb-4">维度详细对比</h3>
          
          <div class="comparison-items">
            <div 
              v-for="dimension in Object.keys(profileA)" 
              :key="dimension"
              class="comparison-item mb-6 last:mb-0"
            >
              <div class="comparison-item-header d-flex justify-content-between mb-2">
                <h4 class="dimension-name font-medium">{{ dimension }}</h4>
                <div class="dimension-scores">
                  <span class="score score-a">{{ profileA[dimension] }}</span>
                  <span class="score-vs">vs</span>
                  <span class="score score-b">{{ profileB[dimension] }}</span>
                </div>
              </div>
              
              <div class="dimension-comparison-bar bg-gray-100 rounded-full h-3 mb-2">
                <div 
                  class="dimension-a-bar h-full rounded-l-full bg-accent transition-all duration-1000 ease-out"
                  :style="{ width: `${(profileA[dimension] / 8) * 50}%` }"
                ></div>
                <div 
                  class="dimension-b-bar h-full rounded-r-full bg-secondary transition-all duration-1000 ease-out"
                  :style="{ width: `${(profileB[dimension] / 8) * 50}%` }"
                ></div>
              </div>
              
              <!-- 差异分析 -->
              <div class="comparison-analysis text-xs text-gray-500">
                {{ getDimensionAnalysis(dimension, profileA[dimension], profileB[dimension]) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    getDimensionAnalysis(dimension, scoreA, scoreB) {
      const diff = Math.abs(scoreA - scoreB)
      const dimensionName = dimension
      let description = ''
      
      if (diff > 3) {
        description = scoreA > scoreB 
          ? `A在${dimensionName}方面显著强于B，可能在这一领域互补性强`
          : `B在${dimensionName}方面显著强于A，可能在这一领域互补性强`
      } else if (diff > 1) {
        description = scoreA > scoreB 
          ? `A在${dimensionName}方面略强于B`
          : `B在${dimensionName}方面略强于A`
      } else {
        description = `两人在${dimensionName}方面较为相似，容易理解彼此`
      }
      
      return description
    }
  }
}
</script>

<style scoped>
.match-container {
  position: relative;
  min-height: 70vh;
  padding: 2rem 0;
  overflow: hidden;
}

.match-decoration {
  position: absolute;
  top: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(114,124,245,0.07) 0%, rgba(114,124,245,0) 70%);
  z-index: -1;
}

.match-decoration-2 {
  position: absolute;
  bottom: -100px;
  left: -100px;
  width: 350px;
  height: 350px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(247,112,29,0.07) 0%, rgba(247,112,29,0) 70%);
  z-index: -1;
}

.match-card {
  background: linear-gradient(135deg, rgba(255,255,255,0.98), rgba(250,250,250,0.95));
  border: none;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  max-width: 900px;
  margin: 0 auto;
}

.match-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(90deg, var(--accent), var(--secondary));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.match-subtitle {
  font-size: 1.1rem;
}

/* 输入框样式 */
.match-input {
  border-radius: 0.5rem;
  border: 2px solid #e2e8f0;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.match-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(114,124,245,0.1);
  outline: none;
}

/* 按钮悬停效果 */
.shadow-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
}

/* 小加载动画 */
.loading-spinner-small {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 最近测试记录 */
.recent-tests {
  background-color: #f8fafc;
  border-radius: 0.5rem;
  padding: 1rem;
}

.recent-test-item {
  transition: background-color 0.2s ease;
}

.recent-test-item:hover {
  background-color: rgba(114,124,245,0.05);
}

/* 匹配结果 */
.match-results {
  animation: fadeInUp 0.5s ease-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  margin: 0 auto;
  max-width: 90%;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 契合度卡片 */
.compatibility-card {
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 800px;
  margin: 0 auto 2rem auto;
  padding: 2rem;
}

.transform-on-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.transform-on-hover:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.08) !important;
}

.compatibility-percentage {
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: 1rem;
  color: white;
  text-align: center;
}

.compatibility-value {
  display: block;
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
}

.compatibility-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 0.5rem;
  opacity: 0.9;
}

/* 维度对比 */
.dimensions-comparison {
  width: 100%;
  max-width: 800px;
  margin: 2rem 0;
}

/* 优化比较项目样式 */
.comparison-title {
  text-align: center;
  margin-bottom: 2rem;
}

.comparison-item {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #fafafa;
  border-radius: 0.75rem;
  width: 100%;
}

.comparison-item:last-child {
  margin-bottom: 0;
}

.dimension-scores {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.score {
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.score-a {
  background-color: rgba(114,124,245,0.1);
  color: var(--accent);
}

.score-b {
  background-color: rgba(247,112,29,0.1);
  color: var(--secondary);
}

.score-vs {
  color: #94a3b8;
  font-size: 0.8rem;
}

.dimension-comparison-bar {
  position: relative;
  overflow: hidden;
  margin: 0.75rem 0;
}

.comparison-analysis {
  text-align: center;
  padding: 0.5rem;
  font-size: 0.875rem;
}

.dimension-a-bar {
  position: absolute;
  left: 0;
  top: 0;
}

.dimension-b-bar {
  position: absolute;
  right: 0;
  top: 0;
}

/* 通知样式 */
:global(.notification) {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.3s ease;
  z-index: 9999;
  color: white;
  font-weight: 500;
}

:global(.notification.info) {
  background-color: var(--accent);
}

:global(.notification.error) {
  background-color: var(--danger);
}

:global(.notification.success) {
  background-color: var(--success);
}

:global(.notification.show) {
  opacity: 1;
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .match-container {
    padding: 1rem 0;
  }
  
  .match-card {
    padding: 1.5rem;
  }
  
  .match-title {
    font-size: 1.75rem;
  }
  
  .compat-value {
    font-size: 2rem;
  }
}

@media (max-width: 576px) {
  .match-title {
    font-size: 1.5rem;
  }
  
  .btn-lg {
    width: 100%;
  }
  
  .compatibility-percentage {
    padding: 0.75rem 1.5rem;
  }
  
  .compatibility-value {
    font-size: 1.75rem;
  }
}
</style>
