<template>
  <section class="result-panel" v-if="result">
    <div class="result-copy">
      <div>
        <p class="eyebrow">转换结果</p>
        <h2>已生成可导入订阅</h2>
      </div>
      <div class="result-actions">
        <button class="icon-button" @click="copyLink" :title="copied ? '已复制' : '复制链接'">
          <Check v-if="copied" :size="18" />
          <Copy v-else :size="18" />
        </button>
        <button class="icon-button" @click="downloadConfig" title="下载转换配置" :disabled="downloading">
          <Loader2 v-if="downloading" :size="18" class="spin" />
          <Download v-else :size="18" />
        </button>
        <button class="icon-button" @click="toggleQR" title="显示二维码" :disabled="qrLoading">
          <Loader2 v-if="qrLoading" :size="18" class="spin" />
          <QrCode v-else :size="18" />
        </button>
      </div>
    </div>

    <div class="result-url">
      <input type="text" :value="result" readonly ref="urlInput" />
    </div>

    <p v-if="error" class="download-error">{{ error }}</p>

    <transition name="fade">
      <div v-if="showQR" class="qr-panel">
        <div class="qr-header">
          <div>
            <p class="eyebrow">扫码导入</p>
            <h3>{{ clientLabel }} 二维码</h3>
          </div>
          <span>{{ qrItems.length }} 个二维码</span>
        </div>

        <div class="qr-tabs" v-if="qrItems.length > 1">
          <button
            v-for="(item, index) in qrItems"
            :key="item.id"
            :class="{ active: activeQrIndex === index }"
            @click="activeQrIndex = index"
          >
            {{ item.shortTitle }}
          </button>
        </div>

        <div class="qr-card" v-if="activeQrItem">
          <canvas ref="qrCanvas"></canvas>
          <div class="qr-meta">
            <strong>{{ activeQrItem.title }}</strong>
            <p>{{ activeQrItem.description }}</p>
            <button class="copy-qr-value" @click="copyQrValue">
              <Copy :size="15" />
              <span>{{ qrValueCopied ? '已复制' : '复制二维码内容' }}</span>
            </button>
          </div>
        </div>

        <p v-if="qrMessage" class="qr-note">{{ qrMessage }}</p>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import QRCode from 'qrcode'
import { Check, Copy, Download, Loader2, QrCode } from 'lucide-vue-next'

const props = defineProps({
  result: {
    type: String,
    default: ''
  }
})

const copied = ref(false)
const downloading = ref(false)
const showQR = ref(false)
const qrLoading = ref(false)
const qrValueCopied = ref(false)
const error = ref('')
const qrMessage = ref('')
const qrItems = ref([])
const activeQrIndex = ref(0)
const urlInput = ref(null)
const qrCanvas = ref(null)

const SHARE_LINK_TARGETS = new Set(['shadowrocket', 'v2rayn', 'v2rayng', 'v2rayu'])
const clientNames = {
  clash: 'Clash',
  clashmeta: 'Clash Meta',
  mihomo: 'Mihomo',
  stash: 'Stash',
  clashverge: 'Clash Verge',
  flclash: 'FlClash',
  surge: 'Surge',
  quantumultx: 'Quantumult X',
  shadowrocket: 'Shadowrocket',
  loon: 'Loon',
  v2rayn: 'V2RayN',
  v2rayng: 'V2RayNG',
  v2rayu: 'V2RayU',
  surfboard: 'Surfboard',
  singbox: 'sing-box',
  'sing-box': 'sing-box',
  nekobox: 'NekoBox',
  hiddify: 'Hiddify',
  sfa: 'SFA',
  sfi: 'SFI',
  sfm: 'SFM'
}

const target = computed(() => {
  try {
    return new URL(props.result).searchParams.get('target') || 'config'
  } catch {
    return 'config'
  }
})

const clientLabel = computed(() => clientNames[target.value] || target.value)
const activeQrItem = computed(() => qrItems.value[activeQrIndex.value])

const copyLink = async () => {
  await copyText(props.result)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1800)
}

const copyQrValue = async () => {
  if (!activeQrItem.value) return
  await copyText(activeQrItem.value.value)
  qrValueCopied.value = true
  setTimeout(() => {
    qrValueCopied.value = false
  }, 1600)
}

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    urlInput.value?.select()
    document.execCommand('copy')
  }
}

const downloadConfig = async () => {
  error.value = ''
  downloading.value = true
  try {
    const response = await fetch(props.result)
    if (!response.ok) {
      const text = await response.text()
      throw new Error(text || `HTTP ${response.status}`)
    }

    const blob = await response.blob()
    const extension = ['singbox', 'sing-box', 'nekobox', 'hiddify', 'sfa', 'sfi', 'sfm'].includes(target.value)
      ? 'json'
      : ['clash', 'clashmeta', 'mihomo', 'stash', 'clashverge', 'clash-verge', 'clashnyanpasu', 'clash-nyanpasu', 'flclash'].includes(target.value)
        ? 'yaml'
        : ['surge', 'loon', 'surfboard'].includes(target.value)
          ? 'conf'
          : 'txt'

    const objectUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = objectUrl
    a.download = `${target.value}-config.${extension}`
    a.click()
    URL.revokeObjectURL(objectUrl)
  } catch (err) {
    error.value = err.message || '下载失败'
  } finally {
    downloading.value = false
  }
}

