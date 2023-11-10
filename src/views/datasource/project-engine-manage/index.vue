<template>
  <TableTemplate :controller="projectEngineController" :options="options">
    <template #in-filter>
      <el-button
        type="success"
        size="large"
        :icon="Plus"
        @click="
          projectEngineController.handleAdd().then(() => {
            projectEngineController.refreshTable(true)
          })
        "
      >
        新增引擎
      </el-button>
    </template>

    <template #slot-operate="{ scope }">
      <el-button
        type="primary"
        link
        @click="
          projectEngineController.handleUpdate(scope.row).then(() => {
            projectEngineController.refreshTable(false)
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
          projectEngineController.handleDelete(scope.row).then(() => {
            projectEngineController.refreshTable(true)
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
import ProjectEngineController from '@/core/classes/ProjectEngineController'
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()

const projectEngineController = new ProjectEngineController()

onMounted(() => {
  userStore.closeProjectChoice()
  projectEngineController.refreshTable(true)
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

<style lang="scss" scoped></style>
