<script setup>
import { ref, reactive, computed } from 'vue'

const QUESTION_BANK = [
  { id:1, text:'你更喜欢哪类活动？', options:[
    {t:'A',label:'独处/阅读'},{t:'B',label:'社交/聚会'},
    {t:'C',label:'创作/手艺'},{t:'D',label:'运动/户外'}]},
  { id:2, text:'遇到问题时你的第一反应是：', options:[
    {t:'A',label:'分析原因'},{t:'B',label:'寻求他人意见'},
    {t:'C',label:'尝试不同方法'},{t:'D',label:'等待合适时机'}]},
  { id:3, text:'下面哪种描述更像你？', options:[
    {t:'A',label:'注重规则与秩序'},{t:'B',label:'善于社交'},
    {t:'C',label:'天马行空的想法'},{t:'D',label:'务实且专注'}]},
  { id:4, text:'你更看重哪项品质？', options:[
    {t:'A',label:'稳定性'},{t:'B',label:'表达力'},
    {t:'C',label:'创造力'},{t:'D',label:'执行力'}]},
  { id:5, text:'你在团队中通常扮演：', options:[
    {t:'A',label:'规划者'},{t:'B',label:'沟通者'},
    {t:'C',label:'创意者'},{t:'D',label:'落实者'}]},
]

const TYPE_DIMENSIONS = {
  A:{Analytical:2,Social:0,Creative:0,Practical:1},
  B:{Analytical:0,Social:2,Creative:0,Practical:1},
  C:{Analytical:0,Social:0,Creative:3,Practical:0},
  D:{Analytical:1,Social:0,Creative:0,Practical:2},
}

function calcProfile(answers){
  const dims={Analytical:0,Social:0,Creative:0,Practical:0}
  answers.forEach(a=>{
    const m=TYPE_DIMENSIONS[a]
    if(m){ for(const k in m) dims[k]+=m[k] }
  })
  return dims
}

const questions = QUESTION_BANK
const answers = reactive(Array(questions.length).fill(''))
const currentIndex = ref(0)
const finished = ref(false)
const resultId = ref('')
const showSuccessAnimation = ref(false)

const currentQuestion = computed(()=>questions[currentIndex.value])
function select(t){ 
  answers[currentIndex.value]=t 
}
function isSelected(t){ return answers[currentIndex.value]===t }
function nextOrFinish(){
  if(currentIndex.value+1 < questions.length){ 
    // 添加过渡动画
    showSuccessAnimation.value = true
    setTimeout(() => {
      currentIndex.value++
      showSuccessAnimation.value = false
    }, 500)
  }
  else {
    finished.value = true
    const res = calcProfile(answers.filter(Boolean))
    const saved = JSON.parse(localStorage.getItem('mm_history')||'[]')
    const id = 'res-' + Date.now()
    const user = JSON.parse(localStorage.getItem('mm_user') || 'null')
    const username = user && user.username ? user.username : 'anonymous'
    saved.unshift({id, date:new Date().toISOString(), username, answers:[...answers], profile:res})
    localStorage.setItem('mm_history', JSON.stringify(saved))
    resultId.value = id
  }
}
function prev(){ 
  if(currentIndex.value>0) currentIndex.value-- 
}
function clearCurrent(){ answers[currentIndex.value]='' }
function resetAll(){ 
  if(confirm('确认清除所有回答并重新开始吗？')){ 
    for(let i=0;i<answers.length;i++) answers[i]=''; 
    currentIndex.value=0; 
    finished.value=false 
  }
}

const answeredCount = computed(()=>answers.filter(x=>x).length)
const progress = computed(()=> Math.round((answeredCount.value / questions.length)*100))
</script>

