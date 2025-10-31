<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Chart } from 'chart.js/auto'

const route = useRoute()
const router = useRouter()
const profile = ref({Analytical:0, Social:0, Creative:0, Practical:0})
const typeLabel = ref('未知类型')
const description = ref('')
const chart = ref(null)
const isLoading = ref(true)

// 计算属性：排序后的性格维度
const sortedProfile = computed(() => {
  return Object.entries(profile.value)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({ key, value }))
})

// 计算属性：获取主要性格类型的颜色
const getTypeColor = (type) => {
  const colors = {
    Analytical: 'var(--primary)',
    Social: 'var(--success)',
    Creative: 'var(--accent)',
    Practical: 'var(--secondary)'
  }
  return colors[type] || 'var(--primary)'
}

onMounted(async () => {
  try {
    // 模拟加载延迟，增强用户体验
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const id = route.params.id
    const saved = JSON.parse(localStorage.getItem('mm_history') || '[]')
    let entry = saved.find(e => e.id === id) || saved[0] || null
    
    if (entry) {
      profile.value = entry.profile
    } else {
      // 如果没有测试数据，使用默认数据确保雷达图能显示
      profile.value = {
        Analytical: 5,
        Social: 6,
        Creative: 4,
        Practical: 7
      }
      console.log('使用默认数据:', profile.value)
    }
    
    computeLabel()
    
    // 添加延迟让DOM完全渲染
    setTimeout(() => {
      drawChart()
      isLoading.value = false
    }, 100)
  } catch (error) {
    console.error('加载结果失败:', error)
    // 即使出错也使用默认数据
    profile.value = {
      Analytical: 5,
      Social: 6,
      Creative: 4,
      Practical: 7
    }
    computeLabel()
    setTimeout(() => {
      drawChart()
      isLoading.value = false
    }, 100)
  }
})

function computeLabel(){
  const p = profile.value
  const arr = Object.entries(p).sort((a,b)=>b[1]-a[1])
  const top = arr[0][0]
  const map = {
    Analytical: '理性型 (Analytical)',
    Social: '社交型 (Social)',
    Creative: '创意型 (Creative)',
    Practical: '务实型 (Practical)'
  }
  const desc = {
    Analytical: '你倾向于分析与逻辑，喜欢结构化解决问题。你擅长批判性思维，在面对挑战时会仔细权衡各种可能性，寻找最优方案。',
    Social: '你善于与人沟通，喜欢社交与协作场景。你富有同理心，能够很好地理解他人的情感和需求，是团队中的凝聚剂。',
    Creative: '你富有想象力和创造力，喜欢新颖与变化。你不满足于常规，总是寻找创新的方法，善于从不同角度思考问题。',
    Practical: '你重视执行与结果，做事踏实可靠。你注重实际效果，擅长将想法转化为行动，是确保项目顺利完成的关键人物。'
  }
  typeLabel.value = map[top] || '混合型'
  description.value = desc[top] || ''
}

function drawChart(){
  // 使用nextTick确保DOM完全渲染后再获取canvas元素
  nextTick(() => {
    const canvas = document.getElementById('radarChart')
    if(!canvas) {
      console.error('雷达图canvas元素未找到')
      // 延迟重试
      setTimeout(drawChart, 500)
      return
    }
    
    const ctx = canvas.getContext('2d')
    if(!ctx) {
      console.error('无法获取canvas上下文')
      return
    }
    
    const labels = Object.keys(profile.value)
    const data = Object.values(profile.value)
    
    // 检查数据是否有效
    if (!labels.length || !data.length) {
      console.error('雷达图数据为空', { labels, data, profile: profile.value })
      return
    }
    
    console.log('绘制雷达图', { labels, data })
    
    // 生成渐变色 - 使用红色作为底色
    const gradient = ctx.createLinearGradient(0, 0, 0, 300)
    gradient.addColorStop(0, '#ff444433') // 红色半透明
    gradient.addColorStop(0.5, '#ff444466') // 红色更明显
    gradient.addColorStop(1, '#ff444400') // 红色透明
    
    // 销毁已存在的图表实例
    if (chart.value) {
      chart.value.destroy()
    }
    
    chart.value = new Chart(ctx, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          label: '性格维度',
          data,
          fill: true,
          backgroundColor: gradient,
          borderColor: '#ff4444', // 红色边框
          borderWidth: 3,
          pointBackgroundColor: '#ff4444', // 红色点
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#ff4444',
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: 12,
            bodyFont: {
              size: 14
            }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            suggestedMax: 8,
            backgroundColor: '#fff5f5', // 浅红色背景
            grid: {
              color: 'rgba(255, 68, 68, 0.1)' // 红色网格线
            },
            angleLines: {
              color: 'rgba(255, 68, 68, 0.2)' // 红色角度线
            },
            pointLabels: {
              font: {
                size: 13,
                weight: '500'
              },
              color: '#ff4444' // 红色标签文字
            },
            ticks: {
              backdropColor: 'transparent',
              color: '#ff4444' // 红色刻度文字
            }
          }
        },
        animation: {
          duration: 2000,
          easing: 'easeOutQuart'
        }
      }
    })
  })
}

