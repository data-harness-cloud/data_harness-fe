<template>
  <TableTemplate :controller="sysDeptController" :options="options">
    <template #in-filter>
      <el-button
        type="success"
        size="large"
        :icon="Plus"
        @click="
          sysDeptController.handleAdd().then(() => {
            sysDeptController.refreshTable(true)
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
          sysDeptController.handleUpdate(scope.row).then(() => {
            sysDeptController.refreshTable(false)
          })
        "
      >
        <img src="/static/icons/edit1.svg" class="mr2" />
        编辑
      </el-button>

      <el-button type="primary" link @click="onEditSysDeptPostClick(scope.row)">
        <img src="/static/icons/sss.svg" class="mr2" />
        岗位
      </el-button>
      <el-button
        type="primary"
        link
        @click="
          sysDeptController.handleDelete(scope.row).then(() => {
            sysDeptController.refreshTable(true)
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
import FormSysDeptController from '@/core/classes/FormSysDeptController'
// import { treeDataTranslate } from '@/utils'
import { useRouter } from 'vue-router'
import useUserStore from '@/store/modules/user'
const router = useRouter()
const userStore = useUserStore()

const sysDeptController = new FormSysDeptController({
  paged: false,
  defaultKeys: {
    idKey: 'deptId',
  },
})

onMounted(() => {
  userStore.closeProjectChoice()
  sysDeptController.refreshTable(true)
})

onBeforeUnmount(() => {
  userStore.openProjectChoice()
})

const options = {
  operate: {
    width: '240',
    rowKey: 'deptId',
  },
}

function onEditSysDeptPostClick(row) {
  const params = {
    deptId: row.deptId,
  }
  params.closeVisible = 1
  router.push({ name: 'sys-dept-post', query: params })
}
</script>

<style lang="scss" scoped></style>