<template>
  <div class="quiz-container">
    <div class="quiz-decoration"></div>
    <div class="quiz-decoration-2"></div>
    
    <div class="card quiz-card p-6 shadow-lg">
      <div class="d-flex justify-content-between align-items-center mb-6">
        <h2 class="quiz-title">趣味性格测试</h2>
        <div class="quiz-counter">
          <span class="badge bg-accent/20 text-accent rounded-full px-3 py-1">
            共 {{questions.length}} 题
          </span>
        </div>
      </div>

      <div v-if="!finished" class="quiz-content">
        <!-- 进度条 -->
        <div class="mb-6">
          <div class="d-flex justify-content-between mb-2">
            <small class="text-muted font-medium">已完成 {{answeredCount}} / {{questions.length}}</small>
            <small class="text-accent font-medium">{{progress}}%</small>
          </div>
          <div class="progress-wrapper rounded-full overflow-hidden bg-gray-100">
            <div 
              class="progress-bar bg-gradient-to-r from-accent to-secondary h-full transition-all duration-700 ease-out"
              :style="{width:progress+'%'}"
            ></div>
          </div>
        </div>
        
        <!-- 问题卡片 -->
        <div class="question-card card p-6 mb-6 shadow-md border-0">
          <div class="d-flex justify-content-between mb-4 align-items-center">
            <div class="question-number bg-accent/10 text-accent font-bold rounded-full w-10 h-10 flex items-center justify-center">
              {{currentIndex+1}}
            </div>
            <div class="small text-muted font-medium">第 {{currentIndex+1}} 题</div>
          </div>
          <h3 class="question-text mb-6 font-medium">
            {{currentQuestion.text}}
          </h3>
          
          <!-- 选项网格 -->
          <div class="option-grid row g-3">
            <div 
              class="col-6"
              v-for="opt in currentQuestion.options" 
              :key="opt.t"
              :class="{ 'option-selected': isSelected(opt.t) }"
            >
              <button 
                class="quiz-option w-100 p-3 text-left rounded-lg border-2 transition-all duration-300"
                :class="{
                  'border-gray-200 bg-white hover:border-accent/50 hover:bg-accent/5': !isSelected(opt.t),
                  'border-accent bg-accent/5': isSelected(opt.t)
                }"
                @click="select(opt.t)"
              >
                <div class="option-header d-flex items-center">
                  <div class="option-marker w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" 
                    :class="{
                      'bg-gray-100 text-gray-500': !isSelected(opt.t),
                      'bg-accent text-white': isSelected(opt.t)
                    }"
                  >
                    {{opt.t}}
                  </div>
                  <div class="option-text ml-2 font-medium text-sm">{{opt.label}}</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- 控制按钮 -->
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div class="left-controls">
            <button 
              class="btn btn-outline-secondary rounded-lg px-4 py-2 transition-all"
              :class="{ 'opacity-50 cursor-not-allowed': currentIndex===0 }"
              @click="prev" 
              :disabled="currentIndex===0"
            >
              <i class="bi bi-arrow-left mr-1"></i> 上一步
            </button>
            <button 
              class="btn btn-link text-muted ml-3"
              @click="clearCurrent"
            >
              <i class="bi bi-x-circle mr-1"></i> 清除
            </button>
          </div>
          <div class="right-controls d-flex align-items-center" style="gap: 20px;">
            <button 
              class="btn btn-outline-danger rounded-lg px-5 py-2 font-medium transition-all hover:bg-danger/5 flex-1"
              @click="resetAll"
            >
              <i class="bi bi-arrow-counterclockwise mr-1"></i> 重置
            </button>
            <button 
              class="btn btn-primary rounded-lg px-5 py-2 font-medium transition-all shadow-hover flex-1"
              :class="{ 'bg-gradient-to-r from-accent to-secondary': currentIndex+1===questions.length }"
              @click="nextOrFinish"
            >
              {{ currentIndex+1===questions.length ? '提交并查看结果' : '下一题' }}
              <i class="bi bi-arrow-right ml-1"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 完成页面 -->
      <div v-else class="completion-card text-center py-8">
        <div class="success-animation mb-6">
          <div class="check-circle w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
            <i class="bi bi-check text-accent text-4xl"></i>
          </div>
        </div>
        <h3 class="text-2xl font-bold mb-3">测试完成！</h3>
        <p class="text-muted mb-6 max-w-md mx-auto">
          我们正在分析你的回答并生成个性化的心理画像，展现你的独特性格特质。
        </p>
       <router-link 
       class="btn btn-lg bg-white text-accent font-medium px-8 py-3 rounded-xl shadow-hover border-accent border-2"
       :to="{ name: 'result', params:{ id: resultId }}"
        >
        查看结果
        <i class="bi bi-arrow-right ml-2"></i>
      </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-container {
  position: relative;
  min-height: 70vh;
  padding: 2rem 1rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quiz-decoration {
  position: absolute;
  top: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(114,124,245,0.08) 0%, rgba(114,124,245,0) 70%);
  z-index: -1;
}

