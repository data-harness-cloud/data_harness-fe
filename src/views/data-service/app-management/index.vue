<template>
  <TableTemplate :controller="appController" :options="options">
    <template #in-filter>
      <el-button
        type="success"
        size="large"
        :icon="Plus"
        @click="
          appController.handleAdd({ projectId: userStore.projectId }).then(() => {
            appController.refreshTable(true)
          })
        "
      >
        添加
      </el-button>
    </template>

    <template #slot-operate="{ scope }">
      <el-button
        type="primary"
        link
        @click="
          appController.handleUpdate(scope?.row).then(() => {
            appController.refreshTable(true)
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
          appController.handleDelete(scope.row).then(() => {
            appController.refreshTable(true)
          })
        "
      >
        <img src="/static/icons/del1.svg" class="mr2" />
        删除
      </el-button>
    </template>
  </TableTemplate>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import ExternalAppController from '@/core/classes/ExternalAppController/index'
import useUserStore from '@/store/modules/user'

const appController = new ExternalAppController()

const userStore = useUserStore()

watch(
  () => userStore.getProjectId(),
  async (newValue) => {
    appController.dataFilter.projectId = newValue
    appController.refreshTable(true)
  }
)

appController.dataFilter.projectId = userStore.getProjectId()
appController.refreshTable(true)

const options = {
  operate: {
    width: '180',
  },
}
</script>

<style lang="scss" scoped>
.el-input {
  width: 200px;
  height: 40px;
}

.noDataTT {
  background-image: url('/static/imgs/contentIsEmpty.svg');
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 0 400px;
  height: 100%;
  padding: 0;
  overflow-x: hidden;
  overflow-y: hidden;
  background-repeat: no-repeat;
  background-position: 50% 35%;
}
</style>
