import { parseSubscription } from './server/utils/parsers.js'
import { convertToTarget } from './server/utils/converters.js'

const mockSubscription = `
ss://YWVzLTI1Ni1nY206cGFzc3dvcmRAMTI3LjAuMC4xOjg4ODg=#SS-SIP002
ss://YWVzLTI1Ni1nY206cGFzc3dvcmRAMTI3LjAuMC4xOjg4ODg#SS-Legacy
vmess://ew0KICAidiI6ICIyIiwNCiAgInBzIjogIlZNZXNzLVRDUCIsDQogICJhZGQiOiAiMTI3LjAuMC4xIiwNCiAgInBvcnQiOiAiNDQzIiwNCiAgImlkIjogImFkODBiYjRkLWY2MzItNDU1Ny04NTViLTk4ZGMzODllNzZlNzk1IiwNCiAgImFpZCI6ICIwIiwNCiAgIm5ldCI6ICJ0Y3AiLA0KICAidHlwZSI6ICJub25lIiwNCiAgImhvc3QiOiAiIiwNCiAgInBhdGgiOiAiIiwNCiAgInRscyI6ICIiDQp9
vmess://ew0KICAidiI6ICIyIiwNCiAgInBzIjogIlZNZXNzLVdTLVRMUyIsDQogICJhZGQiOiAiZXhhbXBsZS5jb20iLA0KICAicG9ydCI6ICI0NDMiLA0KICAiaWQiOiAiYWQ4MGJiNGQtZjYzMi00NTU3LTg1NWItOThkYzM4OWU3Njk1IiwNCiAgImFpZCI6ICIwIiwNCiAgIm5ldCI6ICJ3cyIsDQogICJ0eXBlIjogIm5vbmUiLA0KICAiaG9zdCI6ICJleGFtcGxlLmNvbSIsDQogICJwYXRoIjogIi93cyIsDQogICJ0bHMiOiAidGxzIg0KfQ==
vless://uuid@example.com:443?security=reality&sni=google.com&fp=chrome&pbk=7_...&sid=123456&type=tcp&flow=xtls-rprx-vision#VLESS-Reality
vless://uuid@example.com:443?security=tls&type=ws&host=example.com&path=%2Fws#VLESS-WS-TLS
trojan://password@example.com:443?sni=example.com#Trojan-TLS
hysteria://example.com:443?auth=password&upmbps=100&downmbps=100&alpn=h3&obfs=x&peer=example.com#Hysteria-1
hysteria2://password@example.com:443?sni=example.com&obfs=salamander&obfs-password=pwd&insecure=1#Hysteria-2
tuic://uuid:password@example.com:443?congestion_control=bbr&alpn=h3&sni=example.com&udp_relay_mode=native&allow_insecure=1#TUIC
snell://psk@example.com:443?version=3&obfs=http&obfs-host=example.com#Snell
http://user:pass@example.com:8080#HTTP
socks5://user:pass@example.com:1080#SOCKS5
ssr://MTI3LjAuMC4xOjg4ODg6YXV0aF9hZXMxMjhfbWQ1OmNoYWNoYTIwOnBsYWluOllXVnpMVElMOne8dXJsNjRfZGVjb2RlPj4gIyBTU1I=
`

const clashYaml = `
proxies:
  - name: Clash-SS
    type: ss
    server: example.com
    port: 8388
    cipher: aes-256-gcm
    password: password
  - name: Clash-HTTP
    type: http
    server: example.com
    port: 8080
    username: user
    password: pass
`

const singBoxJson = JSON.stringify({
    outbounds: [
        {
            tag: 'SingBox-VLESS',
            type: 'vless',
            server: 'example.com',
            server_port: 443,
            uuid: 'uuid',
            tls: { enabled: true, server_name: 'example.com' },
            transport: { type: 'ws', path: '/ws', headers: { Host: 'example.com' } }
        }
    ]
})

async function runTests() {
    console.log('--- Starting Protocol Matrix Test ---')

    const nodes = parseSubscription(mockSubscription)
    const expectedTypes = ['ss', 'ss', 'vmess', 'vmess', 'vless', 'vless', 'trojan', 'hysteria', 'hysteria2', 'tuic', 'snell', 'http', 'socks5', 'ssr']

    if (nodes.length !== expectedTypes.length) {
        throw new Error(`Expected ${expectedTypes.length} nodes, got ${nodes.length}`)
    }

    nodes.forEach((node, index) => {
        if (node.type !== expectedTypes[index]) {
            throw new Error(`Node ${index + 1} expected ${expectedTypes[index]}, got ${node.type}`)
        }
        console.log(`ok parse ${index + 1}: ${node.type} ${node.name}`)
    })

    const clashNodes = parseSubscription(clashYaml)
    if (clashNodes.length !== 2 || clashNodes[0].type !== 'ss' || clashNodes[1].type !== 'http') {
        throw new Error('Failed to parse Clash YAML subscription')
    }

    const singBoxNodes = parseSubscription(singBoxJson)
    if (singBoxNodes.length !== 1 || singBoxNodes[0].type !== 'vless') {
        throw new Error('Failed to parse sing-box JSON subscription')
    }

    const targets = [
        'clash',
        'clashmeta',
        'mihomo',
        'stash',
        'singbox',
        'hiddify',
        'surge',
        'quantumultx',
        'loon',
        'v2rayn',
        'shadowrocket'
    ]

    for (const target of targets) {
        const result = convertToTarget(nodes, target, { udp: true, skipCert: false, rulePreset: 'standard' })
        if (!result || !result.trim()) throw new Error(`${target} conversion returned empty output`)
        if (['singbox', 'hiddify'].includes(target)) JSON.parse(result)
        if (['clash', 'clashmeta', 'mihomo', 'stash'].includes(target) && !result.includes('proxies:')) {
            throw new Error(`${target} output missing proxies section`)
        }
        console.log(`ok convert ${target}`)
    }

    console.log('--- Protocol Matrix Test Passed ---')
}

runTests().catch(error => {
    console.error(error)
    process.exit(1)
})