.quiz-decoration-2 {
  position: absolute;
  bottom: -100px;
  left: -100px;
  width: 350px;
  height: 350px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(247,112,29,0.08) 0%, rgba(247,112,29,0) 70%);
  z-index: -1;
}

.quiz-card {
  background: linear-gradient(135deg, rgba(255,255,255,0.98), rgba(250,250,250,0.95));
  border: none;
  border-radius: 1.25rem;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255,255,255,0.3);
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  box-shadow: 0 15px 30px rgba(0,0,0,0.08);
}

.quiz-title {
  font-size: 2.25rem;
  font-weight: 700;
  background: linear-gradient(90deg, var(--accent), var(--secondary));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 0.5rem;
}

.progress-wrapper {
  height: 10px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
  border-radius: 5px;
}

.question-card {
  background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,249,250,0.95));
  border-radius: 1.25rem;
  padding: 2rem !important;
  margin: 2rem 0;
}

.question-text {
  font-size: 1.5rem;
  line-height: 1.6;
  color: var(--dark);
  font-weight: 500;
  margin-bottom: 2rem;
}

.option-grid {
  gap: 0.75rem;
}

.quiz-option {
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  border-radius: 0.75rem;
  min-height: 70px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.quiz-option:hover:not(.option-selected) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.quiz-option:active {
  transform: translateY(0);
}

.option-marker {
  width: 30px;
  height: 30px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.option-text {
  font-size: 0.9rem;
  font-weight: 500;
}

.shadow-hover:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(114,124,245,0.25) !important;
}

/* 查看结果按钮的紫色边框效果 */
.router-link[class*="bg-gradient-to-r"] {
  border: 2px solid transparent;
  transition: all 0.3s ease;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  color: #333 !important;
  font-size: 1.1rem !important;
  font-weight: 700 !important;
  opacity: 1 !important;
  visibility: visible !important;
}

.router-link[class*="bg-gradient-to-r"]:hover {
  border-color: #8b5cf6;
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.4);
}

.router-link[class*="bg-gradient-to-r"]:active {
  border-color: #7c3aed;
  box-shadow: 0 0 10px rgba(124, 58, 237, 0.6);
}

.completion-card {
  animation: fadeIn 0.5s ease-out;
  padding: 3rem 2rem;
}

.check-circle {
  width: 100px;
  height: 100px;
  font-size: 3rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-animation {
  animation: pulse 2s ease-out;
}

@keyframes pulse {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .quiz-container {
    padding: 1rem 0.5rem;
    min-height: 80vh;
  }
  
  .quiz-card {
    padding: 1.5rem !important;
    border-radius: 1rem;
    width: 100%;
  }
  
  .quiz-title {
    font-size: 1.8rem;
  }
  
  .question-card {
    padding: 1.5rem !important;
    margin: 1.5rem 0;
  }
  
  .question-text {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
  }
  
  .option-grid {
    gap: 0.5rem;
  }
  
  .quiz-option {
    min-height: 60px;
    padding: 0.75rem !important;
  }
  
  .option-marker {
    width: 25px;
    height: 25px;
    font-size: 0.8rem;
  }
  
  .option-text {
    font-size: 0.8rem;
  }
  
  .left-controls, .right-controls {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    gap: 10px;
  }
  
  .btn {
    flex: 1;
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
  
  .check-circle {
    width: 80px;
    height: 80px;
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .quiz-container {
    padding: 0.5rem;
  }
  
  .quiz-card {
    padding: 1rem !important;
  }
  
  .quiz-title {
    font-size: 1.6rem;
  }
  
  .question-text {
    font-size: 1.2rem;
  }
  
  .option-grid {
    gap: 0.75rem;
  }
  
  .quiz-option {
    min-height: 70px;
    padding: 0.75rem !important;
  }
  
  .option-marker {
    width: 30px;
    height: 30px;
    font-size: 0.9rem;
  }
  
  .option-text {
    font-size: 0.9rem;
  }
}
</style>
