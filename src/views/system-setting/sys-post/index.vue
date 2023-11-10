<template>
  <TableTemplate :controller="sysPostController" :options="options">
    <template #in-filter>
      <el-button
        type="success"
        size="large"
        :icon="Plus"
        @click="
          sysPostController.handleAdd().then(() => {
            sysPostController.refreshTable(true)
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
          sysPostController.handleUpdate(scope.row).then(() => {
            sysPostController.refreshTable(false)
          })
        "
        ><img src="/static/icons/edit1.svg" class="mr2" />

        编辑
      </el-button>
      <el-button
        type="primary"
        link
        @click="
          sysPostController.handleDelete(scope.row).then(() => {
            sysPostController.refreshTable(true)
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
import FormSysPostController from '@/core/classes/FormSysPostController'
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()
const sysPostController = new FormSysPostController({
  paged: false,
  defaultKeys: {
    idKey: 'deptId',
  },
})

onMounted(() => {
  userStore.closeProjectChoice()
  sysPostController.refreshTable(true)
})

onBeforeUnmount(() => {
  userStore.openProjectChoice()
})

const options = {
  operate: {
    width: '180',
    rowKey: 'deptId',
  },
}
</script>

<style lang="scss" scoped></style>
