<template>
  <div v-if="routes.length" class="wrapper">
    <div v-for="route in routes">
      <div
        v-if="!route.meta?.hidden"
        class="first-level"
        :class="{ selectedBar: currentRouteId === route.menuId }"
        @click.stop="handleClick(route)"
      >
        <div class="routeTitle">
          {{ route.meta?.title || route.menuName }}
        </div>
        <div v-if="route.children" class="openBtn" :class="{ opened: route.opened }"></div>
      </div>
      <div v-else class="first-level undone2">
        <div class="routeTitle undone2">
          {{ route.meta?.title || route.menuName }}
        </div>
      </div>
      <template v-if="route.children && route.opened">
        <template v-for="child in route.children" :key="child.menuId">
          <div
            v-if="!child.meta?.hidden"
            class="first-level levelChild"
            :class="{ selectedBar: currentRouteId === child.menuId }"
            @click.stop="handleClick(child)"
          >
            <div class="routeTitle">
              {{ child.meta?.title || child.menuName }}
            </div>
          </div>
          <div v-else class="first-level levelChild undone2">
            <div class="routeTitle undone2">
              {{ child.meta?.title || child.menuName }}
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const routes = ref([])
const currentRouteId = ref(null)

function setRoutes() {
  routes.value = userStore.secondMenu
}

onMounted(() => {
  currentRouteId.value = userStore.currentMenuId
  setRoutes()
  watch(
    () => userStore.currentColumnId,
    () => {
      routes.value = userStore.secondMenu
    }
  )
  watch(
    () => userStore.currentMenuId,
    () => {
      currentRouteId.value = userStore.currentMenuId
    }
  )
})

function handleClick(route) {
  if (route.children) {
    if (!route.opened) route.opened = true
    else {
      route.opened = !route.opened
    }
    return
  }

  if (route.menuId === userStore.currentMenuId) {
    console.log('当前路由一样')
    return
  }
  if (router.hasRoute(route.formRouterName)) {
    userStore.setCurrentMenuId(route.menuId)
    router.push({
      name: route.formRouterName,
    })
    appStore.closeDrawerBar()
  } else {
    console.log('没有当前路由')
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 156px;
  padding: 8px;
  height: calc(100vh - 64px);
  background-color: #fff;
  border-right: 1px solid #dddddd;

  #title {
    height: 44px;
    padding-left: 19px;
    font-size: 16px;
    font-weight: bold;
    color: #000000;
    line-height: 44px;
  }

  .first-level {
    display: flex;
    position: relative;
    align-items: center;
    width: 140px;
    height: 40px;
    font-size: 14px;
    font-weight: 400;
    color: #222222;
    border-radius: 4px;
    cursor: pointer;

    .routeTitle {
      margin-left: 10px;
      font-size: 12px;
      font-weight: 400;
      color: #000000;
    }

    .openBtn {
      position: absolute;
      right: 20px;
      width: 6px;
      height: 6px;
      border-radius: 1px;
      border-bottom: 1px solid #222;
      border-right: 1px solid #222;
      transform: rotate(-45deg);
      transition: transform 0.2s;
    }

    .opened {
      transform: rotate(45deg);
    }
  }

  .selectedBar {
    background: #f4f7fa;
  }

  .split {
    width: 156px;
    height: 32px;
    font-size: 10px;
    font-weight: 400;
    color: #999999;
    padding-left: 6px;
    line-height: 32px;
  }

  .first-level:hover {
    background: #f4f7fa;
  }

  .levelChild {
    padding-left: 10px;
  }
}
</style>
