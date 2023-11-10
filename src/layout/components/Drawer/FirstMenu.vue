<template>
  <div class="wrapper">
    <div id="title" @click="toDashboard">全部模块</div>
    <div v-for="menu in menuList" @click.stop="handleClick(menu)">
      <div v-if="!menu.hidden" class="first-level" :class="{ selectedLevel: currentColumnId === menu.menuId }">
        <img
          class="levelImg"
          v-if="menu.fileDataList && menu.fileDataList.length > 0"
          :src="getPreviewUrl(menu.fileDataList[menu.fileDataList.length - 1])"
          alt=""
        />
        <img
          class="levelImg"
          v-else-if="
            routeObj[menu.formRouterName] &&
            routeObj[menu.formRouterName].meta &&
            routeObj[menu.formRouterName].meta.svgIcon
          "
          :src="'/static/imgs/' + routeObj[menu.formRouterName].meta.svgIcon + '.svg'"
          alt=""
        />
        <div style="line-height: 14px; height: 14px">
          {{ menu.meta?.title || menu.menuName }}
        </div>
        <img
          v-if="menu.children && menu.children.length > 0"
          class="chevron_right"
          src="/static/imgs/chevron_right.svg"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { routeObj } from '@/router'
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
import projectConfig from '@/core/config/index'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const menuList = computed(() => {
  return userStore.menuList
})
const currentColumnId = computed(() => {
  return userStore.currentColumnId
})

function handleClick(menu) {
  userStore.setCurrentColumnId(menu?.menuId || null)
  if (menu?.children?.length) {
    appStore.drawerBar.secondarydrawerBarOpend = true
  } else {
    appStore.drawerBar.secondarydrawerBarOpend = false
  }
}
function toDashboard() {
  // appStore.setCurrentModule('dashboard')
  router.push({ name: 'dashboard' })
  appStore.closeDrawerBar()
}
function getPreviewUrl(data) {
  const params = Object.assign(typeof data.fileJson === 'object' ? data.fileJson : JSON.parse(data.fileJson), {
    id: data.id,
  })
  params['Authorization'] = userStore.userInfo.tokenData
  return (
    projectConfig.baseUrl +
    `admin/app/baseBusinessFile/download?` +
    Object.keys(params)
      .map((e) => `${e}=${params[e]}`)
      .join('&')
  )
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 236px;
  padding: 8px;
  height: calc(100vh - 64px);
  background-color: #fff;
  border-right: 1px solid #dddddd;

  #title {
    height: 44px;
    // width: 200px;
    padding-left: 19px;
    font-size: 16px;
    font-weight: bold;
    color: #000000;
    line-height: 44px;
    cursor: pointer;
  }

  .first-level {
    display: flex;
    position: relative;
    align-items: center;
    width: 200px;
    height: 40px;
    font-size: 14px;
    font-weight: 400;
    color: #222222;
    margin-left: 10px;
    border-radius: 4px;

    cursor: pointer;

    .levelImg {
      width: 40px;
      height: 40px;
    }

    .chevron_right {
      position: absolute;
      right: 10px;
      width: 16px;
      height: 16px;
    }
  }

  .first-level:hover {
    background: #f4f7fa;
  }

  .selectedLevel {
    background: #f4f7fa;
  }
}
</style>
