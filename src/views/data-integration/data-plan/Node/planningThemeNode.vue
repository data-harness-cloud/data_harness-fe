<template>
  <div id="shape" @dblclick="updateNode">
    <div class="fx">
      <div id="shapeIcon">
        <img src="/static/icons/themeIcon.svg" alt="" />
      </div>
      <div>{{ themeName }}</div>
    </div>

    <div class="fx">
      <el-dropdown trigger="click" :hide-on-click="false" size="large">
        <div class="pointBox">
          <div class="point"></div>
          <div class="point"></div>
          <div class="point"></div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="updateNode">编辑</el-dropdown-item>
            <el-dropdown-item v-if="themeStatus" @click="setStatus">停用</el-dropdown-item>
            <el-dropdown-item v-else @click="setStatus">启用</el-dropdown-item>
            <el-dropdown-item @click="delNode">删除</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="plus" @click="addNode"></div>
  </div>
</template>

<script setup>
import { inject, onMounted, getCurrentInstance } from 'vue'
import { createDownstream, formatNodeTree, removeNodeTree, canDel } from './utils.js'
import PlanningThemeController from '@/core/classes/PlanningThemeController/index'
import PlanningProcessController from '@/core/classes/PlanningProcessController/index'
import { ElMessage } from 'element-plus'
const getNode = inject('getNode')
let planningThemeController = null
let planningProcessController = null
const node = getNode()
const graph = node.model.graph

const themeName = ref('')
themeName.value = node.data?.themeName

const themeStatus = ref(1)
themeStatus.value = node.data?.themeStatus

const project = node.data?.project
function addNode() {
  if (!planningProcessController) planningProcessController = new PlanningProcessController()

  planningProcessController
    .handleAdd(
      {},
      { defaultParams: { project: project, classification: node.data.classification, processTheme: node.data } }
    )
    .then((res) => {
      console.log('formData', res)
      res.project = node.data?.project
      res.classification = node.data?.classification
      res.processTheme = node.data
      createDownstream(node, 'planningProcessNode', res)
      formatNodeTree(graph)
      graph.parentProxy.getIndexTree()
    })
}
function updateNode() {
  if (!planningThemeController) planningThemeController = new PlanningThemeController()

  planningThemeController.handleUpdate(node.data, { defaultParams: { project: project } }).then((res) => {
    console.log('更新业务', node.data.id)
    planningThemeController.view({ id: node.data.id }).then((ress) => {
      node.data = ress.data
      themeName.value = ress.data.themeName
      graph.parentProxy.getIndexTree()
    })
  })
}
onMounted(() => {
  node.delNode = delNode
})

function delNode() {
  if (!canDel(node.id)) {
    ElMessage.error('删除失败,该节点下有子节点')
    return
  }
  if (!planningThemeController) planningThemeController = new PlanningThemeController()
  planningThemeController.handleDelete({ id: node.data.id }).then((res) => {
    if (res) {
      removeNodeTree(graph, node.id)
    }
  })
}
function setStatus() {
  if (!planningThemeController) planningThemeController = new PlanningThemeController()

  if (themeStatus.value === 1) {
    themeStatus.value = 0
    node.data.themeStatus = 0
    planningThemeController.update(node.data, { isRefresh: false }).then((res) => {
      console.log('停用业务', res)
    })
  } else {
    themeStatus.value = 1
    node.data.themeStatus = 1
    planningThemeController.update(node.data, { isRefresh: false }).then((res) => {
      console.log('启用业务', res)
    })
  }
}
</script>

<style lang="scss" scoped>
.fx {
  display: flex;
  align-items: center;
}

#shape {
  background: #ffffff;
  box-shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.05);
  border-radius: 2px 2px 2px 2px;
  border: 1px solid #dddddd;
  display: flex;
  width: 216px;
  height: 40px;
  box-sizing: content-box;
  align-items: center;
  justify-content: space-between;
  position: relative;

  #shapeIcon {
    width: 40px;
    height: 40px;
    background: #fdbb51;
    border-radius: 1px 0px 0px 1px;
    margin-right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pointBox {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    height: 16px;
    width: 16px;
    margin-right: 20px;
    cursor: pointer;

    .point {
      width: 3px;
      height: 3px;
      background: #666666;
      border-radius: 50%;
    }
  }
}

.x6-node-selected #shape {
  border-color: #fdbb51;
}

.plus {
  width: 14px;
  height: 14px;
  position: absolute;
  right: -7px;
  display: none;
  cursor: pointer;
  background: url('/static/icons/addr3.svg') no-repeat center;
}

.x6-node-selected .plus {
  display: block;
}
</style>
