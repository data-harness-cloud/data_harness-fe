<template>
  <TableTemplate v-if="projectList.length" :controller="planningWarehouseLayerController" :options="options">
    <!-- <template #in-filter>
      <el-button
        type="success"
        size="large"
        :icon="Plus"
        @click="
          planningWarehouseLayerController.handleAdd({ projectId: userStore.projectId }).then(() => {
            planningWarehouseLayerController.refreshTable(true)
          })
        "
      >
        添加层级
      </el-button>
    </template> -->

    <template #slot-operate="{ scope }">
      <el-button
        type="primary"
        link
        @click="
          planningWarehouseLayerController.handleUpdate(scope?.row).then(() => {
            planningWarehouseLayerController.refreshTable(true)
          })
        "
      >
        <img src="/static/icons/edit1.svg" class="mr2" />
        编辑
      </el-button>
      <!-- <el-button
        type="primary"
        link
        @click="
          planningWarehouseLayerController.handleDelete(scope.row).then(() => {
            planningWarehouseLayerController.refreshTable(true)
          })
        "
      >
        <img src="/static/icons/del1.svg" class="mr2" />
        删除
      </el-button> -->
    </template>
  </TableTemplate>
  <div v-else class="noDataTTTT">
    <div>当前没有参与项目</div>
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import PlanningWarehouseLayerController from '@/core/classes/PlanningWarehouseLayerController/index'
import { ProjectMainController } from '@/api/index'
import http from '@/core/http/index'
import useUserStore from '@/store/modules/user'

const planningWarehouseLayerController = new PlanningWarehouseLayerController()

const userStore = useUserStore()

const projectList = ref([])
ProjectMainController.list(http, {
  projectMainDtoFilter: {
    projectHeaderId: userStore.userId,
  },
})
  .then((res) => {
    projectList.value = res.data.dataList
    if (res.data.dataList.length <= 0) return
  })
  .catch((err) => {
    console.log(err)
  })

watch(
  () => userStore.getProjectId(),
  async (newValue) => {
    getProjectMemberList()
  }
)
getProjectMemberList()

function getProjectMemberList() {
  planningWarehouseLayerController
    .list({
      projectId: userStore.projectId,
    })
    .then((res) => {
      console.log('项目成员', res)
    })
}

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
