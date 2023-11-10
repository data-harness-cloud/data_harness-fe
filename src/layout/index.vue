<template>
  <div class="layout">
    <Header></Header>
    <main>
      <SiderBar></SiderBar>
      <router-view class="content"></router-view>
      <Drawer></Drawer>
    </main>
    <AIExploration v-if="state.aiFlag" @close="state.aiFlag = false"></AIExploration>
    <div
      v-show="!state.aiFlag"
      class="ai-entrance-box flex flex-pack-center c-white fz12 bold pointer"
      @click="state.aiFlag = true"
    >
      AI探索
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import Header from './components/Header.vue'
import SiderBar from './components/SiderBar.vue'
import Drawer from './components/Drawer/index.vue'
import AIExploration from './components/AIExploration.vue'
import { getToken } from '@/utils/auth'
import http from '@/core/http/index'
import businessDictStore from '@/store/modules/businessDict'
import { routeObj } from '@/router'
import projectConfig from '@/core/config'

const noMenu = ['/login']
const router = useRouter()
const state = reactive({
  showMenu: true,
  defaultOpen: ['1', '2', '3', '4'],
  currentPath: '/',
  aiFlag: false,
})

router.beforeEach((to, from, next) => {
  http.loadingManager.showMask()
  if (to.path === '/login') {
    // 如果路径是 /login 则正常执行
    next()
  } else {
    // 如果不是 /login，判断是否有 token
    if (!getToken()) {
      // 如果没有，则跳至登录页面
      next({ path: '/login' })
    } else {
      // 否则继续执行
      next()
    }
  }
  state.showMenu = !noMenu.includes(to.path)
  state.currentPath = to.path
  document.title = routeObj[to.name]?.meta?.title || projectConfig.projectName
})
router.afterEach((to, from) => {
  // console.log('退出')
  http.loadingManager.hideMask()
})

const dictStore = businessDictStore()
dictStore.initDict()
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background-color: #ffffff;
}

.aside {
  width: 200px !important;
  background-color: #222832;
}

.head {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}

.head > div {
  display: flex;
  align-items: center;
}

.head img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.head span {
  font-size: 20px;
  color: #ffffff;
}

.line {
  border-top: 1px solid hsla(0, 0%, 100%, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.content {
  height: 100%;
  flex: 1 0 400px;
  overflow: hidden;
}

main {
  position: relative;
  height: calc(100vh - 64px);
  display: flex;
  width: 100vw;
  max-width: 100vw;
  overflow: auto;
}
</style>

<style>
body {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.el-menu {
  border-right: none !important;
}

.el-submenu {
  border-top: 1px solid hsla(0, 0%, 100%, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.el-submenu:first-child {
  border-top: none;
}

.el-submenu [class^='el-icon-'] {
  vertical-align: -1px !important;
}

a {
  color: #409eff;
  text-decoration: none;
}

.el-pagination {
  text-align: center;
  margin-top: 20px;
}

.el-popper__arrow {
  display: none;
}

.ai-entrance-box {
  width: 67px;
  height: 77px;
  position: fixed;
  right: 20px;
  bottom: 98px;
  background-image: url('/static/icons/aiExploration/aiEntrance.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding-top: 57px;
  z-index: 3;
}

.ai-entrance-box:hover {
  transform: scale(1.2);
}
</style>
