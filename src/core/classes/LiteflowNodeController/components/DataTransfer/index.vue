<template>
  <div class="wrapper">
    <div id="dataTransferBox">
      <div class="header">
        <contented-title v-model="state.formData.name" />
        <img src="/static/icons/X.svg" class="X" @click="handleCancel" />
      </div>
      <div class="dtMain">
        <!-- <div id="minimap"></div> -->
        <div class="rightBar" id="dndInContainer">
          <div class="nodePlan">
            <div class="nodeTitle">来源和目标</div>
            <div class="nodebox" data-type="sourceNode" @mousedown="startDrag">
              <img src="/static/icons/drag.svg" alt="" />
              <img src="/static/icons/sourceNode.svg" alt="" />
              <span>数据来源</span>
            </div>
            <div class="nodebox" data-type="targetNode" @mousedown="startDrag">
              <img src="/static/icons/drag.svg" alt="" />
              <img src="/static/icons/targetNode.svg" alt="" />
              <span>数据目标</span>
            </div>
            <div class="nodeTitle">处理和转换</div>
            <div class="nodebox" data-type="copy" @mousedown="startDrag">
              <img src="/static/icons/drag.svg" alt="" />
              <img src="/static/icons/copyNode.svg" alt="" />
              <span>复制</span>
            </div>
            <div class="nodebox" data-type="fieldMapper" @mousedown="startDrag">
              <img src="/static/icons/drag.svg" alt="" />
              <img src="/static/icons/FieldMapper.svg" alt="" />
              <span>字段映射</span>
            </div>
            <!-- <div class="nodebox" data-type="dataTransfer" @mousedown="startDrag">
              <img src="/static/icons/drag.svg" alt="" />
              <img src="/static/icons/FilterRowKind.svg" alt="" />
              <span>类型过滤</span>
            </div> -->
            <div class="nodebox" data-type="split" @mousedown="startDrag">
              <img src="/static/icons/drag.svg" alt="" />
              <img src="/static/icons/virtual.svg" alt="" />
              <span>多字段拆分</span>
            </div>
            <div class="nodebox" data-type="replace" @mousedown="startDrag">
              <img src="/static/icons/drag.svg" alt="" />
              <img src="/static/icons/Replace.svg" alt="" />
              <span>更换</span>
            </div>
            <div class="nodebox" data-type="sql" @mousedown="startDrag">
              <img src="/static/icons/drag.svg" alt="" />
              <img src="/static/icons/sql.svg" alt="" />
              <span>SQL</span>
            </div>
          </div>
          <img @click="setSeting" class="setingIcon" src="/static/icons/seting.svg" alt="" />
        </div>
        <div id="inContainer"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, getCurrentInstance } from 'vue'
import { Graph, Shape, Color, Path, Cell, Edge } from '@antv/x6'
import { Dnd } from '@antv/x6-plugin-dnd'
import http from '@/core/http/index'
import { Selection } from '@antv/x6-plugin-selection'
import { NodeRegister, getNodeOrder, GenerateSeaTunnelConfig } from './Node/utils'
import { ElMessage } from 'element-plus'
import LiteflowRulerController from '@/core/classes/LiteflowRulerController'
import ContentedTitle from '@/components/ContentedTitle/index.vue'
import DataTransferController from './Node/Controller/DataTransferController'
const dataTransferController = new DataTransferController()
const liteflowRulerController = new LiteflowRulerController()
const { proxy } = getCurrentInstance()
const props = defineProps({
  observer: {
    type: Object,
    required: true,
  },
  defaultData: {
    type: Object,
    default: null,
  },
})

