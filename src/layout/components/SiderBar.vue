<template>
  <div
    v-if="routes.length && router.currentRoute.value.name !== 'dashboard-index' && appStore.sidebar.opened"
    class="wrapper"
  >
    <div :class="{ barIsCollapse: isCollapse }">
      <div v-for="route in routes" :key="route.path">
        <div v-if="route.meta && route.meta.split" class="split">
          {{ route.meta.split }}
        </div>
        <div
          v-if="!route.meta?.hidden"
          class="first-level"
          :class="{ selectedBar: currentRouteId === route.menuId }"
          @click="handleClick(route)"
        >
          <img
            v-if="route.fileDataList && route.fileDataList.length > 0"
            class="levelImg"
            :src="getPreviewUrl(route.fileDataList[route.fileDataList.length - 1])"
            alt=""
          />
          <img
            v-else-if="route.meta && route.meta.svgIcon"
            class="levelImg levelImgLocal"
            :src="'/static/imgs/' + route.meta.svgIcon + '.svg'"
            alt=""
          />
          <div class="routeTitle">
            {{ route.meta?.title || route.menuName }}
          </div>
          <div v-if="route.children" class="openBtn" :class="{ opened: route.opened }"></div>
        </div>
        <div v-else class="first-level undone2">
          <div class="routeTitle undone2">
            <img
              v-if="route.fileDataList && route.fileDataList.length > 0"
              class="levelImg"
              :src="getPreviewUrl(route.fileDataList[route.fileDataList.length - 1])"
              alt=""
            />
            <img
              v-else-if="route.meta && route.meta.svgIcon"
              class="levelImg"
              :src="'/static/imgs/' + route.meta.svgIcon + '.svg'"
              alt=""
            />
            {{ route.meta?.title || route.menuName }}
          </div>
        </div>
        <template v-if="route.children && route.opened">
          <template v-for="child in route.children" :key="child.menuId">
            <div
              v-if="!child.meta?.hidden"
              class="first-level levelChild"
              :class="{ selectedBar: currentRouteId === child.menuId }"
              @click="handleClick(child)"
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
    <div class="collapse" @click="changeCollapse">
      <img v-if="!isCollapse" src="/static/icons/zk.svg" />
      <img v-else src="/static/icons/sq.svg" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
// import { routeObj } from '@/router'
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
import projectConfig from '@/core/config/index'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const routes = ref([])
const currentRouteId = ref(null)

currentRouteId.value = userStore.currentMenuId

function setRoutes() {
  routes.value = userStore.secondMenu
}

const isCollapse = ref(userStore.barIsCollapse)
function changeCollapse() {
  isCollapse.value = !isCollapse.value
  userStore.setBarIsCollapse(isCollapse.value)
}

function handleClick(route) {
  userStore.setClickedRoute(route) // 设置被点到的route 和CurrentMenuId 有时会不一样
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
    // console.log('route', route)

    router.push({
      name: route.formRouterName,
    })
    // console.log('userStore.needToSetCurrentMenuId', userStore.needToSetCurrentMenuId)
    userStore.needToSetCurrentMenuId && userStore.setCurrentMenuId(route.menuId)
    appStore.closeDrawerBar()
  } else {
    console.log('没有当前路由')
  }
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

onMounted(() => {
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
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 8px;
  height: calc(100vh - 64px);
  background-color: #f4f7fa;
  border-right: 1px solid #dddddd;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .collapse {
    display: flex;
    justify-content: end;
    cursor: pointer;
    padding: 8px;
    padding-right: 14px;
    img {
      width: 24px;
      height: 24px;
    }
  }

  #title {
    height: 44px;
    padding-left: 19px;
    font-size: 16px;
    font-weight: bold;
    color: #000000;
    line-height: 44px;
  }

  .barIsCollapse {
    .split {
      width: 0px;
      height: 0px;
      opacity: 0;
    }
    .first-level {
      width: 48px;
      padding-left: 16px;
      .routeTitle {
        opacity: 0;
      }
      .openBtn {
        opacity: 0;
      }
    }
    .levelChild {
      display: none;
    }
  }

  .first-level {
    display: flex;
    position: relative;
    align-items: center;
    width: 200px;
    height: 44px;
    font-size: 14px;
    font-weight: 400;
    border-radius: 4px;
    cursor: pointer;
    padding-left: 32px;
    transition: width 0.15s linear 0s;

    .routeTitle {
      font-size: 14px;
      font-weight: 400;
      color: #000000;
      overflow: hidden;
      -webkit-line-clamp: 1;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      white-space: normal; // 规定段落中的文本不进行换行
      word-break: break-all; // 允许单词中换行，在容器的最右边进行断开不会浪费控件
      word-wrap: break-word; // 防止长单词溢出，单词内部短句
      transition: opacity 0.15s linear 0s;
      opacity: 1;
    }

    .levelImg {
      width: 16px;
      height: 16px;
      margin-right: 6px;
    }

    .openBtn {
      position: absolute;
      right: 20px;
      width: 8px;
      height: 8px;
      border-radius: 1px;
      border-bottom: 2px solid #222;
      border-right: 2px solid #222;
      transform: rotate(-45deg);
      transition: transform 0.2s;
      transition: opacity 0.15s linear 0s;
      opacity: 1;
    }

    .opened {
      transform: rotate(45deg);
    }
  }

  .selectedBar {
    background: rgba(50, 70, 210, 0.1) !important;

    .routeTitle {
      color: #3246d2;
    }
    .levelImgLocal {
      filter: drop-shadow(#3246d2 100px 0);
    }
  }

  .split {
    width: 156px;
    height: 32px;
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    padding-left: 32px;
    line-height: 32px;
    overflow: hidden;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    white-space: normal; // 规定段落中的文本不进行换行
    word-break: break-all; // 允许单词中换行，在容器的最右边进行断开不会浪费控件
    word-wrap: break-word; // 防止长单词溢出，单词内部短句
    transition: opacity width height 0.15s linear 0s;
    opacity: 1;
  }

  .first-level:hover {
    .routeTitle {
      color: #3246d2;
    }

    background: rgba(50, 70, 210, 0.05);
    .levelImgLocal {
      filter: drop-shadow(#3246d2 100px 0);
    }
  }

  .levelChild {
    padding-left: 52px;
  }
}
.levelImgLocal {
  filter: drop-shadow(#000 100px 0);
  transform: translateX(-100px);
}
</style>
