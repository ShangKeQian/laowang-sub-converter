<template>
  <section class="advanced-options">
    <button class="options-toggle" @click="isOpen = !isOpen">
      <SlidersHorizontal :size="18" />
      <span>高级转换选项</span>
      <ChevronDown :size="18" :class="{ rotated: isOpen }" />
    </button>

    <transition name="expand">
      <div v-if="isOpen" class="options-panel">
        <div class="switch-grid">
          <label v-for="item in switches" :key="item.key" class="switch-row">
            <span>
              <strong>{{ item.label }}</strong>
              <small>{{ item.hint }}</small>
            </span>
            <input type="checkbox" v-model="options[item.key]" />
          </label>
        </div>

        <label class="field">
          <span>分流规则模板</span>
          <select v-model="options.rulePreset">
            <option value="">基础兼容规则</option>
            <option value="standard">标准日常分流</option>
            <option value="developer">开发工具分流</option>
            <option value="gaming">游戏低延迟分流</option>
            <option value="streaming">流媒体服务分流</option>
            <option value="blackmatrix7">BlackMatrix7 实时规则集</option>
          </select>
        </label>

        <div class="field-grid">
          <label class="field">
            <span>保留关键词</span>
            <input v-model="options.filter" placeholder="香港|美国|高级" />
          </label>

          <label class="field">
            <span>排除关键词</span>
            <input v-model="options.exclude" placeholder="过期|流量|测试" />
          </label>
        </div>

        <label class="field">
          <span>重命名规则</span>
          <textarea v-model="options.rename" rows="3" placeholder="旧名称->新名称"></textarea>
        </label>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { ChevronDown, SlidersHorizontal } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])
const isOpen = ref(false)

const options = reactive({
  emoji: props.modelValue.emoji ?? true,
  udp: props.modelValue.udp ?? true,
  skipCert: props.modelValue.skipCert ?? false,
  sort: props.modelValue.sort ?? false,
  filter: props.modelValue.filter ?? '',
  exclude: props.modelValue.exclude ?? '',
  rename: props.modelValue.rename ?? '',
  rulePreset: props.modelValue.rulePreset ?? ''
})

const switches = [
  { key: 'emoji', label: '地区标识', hint: '自动给节点名称添加地区标记' },
  { key: 'udp', label: '启用 UDP', hint: '客户端支持时开启 UDP 转发' },
  { key: 'skipCert', label: '跳过证书校验', hint: '适合自签名或特殊节点' },
  { key: 'sort', label: '节点排序', hint: '按名称整理输出顺序' }
]

watch(options, value => emit('update:modelValue', { ...value }), { deep: true, immediate: true })
</script>

<style scoped>
.advanced-options {
  display: grid;
  gap: 12px;
}

.options-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 8px;
  color: #e5e7eb;
  background: rgba(15, 23, 42, 0.65);
  cursor: pointer;
  font-size: 0.94rem;
  font-weight: 900;
}

.options-toggle span {
  flex: 1;
  margin-left: 10px;
  text-align: left;
}

.rotated {
  transform: rotate(180deg);
}

.options-panel {
  display: grid;
  gap: 14px;
  padding: 16px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 8px;
  background: rgba(2, 6, 23, 0.42);
}

.switch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
}

.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 76px;
  padding: 12px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.58);
}

.switch-row strong,
.switch-row small {
  display: block;
}

.switch-row strong {
  color: #f8fafc;
  font-size: 0.92rem;
}

.switch-row small {
  margin-top: 3px;
  color: #94a3b8;
  font-size: 0.78rem;
  line-height: 1.45;
}

.switch-row input {
  flex: 0 0 auto;
  width: 42px;
  height: 24px;
  appearance: none;
  border-radius: 999px;
  background: #334155;
  cursor: pointer;
  position: relative;
}

.switch-row input::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ffffff;
  transition: transform 0.18s ease;
}

.switch-row input:checked {
  background: #0891b2;
}

.switch-row input:checked::after {
  transform: translateX(18px);
}

.field,
.field-grid {
  display: grid;
  gap: 8px;
}

.field-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.field span {
  color: #cbd5e1;
  font-size: 0.86rem;
  font-weight: 800;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  min-height: 44px;
  padding: 11px 12px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 8px;
  color: #f8fafc;
  background: rgba(15, 23, 42, 0.75);
  font: inherit;
}

.field textarea {
  resize: vertical;
}

.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (max-width: 760px) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
</style>
