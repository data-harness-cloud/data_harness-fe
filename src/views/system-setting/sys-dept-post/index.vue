<template>
  <TableTemplate :controller="sysPostController" :options="options">
    <template #in-filter>
      <el-button
        type="primary"
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
        type="danger"
        link
        size="large"
        @click="
          sysPostController.handleDelete(scope.row).then(() => {
            sysPostController.refreshTable(true)
          })
        "
      >
        删除
      </el-button>
      <el-button
        type="primary"
        link
        size="large"
        @click="
          sysPostController.handleUpdate(scope.row).then(() => {
            sysPostController.refreshTable(false)
          })
        "
      >
        编辑
      </el-button>
    </template>
  </TableTemplate>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import FormSysPostController from '@/core/classes/FormSysPostController'
import { useRouter } from 'vue-router'
const router = useRouter()
const sysPostController = new FormSysPostController({
  paged: false,
  defaultKeys: {
    idKey: 'deptId',
  },
})
sysPostController.refreshTable(true)

const options = {
  operate: {
    width: '180',
    rowKey: 'deptId',
  },
}
</script>

<style lang="scss" scoped></style>
