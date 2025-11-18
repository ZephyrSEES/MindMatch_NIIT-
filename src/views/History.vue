<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const list = ref([])
onMounted(()=>{

  const user = JSON.parse(localStorage.getItem('mm_user')||'null')
  const username = user && user.username ? user.username : null
  const all = JSON.parse(localStorage.getItem('mm_history')||'[]') || []
  list.value = username ? all.filter(it => it.username === username) : []
})
function view(id){ router.push({ name:'result', params:{ id } }) }
function clearAll(){ if(confirm('确认清除所有历史记录？')){ localStorage.removeItem('mm_history'); list.value=[] } }
function exportJSON(){ const data = localStorage.getItem('mm_history')||'[]'; const a=document.createElement('a'); a.href='data:application/json;charset=utf-8,'+encodeURIComponent(data); a.download='mindmatch_history.json'; a.click() }
function formatDate(s){ return new Date(s).toLocaleString() }
</script>

<template>
  <div class="card p-4 shadow-sm">
    <h4>历史记录</h4>
    <p class="text-muted">本地保存的测试记录（localStorage）</p>
    <div v-if="list.length===0" class="text-center py-4 text-muted">
      暂无历史记录，先去做一个测试吧。
    </div>
    <div v-else>
      <div class="list-group mb-3">
        <button v-for="it in list" :key="it.id" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" @click="view(it.id)">
          <div>
            <div class="fw-semibold">测试 - {{formatDate(it.date)}}</div>
            <div class="small text-muted">用户: {{it.username || '匿名'}} · 回答: {{it.answers.filter(Boolean).length}} / {{it.answers.length}}</div>
          </div>
          <div><span class="badge bg-secondary me-2">查看</span></div>
        </button>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-danger" @click="clearAll">清除全部</button>
        <button class="btn btn-outline-secondary" @click="exportJSON">导出 JSON</button>
      </div>
    </div>
  </div>
</template>
