<template>
  <div class="wrapper">
    <div id="x6pane">
      <div class="header">
        <div>
          {{ liteflowRuler.chainName }}
        </div>

        <div class="headerOption">
          <div class="btn" @click="addScheduling()">
            <img src="/static/icons/run.svg" class="iicon" />
            <div>设置并运行</div>
          </div>
          <div class="btn ml12 undone2">
            <img src="/static/icons/result.svg" class="iicon" />
            <div>运行结果</div>
          </div>
          <div class="btn ml12 undone2">
            <img src="/static/icons/Formatting.svg" class="iicon" />
            <div>格式化</div>
          </div>
          <div class="btn ml12 undone2">
            <img src="/static/icons/publish_b.svg" class="iicon" />
            <div>提交上线</div>
          </div>
          <div class="btn2 ml12" @click="saveData">
            <img src="/static/icons/save.svg" class="iicon" />
            <div>保存</div>
          </div>
        </div>
      </div>
      <div id="x6Box" style="width: 100%; height: 100%">
        <div id="graphContainer"></div>
      </div>

      <div id="minimap"></div>
    </div>
    <div class="rightBar" id="dndContainer" :class="{ isCollapse: isCollapse }">
      <div
        style="margin: 5px 0 5px 16px; display: flex; align-items: center; cursor: pointer"
        @click="isCollapse = !isCollapse"
      >
        <img v-if="!isCollapse" src="/static/icons/sq.svg" />
        <img v-else src="/static/icons/zk.svg" />
        <span class="rightBarTit" style="color: #999999; font-size: 12px">收起</span>
      </div>
      <div class="nodeTitle rightBarTit">任务节点</div>
      <div class="nodebox" data-type="dataTransfer" @mousedown="startDrag">
        <img class="drag" src="/static/icons/drag.svg" />
        <img class="nodeimg" src="/static/icons/data.svg" />
        <span class="rightBarTit">数据传输</span>
      </div>
      <div class="nodebox" data-type="sqlNode" @mousedown="startDrag">
        <img class="drag" src="/static/icons/drag.svg" />
        <img class="nodeimg" src="/static/icons/sql.svg" />
        <span class="rightBarTit">SQL</span>
      </div>
      <div class="nodebox" data-type="shellNode" @mousedown="startDrag">
        <img class="drag" src="/static/icons/drag.svg" />
        <img class="nodeimg" src="/static/icons/shell.svg" />
        <span class="rightBarTit">SHELL</span>
      </div>
      <div class="nodeTitle undone rightBarTit">控制节点</div>
      <div class="nodebox undone" data-type="ifNode">
        <img class="drag" src="/static/icons/drag.svg" />
        <img class="nodeimg" src="/static/icons/select.svg" />
        <span class="rightBarTit">判断节点</span>
      </div>
      <div class="nodebox undone" data-type="dataTransfer">
        <img class="drag" src="/static/icons/drag.svg" />
        <img class="nodeimg" src="/static/icons/nest.svg" />
        <span class="rightBarTit">嵌套流</span>
      </div>
      <div class="nodebox undone" data-type="dataTransfer">
        <img class="drag" src="/static/icons/drag.svg" />
        <img class="nodeimg" src="/static/icons/virtual.svg" />
        <span class="rightBarTit">虚拟节点</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, getCurrentInstance } from 'vue'
