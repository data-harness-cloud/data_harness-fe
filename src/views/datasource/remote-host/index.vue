<template>
  <div class="tagPane">
    <el-tabs v-model="activeName" class="sshTabs" @tab-click="handleClick">
      <el-tab-pane label="远程主机管理" name="first">
        <TableTemplate
          v-if="remoteHostController"
          :controller="remoteHostController"
          :options="options"
          :settingOptions="{
            showHeader: false,
            showDivide: false,
          }"
        >
          <template #select-filter>
            <div style="margin-right: 20px">
              <el-select v-model="selectProject" placeholder="选择项目" size="large" style="width: 200px" clearable>
                <el-option v-for="item in projectList" :key="item.id" :label="item.projectName" :value="item.id" />
              </el-select>
            </div>
          </template>
          <template #in-filter>
            <el-button
              type="success"
              size="large"
              :icon="Plus"
              :disabled="!selectProject"
              @click="
                remoteHostController.handleAdd({ projectId: selectProject }).then(() => {
                  remoteHostController.refreshTable(true)
                })
              "
            >
              新增数据源
            </el-button>
          </template>

          <template #slot-operate="{ scope }">
            <el-button
              type="primary"
              link
              @click="
                remoteHostController.handleUpdate(scope?.row).then(() => {
                  remoteHostController.refreshTable(false)
                })
              "
            >
              <img src="/static/icons/edit1.svg" class="mr2" />
              编辑
            </el-button>
            <el-button
              type="primary"
              link
              @click="
                remoteHostController.handleDelete(scope?.row).then(() => {
                  remoteHostController.refreshTable(true)
                })
              "
            >
              <img src="/static/icons/del1.svg" class="mr2" />
              删除
            </el-button>
          </template>
        </TableTemplate>
      </el-tab-pane>
      <el-tab-pane label="Seatunnel管理" name="second">
        <TableTemplate
          v-if="seatunnelConfigController"
          :controller="seatunnelConfigController"
          :options="options"
          :settingOptions="{
            showHeader: false,
            showDivide: false,
          }"
        >
          <template #select-filter>
            <div style="margin-right: 20px">
              <el-select v-model="selectProject" placeholder="选择项目" size="large" style="width: 200px" clearable>
                <el-option v-for="item in projectList" :key="item.id" :label="item.projectName" :value="item.id" />
              </el-select>
            </div>
          </template>
          <template #in-filter>
            <el-button
              type="success"
              size="large"
              :icon="Plus"
              :disabled="!selectProject"
              @click="
                seatunnelConfigController.handleAdd({ projectId: selectProject }).then(() => {
                  seatunnelConfigController.refreshTable(true)
                })
              "
            >
              新增Seatunnel源
            </el-button>
          </template>

          <template #slot-operate="{ scope }">
            <el-button
              type="primary"
              link
              @click="
                seatunnelConfigController.handleUpdate(scope?.row).then(() => {
                  seatunnelConfigController.refreshTable(false)
                })
              "
            >
              <img src="/static/icons/edit1.svg" class="mr2" />
              编辑
            </el-button>
            <el-button
              type="primary"
              link
              @click="
                seatunnelConfigController.handleDelete(scope?.row).then(() => {
                  seatunnelConfigController.refreshTable(true)
                })
              "
            >
              <img src="/static/icons/del1.svg" class="mr2" />
              删除
            </el-button>
          </template>
        </TableTemplate>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import RemoteHostController from '@/core/classes/RemoteHostController'
import SeatunnelConfigController from '@/core/classes/SeatunnelConfigController'

import { ProjectMainController } from '@/api/index'
import useUserStore from '@/store/modules/user'
import http from '@/core/http/index'
const activeName = ref('first')
const userStore = useUserStore()
const remoteHostController = new RemoteHostController()
const seatunnelConfigController = new SeatunnelConfigController()

const projectList = ref([])
const selectProject = ref(null)

watch(selectProject, (newVal, oldVal) => {
  if (newVal) {
    remoteHostController.dataFilter.projectId = newVal
    seatunnelConfigController.dataFilter.projectId = newVal
    remoteHostController.refreshTable(true)
    seatunnelConfigController.refreshTable(true)
  } else {
    remoteHostController.dataList.length = 0
    seatunnelConfigController.dataList.length = 0
  }
})

onMounted(() => {
  userStore.closeProjectChoice()

  ProjectMainController.list(http, {
    projectMainDtoFilter: {
      projectHeaderId: userStore.userId,
    },
  }).then((res) => {
    projectList.value = res.data.dataList
  })

  remoteHostController.refreshTable(true)
  seatunnelConfigController.refreshTable(true)
})

onBeforeUnmount(() => {
  userStore.openProjectChoice()
})

const options = {
  operate: {
    width: '180',
  },
}
</script>

<style lang="scss">
.tagPane {
  position: relative;
  padding-top: 24px;
}
.sshTabs {
  height: 100%;
  .el-tabs__header {
    margin: 0px 32px 10px 32px;
    .el-tabs__item {
      font-size: 20px;
      font-family: PingFang SC-Bold, PingFang SC;
      font-weight: bold;
      color: #222222;
      align-items: start;
      height: 43px;
    }
  }
  .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: #dddddd;
  }
  .el-tabs__content {
    height: calc(100% - 53px);
    .el-tab-pane {
      height: 100%;
    }
  }
  .mainContent {
    height: calc(100% - 53px);
  }
}
</style>
