const ADULT_BLOCK_RULES = [
    `DOMAIN-SUFFIX,wnacg.com`,
    `DOMAIN-SUFFIX,wallhaven.cc`,
    `DOMAIN-SUFFIX,playzip.com`,
    `DOMAIN-SUFFIX,xbookcn.net`,
    `DOMAIN-SUFFIX,hanime1.me`,
    `DOMAIN-SUFFIX,91porn.com`,
    `DOMAIN-SUFFIX,uaa.com`,
    `DOMAIN-SUFFIX,javlibrary.com`,
    `DOMAIN-SUFFIX,njav.tv`,
    `DOMAIN-KEYWORD,18comic`,
    `DOMAIN-KEYWORD,porn`,
    `DOMAIN-KEYWORD,91porn`,
    `DOMAIN-KEYWORD,jable`,
    `DOMAIN-KEYWORD,missav`,
    `DOMAIN-KEYWORD,alicesw`,
    `DOMAIN-KEYWORD,kemono`
]

const GROUPS = {
    select: '🚀 节点选择',
    auto: '♻️ 自动选择',
    direct: '🎯 全球直连',
    reject: '🛑 广告拦截',
    final: '🐟 漏网之鱼',
    telegram: '📲 电报消息',
    media: '🎥 流媒体',
    ai: '🤖 AI 服务',
    dev: '💻 开发工具',
    game: '🎮 游戏平台',
    netflix: 'Netflix',
    disney: 'Disney+',
    youtube: 'YouTube',
    spotify: 'Spotify',
    traffic01x: '📊 0.1x 流量',
    traffic001x: '📉 0.01x 流量',
    hk: '🇭🇰 香港节点',
    tw: '🇨🇳 台湾节点',
    sg: '🇸🇬 狮城节点',
    jp: '🇯🇵 日本节点',
    us: '🇺🇸 美国节点',
    kr: '🇰🇷 韩国节点',
    bahamut: '📺 巴哈姆特',
    bilibili: '📺 哔哩哔哩',
    netease: '🎶 网易音乐',
    googlefcm: '📢 谷歌FCM',
    msbing: 'Ⓜ️ 微软Bing',
    msonedrive: 'Ⓜ️ 微软云盘'
}

