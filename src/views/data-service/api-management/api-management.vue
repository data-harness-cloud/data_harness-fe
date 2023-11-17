<template>
  <TableTemplate :controller="routeController" :options="options">
    <template #in-filter>
      <el-button
        type="success"
        :icon="Plus"
        size="large"
        @click="
          routeController.handleAdd().then(() => {
            routeController.refreshTable(true)
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
          routeController.handleUpdate(scope.row).then(() => {
            routeController.refreshTable(false)
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
          routeController.handleDelete(scope.row).then(() => {
            routeController.refreshTable(true)
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
import CustomizeRouteController from '@/core/classes/CustomizeRouteController'
const routeController = new CustomizeRouteController()

onMounted(() => {
  routeController.refreshTable(true)
})

const options = {
  operate: {
    width: '180',
  },
}
</script>

<style scoped lang="scss"></style>
