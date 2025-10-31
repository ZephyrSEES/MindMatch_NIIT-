<template>
  <div class="home-container">
    <!-- 装饰元素 -->
    <div class="home-decoration"></div>
    <div class="home-decoration-2"></div>
    
    <div class="row align-items-center">
      <div class="col-lg-6 mb-6 mb-lg-0">
        <div class="card card-hero p-6 shadow-lg transform-on-hover">
          <h1 class="brand text-gradient mb-4">MindMatch</h1>
          <p class="lead text-muted mb-6">
            通过一套趣味问卷，<span class="text-accent">了解你的心理维度</span>并找到与你相匹配的类型。支持双人匹配与历史记录。
          </p>
          <div class="d-flex flex-wrap gap-3">
            <router-link class="btn btn-primary btn-lg shadow-hover" to="/quiz">
              开始测试
              <i class="bi bi-arrow-right ml-2"></i>
            </router-link>
            <router-link class="btn btn-outline-secondary btn-lg shadow-hover" to="/match">
              双人匹配
              <i class="bi bi-people ml-2"></i>
            </router-link>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card card-info p-6 shadow-lg transform-on-hover">
          <div class="d-flex align-items-center justify-content-center mb-4">
            <div class="icon-circle bg-accent/10 p-3 me-3">
              <i class="bi bi-question-circle text-accent"></i>
            </div>
            <h5 class="mb-0">如何体验</h5>
          </div>
          <ol class="list-styled mb-6 mx-auto" style="max-width: 400px;">
            <li class="mb-4 d-flex align-items-center justify-content-center">
              <div class="step-number me-3">1</div>
              <span class="text-center">进入 <strong>开始测试</strong>，按提示完成问卷。</span>
            </li>
            <li class="mb-4 d-flex align-items-center justify-content-center">
              <div class="step-number me-3">2</div>
              <span class="text-center">查看结果页的雷达图与类型描述。</span>
            </li>
            <li class="d-flex align-items-center justify-content-center">
              <div class="step-number me-3">3</div>
              <span class="text-center">可进入<strong>双人匹配</strong>对比两人的相似度。</span>
            </li>
          </ol>
          <hr class="mb-4" />
          <div class="d-flex align-items-center justify-content-center">
            <div class="icon-circle bg-muted/10 p-2 me-3">
              <i class="bi bi-code-slash text-muted"></i>
            </div>
            <h6 class="mb-0">技术栈</h6>
          </div>
          <p class="small text-muted mt-2 text-center">MindMatch Demo · 前端原型 · Vue3 + Bootstrap + Chart.js</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  position: relative;
  min-height: 60vh;
  padding: 2rem 0;
}

.home-decoration {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(114,124,245,0.1) 0%, rgba(114,124,245,0) 70%);
  z-index: -1;
}

.home-decoration-2 {
  position: absolute;
  bottom: -50px;
  left: -50px;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(247,112,29,0.1) 0%, rgba(247,112,29,0) 70%);
  z-index: -1;
}

.card-hero {
  background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(250,250,250,0.85));
  border: none;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  padding: 2.5rem !important;
}

.card-info {
  background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,249,250,0.95));
  border: none;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  text-align: center;
  padding: 2.5rem !important;
}

.transform-on-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.transform-on-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
}

.text-gradient {
  background: linear-gradient(90deg, var(--accent), var(--secondary));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 800;
  font-size: 3.6rem;
  line-height: 1.1;
  text-align: center;
  text-shadow: 0 4px 8px rgba(0,0,0,0.1);
  display: block;
  width: 100%;
  margin: 0 auto;
}

.icon-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.shadow-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

.list-styled {
  counter-reset: item;
  padding-left: 0;
}

.list-styled li {
  display: flex;
  align-items: center;
  list-style-type: none;
  justify-content: center;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
  flex-shrink: 0;
  margin-right: 1rem;
}

@media (max-width: 768px) {
  .text-gradient {
    font-size: 2.7rem;
  }
  
  .home-container {
    padding: 1rem 0;
  }
  
  .card-hero, .card-info {
    padding: 2rem !important;
  }
  
  .home-decoration, .home-decoration-2 {
    transform: scale(0.7);
  }
}
</style>
