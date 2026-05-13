import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN.json'
import enUS from './en-US.json'
import ruRU from './ru-RU.json'
import faIR from './fa-IR.json'

function getDefaultLocale() {
  const browserLang = navigator.language || navigator.userLanguage
  if (browserLang.startsWith('zh')) return 'zh-CN'
  if (browserLang.startsWith('ru')) return 'ru-RU'
  if (browserLang.startsWith('fa')) return 'fa-IR'
  return 'zh-CN'
}

function getSavedLocale() {
  return localStorage.getItem('laowang-locale') || getDefaultLocale()
}

const i18n = createI18n({
  legacy: false,
  locale: getSavedLocale(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
    'ru-RU': ruRU,
    'fa-IR': faIR
  }
})

export function setLocale(locale) {
  i18n.global.locale.value = locale
  localStorage.setItem('laowang-locale', locale)

  if (locale === 'fa-IR') {
    document.documentElement.setAttribute('dir', 'rtl')
  } else {
    document.documentElement.setAttribute('dir', 'ltr')
  }
}

export const availableLocales = [
  { code: 'zh-CN', name: '中文', flag: 'CN' },
  { code: 'en-US', name: 'English', flag: 'US' },
  { code: 'ru-RU', name: 'Русский', flag: 'RU' },
  { code: 'fa-IR', name: 'فارسی', flag: 'IR' }
]

export default i18n
