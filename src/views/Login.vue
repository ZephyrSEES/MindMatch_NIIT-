<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')

function login() {
  if (!username.value || !password.value) {
    errorMessage.value = '请输入用户名和密码'
    return
  }
  const users = JSON.parse(localStorage.getItem('mm_users') || '[]')
  const user = users.find(u => u.username === username.value && u.password === password.value)
  if (user) {
    const userObj = { username: username.value, loggedIn: true, loginTime: new Date().toISOString() }
    localStorage.setItem('mm_user', JSON.stringify(userObj))
    // 通知应用已登录（便于更新导航栏）
    window.dispatchEvent(new CustomEvent('mm-auth', { detail: { type: 'login', user: userObj } }))
    router.push('/')
    return
  }
  // 兼容演示账号
  if (username.value === 'admin' && password.value === '123456') {
    const userObj = { username: username.value, loggedIn: true, loginTime: new Date().toISOString() }
    localStorage.setItem('mm_user', JSON.stringify(userObj))
    window.dispatchEvent(new CustomEvent('mm-auth', { detail: { type: 'login', user: userObj } }))
    router.push('/')
    return
  }
  errorMessage.value = '用户名或密码错误'
}

function handleKeyPress(e){ if (e.key === 'Enter') login() }
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-4">
      <div class="card p-4 shadow-sm">
        <h4 class="text-center mb-4">用户登录</h4>
        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
        <div class="mb-3">
          <label class="form-label">用户名</label>
          <input v-model="username" @keypress="handleKeyPress" class="form-control" />
        </div>
        <div class="mb-3">
          <label class="form-label">密码</label>
          <input v-model="password" type="password" @keypress="handleKeyPress" class="form-control" />
        </div>
        <div class="d-grid">
          <button class="btn btn-primary" @click="login">登录</button>
        </div>
        <div class="text-center mt-3">
          <small class="text-muted">演示账号: admin / 123456</small>
        </div>
        <div class="text-center mt-2">
          <router-link to="/register" class="small">没有账号？注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card { background: rgba(255,255,255,0.9); }
</style>
