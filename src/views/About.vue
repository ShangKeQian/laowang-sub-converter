<template>
  <main class="about-page">
    <section class="about-shell">
      <header class="hero-panel">
        <div>
          <p class="eyebrow">发布与部署</p>
          <h1>部署方式、API 与兼容性说明</h1>
          <p class="subtitle">
            这里集中说明老王订阅转换器的协议支持、客户端输出、Docker/NAS 部署方式和自动化接口，
            方便自用、私有化部署或继续二次开发。
          </p>
        </div>
        <ShieldCheck :size="34" class="hero-mark" />
      </header>

      <section class="feature-grid">
        <article v-for="item in features" :key="item.title" class="feature-card">
          <component :is="item.icon" :size="22" />
          <div>
            <h2>{{ item.title }}</h2>
            <p>{{ item.body }}</p>
          </div>
        </article>
      </section>

      <section class="section-panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Docker / NAS</p>
            <h2>推荐私有化部署方式</h2>
          </div>
          <Container :size="24" />
        </div>

        <div class="deploy-grid">
          <article class="code-card">
            <div class="code-head">
              <strong>Docker run</strong>
              <button @click="copyCommand(dockerRun, 'run')">
                <Copy :size="16" />
                <span>{{ copied === 'run' ? '已复制' : '复制' }}</span>
              </button>
            </div>
            <pre><code>{{ dockerRun }}</code></pre>
          </article>

          <article class="code-card">
            <div class="code-head">
              <strong>Docker Compose</strong>
              <button @click="copyCommand(composeRun, 'compose')">
                <Copy :size="16" />
                <span>{{ copied === 'compose' ? '已复制' : '复制' }}</span>
              </button>
            </div>
            <pre><code>{{ composeRun }}</code></pre>
          </article>
        </div>

        <div class="notice-row">
          <Cloud :size="20" />
          <p>
            GitHub Actions 会自动发布多架构 GHCR 镜像。仓库配置
            <code>DOCKERHUB_USERNAME</code> 和 <code>DOCKERHUB_TOKEN</code> 后，
            还会同步推送到 <code>&lt;dockerhub-user&gt;/laowang-sub-converter:latest</code>。
          </p>
        </div>
      </section>

      <section class="section-panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">兼容矩阵</p>
            <h2>主流协议与客户端覆盖</h2>
          </div>
          <Route :size="24" />
        </div>

        <div class="matrix-grid">
          <article>
            <h3>输入协议</h3>
            <div class="pill-grid">
              <span v-for="item in protocols" :key="item">{{ item }}</span>
            </div>
          </article>
          <article>
            <h3>输出客户端</h3>
            <div class="pill-grid">
              <span v-for="item in clients" :key="item">{{ item }}</span>
            </div>
          </article>
        </div>
      </section>

      <section class="section-panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">HTTP API</p>
            <h2>可用于自动化的接口</h2>
          </div>
          <Code2 :size="24" />
        </div>

        <div class="api-grid">
          <article v-for="api in apis" :key="api.path" class="api-card">
            <span>{{ api.method }}</span>
            <h3>{{ api.path }}</h3>
            <p>{{ api.body }}</p>
          </article>
        </div>
      </section>

      <section class="section-panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">项目状态</p>
            <h2>发布前能力清单</h2>
          </div>
          <Box :size="24" />
        </div>

        <div class="check-grid">
          <article v-for="item in checklist" :key="item" class="check-row">
            <CheckCircle2 :size="18" />
            <span>{{ item }}</span>
          </article>
        </div>

        <a
          class="repo-link"
          href="https://github.com/tony-wang1990/laowang-sub-converter"
          target="_blank"
          rel="noreferrer"
        >
          <Github :size="20" />
          <span>打开 GitHub 仓库</span>
        </a>
      </section>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import {
  Box,
  CheckCircle2,
  Cloud,
  Code2,
  Container,
  Copy,
  FileJson,
  Github,
  HeartPulse,
  QrCode,
  Route,
  ShieldCheck
} from 'lucide-vue-next'

const copied = ref('')

const dockerRun = `docker run -d \\
  --name laowang-sub-converter \\
  -p 3000:3000 \\
  -v ./data:/app/data \\
  --restart unless-stopped \\
  ghcr.io/tony-wang1990/laowang-sub-converter:latest`

const composeRun = `git clone https://github.com/tony-wang1990/laowang-sub-converter.git
cd laowang-sub-converter
docker compose up -d`

const features = [
  {
    icon: FileJson,
    title: '多格式转换',
    body: '分享链接、Clash YAML、sing-box JSON 和混合订阅内容都会先统一解析，再生成目标格式。'
  },
  {
    icon: Route,
    title: '客户端适配',
    body: '按 Clash Meta、Mihomo、Stash、Surge、Loon、Quantumult X、V2RayN、Hiddify 等客户端输出。'
  },
  {
    icon: QrCode,
    title: '二维码导入',
    body: '转换后的订阅地址和单节点分享链接可以生成二维码，方便手机客户端扫码导入。'
  },
  {
    icon: HeartPulse,
    title: '健康检测导出',
    body: '支持从服务器侧检测节点可用性，筛掉离线节点，并导出在线节点配置。'
  }
]

const protocols = [
  'SS',
  'SSR',
  'VMess',
  'VLESS',
  'Trojan',
  'Hysteria',
  'Hysteria2',
  'TUIC',
  'Snell',
  'HTTP',
  'SOCKS5',
  'Clash YAML',
  'sing-box JSON'
]

