<template>
  <TableTemplate v-if="projectDatasourceController" :controller="projectDatasourceController" :options="options">
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
        @click="
          projectDatasourceController.handleAdd({ projectId: selectProject }).then(() => {
            projectDatasourceController.refreshTable(true)
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
          projectDatasourceController.handleUpdate(scope?.row).then(() => {
            projectDatasourceController.refreshTable(false)
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
          projectDatasourceController.handleDelete(scope?.row).then(() => {
            projectDatasourceController.refreshTable(true)
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
import ProjectDatasourceController from '@/core/classes/ProjectDatasourceController'
import { ProjectMainController } from '@/api/index'
import useUserStore from '@/store/modules/user'
import http from '@/core/http/index'
const userStore = useUserStore()
const projectDatasourceController = new ProjectDatasourceController()

const projectList = ref([])
const selectProject = ref(null)

watch(selectProject, (newVal, oldVal) => {
  if (newVal) {
    projectDatasourceController.dataFilter.projectId = newVal
    projectDatasourceController.refreshTable(true)
  } else {
    projectDatasourceController.dataList.length = 0
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

  projectDatasourceController.refreshTable(true)
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
