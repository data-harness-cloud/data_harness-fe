<template>
  <div style="position: relative; width: 100%; height: 100%">
    <div style="display: flex; height: 100%">
      <div class="smSiderBar">
        <div style="width: 100%; display: flex; margin-bottom: 10px">
          <div class="searchIcon"><img src="/static/icons/icon_search.svg" /></div>
          <input type="text" class="my-input" placeholder="请输入内容" v-model="searchKeywords" />
        </div>
        <dataTree v-for="ii in indexTree" :data="ii" @selectNode="selectMenu" :selectNodeId="selectedMenu?.id" />
      </div>
      <div class="main">
        <TableTemplate v-if="routeController" :controller="routeController" :options="options">
          <template #in-filter>
            <el-button
              type="success"
              size="large"
              :disabled="!selectedMenu || selectedMenu.level !== 3"
              :icon="Plus"
              @click="
                routeController
                  .handleAdd({
                    processId: selectedMenu.id,
                    projectId: userStore.getProjectId(),
                  })
                  .then(() => {
                    selectMenu(selectedMenu)
                  })
              "
            >
              新增
            </el-button>
          </template>

          <template #slot-operate="{ scope }">
            <el-button v-if="scope.row.state === -1" type="primary" link @click="registerApi(scope.row)">
              上线
            </el-button>
            <el-button v-else type="primary" link @click="unregisterApi(scope.row)"> 下线 </el-button>

            <el-button
              type="primary"
              link
              @click="
                routeController.handleUpdate(scope.row).then(() => {
                  selectMenu(selectedMenu)
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import {
  ProjectMainController,
  PlanningClassificationController,
  PlanningProcessController,
  PlanningThemeController,
} from '@/api/index'
import dataTree from '@/components/modelDesignThree/dataTree.vue'
import http from '@/core/http/index'
import useUserStore from '@/store/modules/user'
import { treeDataTranslate } from '@/utils'
import CustomizeRouteController from '@/core/classes/CustomizeRouteController'
import { ElMessage } from 'element-plus'
const routeController = new CustomizeRouteController()
const userStore = useUserStore()
const projectList = ref([])

watch(
  () => userStore.getProjectId(),
  async (newValue) => {
    getIndexTree()
  }
)

async function getProjectList() {
  return ProjectMainController.list(http, {
    projectMainDtoFilter: {
      projectHeaderId: userStore.userId,
    },
  })
    .then((res) => {
      projectList.value = res.data.dataList
    })
    .catch((err) => {
      console.error(err)
    })
}
const searchKeywords = ref('')
const indexTree = ref(null)
watch(searchKeywords, (val) => {
  if (!indexTree.value) return
  function dfs(nodes) {
    let ans = false
    nodes.forEach((node) => {
      let flag = false
      if (node.children && dfs(node.children)) {
        flag = true
      }
      if (flag || node.name.indexOf(val) > -1) {
        node.show = true
        ans = true
      } else {
        node.show = false
      }
    })
    return ans
  }
  dfs(indexTree.value)
})
const selectedMenu = ref(null)
function selectMenu(node) {
  selectedMenu.value = node
  routeController.dataFilter = {
    processId: node.id,
  }
  routeController.getListByNode(node)
}

const DataPlanning = {}
async function getDataPlanning() {
  return new Promise((resolve, reject) => {
    const PromiseArr = []

    PromiseArr.push(
      PlanningClassificationController.list(http, {
        planningClassificationDtoFilter: {
          projectId: userStore.projectId,
        },
      })
        .then((res) => {
          DataPlanning.planningClass = res.data.dataList
        })
        .catch((err) => {
          console.error(err)
        })
    )

    PromiseArr.push(
      PlanningProcessController.list(http, {
        planningProcessDtoFilter: {
          projectId: userStore.projectId,
        },
      })
        .then((res) => {
          DataPlanning.planningProcess = res.data.dataList
        })
        .catch((err) => {
          console.error(err)
        })
    )

    PromiseArr.push(
      PlanningThemeController.list(http, {
        planningThemeDtoFilter: {
          projectId: userStore.projectId,
        },
      })
        .then((res) => {
          DataPlanning.planningTheme = res.data.dataList
        })
        .catch((err) => {
          console.error(err)
        })
    )

    Promise.all(PromiseArr).then((res) => {
      resolve(DataPlanning)
    })
  })
}

async function getIndexTree() {
  await getDataPlanning()
  let dataArr = []
  const selectedProject = projectList.value.find((item) => item.id === userStore.projectId)
  dataArr.push({
    id: selectedProject.id,
    name: selectedProject.projectName,
    level: 0,
    parentId: null,
    show: true,
  })
  DataPlanning.planningClass.forEach((item) => {
    dataArr.push({
      id: item.id,
      name: item.classificationName,
      level: 1,
      parentId: item.projectId,
      show: true,
    })
  })
  DataPlanning.planningTheme.forEach((item) => {
    dataArr.push({
      id: item.id,
      name: item.themeName,
      level: 2,
      parentId: item.classificationId,
      show: true,
    })
  })
  DataPlanning.planningProcess.forEach((item) => {
    dataArr.push({
      id: item.id,
      name: item.processName,
      level: 3,
      parentId: item.processParentId || item.processThemeId,
      show: true,
    })
  })
  indexTree.value = treeDataTranslate(dataArr, 'id', 'parentId', 'children')
}

function registerApi(row) {
  routeController.$apiController.registerApi(http, { id: row.id }).then((res) => {
    ElMessage.success('上线成功')
    row.state = 1
  })
}

function unregisterApi() {
  routeController.$apiController.unregisterApi(http, { id: row.id }).then((res) => {
    ElMessage.success('下线成功')
    row.state = -1
  })
}

onMounted(async () => {
  await getProjectList()
  await getIndexTree()
  selectMenu(indexTree.value[0])
})

const options = {
  operate: {
    width: '240',
  },
}
</script>

<style lang="scss">
.smSiderBar {
  width: 256px;
  min-width: 256px;
  height: 100%;
  padding: 16px;
  border-right: 1px solid #dddddd;
  position: relative;
}

.main {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.searchIcon {
  width: 26px;
  height: 32px;
  background: #f6f6f9;
  border-radius: 4px 0px 0px 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.my-input {
  width: 240px;
  height: 32px;
  background: #f6f6f9;
  border-radius: 0px 4px 4px 0px;
  padding-left: 4px;
  border: none;

  font-size: 14px;
  color: #666666;
  outline: none;
}

.addBtn {
  width: 40px;
  height: 32px;
  border-radius: 4px 4px 4px 4px;
  opacity: 1;
  border: 1px solid #dddddd;
  margin-left: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