const state = reactive({
  dataExample: {
    nodeId: '',
    nodeTag: '',
    name: '',
    status: 1,
    data: null,
  },
  formData: null,
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)
let nodeItem = null
let graph, dnd
let env = {
  'job.mode': 'BATCH',
  parallelism: 1,
}

function graphInit() {
  graph = new Graph({
    container: document.getElementById('inContainer'),
    background: {
      color: '#F0F3F5',
    },
    autoResize: true,
    grid: true,
    panning: true,
    mousewheel: true,
    scaling: { min: 0.2, max: 4 },
    connecting: {
      snap: true,
      allowBlank: false,
      allowMulti: true,
      allowLoop: false,
      allowNode: false,
      allowEdge: true,
      allowPort: true,
      highlight: true,
      createEdge() {
        let edge = this.createEdge({
          shape: 'data-processing-curve',
          attrs: {
            line: {
              targetMarker: null,
              stroke: '#8f8f8f',
              strokeWidth: 1,
            },
          },
        })
        return edge
      },
      validateMagnet({ magnet }) {
        // 节点上方的连接桩无法创建连线
        return magnet.getAttribute('port-group') !== 'in'
      },
      validateConnection({ sourceCell, targetCell, sourceMagnet, targetMagnet }) {
        // 不能连接自身
        if (sourceCell === targetCell) {
          return false
        }
        if (!sourceMagnet || sourceMagnet.getAttribute('port-group') === 'in') {
          return false
        }
        if (!targetMagnet || targetMagnet.getAttribute('port-group') !== 'in') {
          return false
        }

        return true
      },
    },
    highlighting: {
      // 连接桩可以被连接时在连接桩外围围渲染一个包围框
      magnetAvailable: {
        name: 'stroke',
        args: {
          attrs: {
            // fill: '#fff',
            stroke: '#A4DEB1',
            strokeWidth: 4,
          },
        },
      },
      // 连接桩吸附连线时在连接桩外围围渲染一个包围框
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            // fill: '#fff',
            stroke: '#31d0c6',
            strokeWidth: 4,
          },
        },
      },
    },
  })
  const dndContainer = document.getElementById('dndInContainer')
  dnd = new Dnd({
    target: graph,
    scaled: true,
    dndContainer: dndContainer,
    getDragNode: (node) => {
      return node.clone({
        keepId: true,
      })
    },
    getDropNode: (node) => {
      node.data.loadData = true
      return node.clone({
        keepId: true,
      })
    },
  })
  graph.use(
    new Selection({
      enabled: true,
      multiple: false,
      rubberband: false,
      rubberEdge: true,
      rubberNode: true,
      movable: true,
      pointerEvents: 'none',
    })
  )
  graph.on('node:click', (e) => {
    if (nodeItem === e.cell) return

    nodeItem = e.cell // 获取被点击的节点元素对象
  })
  graph.on('node:dblclick', (e) => {
    const node = e.cell
  })

  graph.on('edge:selected', function (e) {
    const edge = e.cell
    edge.attr('line/stroke', '#1890ff')
    edge.attr('line/strokeWidth', 2)
  })
  graph.on('edge:unselected', function (e) {
    const edge = e.cell
    edge.attr('line/stroke', '#8f8f8f')
    edge.attr('line/strokeWidth', 1)
  })
}
function dataInit() {
  if (!state.formData.data?.graphData) return
  graph.clearCells()
  graph.fromJSON(state.formData.data.graphData)
  graph.centerContent()
  env = state.formData.data.env

  const nodes = graph.getNodes()
  const nodeDatas = state.formData.data.nodeData
  setTimeout(() => {
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index]
      const nodeData = nodeDatas.find((item) => item.nodeTag === node.id)
      if (node.setELData && nodeData) {
        node.setELData(nodeData)
      }
    }
  }, 200)
}

function startDrag(e) {
  const target = e.currentTarget
  const type = target.getAttribute('data-type')
  let node, nodeJson
  if (type === 'sourceNode') {
    nodeJson = {
      shape: 'sourceNode',
      ports: {
        items: [
          {
            id: 'out',
            group: 'out',
          },
        ],
      },
    }
  } else if (type === 'targetNode') {
    nodeJson = {
      shape: 'targetNode',
      ports: {
        items: [
          {
            id: 'in',
            group: 'in',
          },
        ],
      },
    }
  } else if (type === 'fieldMapper') {
    nodeJson = {
      shape: 'fieldMapper',
      ports: {
        items: [
          {
            id: 'in',
            group: 'in',
          },
          {
            id: 'out',
            group: 'out',
          },
        ],
      },
    }
  } else if (type === 'copy') {
    nodeJson = {
      shape: 'copy',
      ports: {
        items: [
          {
            id: 'in',
            group: 'in',
          },
          {
            id: 'out',
            group: 'out',
          },
        ],
      },
    }
  } else if (type === 'replace') {
    nodeJson = {
      shape: 'replace',
      ports: {
        items: [
          {
            id: 'in',
            group: 'in',
          },
          {
            id: 'out',
            group: 'out',
          },
        ],
      },
    }
  } else if (type === 'split') {
    nodeJson = {
      shape: 'split',
      ports: {
        items: [
          {
            id: 'in',
            group: 'in',
          },
          {
            id: 'out',
            group: 'out',
          },
        ],
      },
    }
  } else if (type === 'sql') {
    nodeJson = {
      shape: 'sql',
      ports: {
        items: [
          {
            id: 'in',
            group: 'in',
          },
          {
            id: 'out',
            group: 'out',
          },
        ],
      },
    }
  }

  nodeJson.data = {
    loadData: false,
  }
  node = graph.createNode(nodeJson)

  dnd.start(node, e)
}

