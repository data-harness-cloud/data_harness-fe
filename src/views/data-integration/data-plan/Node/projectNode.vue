<template>
  <div id="shape">
    <div class="fx">
      <div id="shapeIcon">
        <img src="/static/icons/projectIcon.svg" alt="" />
      </div>
      <div>{{ projectName }}</div>
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
            <!-- <el-dropdown-item>编辑</el-dropdown-item> -->
            <el-dropdown-item>停用</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="plus" @click="addNode"></div>
  </div>
</template>

<script setup>
import { inject, onMounted, getCurrentInstance } from 'vue'
import { createDownstream, formatNodeTree } from './utils.js'
import PlanningClassificationController from '@/core/classes/PlanningClassificationController/index'

const { proxy } = getCurrentInstance()
const getNode = inject('getNode')
const node = getNode()
let planningClassificationController = null
const graph = node.model.graph

const projectName = ref('')
projectName.value = node.data?.project?.projectName
node.on('change:data', ({ current }) => {
  const { project } = current
  projectName.value = project.projectName
})
function addNode() {
  // createDownstream(node, 'projectNode')
  // formatNodeTree(graph)
  // graph.parentProxy.getIndexTree()
  if (!planningClassificationController) planningClassificationController = new PlanningClassificationController()

  planningClassificationController.handleAdd({}, { defaultParams: { project: node.data?.project } }).then((res) => {
    console.log(res)
    res.project = node.data?.project
    createDownstream(node, 'PlanningClassificationNode', res)
    formatNodeTree(graph)
    graph.parentProxy.getIndexTree()
  })
}
onMounted(() => {
  // console.log('proxy', proxy);
})

function delNode() {
  graph.removeCell(node)
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
    width: 39px;
    height: 39px;
    background: #5d70f7;
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
  border-color: #5d70f7;
}

.plus {
  width: 14px;
  height: 14px;
  position: absolute;
  right: -7px;
  display: none;
  cursor: pointer;
  background: url('/static/icons/addr.svg') no-repeat center;
}

.x6-node-selected .plus {
  display: block;
}
</style>
