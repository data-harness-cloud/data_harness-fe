<template>
  <div id="shape" @dblclick="eidtNode">
    <div id="nodeData">
      <div class="fx">
        <div>{{ state.name }}</div>
      </div>
    </div>
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
  name: '判断',
  nodeId: 'ifNode',
  nodeTag: '',
  id: '',
  fieldJsonData: '',
  rulerId: '',
  data: {},
})

function eidtNode() {
  liteFlowNodeController.editShellNode(state).then((res) => {
    Object.assign(state, res)
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
    return state
  }
}
onMounted(() => {
  if (node.isInit) return
  nodeInit()

  node.isInit = true
})
</script>

<style lang="scss" scoped>
.fx {
  display: flex;
  align-items: center;
}
#ifNode {
  position: relative;
  width: 100%;
  height: 100%;
}

#nodeData {
  transform: rotate(-45deg);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

#shape {
  background: #ffffff;
  box-shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.05);
  border-radius: 2px 2px 2px 2px;
  border: 1px solid #dddddd;
  display: flex;
  width: 64px;
  height: 64px;
  box-sizing: content-box;
  align-items: center;
  justify-content: space-between;

  transform: translate(11px, 11px) rotate(45deg);

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
  &:hover {
    border: 1px solid rgba(0, 0, 0, 20%);
    box-shadow: 0 -2px 4px 0 rgba(209, 209, 209, 50%), 2px 2px 4px 0 rgba(217, 217, 217, 50%);
    .plus {
      display: block;
    }
  }
}

.x6-node-selected #shape {
  border-color: #53b0ff;
}

.plus {
  width: 6px;
  height: 6px;
  background-color: #fff;
  border: 1px solid #53b0ff;
  border-radius: 50%;
  position: absolute;
  left: 104px;
  bottom: -4px;
  display: none;
  cursor: pointer;
}
</style>