function setSeting() {
  dataTransferController.editSeting(env).then((res) => {
    env = res
  })
}

async function saveData() {
  const data = graph.toJSON()
  state.formData.data.graphData = data
  return await saveNodeData()
}
async function saveNodeData() {
  let nodeData
  try {
    nodeData = getNodeOrder(graph)
  } catch (error) {
    ElMessage.error(error.message)
    return false
  }
  state.formData.data.nodeData = nodeData
  state.formData.data.env = env
  state.formData.data.seaTunnelId = env.seaTunnelId

  state.formData.data.seaTunnelConfig = GenerateSeaTunnelConfig(state.formData.data)
  console.log('数据传输数据', state.formData.data)
  return true
}

function setBoxSize() {
  const box = document.getElementById('dataTransferBox')
  box.style.width = window.innerWidth - 400 + 'px'
  box.style.height = window.innerHeight - 200 + 'px'
  window.onresize = () => {
    box.style.width = window.innerWidth - 400 + 'px'
    box.style.height = window.innerHeight - 200 + 'px'
  }
}
function delNode() {
  const node = graph.getSelectedCells()
  if (node[0].shape === 'data-processing-curve') {
    node.forEach((item) => {
      graph.removeCell(item)
    })
    return
  }
  liteflowRulerController.handleDeleteNode(node[0].getELData()).then((res) => {
    if (res) {
      ElMessage.success('删除成功')
      node.forEach((item) => {
        graph.removeCell(item)
      })
    }
  })
}

function deleteEvent(e) {
  if (e.key === 'Delete') {
    delNode()
  }
}
onMounted(() => {
  setBoxSize()
  NodeRegister()
  graphInit()
  dataInit()
  document.addEventListener('keydown', deleteEvent)
})

const handleCancel = async (isSuccess = true) => {
  const flag = await saveData()
  if (!flag) return

  let pStart = Promise.resolve()
  if (props.observer != null) {
    pStart = pStart.then(() => {
      graph.dispose()
      document.removeEventListener('keydown', deleteEvent)
      return props.observer?.cancel(true, state.formData)
    })
  }

  return pStart
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: visible;
}
#dataTransferBox {
  width: 1000px;
  height: 700px;
  position: absolute;
  background-color: #fff;
  top: 0;
  left: 0;
  transform: translate(-50%, -14%);
  border-radius: 8px;
  .header {
    width: 100%;
    height: 56px;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 32px;
    border-bottom: 1px solid #dddddd;
  }
}
.X {
  height: 14px;
  width: 14px;
  cursor: pointer;
}
.dtMain {
  width: 100%;
  height: calc(100% - 56px) !important;
  display: flex;
  #inContainer {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .rightBar {
    width: 168px;
    min-width: 168px;
    height: 100%;
    background-color: #fff;
    border-right: 1px solid #dddddd;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .nodeTitle {
      height: 32px;
      padding: 5px 16px;
      font-size: 14px;
      font-weight: bold;
      color: #222222;
      border-bottom: 1px solid #dddddd;
    }
    .nodebox {
      img {
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }
      height: 32px;
      padding: 8px 16px;
      font-size: 14px;
      color: #222222;
      border-bottom: 1px solid #dddddd;
      display: flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
    }
    .setingIcon {
      width: 24px;
      height: 24px;
      margin: 6px;
      cursor: pointer;
    }
  }
}
.title {
}
</style>
