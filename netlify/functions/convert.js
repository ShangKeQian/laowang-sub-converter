const SUPPORTED_CLIENTS = new Set([
    'clash', 'clashmeta', 'mihomo', 'stash', 'clashverge', 'clash-verge',
    'clashnyanpasu', 'clash-nyanpasu', 'flclash', 'surge', 'surfboard',
    'quantumultx', 'shadowrocket', 'loon', 'v2rayn', 'v2rayng', 'v2rayu',
    'singbox', 'sing-box', 'nekobox', 'hiddify', 'sfa', 'sfi', 'sfm'
])

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
}

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' }
    }

    try {
        const { parseSubscription, addEmoji } = await import('../../server/utils/parsers.js')
        const { convertToTarget } = await import('../../server/utils/converters.js')
        const params = event.queryStringParameters || {}
        const target = params.target
        const url = params.url

        if (!target || !SUPPORTED_CLIENTS.has(target)) {
            return json(400, {
                error: 'Invalid target client',
                supported: [...SUPPORTED_CLIENTS]
            })
        }
        if (!url) return json(400, { error: 'Subscription URL is required' })

        const response = await fetch(decodeURIComponent(url), {
            headers: { 'User-Agent': 'LaoWang-Sub-Converter/1.0' }
        })
        if (!response.ok) return json(502, { error: 'Failed to fetch subscription' })

        let nodes = parseSubscription(await response.text())
        nodes = filterNodes(nodes, params)
        if (params.sort === '1') nodes.sort((a, b) => a.name.localeCompare(b.name))
        if (params.emoji !== '0') nodes = nodes.map(node => ({ ...node, name: addEmoji(node.name) }))
        if (params.rename) nodes = renameNodes(nodes, params.rename)
        if (!nodes.length) return json(422, { error: 'No supported nodes found in subscription' })

        const body = convertToTarget(nodes, target, {
            udp: params.udp !== '0',
            skipCert: params.scert === '1',
            rulePreset: params.rulePreset || ''
        })

        return {
            statusCode: 200,
            headers: {
                ...headers,
                'Content-Type': contentType(target),
                'Content-Disposition': `attachment; filename="config.${extension(target)}"`
            },
            body
        }
    } catch (error) {
        return json(500, { error: 'Conversion failed', message: error.message })
    }
}

function filterNodes(nodes, params) {
    let output = nodes
    if (params.include) {
        const keywords = params.include.split('|').map(item => item.trim()).filter(Boolean)
        output = output.filter(node => keywords.some(keyword => node.name.includes(keyword)))
    }
    if (params.exclude) {
        const keywords = params.exclude.split('|').map(item => item.trim()).filter(Boolean)
        output = output.filter(node => !keywords.some(keyword => node.name.includes(keyword)))
    }
    return output
}

function renameNodes(nodes, rename) {
    const rules = rename.split('\n').filter(rule => rule.includes('->'))
    return nodes.map(node => {
        let name = node.name
        for (const rule of rules) {
            const [from, to = ''] = rule.split('->')
            name = name.split(from.trim()).join(to.trim())
        }
        return { ...node, name }
    })
}

function json(statusCode, data) {
    return {
        statusCode,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }
}

function contentType(target) {
    if (['singbox', 'sing-box', 'nekobox', 'hiddify', 'sfa', 'sfi', 'sfm'].includes(target)) return 'application/json'
    if (['clash', 'clashmeta', 'mihomo', 'stash', 'clashverge', 'clash-verge', 'clashnyanpasu', 'clash-nyanpasu', 'flclash'].includes(target)) return 'text/yaml'
    return 'text/plain'
}

function extension(target) {
    if (contentType(target) === 'application/json') return 'json'
    if (contentType(target) === 'text/yaml') return 'yaml'
    if (['surge', 'loon', 'surfboard'].includes(target)) return 'conf'
    return 'txt'
}
