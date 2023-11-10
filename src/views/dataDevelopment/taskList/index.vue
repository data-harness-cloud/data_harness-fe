<template>
  <div style="position: relative; width: 100%; flex: 1 0 400px">
    <div style="display: flex; height: 100%">
      <div class="smSiderBar">
        <div style="width: 100%; display: flex; margin-bottom: 10px">
          <div class="searchIcon"><img src="/static/icons/icon_search.svg" /></div>
          <input type="text" class="my-input" placeholder="请输入内容" v-model="searchKeywords" />
          <div class="iconBox ml4">
            <img src="/static/icons/filter.svg" />
          </div>
          <div class="iconBox ml4">
            <img src="/static/icons/fucr.svg" />
          </div>
        </div>
        <dataTree
          v-for="ii in indexTree"
          :key="ii.id"
          :data="ii"
          @selectNode="selectMenu"
          :selectNodeId="selectedMenu?.id"
          @addTaskById="addTaskById"
          @editTask="displayEditTaskPlane"
          :showSmallImg="false"
        />
      </div>
      <div class="main">
        <taskListIndex ref="taskListIndexRef"></taskListIndex>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, getCurrentInstance } from 'vue'
import {
  ProjectMainController,
  PlanningClassificationController,
  PlanningProcessController,
  PlanningThemeController,
  devLiteflowRulerController,
} from '@/api/index'
import LiteflowRulerController from '@/core/classes/LiteflowRulerController'
import dataTree from '@/views/dataDevelopment/OfflineDevelopment/dataTree.vue'
import http from '@/core/http/index'
import useUserStore from '@/store/modules/user'
import { treeDataTranslate } from '@/utils'
import { createMd5Id, getAncestors } from '@/core/js/$'
import taskListIndex from './taskListIndex.vue'

const userStore = useUserStore()
const projectList = ref([])
const litrflowRulerController = new LiteflowRulerController()

const taskListIndexRef = ref() //节点

watch(
  () => userStore.getProjectId(),
  async (newValue) => {
    await getDataPlanning()
    await getIndexTree()
    selectMenu(indexTree.value[0])
  }
)

