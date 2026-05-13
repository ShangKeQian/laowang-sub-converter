<template>
  <main class="tool-page">
    <section class="tool-shell">
      <header class="hero-panel">
        <div>
          <p class="eyebrow">短链接管理</p>
          <h1>把复杂订阅地址压缩成固定短码</h1>
          <p class="subtitle">为转换后的长链接创建可分享、可统计、可删除的短链接，方便 NAS、手机和客户端快速导入。</p>
        </div>
        <LinkIcon :size="32" class="hero-mark" />
      </header>

      <section class="control-panel">
        <div class="form-grid">
          <label class="field wide">
            <span>原始地址</span>
            <input v-model="newUrl" placeholder="https://example.com/api/convert?target=..." />
          </label>
          <label class="field">
            <span>自定义短码</span>
            <input v-model="customCode" placeholder="my-profile" />
          </label>
        </div>

        <div class="actions">
          <button class="primary" @click="createShortLink" :disabled="!newUrl.trim() || loading">
            <Loader2 v-if="loading" :size="18" class="spin" />
            <Plus v-else :size="18" />
            <span>{{ loading ? '创建中' : '创建短链接' }}</span>
          </button>
          <button class="secondary" @click="loadShortLinks">
            <RefreshCw :size="18" />
            <span>刷新列表</span>
          </button>
        </div>

        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ success }}</p>
      </section>

      <section class="result-panel">
        <div class="list-header">
          <div>
            <p class="eyebrow">短链列表</p>
            <h2>{{ shortLinks.length }} 个短链接</h2>
          </div>
        </div>

        <div v-if="shortLinks.length" class="link-list">
          <article v-for="link in shortLinks" :key="link.id" class="link-row">
            <div class="link-main">
              <strong>{{ link.shortUrl }}</strong>
              <span :title="link.originalUrl">{{ link.originalUrl }}</span>
            </div>
            <div class="link-meta">
              <span>{{ link.clicks }} 次访问</span>
              <span>{{ formatDate(link.createdAt) }}</span>
            </div>
            <div class="row-actions">
              <button title="复制" @click="copyLink(link.shortUrl)">
                <Copy :size="17" />
              </button>
              <button title="删除" @click="deleteLink(link.id)">
                <Trash2 :size="17" />
              </button>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">
          <LinkIcon :size="28" />
          <p>还没有创建短链接。</p>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Copy, Link as LinkIcon, Loader2, Plus, RefreshCw, Trash2 } from 'lucide-vue-next'

const newUrl = ref('')
const customCode = ref('')
const loading = ref(false)
const shortLinks = ref([])
const error = ref('')
const success = ref('')

const createShortLink = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    const response = await fetch('/api/shortlink', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: newUrl.value.trim(), code: customCode.value.trim() || undefined })
    })
    const data = await response.json()
    if (!response.ok || data.error) throw new Error(data.error || `HTTP ${response.status}`)
    shortLinks.value = [normalizeLink(data), ...shortLinks.value.filter(link => link.id !== data.id)]
    newUrl.value = ''
    customCode.value = ''
    success.value = '短链接已创建。'
  } catch (err) {
    error.value = err.message || '创建失败'
  } finally {
    loading.value = false
  }
}

const loadShortLinks = async () => {
  error.value = ''
  try {
    const response = await fetch('/api/shortlink/list')
    const data = await response.json()
    if (!response.ok || data.error) throw new Error(data.error || `HTTP ${response.status}`)
    shortLinks.value = (data.links || []).map(normalizeLink)
  } catch (err) {
    error.value = err.message || '加载失败'
  }
}

const copyLink = async (url) => {
  await navigator.clipboard.writeText(url)
  success.value = '已复制到剪贴板。'
}

const deleteLink = async (id) => {
  if (!confirm('确定删除这个短链接吗？')) return
  error.value = ''
  try {
    const response = await fetch(`/api/shortlink/${id}`, { method: 'DELETE' })
    const data = await response.json()
    if (!response.ok || data.error) throw new Error(data.error || `HTTP ${response.status}`)
    shortLinks.value = shortLinks.value.filter(link => link.id !== id)
    success.value = '短链接已删除。'
  } catch (err) {
    error.value = err.message || '删除失败'
  }
}

