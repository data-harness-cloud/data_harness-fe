<template>
  <TableTemplate :controller="sysUserController" :options="options">
    <template #in-filter>
      <el-button
        type="success"
        :icon="Plus"
        size="large"
        @click="
          sysUserController.handleAdd().then(() => {
            sysUserController.refreshTable(true)
          })
        "
      >
        新增
      </el-button>
    </template>
    <template #slot-operate="{ scope }">
      <el-button
        type="primary"
        link
        @click="
          sysUserController.handleUpdate(scope.row).then(() => {
            sysUserController.refreshTable(false)
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
          sysUserController.handleDelete(scope.row).then(() => {
            sysUserController.refreshTable(true)
          })
        "
        ><img src="/static/icons/del1.svg" class="mr2" />

        删除
      </el-button>
    </template>
  </TableTemplate>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import FormSysUserController from '@/core/classes/FormSysUserController'
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()

const sysUserController = new FormSysUserController()

onMounted(() => {
  userStore.closeProjectChoice()
  sysUserController.refreshTable(true)
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

<style scoped lang="scss"></style>