function goBack(){ router.push('/quiz') }

function downloadImage(){
  const canvas = document.getElementById('radarChart')
  if (!canvas) {
    console.error('雷达图canvas元素未找到，无法下载')
    return
  }
  
  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = 'mindmatch_profile.png'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  
  // 显示下载成功提示
  const notification = document.createElement('div')
  notification.className = 'download-notification'
  notification.textContent = '图像已下载到本地！'
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.classList.add('show')
    setTimeout(() => {
      notification.classList.remove('show')
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 2000)
  }, 100)
}
</script>

<template>
  <div class="result-container">
    <div class="result-decoration"></div>
    <div class="result-decoration-2"></div>
    
    <div class="card result-card p-6 shadow-lg">
      <!-- 头部 -->
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-6">
        <div>
          <h1 class="result-title">你的心理画像</h1>
          <p class="result-subtitle">基于你的回答生成的个性化分析</p>
        </div>
        <div class="action-buttons mt-3 md:mt-0">
          <button class="btn btn-outline-secondary rounded-lg px-4 py-2 me-4 transition-all shadow-hover" @click="goBack">
            <i class="bi bi-arrow-left me-2"></i> 返回测试
          </button>
          <button class="btn btn-primary rounded-lg px-4 py-2 transition-all shadow-hover" @click="downloadImage">
            <i class="bi bi-download me-2"></i> 保存结果
          </button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="text-muted">正在生成你的心理画像...</p>
      </div>

      <!-- 结果内容 -->
      <div v-else class="result-content">
        <div class="row gap-8">
          <!-- 左侧：类型和描述 -->
          <div class="col-lg-5">
            <div class="personality-card card p-6 shadow-md border-0 bg-white rounded-xl mb-6">
              <div class="type-badge mb-4 inline-block" 
                   :style="{ backgroundColor: getTypeColor(sortedProfile[0].key) + '20', color: getTypeColor(sortedProfile[0].key) }">
                主要性格类型
              </div>
              <h2 class="type-label text-2xl font-bold mb-3" 
                  :style="{ color: getTypeColor(sortedProfile[0].key) }">
                {{typeLabel}}
              </h2>
              <p class="type-description text-muted leading-relaxed">
                {{description}}
              </p>
            </div>

            <!-- 维度得分 -->
            <div class="dimensions-card card p-6 shadow-md border-0 bg-white rounded-xl">
              <h3 class="dimensions-title text-lg font-semibold mb-4">维度得分</h3>
              <div class="dimensions-list">
                <div 
                  v-for="(item, index) in sortedProfile" 
                  :key="item.key" 
                  class="dimension-item mb-4 last:mb-0"
                >
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <div class="d-flex align-items-center">
                      <span class="dimension-rank font-medium me-2">{{index + 1}}</span>
                      <span class="dimension-name">{{item.key}}</span>
                    </div>
                    <span class="dimension-score font-bold" :style="{ color: getTypeColor(item.key) }">
                      {{item.value}}
                    </span>
                  </div>
                  <div class="dimension-bar bg-gray-100 rounded-full h-2.5">
                    <div 
                      class="dimension-progress h-full rounded-full transition-all duration-1500 ease-out"
                      :style="{ 
                        width: (item.value / 8) * 100 + '%',
                        backgroundColor: getTypeColor(item.key)
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：雷达图 -->
          <div class="col-lg-7">
            <div class="chart-card card p-6 shadow-md border-0 bg-white rounded-xl h-full">
              <h3 class="chart-title text-lg font-semibold mb-4">性格维度雷达图</h3>
              <div class="chart-container relative">
                <canvas id="radarChart" class="w-full" height="320"></canvas>
                <div class="chart-overlay"></div>
              </div>
              <p class="chart-description text-sm text-muted text-center mt-4">
                你的性格维度雷达图展示了四大核心特质的分布情况
              </p>
            </div>
          </div>
        </div>

        <!-- 底部建议 -->
        <div class="suggestions-card card p-5 shadow-md border-0 bg-gradient-to-r from-accent/5 to-secondary/5 rounded-xl mt-6">
          <h3 class="suggestions-title text-lg font-semibold mb-3">探索更多</h3>
          <p class="suggestions-text text-muted mb-4">
            想要更深入地了解自己或与他人对比？试试以下功能：
          </p>
          <div class="suggestions-actions d-flex flex-wrap gap-3">
            <router-link 
              to="/quiz" 
              class="btn bg-white text-accent border border-accent/30 rounded-lg px-5 py-2 transition-all shadow-hover"
            >
              <i class="bi bi-repeat mr-1"></i> 重新测试
            </router-link>
            <router-link 
              to="/match" 
              class="btn bg-white text-secondary border border-secondary/30 rounded-lg px-5 py-2 transition-all shadow-hover"
            >
              <i class="bi bi-people mr-1"></i> 双人匹配
            </router-link>
            <router-link 
              to="/history" 
              class="btn bg-white text-gray-700 border border-gray-200 rounded-lg px-5 py-2 transition-all shadow-hover"
            >
              <i class="bi bi-clock-history mr-1"></i> 查看历史
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-container {
  position: relative;
  min-height: 70vh;
  padding: 2rem 0;
  overflow: hidden;
}

