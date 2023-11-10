<template>
  <TableTemplate :controller="projectController" :options="options">
    <template #in-filter>
      <el-button
        type="success"
        size="large"
        :icon="Plus"
        @click="
          projectController.handleAdd().then(() => {
            projectController.refreshTable(true)
          })
        "
      >
        新增项目
      </el-button>
    </template>

    <template #slot-operate="{ scope }">
      <el-button
        type="primary"
        link
        @click="
          projectController.handleUpdate(scope.row).then(() => {
            projectController.refreshTable(false)
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
          projectController.handleDelete(scope.row).then(() => {
            projectController.refreshTable(true)
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
import ProjectController from '@/core/classes/ProjectController/index'
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()
const projectController = new ProjectController()

onMounted(() => {
  userStore.closeProjectChoice()
  projectController.refreshTable(true)
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