export const rulePresets = {
    basic: {
        name: 'Basic',
        description: 'Small, compatible rule set for general use.',
        groups: [
            { name: GROUPS.select, type: 'select', proxies: [GROUPS.auto, 'DIRECT'] },
            { name: GROUPS.auto, type: 'url-test', proxies: [], url: 'http://www.gstatic.com/generate_204', interval: 300 }
        ],
        rules: [
            `GEOIP,LAN,DIRECT`,
            `GEOIP,CN,DIRECT`,
            `MATCH,${GROUPS.select}`
        ]
    },
    standard: {
        name: 'Standard',
        description: 'Balanced rules for daily browsing, media, AI, ads and direct China traffic.',
        groups: [
            { name: GROUPS.select, type: 'select', proxies: [GROUPS.auto, GROUPS.direct] },
            { name: GROUPS.auto, type: 'url-test', proxies: [], url: 'http://www.gstatic.com/generate_204', interval: 300 },
            { name: GROUPS.telegram, type: 'select', proxies: [GROUPS.select, GROUPS.auto, GROUPS.traffic01x, GROUPS.traffic001x] },
            { name: GROUPS.media, type: 'select', proxies: [GROUPS.select, GROUPS.auto, GROUPS.traffic01x, GROUPS.traffic001x] },
            { name: GROUPS.ai, type: 'select', proxies: [GROUPS.select, GROUPS.auto, GROUPS.traffic01x, GROUPS.traffic001x] },
            { name: GROUPS.traffic01x, type: 'select', proxies: [], filter: '0.1' },
            { name: GROUPS.traffic001x, type: 'select', proxies: [], filter: '0.01' },
            { name: GROUPS.direct, type: 'select', proxies: ['DIRECT'] },
            { name: GROUPS.reject, type: 'select', proxies: ['REJECT'] },
            { name: GROUPS.final, type: 'select', proxies: [GROUPS.select, GROUPS.direct] }
        ],
        rules: [
            `DOMAIN-KEYWORD,adservice,${GROUPS.reject}`,
            `DOMAIN-KEYWORD,tracking,${GROUPS.reject}`,
            ...ADULT_BLOCK_RULES.map(r => `${r},${GROUPS.reject}`),
            `DOMAIN-SUFFIX,openai.com,${GROUPS.ai}`,
            `DOMAIN-SUFFIX,chatgpt.com,${GROUPS.ai}`,
            `DOMAIN-SUFFIX,anthropic.com,${GROUPS.ai}`,
            `DOMAIN-SUFFIX,claude.ai,${GROUPS.ai}`,
            `DOMAIN-SUFFIX,gemini.google.com,${GROUPS.ai}`,
            `DOMAIN-SUFFIX,t.me,${GROUPS.telegram}`,
            `DOMAIN-SUFFIX,telegram.org,${GROUPS.telegram}`,
            `IP-CIDR,91.108.4.0/22,${GROUPS.telegram},no-resolve`,
            `IP-CIDR,149.154.160.0/20,${GROUPS.telegram},no-resolve`,
            `DOMAIN-SUFFIX,netflix.com,${GROUPS.media}`,
            `DOMAIN-SUFFIX,nflxvideo.net,${GROUPS.media}`,
            `DOMAIN-SUFFIX,youtube.com,${GROUPS.media}`,
            `DOMAIN-SUFFIX,googlevideo.com,${GROUPS.media}`,
            `DOMAIN-SUFFIX,spotify.com,${GROUPS.media}`,
            `DOMAIN-SUFFIX,cn,${GROUPS.direct}`,
            `DOMAIN-SUFFIX,baidu.com,${GROUPS.direct}`,
            `DOMAIN-SUFFIX,bilibili.com,${GROUPS.direct}`,
            `DOMAIN-SUFFIX,qq.com,${GROUPS.direct}`,
            `DOMAIN-SUFFIX,taobao.com,${GROUPS.direct}`,
            `GEOIP,LAN,${GROUPS.direct}`,
            `GEOIP,CN,${GROUPS.direct}`,
            `MATCH,${GROUPS.final}`
        ]
    },
    developer: {
        name: 'Developer',
        description: 'Rules for GitHub, package registries, cloud platforms and AI tools.',
        groups: [
            { name: GROUPS.select, type: 'select', proxies: [GROUPS.auto, GROUPS.direct] },
            { name: GROUPS.auto, type: 'url-test', proxies: [], url: 'http://www.gstatic.com/generate_204', interval: 300 },
            { name: GROUPS.dev, type: 'select', proxies: [GROUPS.select, GROUPS.auto] },
            { name: GROUPS.ai, type: 'select', proxies: [GROUPS.select, GROUPS.auto] },
            { name: GROUPS.direct, type: 'select', proxies: ['DIRECT'] },
            { name: GROUPS.final, type: 'select', proxies: [GROUPS.select, GROUPS.direct] }
        ],
        rules: [
            `DOMAIN-SUFFIX,github.com,${GROUPS.dev}`,
            `DOMAIN-SUFFIX,githubusercontent.com,${GROUPS.dev}`,
            `DOMAIN-SUFFIX,githubassets.com,${GROUPS.dev}`,
            `DOMAIN-SUFFIX,npmjs.org,${GROUPS.dev}`,
            `DOMAIN-SUFFIX,npmjs.com,${GROUPS.dev}`,
            `DOMAIN-SUFFIX,docker.com,${GROUPS.dev}`,
            `DOMAIN-SUFFIX,stackoverflow.com,${GROUPS.dev}`,
            `DOMAIN-SUFFIX,vercel.com,${GROUPS.dev}`,
            `DOMAIN-SUFFIX,cloudflare.com,${GROUPS.dev}`,
            `DOMAIN-SUFFIX,openai.com,${GROUPS.ai}`,
            `DOMAIN-SUFFIX,chatgpt.com,${GROUPS.ai}`,
            `DOMAIN-SUFFIX,anthropic.com,${GROUPS.ai}`,
            `DOMAIN-SUFFIX,claude.ai,${GROUPS.ai}`,
            `GEOIP,LAN,${GROUPS.direct}`,
            `GEOIP,CN,${GROUPS.direct}`,
            `MATCH,${GROUPS.final}`
        ]
    },
    gaming: {
        name: 'Gaming',
        description: 'Low-latency groups for Steam, Epic, PlayStation, Xbox, Nintendo and Discord.',
        groups: [
            { name: GROUPS.select, type: 'select', proxies: [GROUPS.auto, GROUPS.direct] },
            { name: GROUPS.auto, type: 'url-test', proxies: [], url: 'http://www.gstatic.com/generate_204', interval: 150, tolerance: 50 },
            { name: GROUPS.game, type: 'select', proxies: [GROUPS.auto, GROUPS.select] },
            { name: GROUPS.direct, type: 'select', proxies: ['DIRECT'] },
            { name: GROUPS.final, type: 'select', proxies: [GROUPS.select, GROUPS.direct] }
        ],
        rules: [
            `DOMAIN-SUFFIX,steamcommunity.com,${GROUPS.game}`,
            `DOMAIN-SUFFIX,steampowered.com,${GROUPS.game}`,
            `DOMAIN-SUFFIX,epicgames.com,${GROUPS.game}`,
            `DOMAIN-SUFFIX,playstation.com,${GROUPS.game}`,
            `DOMAIN-SUFFIX,xbox.com,${GROUPS.game}`,
            `DOMAIN-SUFFIX,nintendo.com,${GROUPS.game}`,
            `DOMAIN-SUFFIX,discord.com,${GROUPS.game}`,
            `GEOIP,LAN,${GROUPS.direct}`,
            `GEOIP,CN,${GROUPS.direct}`,
            `MATCH,${GROUPS.final}`
        ]
    },
    streaming: {
        name: 'Streaming',
        description: 'Dedicated groups for Netflix, Disney+, YouTube and Spotify.',
        groups: [
            { name: GROUPS.select, type: 'select', proxies: [GROUPS.auto, GROUPS.direct] },
            { name: GROUPS.auto, type: 'url-test', proxies: [], url: 'http://www.gstatic.com/generate_204', interval: 300 },
            { name: GROUPS.netflix, type: 'select', proxies: [GROUPS.select, GROUPS.auto, GROUPS.traffic01x, GROUPS.traffic001x] },
            { name: GROUPS.disney, type: 'select', proxies: [GROUPS.select, GROUPS.auto, GROUPS.traffic01x, GROUPS.traffic001x] },
            { name: GROUPS.youtube, type: 'select', proxies: [GROUPS.select, GROUPS.auto, GROUPS.traffic01x, GROUPS.traffic001x] },
            { name: GROUPS.spotify, type: 'select', proxies: [GROUPS.select, GROUPS.auto, GROUPS.traffic01x, GROUPS.traffic001x] },
            { name: GROUPS.direct, type: 'select', proxies: ['DIRECT'] },
            { name: GROUPS.final, type: 'select', proxies: [GROUPS.select, GROUPS.direct] }
        ],
        rules: [
            `DOMAIN-SUFFIX,netflix.com,${GROUPS.netflix}`,
            `DOMAIN-SUFFIX,nflxvideo.net,${GROUPS.netflix}`,
            `DOMAIN-SUFFIX,disneyplus.com,${GROUPS.disney}`,
            `DOMAIN-SUFFIX,dssott.com,${GROUPS.disney}`,
            `DOMAIN-SUFFIX,youtube.com,${GROUPS.youtube}`,
            `DOMAIN-SUFFIX,googlevideo.com,${GROUPS.youtube}`,
            `DOMAIN-SUFFIX,spotify.com,${GROUPS.spotify}`,
            `DOMAIN-SUFFIX,spotifycdn.com,${GROUPS.spotify}`,
            `GEOIP,LAN,${GROUPS.direct}`,
            `GEOIP,CN,${GROUPS.direct}`,
            `MATCH,${GROUPS.final}`
        ]
    },
    blackmatrix7: {
        name: 'BlackMatrix7',
        description: '使用 blackmatrix7/ios_rule_script 的实时规则集，支持广告拦截、流媒体、AI、游戏、开发工具等精细分流。需 Clash Meta/Mihomo 内核。',
        groups: [
            { name: GROUPS.select, type: 'select', proxies: [GROUPS.auto, GROUPS.direct] },
            { name: GROUPS.auto, type: 'url-test', proxies: [], url: 'http://www.gstatic.com/generate_204', interval: 300 },
            { name: GROUPS.telegram, type: 'select', proxies: [GROUPS.select, GROUPS.auto, GROUPS.traffic01x, GROUPS.traffic001x] },
            { name: GROUPS.media, type: 'select', proxies: [GROUPS.select, GROUPS.auto, GROUPS.traffic01x, GROUPS.traffic001x] },
            { name: GROUPS.ai, type: 'select', proxies: [GROUPS.select, GROUPS.auto, GROUPS.traffic01x, GROUPS.traffic001x] },
            { name: GROUPS.dev, type: 'select', proxies: [GROUPS.select, GROUPS.auto, GROUPS.traffic01x, GROUPS.traffic001x] },
            { name: GROUPS.game, type: 'select', proxies: [GROUPS.select, GROUPS.auto, GROUPS.traffic01x, GROUPS.traffic001x] },
            { name: GROUPS.traffic01x, type: 'select', proxies: [], filter: '0.1' },
            { name: GROUPS.traffic001x, type: 'select', proxies: [], filter: '0.01' },
            { name: GROUPS.direct, type: 'select', proxies: ['DIRECT'] },
            { name: GROUPS.reject, type: 'select', proxies: ['REJECT'] },
            { name: GROUPS.final, type: 'select', proxies: [GROUPS.select, GROUPS.direct] }
        ],
        rules: [
            `RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Advertising/Advertising.list,${GROUPS.reject}`,
            `RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Hijacking/Hijacking.list,${GROUPS.reject}`,
            `RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Privacy/Privacy.list,${GROUPS.reject}`,
            `RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Telegram/Telegram.list,${GROUPS.telegram}`,
            `RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Netflix/Netflix.list,${GROUPS.media}`,
            `RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/YouTube/YouTube.list,${GROUPS.media}`,
            `RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Disney/Disney.list,${GROUPS.media}`,
            `RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Spotify/Spotify.list,${GROUPS.media}`,
            `RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/HBO/HBO.list,${GROUPS.media}`,
            `RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/PrimeVideo/PrimeVideo.list,${GROUPS.media}`,
            `RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/OpenAI/OpenAI.list,${GROUPS.ai}`,
            `RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Claude/Claude.list,${GROUPS.ai}`,
            `RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Gemini/Gemini.list,${GROUPS.ai}`,
            `RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GitHub/GitHub.list,${GROUPS.dev}`,
            `RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Docker/Docker.list,${GROUPS.dev}`,
            `RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Vercel/Vercel.list,${GROUPS.dev}`,
            `RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Npmjs/Npmjs.list,${GROUPS.dev}`,
            `RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Steam/Steam.list,${GROUPS.game}`,
            `RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Epic/Epic.list,${GROUPS.game}`,
            `RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/PlayStation/PlayStation.list,${GROUPS.game}`,
            `RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Xbox/Xbox.list,${GROUPS.game}`,
            `RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Nintendo/Nintendo.list,${GROUPS.game}`,
            `RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Blizzard/Blizzard.list,${GROUPS.game}`,
            `RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Discord/Discord.list,${GROUPS.game}`,
            ...ADULT_BLOCK_RULES.map(r => `${r},${GROUPS.reject}`),
            `GEOIP,LAN,${GROUPS.direct}`,
            `GEOIP,CN,${GROUPS.direct}`,
            `MATCH,${GROUPS.final}`
        ]
    },
    acl4ssr: {
        name: 'ACL4SSR',
        description: '使用 ACL4SSR 的实时规则集，覆盖广告拦截、流媒体、电报、微软、苹果、谷歌等精细分流。需 Clash Meta/Mihomo 内核。',
        groups: [
            { name: GROUPS.select, type: 'select', proxies: [GROUPS.auto, GROUPS.direct] },
            { name: GROUPS.auto, type: 'url-test', proxies: [], url: 'http://www.gstatic.com/generate_204', interval: 300 },
            { name: GROUPS.telegram, type: 'select', proxies: [GROUPS.select, GROUPS.auto, GROUPS.traffic01x, GROUPS.traffic001x] },
            { name: GROUPS.media, type: 'select', proxies: [GROUPS.select, GROUPS.auto, GROUPS.traffic01x, GROUPS.traffic001x] },
            { name: GROUPS.ai, type: 'select', proxies: [GROUPS.select, GROUPS.auto, GROUPS.traffic01x, GROUPS.traffic001x] },
            { name: GROUPS.traffic01x, type: 'select', proxies: [], filter: '0.1' },
            { name: GROUPS.traffic001x, type: 'select', proxies: [], filter: '0.01' },
            { name: GROUPS.direct, type: 'select', proxies: ['DIRECT'] },
            { name: GROUPS.reject, type: 'select', proxies: ['REJECT'] },
            { name: GROUPS.final, type: 'select', proxies: [GROUPS.select, GROUPS.direct] }
        ],
        rules: [
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanAD.list,${GROUPS.reject}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanProgramAD.list,${GROUPS.reject}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Telegram.list,${GROUPS.telegram}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ProxyMedia.list,${GROUPS.media}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Microsoft.list,${GROUPS.direct}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Apple.list,${GROUPS.direct}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/GoogleCN.list,${GROUPS.direct}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/SteamCN.list,${GROUPS.direct}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ProxyLite.list,${GROUPS.select}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaDomain.list,${GROUPS.direct}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaCompanyIp.list,${GROUPS.direct}`,
            ...ADULT_BLOCK_RULES.map(r => `${r},${GROUPS.reject}`),
            `GEOIP,LAN,${GROUPS.direct}`,
            `GEOIP,CN,${GROUPS.direct}`,
            `MATCH,${GROUPS.final}`
        ]
    },
    acl4ssr_full: {
        name: 'ACL4SSR Full',
        description: 'ACL4SSR 完整版规则集，含地区分组（香港/台湾/狮城/日本/美国/韩国）、微软/苹果/谷歌/AI/游戏/巴哈姆特/哔哩哔哩/网易音乐等精细分流。需 Clash Meta/Mihomo 内核。',
        groups: [
            { name: GROUPS.select, type: 'select', proxies: [GROUPS.auto, GROUPS.hk, GROUPS.tw, GROUPS.sg, GROUPS.jp, GROUPS.us, GROUPS.kr, GROUPS.direct] },
            { name: GROUPS.auto, type: 'url-test', proxies: [], url: 'http://www.gstatic.com/generate_204', interval: 300 },
            { name: GROUPS.telegram, type: 'select', proxies: [GROUPS.select, GROUPS.auto, GROUPS.sg, GROUPS.hk, GROUPS.tw, GROUPS.jp, GROUPS.us, GROUPS.kr, GROUPS.traffic01x, GROUPS.traffic001x] },
            { name: GROUPS.media, type: 'select', proxies: [GROUPS.select, GROUPS.auto, GROUPS.sg, GROUPS.hk, GROUPS.tw, GROUPS.jp, GROUPS.us, GROUPS.kr, GROUPS.traffic01x, GROUPS.traffic001x] },
            { name: GROUPS.ai, type: 'select', proxies: [GROUPS.select, GROUPS.auto, GROUPS.sg, GROUPS.hk, GROUPS.tw, GROUPS.jp, GROUPS.us, GROUPS.kr, GROUPS.traffic01x, GROUPS.traffic001x] },
            { name: GROUPS.hk, type: 'url-test', proxies: [], filter: ['港', 'HK', 'hk', 'Hong Kong', 'HongKong', 'hongkong'] },
            { name: GROUPS.tw, type: 'url-test', proxies: [], filter: ['台', 'TW', 'tw', 'Taiwan'] },
            { name: GROUPS.sg, type: 'url-test', proxies: [], filter: ['新加坡', '坡', '狮城', 'SG', 'sg', 'Singapore'] },
            { name: GROUPS.jp, type: 'url-test', proxies: [], filter: ['日本', '川日', '东京', '大阪', '泉日', '埼玉', '沪日', '深日', 'JP', 'jp', 'Japan'] },
            { name: GROUPS.us, type: 'url-test', proxies: [], filter: ['美', '波特兰', '达拉斯', '俄勒冈', '凤凰城', '费利蒙', '硅谷', '拉斯维加斯', '洛杉矶', '圣何塞', '圣克拉拉', '西雅图', '芝加哥', 'US', 'us', 'United States'] },
            { name: GROUPS.kr, type: 'url-test', proxies: [], filter: ['KR', 'kr', 'Korea', 'KOR', '首尔', '韩', '韓'] },
            { name: GROUPS.bahamut, type: 'select', proxies: [GROUPS.tw, GROUPS.select, GROUPS.direct] },
            { name: GROUPS.bilibili, type: 'select', proxies: [GROUPS.direct, GROUPS.tw, GROUPS.hk] },
            { name: GROUPS.netease, type: 'select', proxies: [GROUPS.direct, GROUPS.select, GROUPS.auto] },
            { name: GROUPS.googlefcm, type: 'select', proxies: [GROUPS.direct, GROUPS.select, GROUPS.us, GROUPS.hk, GROUPS.tw, GROUPS.sg, GROUPS.jp, GROUPS.kr] },
            { name: GROUPS.msbing, type: 'select', proxies: [GROUPS.direct, GROUPS.select, GROUPS.us, GROUPS.hk, GROUPS.tw, GROUPS.sg, GROUPS.jp, GROUPS.kr] },
            { name: GROUPS.msonedrive, type: 'select', proxies: [GROUPS.direct, GROUPS.select, GROUPS.us, GROUPS.hk, GROUPS.tw, GROUPS.sg, GROUPS.jp, GROUPS.kr] },
            { name: GROUPS.traffic01x, type: 'select', proxies: [], filter: '0.1' },
            { name: GROUPS.traffic001x, type: 'select', proxies: [], filter: '0.01' },
            { name: GROUPS.direct, type: 'select', proxies: ['DIRECT'] },
            { name: GROUPS.reject, type: 'select', proxies: ['REJECT'] },
            { name: GROUPS.netflix, type: 'select', proxies: [GROUPS.select, GROUPS.auto, GROUPS.sg, GROUPS.hk, GROUPS.tw, GROUPS.jp, GROUPS.us, GROUPS.kr] },
            { name: GROUPS.final, type: 'select', proxies: [GROUPS.select, GROUPS.auto, GROUPS.direct] }
        ],
        rules: [
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/LocalAreaNetwork.list,${GROUPS.direct}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/UnBan.list,${GROUPS.direct}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanAD.list,${GROUPS.reject}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanProgramAD.list,${GROUPS.reject}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/GoogleFCM.list,${GROUPS.googlefcm}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/GoogleCN.list,${GROUPS.direct}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/SteamCN.list,${GROUPS.direct}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Bing.list,${GROUPS.msbing}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/OneDrive.list,${GROUPS.msonedrive}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Microsoft.list,${GROUPS.direct}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Apple.list,${GROUPS.direct}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Telegram.list,${GROUPS.telegram}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/AI.list,${GROUPS.ai}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/OpenAi.list,${GROUPS.ai}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/NetEaseMusic.list,${GROUPS.netease}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Epic.list,${GROUPS.media}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Origin.list,${GROUPS.media}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Sony.list,${GROUPS.media}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Steam.list,${GROUPS.media}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Nintendo.list,${GROUPS.media}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/YouTube.list,${GROUPS.media}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Netflix.list,${GROUPS.netflix}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Bahamut.list,${GROUPS.bahamut}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/BilibiliHMT.list,${GROUPS.bilibili}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Bilibili.list,${GROUPS.bilibili}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaMedia.list,${GROUPS.direct}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ProxyMedia.list,${GROUPS.media}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ProxyGFWlist.list,${GROUPS.select}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaDomain.list,${GROUPS.direct}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaCompanyIp.list,${GROUPS.direct}`,
            `RULE-SET,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Download.list,${GROUPS.direct}`,
            ...ADULT_BLOCK_RULES.map(r => `${r},${GROUPS.reject}`),
            `GEOIP,LAN,${GROUPS.direct}`,
            `GEOIP,CN,${GROUPS.direct}`,
            `MATCH,${GROUPS.final}`
        ]
    }
}

