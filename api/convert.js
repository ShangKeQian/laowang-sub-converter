import { parseSubscription, addEmoji } from '../server/utils/parsers.js'
import { convertToTarget } from '../server/utils/converters.js'

const SUPPORTED_CLIENTS = {
    clash: 'clash',
    clashmeta: 'clashmeta',
    mihomo: 'mihomo',
    clashverge: 'clashverge',
    'clash-verge': 'clash-verge',
    clashnyanpasu: 'clashnyanpasu',
    'clash-nyanpasu': 'clash-nyanpasu',
    flclash: 'flclash',
    surge: 'surge',
    quantumultx: 'quantumultx',
    shadowrocket: 'shadowrocket',
    loon: 'loon',
    v2rayn: 'v2rayn',
    v2rayng: 'v2rayng',
    v2rayu: 'v2rayu',
    nekobox: 'nekobox',
    hiddify: 'hiddify',
    sfa: 'sfa',
    sfi: 'sfi',
    sfm: 'sfm',
    surfboard: 'surfboard',
    stash: 'stash',
    singbox: 'singbox',
    'sing-box': 'sing-box'
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    try {
        const {
            target,
            url,
            emoji = '1',
            udp = '1',
            scert = '0',
            sort = '0',
            include = '',
            exclude = '',
            rename = '',
            rulePreset = ''
        } = req.query

        // 参数验证
        if (!target || !SUPPORTED_CLIENTS[target]) {
            return res.status(400).json({
                error: 'Invalid target client',
                supported: Object.keys(SUPPORTED_CLIENTS)
            })
        }

        if (!url) {
            return res.status(400).json({ error: 'Subscription URL is required' })
        }

        // 解码订阅链接
        const subscriptionUrl = decodeURIComponent(url)

        // 获取原始订阅内容
        const response = await fetch(subscriptionUrl, {
            headers: {
                'User-Agent': 'LaoWang-Sub-Converter/1.0'
            }
        })

        if (!response.ok) {
            return res.status(502).json({ error: 'Failed to fetch subscription' })
        }

        const rawContent = await response.text()

        // 解析订阅内容
        let nodes = parseSubscription(rawContent)

        // 应用过滤规则
        if (include) {
            const keywords = include.split('|').map(kw => kw.trim()).filter(Boolean)
            nodes = nodes.filter(node =>
                keywords.some(kw => node.name.includes(kw))
            )
        }

        if (exclude) {
            const keywords = exclude.split('|').map(kw => kw.trim()).filter(Boolean)
            nodes = nodes.filter(node =>
                !keywords.some(kw => node.name.includes(kw))
            )
        }

        // 排序
        if (sort === '1') {
            nodes.sort((a, b) => a.name.localeCompare(b.name))
        }

        // 添加 Emoji
        if (emoji === '1') {
            nodes = nodes.map(node => ({
                ...node,
                name: addEmoji(node.name)
            }))
        }

        // 重命名
        if (rename) {
            const rules = rename.split('\n').filter(r => r.includes('->'))
            nodes = nodes.map(node => {
                let newName = node.name
                for (const rule of rules) {
                    const [from, to] = rule.split('->')
                    newName = newName.split(from.trim()).join((to || '').trim())
                }
                return { ...node, name: newName }
            })
        }

        if (nodes.length === 0) {
            return res.status(422).json({ error: 'No supported nodes found in subscription' })
        }

        // 转换为目标格式
        const output = convertToTarget(nodes, target, {
            udp: udp === '1',
            skipCert: scert === '1',
            rulePreset
        })

        // 设置响应头
        const contentTypes = {
            clash: 'text/yaml',
            clashmeta: 'text/yaml',
            surge: 'text/plain',
            quantumultx: 'text/plain',
            shadowrocket: 'text/plain',
            loon: 'text/plain',
            v2rayn: 'text/plain',
            v2rayng: 'text/plain',
            surfboard: 'text/plain',
            stash: 'text/yaml',
            mihomo: 'text/yaml',
            clashverge: 'text/yaml',
            'clash-verge': 'text/yaml',
            clashnyanpasu: 'text/yaml',
            'clash-nyanpasu': 'text/yaml',
            flclash: 'text/yaml',
            singbox: 'application/json',
            'sing-box': 'application/json',
            nekobox: 'application/json',
            hiddify: 'application/json',
            sfa: 'application/json',
            sfi: 'application/json',
            sfm: 'application/json'
        }

        // 确定文件扩展名
        let extension = 'txt'
        if (['singbox', 'sing-box', 'nekobox', 'hiddify', 'sfa', 'sfi', 'sfm'].includes(target)) {
            extension = 'json'
        } else if (['clash', 'clashmeta', 'mihomo', 'stash', 'clashverge', 'clash-verge', 'clashnyanpasu', 'clash-nyanpasu', 'flclash'].includes(target)) {
            extension = 'yaml'
        } else if (['surge', 'loon', 'surfboard'].includes(target)) {
            extension = 'conf'
        }

        res.setHeader('Content-Type', contentTypes[target] || 'text/plain')
        res.setHeader('Content-Disposition', `attachment; filename="config.${extension}"`)
        return res.send(output)

    } catch (error) {
        console.error('Conversion error:', error)
        return res.status(500).json({ error: 'Conversion failed', message: error.message })
    }
}