const clients = [
  'Clash',
  'Clash Meta',
  'Mihomo',
  'Stash',
  'Clash Verge',
  'FlClash',
  'Surge',
  'Surfboard',
  'Loon',
  'Quantumult X',
  'Shadowrocket',
  'V2RayN',
  'V2RayNG',
  'NekoBox',
  'Hiddify',
  'sing-box'
]

const apis = [
  {
    method: 'GET',
    path: '/api/convert',
    body: '把一个订阅地址或原始内容转换成目标客户端格式。'
  },
  {
    method: 'POST',
    path: '/api/merge',
    body: '拉取多个订阅、合并去重，并返回一个转换后的输出。'
  },
  {
    method: 'POST',
    path: '/api/health/check',
    body: '检测节点可用性，并返回在线节点导出内容。'
  },
  {
    method: 'POST',
    path: '/api/shortlink',
    body: '创建可持久化的短链接，支持自定义短码。'
  }
]

const checklist = [
  '转换工具无需登录，打开即可使用。',
  'Docker 镜像包含前端、后端 API 和短链接持久化数据目录。',
  '健康检测支持订阅地址、原始节点、批量探测和在线节点导出。',
  '订阅合并、短链接、检测页面已统一为中文控制台风格。',
  '协议与客户端兼容性已纳入自动化回归测试。'
]

const copyCommand = async (text, key) => {
  await navigator.clipboard.writeText(text)
  copied.value = key
  window.setTimeout(() => {
    if (copied.value === key) copied.value = ''
  }, 1400)
}
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  padding: 118px 24px 56px;
  background:
    linear-gradient(135deg, rgba(20, 184, 166, 0.12), transparent 34%),
    linear-gradient(225deg, rgba(99, 102, 241, 0.14), transparent 42%),
    #020617;
}

.about-shell {
  display: grid;
  gap: 18px;
  width: min(1120px, 100%);
  margin: 0 auto;
}

.hero-panel,
.section-panel,
.feature-card {
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.78);
}

.hero-panel {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: clamp(26px, 4vw, 40px);
}

.hero-mark,
.section-heading > svg,
.feature-card > svg {
  flex: 0 0 auto;
  color: #67e8f9;
}

.eyebrow {
  color: #22d3ee;
  font-size: 0.86rem;
  font-weight: 900;
}

h1 {
  max-width: 780px;
  margin-top: 10px;
  color: #f8fafc;
  font-size: clamp(2rem, 3.8vw, 3.45rem);
  line-height: 1.12;
}

h2,
h3 {
  color: #f8fafc;
}

.subtitle {
  max-width: 760px;
  margin-top: 14px;
  color: #cbd5e1;
  font-size: 1rem;
  line-height: 1.8;
}

.feature-grid,
.deploy-grid,
.matrix-grid,
.api-grid,
.check-grid {
  display: grid;
  gap: 12px;
}

.feature-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.feature-card {
  display: flex;
  gap: 12px;
  min-height: 148px;
  padding: 16px;
}

.feature-card h2,
.section-heading h2 {
  font-size: 1.08rem;
}

.feature-card p,
.notice-row p,
.api-card p,
.check-row span {
  color: #94a3b8;
  font-size: 0.92rem;
  line-height: 1.7;
}

.section-panel {
  display: grid;
  gap: 16px;
  padding: 20px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.deploy-grid,
.matrix-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.code-card,
.matrix-grid article,
.api-card,
.check-row,
.notice-row {
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 8px;
  background: rgba(2, 6, 23, 0.4);
}

.code-card {
  overflow: hidden;
}

.code-head,
.notice-row,
.check-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.code-head {
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.16);
}

.code-head strong {
  color: #f8fafc;
}

.code-head button,
.repo-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 36px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 8px;
  color: #cbd5e1;
  background: rgba(15, 23, 42, 0.64);
  font: inherit;
  font-weight: 900;
  cursor: pointer;
  text-decoration: none;
}

.code-head button {
  padding: 0 10px;
}

pre {
  margin: 0;
  padding: 14px;
  overflow: auto;
}

code {
  color: #67e8f9;
  font-family: var(--font-mono);
  font-size: 0.86rem;
}

.notice-row {
  padding: 14px;
}

.notice-row svg,
.check-row svg {
  flex: 0 0 auto;
  color: #86efac;
}

.matrix-grid article {
  padding: 16px;
}

.matrix-grid h3 {
  margin-bottom: 12px;
  font-size: 1rem;
}

.pill-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill-grid span {
  padding: 7px 10px;
  border: 1px solid rgba(34, 211, 238, 0.22);
  border-radius: 8px;
  color: #cbd5e1;
  background: rgba(8, 47, 73, 0.38);
  font-size: 0.84rem;
  font-weight: 800;
}

.api-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.api-card {
  min-height: 142px;
  padding: 16px;
}

.api-card span {
  display: inline-block;
  margin-bottom: 10px;
  color: #67e8f9;
  font-size: 0.76rem;
  font-weight: 900;
}

.api-card h3 {
  margin-bottom: 8px;
  font-family: var(--font-mono);
  font-size: 0.95rem;
}

.check-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.check-row {
  padding: 13px;
}

.repo-link {
  width: fit-content;
  padding: 0 14px;
}

@media (max-width: 980px) {
  .feature-grid,
  .api-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .about-page {
    padding: 100px 14px 36px;
  }

  .hero-panel {
    flex-direction: column;
  }

  .feature-grid,
  .deploy-grid,
  .matrix-grid,
  .api-grid,
  .check-grid {
    grid-template-columns: 1fr;
  }
}
</style>