export function getRulePresets() {
    return Object.entries(rulePresets).map(([id, preset]) => ({
        id,
        name: preset.name,
        description: preset.description,
        groupCount: preset.groups.length,
        ruleCount: preset.rules.length
    }))
}

export function getRulePreset(presetId) {
    return rulePresets[presetId] || rulePresets.basic
}

export function applyRulePreset(nodeNames, presetId = 'basic') {
    const names = Array.isArray(nodeNames) ? nodeNames : nodeNames.map(node => node.name)
    const preset = getRulePreset(presetId)
    const groups = preset.groups.map(group => {
        let proxies
        if (group.filter) {
            const keywords = Array.isArray(group.filter) ? group.filter : [group.filter]
            const filtered = names.filter(n => {
                const lower = n.toLowerCase()
                return keywords.some(kw => lower.includes(kw.toLowerCase()))
            })
            proxies = [...group.proxies, ...filtered]
        } else if (group.type === 'url-test') {
            proxies = [...names]
        } else {
            proxies = [...group.proxies, ...((group.name === GROUPS.select) ? names : [])]
        }

        return {
            ...group,
            proxies: [...new Set(proxies)].filter(Boolean)
        }
    })

    return {
        proxyGroups: groups,
        rules: preset.rules
    }
}

const RULESET_CACHE = new Map()

