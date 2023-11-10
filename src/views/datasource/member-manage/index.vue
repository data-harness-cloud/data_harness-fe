<template>
  <TableTemplate v-if="projectList.length" :controller="projectMemberController" :options="options">
    <template #select-filter>
      <div style="margin-right: 20px">
        <el-select v-model="selectProject" placeholder="选择项目" size="large" style="width: 200px">
          <el-option v-for="item in projectList" :key="item.id" :label="item.projectName" :value="item.id" />
        </el-select>
      </div>
    </template>
    <template #in-filter>
      <el-button
        :disabled="!selectProject"
        type="success"
        size="large"
        :icon="Plus"
        @click="
          projectMemberController.handleAdd({ memberProjectId: selectProject }).then(() => {
            projectMemberController.refreshTable(true)
          })
        "
      >
        添加成员
      </el-button>
    </template>

    <template #slot-operate="{ scope }">
      <el-button
        type="primary"
        link
        @click="
          projectMemberController.handleDelete(scope.row).then(() => {
            projectMemberController.refreshTable(true)
          })
        "
      >
        <img src="/static/icons/del1.svg" class="mr2" />
        删除
      </el-button>
    </template>
  </TableTemplate>
  <div v-else class="noDataTT">
    <div>当前没有参与项目</div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import ProjectMemberController from '@/core/classes/ProjectMemberController/index'
import { ProjectMainController } from '@/api/index'
import http from '@/core/http/index'
import useUserStore from '@/store/modules/user'

const projectMemberController = new ProjectMemberController()

const userStore = useUserStore()

const projectList = ref([])
const selectProject = ref(null)

watch(selectProject, (newVal, oldVal) => {
  if (newVal) {
    getProjectMemberList()
  } else {
    projectMemberController.dataList.length = 0
  }
})

function getProjectMemberList() {
  projectMemberController
    .list({
      memberProjectId: selectProject.value,
    })
    .then((res) => {
      console.log('项目成员', res)
    })
}
onMounted(() => {
  userStore.closeProjectChoice()
  ProjectMainController.list(http, {
    projectMainDtoFilter: {
      projectHeaderId: userStore.userId,
    },
  }).then((res) => {
    projectList.value = res.data.dataList
  })
})

onBeforeUnmount(() => {
  userStore.openProjectChoice()
})

const options = {
  operate: {
    width: '120',
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
