<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')

function register(){
  if (!username.value || !password.value) { errorMessage.value = '请输入用户名和密码'; return }
  if (password.value !== confirmPassword.value) { errorMessage.value = '两次密码不一致'; return }
  const users = JSON.parse(localStorage.getItem('mm_users') || '[]')
  if (users.some(u=>u.username===username.value)){ errorMessage.value='用户名已存在'; return }
  users.push({ username: username.value, password: password.value, registerTime: new Date().toISOString() })
  localStorage.setItem('mm_users', JSON.stringify(users))
  const userObj = { username: username.value, loggedIn: true, loginTime: new Date().toISOString() }
  localStorage.setItem('mm_user', JSON.stringify(userObj))

  window.dispatchEvent(new CustomEvent('mm-auth', { detail: { type: 'login', user: userObj } }))
  router.push('/')
}

function handleKeyPress(e){ if (e.key==='Enter') register() }
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-4">
      <div class="card p-4 shadow-sm">
        <h4 class="text-center mb-4">用户注册</h4>
        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
        <div class="mb-3">
          <label class="form-label">用户名</label>
          <input v-model="username" @keypress="handleKeyPress" class="form-control" />
        </div>
        <div class="mb-3">
          <label class="form-label">密码</label>
          <input v-model="password" type="password" @keypress="handleKeyPress" class="form-control" />
        </div>
        <div class="mb-3">
          <label class="form-label">确认密码</label>
          <input v-model="confirmPassword" type="password" @keypress="handleKeyPress" class="form-control" />
        </div>
        <div class="d-grid">
          <button class="btn btn-primary" @click="register">注册并登录</button>
        </div>
        <div class="text-center mt-2">
          <router-link to="/login" class="small">已有账号？登录</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card { background: rgba(255,255,255,0.9); }
</style>