const pendingFetches = new Map()

async function fetchRuleset(url, timeout = 8000) {
    if (RULESET_CACHE.has(url)) return RULESET_CACHE.get(url)
    if (pendingFetches.has(url)) return pendingFetches.get(url)

    const promise = (async () => {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), timeout)
        try {
            const res = await fetch(url, {
                signal: controller.signal,
                headers: { 'User-Agent': 'LaoWang-Sub-Converter/1.0' }
            })
            if (!res.ok) return []
            const text = await res.text()
            const lines = text.split('\n')
                .map(l => l.trim())
                .filter(l => l && !l.startsWith('#') && !l.startsWith(';'))
                .map(l => l.split(','))
                .filter(parts => parts.length >= 2)
                .map(parts => {
                    const type = parts[0].toUpperCase()
                    const value = parts[1]
                    const extra = parts.slice(2).join(',')
                    return { type, value, extra }
                })
            RULESET_CACHE.set(url, lines)
            return lines
        } catch {
            return []
        } finally {
            clearTimeout(timer)
        }
    })()

    pendingFetches.set(url, promise)
    const result = await promise
    pendingFetches.delete(url)
    return result
}

const SUPPORTED_RULE_TYPES = new Set([
    'DOMAIN', 'DOMAIN-SUFFIX', 'DOMAIN-KEYWORD',
    'IP-CIDR', 'IP-CIDR6', 'GEOIP',
    'DST-PORT', 'SRC-PORT',
    'PROCESS-NAME', 'PROCESS-PATH',
    'RULE-SET', 'MATCH'
])

export async function expandRules(rules) {
    const urls = new Set()
    for (const rule of rules) {
        if (rule.startsWith('RULE-SET,')) {
            const url = rule.split(',')[1]
            if (url?.startsWith('http')) urls.add(url)
        }
    }

    await Promise.all([...urls].map(url => fetchRuleset(url)))

    const expanded = []
    for (const rule of rules) {
        const parts = rule.split(',')
        if (parts[0] === 'RULE-SET' && parts[1]?.startsWith('http')) {
            const url = parts[1]
            const group = parts.slice(2).join(',')
            const entries = RULESET_CACHE.get(url) || []
            for (const entry of entries) {
                if (!SUPPORTED_RULE_TYPES.has(entry.type)) continue
                const suffix = entry.extra ? `,${entry.extra}` : ''
                expanded.push(`${entry.type},${entry.value},${group}${suffix}`)
            }
        } else {
            expanded.push(rule)
        }
    }
    return expanded
}
