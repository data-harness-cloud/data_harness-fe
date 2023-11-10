<template>
  <header class="header">
    <div class="head-title">
      <div id="NavigationBtnBox" @click="toggleDrawerBar">
        <img src="/static/imgs/NavigationBtn.svg" alt="" />
      </div>
      <img style="margin-left: 16px; cursor: pointer" src="/static/imgs/supieLogo.svg" alt="" @click="toDashboard" />
      <div class="h1" style="cursor: pointer" @click="toDashboard">驭数轻云数据平台</div>
      <el-dropdown @command="changeProjectId" v-if="userStore.showProjectChoice">
        <div class="projectSelect">
          <div style="width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
            {{ projectObj[projectId]?.projectName || '请选择项目' }}
          </div>
          <el-icon color="#FFFFFF">
            <CaretBottom />
          </el-icon>
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in projectList"
              :key="item.id"
              :command="item.id"
              :class="{ 'c-primary': item.id === projectId }"
            >
              {{ item.projectName }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div id="userBar">
      <!-- <div class="h2">
        <div class="cur-menu">本地站点</div>

        <el-icon class="down-arrow">
          <ArrowDown style="width: 1em; height: 1em" />
        </el-icon>
      </div> -->
      <img class="barIcon" src="/static/imgs/serach.svg" alt="" />
      <img class="barIcon" src="/static/imgs/tips.svg" alt="" />
      <img class="barIcon" src="/static/imgs/Message.svg" alt="" />

      <el-dropdown>
        <img style="margin: 0 6px" src="/static/imgs/userIcon.svg" alt="" />
        <template #dropdown>
          <el-dropdown-menu>
            <!-- <el-dropdown-item @click="toSystemManagement">系统管理</el-dropdown-item> -->
            <el-dropdown-item>修改密码</el-dropdown-item>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div>{{ userStore.userInfo?.showName }}</div>
    </div>
  </header>
</template>

<script setup>
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
import { ProjectMainController } from '@/api/index'
import http from '@/core/http/index'
import { routeObj } from '@/router'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'
const appStore = useAppStore()
const userStore = useUserStore()

const router = useRouter()

function toggleDrawerBar() {
  appStore.toggleDrawerBar()
}

function toDashboard() {
  // appStore.setCurrentModule('dashboard')
  router.push({ name: 'dashboard' })
  appStore.closeDrawerBar()
}

const projectList = ref([])
const projectObj = reactive({})
const projectId = ref(null)
async function getProjectList() {
  return ProjectMainController.list(
    http,
    {
      projectMainDtoFilter: {
        projectHeaderId: userStore.userId,
      },
    },
    null,
    null
  ).then((res) => {
    projectList.value = res.data.dataList
    res.data.dataList.forEach((project) => {
      projectObj[project.id] = project
    })
    if (!projectId.value) {
      projectId.value = projectList.value[0].id
    }
  })
}

function changeProjectId(id) {
  // console.log('id = ', id)
  projectId.value = id
  userStore.setProjectId(id)
}

onMounted(() => {
  projectId.value = userStore.getProjectId()
  getProjectList()
})
// // 退出登录
const logout = () => {
  userStore.logOut()
  router.push({ name: 'login' })
}
</script>

<style lang="scss" scoped>
header {
  height: 64px;
  background: #3246d2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;

  #NavigationBtnBox {
    background-color: #2033be;
    width: 65px;
    height: 64px;
    //里面的元素垂直上下居中
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #7180f4;
  }

  .h1 {
    height: 30px;
    font-size: 22px;
    font-weight: bold;
    color: #ffffff;
    margin-left: 8px;
    margin-right: 16px;
  }

  .head-title {
    min-width: 260px;
    display: flex;
    align-items: center;
    .projectSelect {
      width: 180px;
      display: flex;
      color: #fff;
      align-items: center;
      border: 1px #fff solid;
      padding: 8px;
      font-size: 16px;
      font-weight: bold;
      border-radius: 4px;
    }
  }

  #userBar {
    display: flex;
    align-items: center;
    margin-right: 32px;

    .h2 {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .cur-menu {
        margin-left: 20px;
        height: 22px;
        font-size: 16px;
        font-weight: 400;
      }
    }

    .barIcon {
      margin: 0 10px;
    }
  }

  .down-arrow {
    width: 24px;
    height: 24px;
    font-size: 16px;
    color: #ffffff;
    margin-left: 8px;
    // outline: 1px solid red;
  }
}
</style>
<style lang="scss">
:focus-visible {
  outline: none !important;
}
.c-primary {
  color: #3246d2 !important;
  font-weight: bold;
}
</style>