async function getProjectList() {
  return ProjectMainController.list(
    http,
    {
      projectMainDtoFilter: {
        projectHeaderId: userStore.userId,
      },
    },
    null,
    null
  ).then((res) => {
    projectList.value = res.data.dataList
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
const setAllOutSelectedMenu = (allData) => {
  taskListIndexRef.value.afterFilter.allOutSelectedMenu = {}
  allData.forEach((item) => {
    switch (item.level) {
      case 0:
        taskListIndexRef.value.afterFilter.allOutSelectedMenu.projectId = item.id
        break
      case 1:
        taskListIndexRef.value.afterFilter.allOutSelectedMenu.classificationId = item.id
        break
      case 2:
        taskListIndexRef.value.afterFilter.allOutSelectedMenu.processThemeId = item.id
        break
      case 3:
        taskListIndexRef.value.afterFilter.allOutSelectedMenu.processId = item.id
        break
      case 4:
        taskListIndexRef.value.afterFilter.allOutSelectedMenu.rulerId = item.id
        break
    }
  })
}
function selectMenu(node) {
  selectedMenu.value = node
  taskListIndexRef.value.afterFilter.projectId = ''
  taskListIndexRef.value.afterFilter.classificationId = ''
  taskListIndexRef.value.afterFilter.processThemeId = ''
  taskListIndexRef.value.afterFilter.processId = ''
  taskListIndexRef.value.afterFilter.rulerId = ''
  setAllOutSelectedMenu([selectedMenu.value, ...getAncestors(indexTree.value, selectedMenu.value)])

  switch (selectedMenu.value.level) {
    case 0:
      taskListIndexRef.value.afterFilter.projectId = selectedMenu.value.id
      break
    case 1:
      taskListIndexRef.value.afterFilter.classificationId = selectedMenu.value.id
      break
    case 2:
      taskListIndexRef.value.afterFilter.processThemeId = selectedMenu.value.id
      break
    case 3:
      taskListIndexRef.value.afterFilter.processId = selectedMenu.value.id
      break
    case 4:
      taskListIndexRef.value.afterFilter.rulerId = selectedMenu.value.id
      break
  }
}
const changeSelectedProjectId = () => {
  // 改变taskListIndexRef 中的afterFilter
  taskListIndexRef.value.afterFilter.classificationId = ''
  taskListIndexRef.value.afterFilter.processThemeId = ''
  taskListIndexRef.value.afterFilter.processId = ''
  taskListIndexRef.value.afterFilter.rulerId = ''
  taskListIndexRef.value.afterFilter.projectId = userStore.projectId
}
const DataPlanning = {}
let liteflowRulerList = []
async function getDataPlanning() {
  return new Promise((resolve, reject) => {
    const PromiseArr = []

    PromiseArr.push(
      PlanningClassificationController.list(
        http,
        {
          planningClassificationDtoFilter: {
            projectId: userStore.projectId,
          },
        },
        null,
        { showMask: false }
      )
        .then((res) => {
          DataPlanning.planningClass = res.data.dataList
        })
        .catch((err) => {
          console.error(err)
        })
    )

    PromiseArr.push(
      PlanningProcessController.list(
        http,
        {
          planningProcessDtoFilter: {
            projectId: userStore.projectId,
          },
        },
        null,
        null
      )
        .then((res) => {
          DataPlanning.planningProcess = res.data.dataList
        })
        .catch((err) => {
          console.error(err)
        })
    )

    PromiseArr.push(
      PlanningThemeController.list(
        http,
        {
          planningThemeDtoFilter: {
            projectId: userStore.projectId,
          },
        },
        null,
        null
      )
        .then((res) => {
          DataPlanning.planningTheme = res.data.dataList
        })
        .catch((err) => {
          console.error(err)
        })
    )
    PromiseArr.push(
      devLiteflowRulerController
        .list(http, {
          devLiteflowRulerDtoFilter: {
            projectId: userStore.projectId,
          },
        })
        .then((res) => {
          liteflowRulerList = res.data.dataList
        })
    )

    Promise.all(PromiseArr).then((res) => {
      resolve(DataPlanning)
    })
  })
}

async function getIndexTree() {
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
  liteflowRulerList.forEach((item) => {
    dataArr.push({
      id: item.id,
      name: item.chainName,
      level: 4,
      parentId: item.processId,
      show: true,
    })
  })
  indexTree.value = treeDataTranslate(dataArr, 'id', 'parentId', 'children')
}

function addTaskById(id) {
  litrflowRulerController
    .handleAdd({
      processId: id,
      projectId: userStore.projectId,
      elData: 'null',
    })
    .then((res) => {
      liteflowRulerList.push(res)
      getIndexTree()
    })
}

onMounted(async () => {
  await getProjectList()
  await getDataPlanning()
  await getIndexTree()
  selectMenu(indexTree.value[0])
})

const selectedTask = ref(null)
const showEditTaskPlane = ref(false)
function displayEditTaskPlane(Task = null) {
  selectedTask.value = Task
  showEditTaskPlane.value = true
}
function undisplayEditTaskPlane() {
  selectedTask.value = null
  showEditTaskPlane.value = false
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

  #projectName {
    height: 40px;
    background: #7e8289;
    font-size: 14px;
    font-weight: bold;
    color: #222222;
    position: absolute;
    top: 0;
    left: 0;

    --el-input-icon-color: #fff;

    .el-input__wrapper {
      background-color: #7e8289;
      box-shadow: none !important;

      .el-input__inner {
        color: #fff !important;
        font-size: 16px !important;
        font-weight: bold;
      }

      .el-icon {
        color: #fff !important;
        width: 16px !important;
        height: 16px !important;

        svg {
          width: 16px !important;
          height: 16px !important;
        }
      }
    }
  }
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
  width: 130px;
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