.result-decoration {
  position: absolute;
  top: -150px;
  right: -150px;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(114,124,245,0.07) 0%, rgba(114,124,245,0) 70%);
  z-index: -1;
}

.result-decoration-2 {
  position: absolute;
  bottom: -100px;
  left: -100px;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(247,112,29,0.07) 0%, rgba(247,112,29,0) 70%);
  z-index: -1;
}

.result-card {
  background: linear-gradient(135deg, rgba(255,255,255,0.98), rgba(250,250,250,0.95));
  border: none;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  max-width: 1200px;
  margin: 0 auto;
}

.result-title {
  font-size: 2.25rem;
  font-weight: 800;
  background: linear-gradient(90deg, var(--accent), var(--secondary));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.result-subtitle {
  color: var(--gray-600);
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.type-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
}

.shadow-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
}

/* 加载状态 */
.loading-container {
  text-align: center;
  padding: 4rem 0;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--gray-200);
  border-top: 4px solid var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 维度进度条 */
.dimension-rank {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--gray-100);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
}

.dimension-name {
  font-weight: 500;
}

/* 维度列表样式 */
.dimensions-list {
  text-align: center;
}

.dimension-item {
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.75rem;
}

.dimension-item:last-child {
  margin-bottom: 0;
}

/* 图表容器 */
.chart-container {
  position: relative;
  height: 320px;
}

.chart-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 15%, rgba(255,255,255,0) 85%, rgba(255,255,255,0.1) 100%);
  pointer-events: none;
}

/* 下载通知 */
:global(.download-notification) {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: var(--success);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  z-index: 9999;
}

:global(.download-notification.show) {
  opacity: 1;
  transform: translateY(0);
}

/* 卡片通用样式 */
.personality-card,
.dimensions-card,
.chart-card {
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
  padding: 1.5rem !important;
}

.personality-card:hover,
.dimensions-card:hover,
.chart-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.08);
}

/* 个性卡片内部元素间距 */
.personality-card > * {
  margin-bottom: 0.75rem;
}

.personality-card > *:last-child {
  margin-bottom: 0;
}

/* 维度卡片内部元素间距 */
.dimensions-card > * {
  margin-bottom: 0.75rem;
}

.dimensions-card > *:last-child {
  margin-bottom: 0;
}

/* 图表卡片内部元素间距 */
.chart-card > * {
  margin-bottom: 0.75rem;
}

.chart-card > *:last-child {
  margin-bottom: 0;
}

/* 建议卡片内部元素间距 */
.suggestions-card > * {
  margin-bottom: 0.75rem;
  text-align: center;
}

.suggestions-card > *:last-child {
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .result-title {
    font-size: 1.75rem;
  }
  
  .result-subtitle {
    font-size: 1rem;
  }
  
  .chart-container {
    height: 300px;
  }
}

@media (max-width: 768px) {
  .result-container {
    padding: 1rem 0;
  }
  
  .result-card {
    padding: 1.5rem;
  }
  
  .action-buttons {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  
  .btn {
    flex: 1;
    margin: 0 0.5rem;
  }
  
  .btn:first-child {
    margin-left: 0;
  }
  
  .btn:last-child {
    margin-right: 0;
  }
  
  .chart-container {
    height: 250px;
  }
}

@media (max-width: 576px) {
  .result-title {
    font-size: 1.5rem;
  }
  
  .type-label {
    font-size: 1.5rem;
  }
  
  .suggestions-actions {
    flex-direction: column;
  }
  
  .suggestions-actions .btn {
    margin: 0;
    width: 100%;
  }
}
</style>