const normalizeLink = item => ({
  id: item.id,
  shortUrl: item.shortUrl,
  originalUrl: item.originalUrl,
  clicks: item.clicks || 0,
  createdAt: item.createdAt || item.created || new Date().toISOString()
})

const formatDate = date => date ? new Date(date).toLocaleDateString('zh-CN') : '-'

onMounted(loadShortLinks)
</script>

<style scoped>
.tool-page {
  min-height: 100vh;
  padding: 118px 24px 56px;
  background:
    linear-gradient(135deg, rgba(20, 184, 166, 0.12), transparent 34%),
    linear-gradient(225deg, rgba(99, 102, 241, 0.14), transparent 42%),
    #020617;
}

.tool-shell {
  display: grid;
  gap: 18px;
  width: min(1120px, 100%);
  margin: 0 auto;
}

.hero-panel,
.control-panel,
.result-panel {
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.78);
}

.hero-panel {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: clamp(26px, 4vw, 40px);
}

.hero-mark {
  flex: 0 0 auto;
  color: #67e8f9;
}

.eyebrow {
  color: #22d3ee;
  font-size: 0.86rem;
  font-weight: 900;
}

h1 {
  max-width: 760px;
  margin-top: 10px;
  color: #f8fafc;
  font-size: clamp(2rem, 3.8vw, 3.45rem);
  line-height: 1.12;
}

h2 {
  color: #f8fafc;
  font-size: 1.2rem;
}

.subtitle {
  max-width: 720px;
  margin-top: 14px;
  color: #cbd5e1;
  font-size: 1rem;
  line-height: 1.8;
}

.control-panel,
.result-panel {
  display: grid;
  gap: 16px;
  padding: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 240px;
  gap: 12px;
}

.field {
  display: grid;
  gap: 8px;
}

.field span {
  color: #cbd5e1;
  font-size: 0.88rem;
  font-weight: 900;
}

input {
  width: 100%;
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 8px;
  color: #f8fafc;
  background: rgba(2, 6, 23, 0.72);
  font: inherit;
}

.actions,
.row-actions,
.list-header,
.link-row,
.link-meta {
  display: flex;
  gap: 10px;
}

.actions,
.list-header,
.link-row {
  align-items: center;
}

.list-header,
.link-row {
  justify-content: space-between;
}

.primary,
.secondary,
.row-actions button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  font: inherit;
  font-size: 0.94rem;
  font-weight: 900;
  cursor: pointer;
}

.primary,
.secondary {
  min-height: 44px;
  padding: 0 14px;
}

.primary {
  border: 0;
  color: #03131a;
  background: #67e8f9;
}

.secondary,
.row-actions button {
  border: 1px solid rgba(148, 163, 184, 0.22);
  color: #cbd5e1;
  background: rgba(15, 23, 42, 0.64);
}

.primary:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.link-list {
  display: grid;
  gap: 10px;
}

.link-row {
  padding: 14px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 8px;
  background: rgba(2, 6, 23, 0.4);
}

.link-main {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.link-main strong,
.link-main span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-main strong {
  color: #f8fafc;
}

.link-main span,
.link-meta,
.empty-state {
  color: #94a3b8;
}

.link-meta {
  flex: 0 0 auto;
  flex-direction: column;
  align-items: flex-end;
  font-size: 0.84rem;
}

.row-actions button {
  width: 38px;
  height: 38px;
}

.error {
  color: #fecdd3;
}

.success {
  color: #bbf7d0;
}

.empty-state {
  display: grid;
  place-items: center;
  gap: 10px;
  min-height: 180px;
}

.spin {
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 820px) {
  .tool-page {
    padding: 100px 14px 36px;
  }

  .form-grid,
  .link-row,
  .hero-panel {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: stretch;
  }

  .link-meta {
    align-items: flex-start;
  }
}
</style>