const toggleQR = async () => {
  showQR.value = !showQR.value
  if (showQR.value) {
    await prepareQrItems()
    await renderActiveQr()
  }
}

const prepareQrItems = async () => {
  qrLoading.value = true
  qrMessage.value = ''
  activeQrIndex.value = 0
  qrItems.value = [{
    id: 'subscription',
    shortTitle: '订阅',
    title: `${clientLabel.value} 订阅导入`,
    description: '适合支持扫描订阅地址的客户端，手机端通常最稳定。',
    value: props.result
  }]

  try {
    if (SHARE_LINK_TARGETS.has(target.value)) {
      const response = await fetch(props.result)
      if (!response.ok) throw new Error(`加载转换结果失败：HTTP ${response.status}`)
      const encoded = await response.text()
      const links = decodeBase64Lines(encoded)
      qrItems.value.push(...links.map((link, index) => ({
        id: `node-${index + 1}`,
        shortTitle: `节点 ${index + 1}`,
        title: nodeTitle(link, index),
        description: '单节点分享链接二维码，适合支持直接扫码导入节点的客户端。',
        value: link
      })))
      if (!links.length) {
        qrMessage.value = '当前输出没有解析到单节点分享链接。'
      }
    } else {
      qrMessage.value = '该客户端推荐扫描订阅地址二维码；完整 YAML/JSON 通常过大，不适合直接生成二维码。'
    }
  } catch (err) {
    qrMessage.value = err.message || '无法加载更多二维码，订阅地址二维码仍可使用。'
  } finally {
    qrLoading.value = false
  }
}

const decodeBase64Lines = (value) => {
  try {
    const normalized = value.trim().replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    return decodeURIComponent(escape(atob(padded)))
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.includes('://'))
  } catch {
    return []
  }
}

const nodeTitle = (link, index) => {
  try {
    const hash = link.includes('#') ? decodeURIComponent(link.split('#').pop()) : ''
    return hash || `节点 ${index + 1}`
  } catch {
    return `节点 ${index + 1}`
  }
}

const renderActiveQr = async () => {
  await nextTick()
  if (!showQR.value || !activeQrItem.value || !qrCanvas.value) return
  try {
    await QRCode.toCanvas(qrCanvas.value, activeQrItem.value.value, {
      width: 236,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#0f172a', light: '#ffffff' }
    })
  } catch {
    qrMessage.value = '二维码内容过长，建议扫描订阅地址二维码或直接下载配置。'
  }
}

watch(activeQrIndex, renderActiveQr)
watch(() => props.result, () => {
  showQR.value = false
  qrItems.value = []
  activeQrIndex.value = 0
})
</script>

<style scoped>
.result-panel {
  margin-top: 18px;
  padding: 20px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.72);
}

.result-copy,
.qr-header,
.qr-card {
  display: flex;
  gap: 16px;
}

.result-copy,
.qr-header {
  align-items: center;
  justify-content: space-between;
}

.result-copy {
  margin-bottom: 14px;
}

.eyebrow {
  margin-bottom: 4px;
  color: #38bdf8;
  font-size: 0.8rem;
  font-weight: 900;
}

h2 {
  color: #f8fafc;
  font-size: 1.16rem;
}

h3 {
  color: #f8fafc;
  font-size: 1rem;
}

.result-actions {
  display: flex;
  gap: 8px;
}

.icon-button,
.copy-qr-value,
.qr-tabs button {
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 8px;
  color: #e5e7eb;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
}

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.icon-button:hover,
.copy-qr-value:hover,
.qr-tabs button:hover,
.qr-tabs button.active {
  border-color: #22d3ee;
  color: #67e8f9;
}

.icon-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.result-url input {
  width: 100%;
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 8px;
  color: #d1d5db;
  background: rgba(2, 6, 23, 0.7);
  font-family: var(--font-mono);
}

.download-error {
  margin-top: 10px;
  color: #fb7185;
  font-size: 0.9rem;
}

.qr-panel {
  display: grid;
  gap: 14px;
  margin-top: 16px;
  padding: 16px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 8px;
  background: rgba(2, 6, 23, 0.42);
}

.qr-header span {
  color: #94a3b8;
  font-size: 0.84rem;
  font-weight: 800;
}

.qr-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.qr-tabs button {
  min-height: 34px;
  padding: 0 11px;
  font: inherit;
  font-size: 0.84rem;
  font-weight: 900;
}

.qr-card {
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.75);
}

.qr-card canvas {
  flex: 0 0 auto;
  padding: 10px;
  border-radius: 8px;
  background: #ffffff;
}

.qr-meta {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.qr-meta strong {
  color: #f8fafc;
}

.qr-meta p,
.qr-note {
  color: #94a3b8;
  font-size: 0.9rem;
  line-height: 1.65;
}

.copy-qr-value {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: fit-content;
  min-height: 36px;
  padding: 0 11px;
  font: inherit;
  font-size: 0.84rem;
  font-weight: 900;
}

.spin {
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 720px) {
  .result-copy,
  .qr-header,
  .qr-card {
    align-items: stretch;
    flex-direction: column;
  }

  .qr-card canvas {
    align-self: center;
  }
}
</style>
