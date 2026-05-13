<template>
  <header class="header">
    <router-link to="/" class="logo">
      <Network :size="24" />
      <span>老王订阅转换器</span>
    </router-link>

    <nav class="nav" :class="{ open: menuOpen }">
      <router-link to="/" @click="closeMenu">控制台</router-link>
      <router-link to="/converter" @click="closeMenu">订阅转换</router-link>
      <router-link to="/merge" @click="closeMenu">订阅合并</router-link>
      <router-link to="/health" @click="closeMenu">节点检测</router-link>
      <router-link to="/shortlink" @click="closeMenu">短链接</router-link>
      <router-link to="/about" @click="closeMenu">部署说明</router-link>
    </nav>

    <div class="header-actions">
      <a href="https://github.com/tony-wang1990/laowang-sub-converter" target="_blank" title="GitHub">
        <Github :size="20" />
      </a>
      <button class="menu-toggle" @click="toggleMenu" title="菜单">
        <Menu :size="22" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { Github, Menu, Network } from 'lucide-vue-next'

const menuOpen = ref(false)
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}
const closeMenu = () => {
  menuOpen.value = false
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 14px;
  left: 50%;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(1220px, calc(100% - 28px));
  height: 68px;
  padding: 0 14px 0 18px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 8px;
  background: rgba(2, 6, 23, 0.86);
  backdrop-filter: blur(18px);
  box-shadow: 0 18px 54px rgba(0, 0, 0, 0.28);
  transform: translateX(-50%);
}

.logo,
.nav,
.header-actions,
.header-actions a,
.menu-toggle {
  display: flex;
  align-items: center;
}

.logo {
  flex: 0 0 auto;
  gap: 10px;
  color: #f8fafc;
  font-size: 1.02rem;
  font-weight: 900;
  white-space: nowrap;
}

.logo svg {
  color: #67e8f9;
}

.nav {
  justify-content: center;
  gap: 6px;
  min-width: 0;
}

.nav a,
.header-actions a,
.menu-toggle {
  min-height: 42px;
  border-radius: 8px;
  color: #94a3b8;
}

.nav a {
  display: inline-flex;
  align-items: center;
  padding: 0 13px;
  font-size: 0.94rem;
  font-weight: 800;
  white-space: nowrap;
}

.nav a:hover,
.nav a.router-link-active,
.header-actions a:hover,
.menu-toggle:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

.nav a.router-link-active {
  border: 1px solid rgba(34, 211, 238, 0.28);
  background: rgba(8, 47, 73, 0.55);
}

.header-actions {
  flex: 0 0 auto;
  gap: 6px;
}

.header-actions a,
.menu-toggle {
  justify-content: center;
  width: 42px;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.menu-toggle {
  display: none;
}

@media (max-width: 960px) {
  .header {
    height: 64px;
  }

  .menu-toggle {
    display: flex;
  }

  .nav {
    position: absolute;
    top: 74px;
    left: 0;
    right: 0;
    display: none;
    flex-direction: column;
    align-items: stretch;
    padding: 10px;
    border: 1px solid rgba(148, 163, 184, 0.24);
    border-radius: 8px;
    background: rgba(2, 6, 23, 0.96);
    box-shadow: 0 18px 54px rgba(0, 0, 0, 0.32);
  }

  .nav.open {
    display: flex;
  }

  .nav a {
    min-height: 44px;
  }
}

@media (max-width: 520px) {
  .logo span {
    max-width: 148px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
