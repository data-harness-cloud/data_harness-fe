<template>
  <div id="shape" @dblclick="eidtNode">
    <div class="fx">
      <div id="shapeIcon">
        <img src="/static/icons/data2.svg" alt="" />
      </div>
      <div>{{ state.name }}</div>
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
            <el-dropdown-item @click="eidtNode">编辑</el-dropdown-item>
            <el-dropdown-item v-if="state.status" @click="setStatus">停用</el-dropdown-item>
            <el-dropdown-item v-else @click="setStatus">启用</el-dropdown-item>
            <el-dropdown-item @click="delNode">删除</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="plus"></div>
  </div>
</template>

<script setup>
import { inject, onMounted, getCurrentInstance } from 'vue'

import LiteFlowNodeController from '@/core/classes/LiteflowNodeController'
const liteFlowNodeController = new LiteFlowNodeController()
const getNode = inject('getNode')
const node = getNode()

const state = reactive({
  status: 1,
  name: '数据传输',
  nodeId: 'dataTransfer',
  nodeTag: '',
  id: '',
  fieldJsonData: '',
  rulerId: '',
  data: {},
})

function eidtNode() {
  node.model.graph.removeDelete()
  liteFlowNodeController.editDataTransfer(state).then((res) => {
    Object.assign(state, res)

    node.model.graph.addDelete()
  })
}
function setStatus() {
  state.status = state.status ? 0 : 1
}
function delNode() {
  node.model.graph.removeCell(node)
}

function nodeInit() {
  state.nodeTag = node.id
  // node.on('change:data', (data) => {
  //   console.log('nodeData改变了', data)
  // })
  if (node.data?.loadData) {
    // console.log('获取数据', node.data)
    state.rulerId = node.data.rulerId
    if (node.data?.id) {
      state.id = node.data.id
    }
  }
  node.saveELData = async function () {
    console.log('保存数据', state.data)
    state.fieldJsonData = JSON.stringify(state.data)
    let res
    if (state.id) {
      res = await liteFlowNodeController.update(state)
    } else {
      res = await liteFlowNodeController.add(state)
    }
    return res
  }
  node.setELData = function (data) {
    Object.assign(state, data)
    try {
      state.data = JSON.parse(state.fieldJsonData)
    } catch (error) {
      state.data = {}
    }
  }
  node.getELData = function () {
    console.log('获取数据', state)
    return state
  }
}
onMounted(() => {
  if (node.isInit) return
  nodeInit()

  node.isInit = true
})

onBeforeUnmount(() => {})
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
    margin-right: 17px;
    cursor: pointer;

    .point {
      width: 3px;
      height: 3px;
      background: #666666;
      border-radius: 50%;
    }
  }
  &:hover {
    border: 1px solid rgba(0, 0, 0, 20%);
    box-shadow: 0 -2px 4px 0 rgba(209, 209, 209, 50%), 2px 2px 4px 0 rgba(217, 217, 217, 50%);
    .plus {
      display: block;
    }
  }
}

.x6-node-selected #shape {
  border-color: #5d70f7;
}

.plus {
  width: 6px;
  height: 6px;
  background-color: #fff;
  border: 1px solid #5d70f7;
  border-radius: 50%;
  position: absolute;
  left: 104px;
  bottom: -4px;
  display: none;
  cursor: pointer;
}
</style>
