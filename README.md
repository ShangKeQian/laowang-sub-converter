# 老王订阅转换器

一个面向中文用户的订阅转换与节点整理工具。项目提供 Web 控制台和后端 API，支持多协议解析、多客户端输出、订阅合并、节点健康检测、二维码导入、短链接，以及 Docker/NAS 私有化部署。

## 核心能力

- 多协议解析：SS、SSR、VMess、VLESS、VLESS Reality、Trojan、Hysteria、Hysteria2、TUIC、Snell、HTTP、SOCKS5、Clash YAML、sing-box JSON。
- 多客户端输出：Clash、Clash Meta、Mihomo、Stash、Clash Verge、FlClash、Surge、Surfboard、Loon、Quantumult X、Shadowrocket、V2RayN、V2RayNG、V2RayU、NekoBox、Hiddify、sing-box、SFA、SFI。
- 订阅合并：批量拉取多个订阅，合并、去重、预览节点，并导出目标客户端配置。
- 健康检测：从服务器侧检测节点连通性和延迟，过滤离线节点，导出在线节点配置。
- 二维码导入：转换后的订阅地址可生成二维码；V2RayN、V2RayNG、V2RayU、Shadowrocket 等分享链接输出还支持单节点二维码。
- 短链接：把复杂转换链接保存为短码，支持自定义短码、访问统计和删除。
- 私有化部署：单 Docker 镜像同时包含前端页面、后端 API 和持久化数据目录，适合 NAS、VPS、软路由环境。

## 推荐部署

### Docker / NAS

```bash
docker run -d \
  --name laowang-sub-converter \
  -p 3000:3000 \
  -v ./data:/app/data \
  --restart unless-stopped \
  ghcr.io/tony-wang1990/laowang-sub-converter:latest
```

访问：

```text
http://NAS_IP:3000
```

短链接数据会保存在宿主机的 `./data` 目录中。

### Docker Compose

```bash
git clone https://github.com/tony-wang1990/laowang-sub-converter.git
cd laowang-sub-converter
docker compose up -d
```

### Docker Hub

仓库 Actions 默认发布 GHCR 镜像。如果要同步发布 Docker Hub，在 GitHub 仓库 Secrets 中添加：

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

配置后会自动推送：

```text
<dockerhub-user>/laowang-sub-converter:latest
```

## 本地开发

```bash
git clone https://github.com/tony-wang1990/laowang-sub-converter.git
cd laowang-sub-converter
npm install
npm run dev
```

前端开发服务默认由 Vite 启动。后端 API 可单独启动：

```bash
npm run server
```

生产构建：

```bash
npm run build
npm run server
```

## 页面说明

| 页面 | 功能 |
| --- | --- |
| 控制台 | 项目入口、协议支持概览、常用功能入口 |
| 订阅转换 | 输入订阅地址，选择客户端，生成转换订阅链接、下载配置或二维码 |
| 订阅合并 | 多订阅合并、去重、预览、导出 |
| 节点检测 | 检测节点在线状态和延迟，导出在线节点 |
| 短链接 | 创建、复制、统计、删除短链接 |
| 部署说明 | Docker、API、兼容性和发布状态说明 |

## API 接口

### 订阅转换

```http
GET /api/convert?target=clashmeta&url=https%3A%2F%2Fexample.com%2Fsub
```

常用参数：

| 参数 | 说明 |
| --- | --- |
| `target` | 目标客户端，例如 `clashmeta`、`mihomo`、`singbox`、`surge`、`v2rayn` |
| `url` | 订阅地址，需要 URL 编码 |
| `emoji` | 是否添加地区标识，`1` 或 `0` |
| `udp` | 是否启用 UDP，`1` 或 `0` |
| `sort` | 是否排序，`1` 或 `0` |
| `include` | 仅保留包含关键词的节点 |
| `exclude` | 排除包含关键词的节点 |
| `rename` | 重命名规则，例如 `old->new` |
| `rulePreset` | 分流模板：`standard`、`developer`、`gaming`、`streaming` |

### 订阅合并

```http
POST /api/merge
Content-Type: application/json

{
  "urls": [
    "https://example.com/sub1",
    "https://example.com/sub2"
  ],
  "target": "clashmeta",
  "dedupe": true,
  "emoji": true,
  "sort": false
}
```

预览接口：

```http
POST /api/merge/preview
```

### 节点健康检测

```http
POST /api/health/check
Content-Type: application/json

{
  "url": "https://example.com/sub",
  "timeout": 5000,
  "concurrent": 10,
  "exportTarget": "clashmeta"
}
```

也可以传入原始节点内容：

```json
{
  "content": "ss://...\nvmess://...",
  "exportTarget": "v2rayn"
}
```

返回内容包含节点状态、统计信息和 `exportConfig` 在线节点导出结果。

### 短链接

```http
POST /api/shortlink
Content-Type: application/json

{
  "url": "https://example.com/api/convert?target=clashmeta&url=...",
  "code": "my-profile"
}
```

列表：

```http
GET /api/shortlink/list
```

删除：

```http
DELETE /api/shortlink/:id
```

服务探针：

```http
GET /healthz
```

## 兼容性

### 输入协议

| 协议 | 支持情况 |
| --- | --- |
| SS / SSR | 支持常见 URI 格式 |
| VMess | 支持 TCP、WS、TLS 等常见参数 |
| VLESS | 支持 TLS、Reality、WS 等常见参数 |
| Trojan | 支持 TLS 和常见传输参数 |
| Hysteria / Hysteria2 | 支持主流分享链接格式 |
| TUIC | 支持常见 v5 链接 |
| Snell | 支持常见链接参数 |
| HTTP / SOCKS5 | 支持代理节点转换 |
| Clash YAML | 可解析 Clash/Mihomo 配置中的节点 |
| sing-box JSON | 可解析 sing-box outbound 节点 |

### 输出客户端

| 客户端 | 输出格式 |
| --- | --- |
| Clash / Clash Meta / Mihomo / Stash / Clash Verge / FlClash | YAML |
| Surge / Surfboard / Loon | conf / 规则文本 |
| Quantumult X | 节点配置文本 |
| Shadowrocket / V2RayN / V2RayNG / V2RayU | Base64 分享链接订阅 |
| sing-box / NekoBox / Hiddify / SFA / SFI / SFM | JSON |

## 测试

```bash
npm run build
node test-all-protocols.js
node final-comprehensive-test.mjs
npm audit --audit-level=moderate
```

当前测试覆盖协议解析、主要客户端导出、规则模板、订阅合并、去重、健康检测和在线节点导出。

## 技术栈

- 前端：Vue 3、Vite、lucide-vue-next
- 后端：Node.js、Express
- 配置解析：js-yaml
- 二维码：qrcode
- 部署：Docker、Docker Compose、GitHub Actions、GHCR、可选 Docker Hub

## 注意事项

- 该项目仅用于订阅格式转换、节点整理和自用部署，请遵守所在地法律法规。
- 健康检测结果取决于部署服务器所在网络环境，不等同于所有客户端所在地的实际可用性。
- 第三方转换 API 只作为备用选项；私有化部署建议优先使用本地服务。

## License

MIT License