import { devLiteflowRulerController, devLiteflowNodeController } from '@/api/index'
import LiteflowRulerController from '@/core/classes/LiteflowRulerController'
import { Graph, Shape, Color, Path, Cell, Edge } from '@antv/x6'
import { Dnd } from '@antv/x6-plugin-dnd'
import http from '@/core/http/index'
import { Selection } from '@antv/x6-plugin-selection'
import { MiniMap } from '@antv/x6-plugin-minimap'
import './index.scss'
import { NodeRegister } from './Node/utils'
import { ElMessage } from 'element-plus'
import { cellsInit } from './elExpression'
import SchedulingTasksController from '@/core/classes/SchedulingTasksController/index'
const liteflowRulerController = new LiteflowRulerController()
const props = defineProps({
  defaultData: {
    type: Object,
    default: {},
  },
})
const liteflowRuler = ref({})
const liteflowNodes = []
const lietflowMap = new Map()
const isCollapse = ref(false)
watch(
  () => props.defaultData,
  () => {
    getLiteflowRuler()
  }
)
async function getLiteflowRuler() {
  await liteflowRulerController.view({ id: props.defaultData.id }, { showMask: false }).then((res) => {
    liteflowRuler.value = res.data
  })

  dataInit()

  await devLiteflowNodeController
    .list(http, { devLiteflowNodeDtoFilter: { rulerId: props.defaultData.id } }, null, { showMask: false })
    .then((res) => {
      liteflowNodes.value = res.data.dataList
      liteflowNodes.value.forEach((item) => {
        lietflowMap.set(item.nodeTag, item)
      })
    })

  const nodes = graph.getNodes()
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index]
    const nodeData = lietflowMap.get(node.id)
    if (node.setELData && nodeData) {
      await node.setELData(lietflowMap.get(node.id))
    }
  }
}
let nodeItem = null
let graph, dnd
function graphInit() {
  graph = new Graph({
    container: document.getElementById('graphContainer'),
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
      createEdge({ sourceCell, sourceMagnet }) {
        const edgeD = {
          shape: 'data-processing-curve',
          attrs: {
            line: {
              targetMarker: null,
              stroke: '#8f8f8f',
              strokeWidth: 1,
            },
          },
          label: {},
        }
        if (sourceCell.shape === 'ifNode') {
          edgeD.label = {
            attrs: {
              text: {
                text: 'hello',
              },
              rect: {
                ref: 'label',
                fill: 'transparent',
              },
            },
          }
          if (
            sourceMagnet.getAttribute('port-group') === 'rOut' ||
            sourceMagnet.getAttribute('port-group') === 'lOut'
          ) {
            edgeD.label.attrs.text.text = '否'
            edgeD.shape = 'parallelConnector'
          } else if (sourceMagnet.getAttribute('port-group') === 'bOut') {
            edgeD.label.attrs.text.text = '是'
          }
        }
        let edge = this.createEdge(edgeD)
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
  const dndContainer = document.getElementById('dndContainer')
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
  graph.use(
    new MiniMap({
      container: document.getElementById('minimap'),
      width: 180,
      height: 120,
      padding: 0,
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
  graph.clearCells()
  if (!liteflowRuler.value.chainStructureJson) return
  const data = JSON.parse(liteflowRuler.value.chainStructureJson)
  graph.fromJSON(data)
  graph.centerContent()
}

function createLiteFlow() {
  return cellsInit(graph.toJSON().cells, null)
}

async function saveData() {
  const data = graph.toJSON()
  liteflowRuler.value.chainStructureJson = data
  liteflowRuler.value.elData = createLiteFlow()

  await saveNodeData()

  liteflowRulerController.update(liteflowRuler.value, { showMask: false }).then((res) => {
    ElMessage.success('保存成功')
  })
}
async function saveNodeData() {
  const nodes = graph.getNodes()
  console.log('nodes', nodes)
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index]
    if (node.saveELData) {
      await node.saveELData()
    } else {
      console.log('没有saveELData', node)
    }
  }
}
function startDrag(e) {
  const target = e.currentTarget
  const type = target.getAttribute('data-type')
  let node, nodeJson
  if (type === 'dataTransfer') {
    nodeJson = {
      shape: 'dataTransfer',
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
  } else if (type === 'sqlNode') {
    nodeJson = {
      shape: 'sqlNode',
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
  } else if (type === 'shellNode') {
    nodeJson = {
      shape: 'shellNode',
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
  } else if (type === 'ifNode') {
    nodeJson = {
      shape: 'ifNode',
      ports: {
        items: [
          {
            id: 'in',
            group: 'in',
          },
          {
            id: 'bOut',
            group: 'bOut',
          },
          {
            id: 'lOut',
            group: 'lOut',
          },
          {
            id: 'rOut',
            group: 'rOut',
          },
        ],
      },
    }
  }

  nodeJson.data = {
    loadData: false,
    rulerId: liteflowRuler.value.id,
  }
  node = graph.createNode(nodeJson)

  dnd.start(node, e)
}

function delNode(event) {
  if (event.key !== 'Delete') return
  const node = graph.getSelectedCells()
  if (node[0].shape === 'data-processing-curve') {
    node.forEach((item) => {
      graph.removeCell(item)
    })
    return
  }
  liteflowRulerController.handleDeleteNode(node[0].getELData()).then((res) => {
    console.log(res)
    if (res) {
      ElMessage.success('删除成功')
      node.forEach((item) => {
        graph.removeCell(item)
      })
    }
  })
}

async function addScheduling() {
  await saveData()
  const vv = {
    classificationId: props.defaultData.classificationId,
    processThemeId: props.defaultData.processThemeId,
    processId: props.defaultData.processId,
    projectId: props.defaultData.projectId,
    rulerId: props.defaultData.id,
    taskState: '未上线',
  }
  const schedulingTasksController = new SchedulingTasksController()
  schedulingTasksController.handleAdd(vv).then((res) => {
    schedulingTasksController.$apiController.addJob(http, res)
  })
}

onMounted(() => {
  NodeRegister()
  graphInit()
  getLiteflowRuler()
  graph.addDelete = () => {
    document.addEventListener('keydown', delNode)
  }
  graph.removeDelete = () => {
    document.removeEventListener('keydown', delNode)
  }
  graph.addDelete()
})
onBeforeUnmount(() => {
  graph.removeDelete()
  graph.dispose()
})
</script>

<style lang="scss" scoped>
#minimap {
  position: absolute;
  right: 40px;
  bottom: 40px;
  width: 200px;
  height: 124px;
}

.wrapper {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  overflow: hidden;
  #x6pane {
    flex: 1 0 400px;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
    overflow: hidden;
    #x6Box {
      width: 100%;
      height: calc(100% - 56px) !important;
      overflow: hidden;
    }
  }
  .rightBar {
    width: 168px;
    transition: width 0.15s linear 0s;
    height: 100%;
    background-color: #fff;
    border-left: 1px solid #dddddd;
    .rightBarTit {
      overflow: hidden;
      -webkit-line-clamp: 1;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      white-space: normal; // 规定段落中的文本不进行换行
      word-break: break-all; // 允许单词中换行，在容器的最右边进行断开不会浪费控件
      word-wrap: break-word; // 防止长单词溢出，单词内部短句
      transition: opacity 0.15s linear 0s;
      opacity: 1;
    }
    .drag {
      width: 16px;
      height: 16px;
      margin-right: 8px;
      transition: width height margin-right 0.15s linear 0s;
    }
    .nodeimg {
      width: 16px;
      height: 16px;
      margin-right: 8px;
      transition: width height margin-right 0.15s linear 0s;
    }
    .nodeTitle {
      height: 32px;
      padding: 5px 16px;
      font-size: 14px;
      font-weight: bold;
      color: #222222;
      border-bottom: 1px solid #dddddd;
    }
    .nodebox {
      height: 32px;
      transition: height 0.15s linear 0s;
      padding: 8px 16px;
      font-size: 14px;
      color: #222222;
      border-bottom: 1px solid #dddddd;
      display: flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
    }
  }
  .isCollapse {
    width: 50px;
    .rightBarTit {
      // width: 0px;
      opacity: 0;
    }
    .nodeTitle {
      height: 0;
      padding: 0;
    }
    .drag {
      width: 0;
      height: 0;
      margin-right: 0;
    }
    .nodeimg {
      width: 20px;
      height: 20px;
    }
  }
}
.header {
  width: 100%;
  height: 56px;
  background-color: #fff;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #222222;
}
.headerOption {
  background-color: #fff;
  display: flex;
}
.iicon {
  width: 16px;
  height: 16px;
  margin-right: 2px;
}
</style>
