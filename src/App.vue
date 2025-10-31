<template>
  <div class="app-container">
    <!-- 背景装饰 -->
    <div class="background-decoration"></div>
    
    <!-- 导航栏 -->
    <nav class="navbar navbar-expand-lg navbar-white bg-white/90 backdrop-blur-md shadow-md">
      <div class="container">
        <a class="navbar-brand nav-brand" href="#" @click.prevent="goHome">
          <span class="brand-logo">MindMatch</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navMain">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link nav-link-custom" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link nav-link-custom" to="/quiz">Start Test</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link nav-link-custom" to="/history">History</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link nav-link-custom" to="/match">Match Two</router-link>
            </li>
            <template v-if="!isLoggedIn">
              <li class="nav-item"><router-link class="nav-link nav-link-custom" to="/login">Login</router-link></li>
              <li class="nav-item"><router-link class="nav-link nav-link-custom" to="/register">Register</router-link></li>
            </template>
            <li class="nav-item dropdown" v-else>
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                {{ currentUser.username }}
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" @click.prevent="logout">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- 主内容区 -->
    <main class="container py-8">
      <router-view class="fade-in" />
    </main>

    <!-- 页脚 -->
    <footer class="text-center footer-custom">
      <div class="container">
        <p class="footer-text">MindMatch Prototype — Frontend demo · Built with Vue 3, Bootstrap & Chart.js</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
const router = useRouter()
const isLoggedIn = ref(false)
const currentUser = ref({})

onMounted(()=>{
  const u = localStorage.getItem('mm_user')
  if (u) {
    const p = JSON.parse(u)
    if (p.loggedIn) { isLoggedIn.value = true; currentUser.value = p }
  }
  // 监听自定义事件（同标签页内）
  const handler = (e) => {
    if (!e || !e.detail) return
    if (e.detail.type === 'login') {
      isLoggedIn.value = true
      currentUser.value = e.detail.user || {}
    } else if (e.detail.type === 'logout') {
      isLoggedIn.value = false
      currentUser.value = {}
    }
  }
  window.addEventListener('mm-auth', handler)
  // 监听 storage 事件（跨标签页登录/登出）
  const storageHandler = () => {
    const uu = localStorage.getItem('mm_user')
    if (uu) {
      const pp = JSON.parse(uu)
      if (pp.loggedIn) { isLoggedIn.value = true; currentUser.value = pp }
      else { isLoggedIn.value = false; currentUser.value = {} }
    } else { isLoggedIn.value = false; currentUser.value = {} }
  }
  window.addEventListener('storage', storageHandler)
  // 清理函数
  onUnmounted(() => {
    window.removeEventListener('mm-auth', handler)
    window.removeEventListener('storage', storageHandler)
  })
})

function goHome() { router.push('/') }
function logout(){ localStorage.removeItem('mm_user'); window.dispatchEvent(new CustomEvent('mm-auth', { detail: { type: 'logout' } })); isLoggedIn.value=false; currentUser.value={}; router.push('/login') }
</script>

<style>
/* 全局变量 */
:root {
  --primary: #7c3aed; /* 主色调 - 紫色 */
  --primary-light: #c4b5fd;
  --primary-dark: #6d28d9;
  --secondary: #10b981; /* 辅助色 - 绿色 */
  --secondary-light: #34d399;
  --accent: #6f42c1;
  --muted: #6c757d;
  --light: #f8fafc;
  --dark: #1e293b;
  --border-radius: 12px;
  --transition: all 0.3s ease;
}

/* 基础样式 */
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: var(--light);
  min-height: 100vh;
  color: var(--dark);
  line-height: 1.6;
}

/* 应用容器 */
.app-container {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
}

/* 背景装饰 */
.background-decoration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 10% 20%, rgba(124, 58, 237, 0.05) 0%, rgba(16, 185, 129, 0.05) 90.1%);
  z-index: -1;
  pointer-events: none;
}

/* 导航栏样式 */
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: var(--transition);
}

.navbar:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.brand-logo {
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transition: var(--transition);
}

.brand-logo:hover {
  background: linear-gradient(45deg, var(--primary-dark), var(--secondary-light));
  -webkit-background-clip: text;
  background-clip: text;
}

.nav-link-custom {
  position: relative;
  color: var(--dark);
  font-weight: 500;
  transition: var(--transition);
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  border-radius: var(--border-radius);
  border: 2px solid transparent;
}

.nav-link-custom:hover,
.nav-link-custom.router-link-active {
  color: var(--primary);
  background-color: rgba(124, 58, 237, 0.05);
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.nav-link-custom.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background-color: var(--primary);
  border-radius: 1.5px;
}

/* 通用a元素紫色边框 */
a {
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

a:hover {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

/* 主内容区 */
main {
  position: relative;
  z-index: 1;
}

/* 卡片样式增强 */
.card {
  border: none;
  border-radius: var(--border-radius);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03);
  transition: var(--transition);
  background-color: white;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.card-ghost {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 按钮样式增强 */
.btn {
  border-radius: var(--border-radius);
  padding: 0.625rem 1.25rem;
  font-weight: 500;
  transition: var(--transition);
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: linear-gradient(45deg, var(--primary), var(--primary-dark));
}

.btn-primary:hover {
  background: linear-gradient(45deg, var(--primary-dark), var(--primary));
  transform: translateY(-1px);
}

.btn-outline-secondary {
  border: 2px solid var(--muted);
  color: var(--muted);
}

.btn-outline-secondary:hover {
  background-color: var(--muted);
  color: white;
}

/* 表单样式增强 */
.form-control {
  border-radius: var(--border-radius);
  border: 2px solid #e2e8f0;
  padding: 0.75rem 1rem;
  transition: var(--transition);
  font-size: 0.9rem;
}

.form-control:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
  outline: none;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--dark);
}

/* 列表样式增强 */
.list-group-item {
  border: none;
  border-bottom: 1px solid #f1f5f9;
  padding: 1rem;
  transition: var(--transition);
}

.list-group-item:hover {
  background-color: #f8fafc;
}

/* 徽章样式增强 */
.badge {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 9999px;
}

.badge-primary {
  background-color: var(--primary);
}

.badge-success {
  background-color: var(--secondary);
}

/* 页脚样式 */
.footer-custom {
  background-color: white;
  border-top: 1px solid #f1f5f9;
  padding: 2rem 0;
  margin-top: 3rem;
  transition: var(--transition);
}

.footer-text {
  color: var(--muted);
  font-size: 0.875rem;
  margin: 0;
}

/* 动画效果 */
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .nav-link-custom {
    margin: 0.25rem 0;
  }
  
  .card {
    margin-bottom: 1.5rem;
  }
}

/* 特殊组件样式 */
.question-card {
  min-height: 250px;
  display: flex;
  flex-direction: column;
}

.progress-custom {
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
  background-color: #f1f5f9;
}

.progress-bar {
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  transition: width 0.5s ease;
  display: block;
  height: 100%;
}
</style>
