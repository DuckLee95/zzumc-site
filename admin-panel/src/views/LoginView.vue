<template>
  <div class="login-shell">
    <div class="login-grid"></div>

    <section class="login-card">
      <p class="login-kicker">ZZUMC COMMAND BLOCK</p>
      <h1>管理后台登录</h1>
      <p class="login-desc">
        阶段 A 为独立后台壳层，不影响现有主站代码。
      </p>

      <form class="login-form" @submit.prevent="onSubmit">
        <label>
          <span>邮箱</span>
          <input v-model="form.email" type="email" placeholder="输入管理员邮箱" required />
        </label>

        <label>
          <span>密码</span>
          <input v-model="form.password" type="password" placeholder="输入密码" required />
        </label>

        <button type="submit" class="command-btn command-btn--primary" :disabled="loading">
          {{ loading ? '登录中...' : '进入控制台' }}
        </button>
      </form>

      <p v-if="error" class="login-error">{{ error }}</p>

      <div class="login-demo">
        <p>测试账号：</p>
        <p>super@zzumc.com / admin123</p>
        <p>content@zzumc.com / content123</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  email: 'super@zzumc.com',
  password: 'admin123',
})

const loading = ref(false)
const error = ref('')

function onSubmit() {
  loading.value = true
  error.value = ''

  const result = auth.login(form)

  if (!result.ok) {
    error.value = result.message
    loading.value = false
    return
  }

  router.replace('/dashboard')
}
</script>
