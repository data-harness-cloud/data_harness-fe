<template>
  <div style="display: flex">
    <div class="shaderBar">
      <el-input
        v-model="searchKeywords"
        placeholder="请输入关键字"
        @keyup.enter.native=""
        style="margin: 18px 0 16px 0; height: 32px"
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <Search />
          </el-icon>
        </template>
      </el-input>

      <el-tree
        ref="treeRef"
        class="filter-tree"
        :data="indexTree"
        :props="{
          label: 'name',
          children: 'children',
        }"
        default-expand-all
        :filter-node-method="filterNode"
      >
        <template #default="{ node, data }">
          <div class="custom-tree-node">
            <img v-if="data.level === 0" src="/static/icons/themeIcon2.svg" alt="" />
            <img v-else-if="data.level === 1" src="/static/icons/BusinessIcon2.svg" alt="" />
            <img v-else-if="data.level === 2" src="/static/icons/projectIcon2.svg" alt="" />
            <div
              v-else
              style="height: 7px; width: 7px; background-color: #64c37d; border-radius: 50%; margin: 0 5px"
            ></div>
            <div style="margin-left: 4px">{{ node.label }}</div>
          </div>
        </template>
      </el-tree>
    </div>
    <div id="box1">
      <div class="canvasHeader">
        <div class="fx"></div>
        <div class="fx">
          <!-- <el-button> <img style="margin-right: 4px" src="/static/icons/Reset.svg" alt="" />重置</el-button> -->
          <el-button @click="formatNodeTree(graph)">
            <img style="margin-right: 4px" src="/static/icons/Formatting.svg" alt="" />格式化</el-button
          >
          <el-button class="saveBtn" @click="getIndexTree">
            <img style="margin-right: 4px" src="/static/icons/save.svg" alt="" />保存</el-button
          >
        </div>
      </div>
      <div id="x6Box" style="width: 100%; height: 100%">
        <div id="graphContainer"></div>
      </div>
      <div id="minimap"></div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  defineComponent,
  watch,
  getCurrentInstance,
  createApp,
  nextTick,
  onBeforeUnmount,
} from 'vue'
import {
  ProjectMainController,
  PlanningClassificationController,
  PlanningProcessController,
  PlanningThemeController,
} from '@/api/index'
import projectNode from './Node/projectNode.vue'
import PlanningClassificationNode from './Node/PlanningClassificationNode.vue'
import planningThemeNode from './Node/planningThemeNode.vue'
import planningProcessNode from './Node/planningProcessNode.vue'
import { Graph, Shape, Color, Path, Cell, Edge } from '@antv/x6'
import http from '@/core/http/index'
import { Selection } from '@antv/x6-plugin-selection'
import { register, getTeleport } from '@antv/x6-vue-shape'
import { MiniMap } from '@antv/x6-plugin-minimap'
import './x6Style.scss'
import { dataTree, formatNodeTree, createDownstream, clearCellMap } from './Node/utils.js'
const { proxy } = getCurrentInstance()
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
import { treeDataTranslate } from '@/utils'
const appStore = useAppStore()

//项目列表相关
const userStore = useUserStore()
const projectList = ref([])

watch(
  () => userStore.getProjectId(),
  async (newValue) => {
    graph.clearCells()
    clearCellMap()
    let DataPlanning = await getDataPlanning()
    nodeInit(DataPlanning)
  }
)

let nodeItem = null
let graph
const selectName = ref('')
const nodeIdToId = new Map()
//监听selectName变化
watch(selectName, (newVal, oldVal) => {
  console.log(newVal, oldVal)
  if (newVal && nodeItem) {
    //修改nodeItem的id
    nodeItem.attr('label/text', newVal)
    console.log(`nodeItem---`, nodeItem)
  }
})

const searchKeywords = ref('')
const treeRef = ref()
const indexTree = ref(null)

const filterNode = (value, data) => {
  if (!value) return true
  return data.name.includes(value)
}
watch(searchKeywords, (val) => {
  treeRef.value.filter(val)
})

function getIndexTree() {
  indexTree.value = dataTree(graph)
}
proxy.getIndexTree = getIndexTree

function init() {
  register({
    shape: 'projectNode',
    width: 216,
    height: 40,
    component: projectNode,
    ports: {
      groups: {
        in: {
          position: 'left',
          attrs: {
            circle: {
              r: 0,
              magnet: true,
              stroke: 'transparent',
              strokeWidth: 1,
              fill: 'transparent',
            },
          },
        },
        out: {
          position: 'right',
          attrs: {
            circle: {
              r: 0,
              magnet: true,
              stroke: 'transparent',
              strokeWidth: 1,
              fill: 'transparent',
            },
          },
        },
      },
    },
  })
  register({
    shape: 'PlanningClassificationNode',
    width: 216,
    height: 40,
    component: PlanningClassificationNode,
    ports: {
      groups: {
        in: {
          position: 'left',
          attrs: {
            circle: {
              r: 0,
              magnet: true,
              stroke: 'transparent',
              strokeWidth: 1,
              fill: 'transparent',
            },
          },
        },
        out: {
          position: 'right',
          attrs: {
            circle: {
              r: 0,
              magnet: true,
              stroke: 'transparent',
              strokeWidth: 1,
              fill: 'transparent',
            },
          },
        },
      },
    },
  })
  register({
    shape: 'planningThemeNode',
    width: 216,
    height: 40,
    component: planningThemeNode,
    ports: {
      groups: {
        in: {
          position: 'left',
          attrs: {
            circle: {
              r: 0,
              magnet: true,
              stroke: 'transparent',
              strokeWidth: 1,
              fill: 'transparent',
            },
          },
        },
        out: {
          position: 'right',
          attrs: {
            circle: {
              r: 0,
              magnet: true,
              stroke: 'transparent',
              strokeWidth: 1,
              fill: 'transparent',
            },
          },
        },
      },
    },
  })
  register({
    shape: 'planningProcessNode',
    width: 216,
    height: 40,
    component: planningProcessNode,
    ports: {
      groups: {
        in: {
          position: 'left',
          attrs: {
            circle: {
              r: 0,
              magnet: true,
              stroke: 'transparent',
              strokeWidth: 1,
              fill: 'transparent',
            },
          },
        },
        out: {
          position: 'right',
          attrs: {
            circle: {
              r: 0,
              magnet: true,
              stroke: 'transparent',
              strokeWidth: 1,
              fill: 'transparent',
            },
          },
        },
      },
    },
  })
  // 注册连线
  Graph.registerConnector(
    'curveConnector',
    (sourcePoint, targetPoint) => {
      const hgap = Math.abs(targetPoint.x - sourcePoint.x)
      const path = new Path()
      path.appendSegment(Path.createSegment('M', sourcePoint.x - 4, sourcePoint.y))
      path.appendSegment(Path.createSegment('L', sourcePoint.x + 12, sourcePoint.y))
      // 水平三阶贝塞尔曲线
      path.appendSegment(
        Path.createSegment(
          'C',
          sourcePoint.x < targetPoint.x ? sourcePoint.x + hgap / 2 : sourcePoint.x - hgap / 2,
          sourcePoint.y,
          sourcePoint.x < targetPoint.x ? targetPoint.x - hgap / 2 : targetPoint.x + hgap / 2,
          targetPoint.y,
          targetPoint.x - 6,
          targetPoint.y
        )
      )
      path.appendSegment(Path.createSegment('L', targetPoint.x + 2, targetPoint.y))

      return path.serialize()
    },
    true
  )

  Edge.config({
    markup: [
      {
        tagName: 'path',
        selector: 'wrap',
        attrs: {
          fill: 'none',
          cursor: 'pointer',
          stroke: 'transparent',
          strokeLinecap: 'round',
        },
      },
      {
        tagName: 'path',
        selector: 'line',
        attrs: {
          fill: 'none',
          pointerEvents: 'none',
        },
      },
    ],
    connector: { name: 'curveConnector' },
    attrs: {
      wrap: {
        connection: true,
        strokeWidth: 10,
        strokeLinejoin: 'round',
      },
      line: {
        connection: true,
        stroke: '#A2B1C3',
        strokeWidth: 1,
        // targetMarker: {
        //     name: 'classic',
        //     size: 6,
        // },
      },
    },
  })

  Graph.registerEdge('data-processing-curve', Edge, true)

  graph = new Graph({
    container: document.getElementById('graphContainer'),
    background: {
      color: '#F0F3F5',
    },
    autoResize: true,
    grid: true,
    panning: true,
    mousewheel: true,
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
        console.log(`createEdge`)
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
        return magnet.getAttribute('port-group') !== 'top'
      },
      validateConnection({ sourceCell, targetCell, sourceMagnet, targetMagnet }) {
        // 不能连接自身
        if (sourceCell === targetCell) {
          return false
        }

        if (!sourceMagnet || sourceMagnet.getAttribute('port-group') === 'top') {
          return false
        }
        if (!targetMagnet || targetMagnet.getAttribute('port-group') !== 'top') {
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
function delNode(event) {
  if (event.key !== 'Delete') return
  const node = graph.getSelectedCells()
  if (node[0].shape === 'data-processing-curve') {
    node.forEach((item) => {
      graph.removeCell(item)
    })
    return
  }
  node.forEach((item) => {
    if (item.delNode) item.delNode()
  })
}
function nodeInit(DataPlanning) {
  const project = projectList.value.filter((obj) => obj.id === userStore.projectId)[0]
  let pNode = graph.addNode({
    shape: 'projectNode',
    x: 138,
    y: 35,
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
    data: {
      project: project,
    },
  })
  nodeIdToId.set(userStore.projectId, pNode)

  DataPlanning.planningClass.forEach((pClass) => {
    pClass.project = project
    let node = createDownstream(pNode, 'PlanningClassificationNode', pClass)
    nodeIdToId.set(pClass.id, node)
  })
  DataPlanning.planningTheme.forEach((pTheme) => {
    pTheme.project = project
    pTheme.classification = DataPlanning.planningClass.filter((obj) => obj.id === pTheme.classificationId)[0]
    if (!pTheme.classification) return
    let node = createDownstream(nodeIdToId.get(pTheme.classification.id), 'planningThemeNode', pTheme)
    nodeIdToId.set(pTheme.id, node)
  })

  DataPlanning.planningProcess = treeDataTranslate(DataPlanning.planningProcess, 'id', 'processParentId', 'children')
  function createPlanningProcessNode(planningProcess, parent = null) {
    planningProcess.forEach((pProcess) => {
      pProcess.project = project
      pProcess.classification = DataPlanning.planningClass.filter((obj) => obj.id === pProcess.classificationId)[0]
      if (!pProcess.classification) return
      pProcess.processTheme = DataPlanning.planningTheme.filter((obj) => obj.id === pProcess.processThemeId)[0]
      if (!pProcess.processTheme) return
      let node
      if (parent) {
        pProcess.parent = parent
        node = createDownstream(nodeIdToId.get(parent.id), 'planningProcessNode', pProcess)
      } else {
        node = createDownstream(nodeIdToId.get(pProcess.processTheme.id), 'planningProcessNode', pProcess)
      }
      nodeIdToId.set(pProcess.id, node)

      if (pProcess.children && pProcess.children.length > 0) {
        createPlanningProcessNode(pProcess.children, pProcess)
      }
    })
  }

  createPlanningProcessNode(DataPlanning.planningProcess)

  formatNodeTree(graph)

  graph.centerContent()

  graph.parentProxy = proxy

  getIndexTree()
}

//输出数据
function output() {
  console.log(graph.toJSON())
  console.log(JSON.stringify(graph.toJSON()))
}

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

async function getDataPlanning() {
  return new Promise((resolve, reject) => {
    const PromiseArr = []
    const DataPlanning = {}
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

onMounted(async () => {
  setTimeout(async () => {
    init()
    await getProjectList()
    graph.clearCells()
    clearCellMap()
    let DataPlanning = await getDataPlanning()
    nodeInit(DataPlanning)

    graph.addDelete = () => {
      document.addEventListener('keydown', delNode)
    }
    graph.removeDelete = () => {
      document.removeEventListener('keydown', delNode)
    }
    graph.addDelete()
  }, 100)
})

//销毁之前回调函数
onBeforeUnmount(() => {
  graph.removeDelete()
  graph.dispose()
})
</script>

<style lang="scss">
#box1 {
  flex: 1 0 400px;
  height: 100%;
  background-color: #f1f1f1;
  position: relative;
  overflow: hidden;
}

.canvasHeader {
  height: 56px;
  width: 100%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;

  .circleBox {
    width: 24px;
    height: 24px;
    box-shadow: 0px 1px 6px 1px rgba(0, 0, 0, 0.12);
    border-radius: 60px 60px 60px 60px;
    justify-content: center;
    align-items: center;
    margin-right: 16px;
    flex: 1 0 400px;
  }
}
#x6Box {
  width: 100%;
  height: calc(100% - 56px) !important;
  overflow: hidden;
}
#graphContainer {
}

#minimap {
  position: absolute;
  right: 40px;
  bottom: 40px;
  width: 200px;
  height: 124px;
}

.shaderBar {
  min-width: 256px;
  width: 256px;
  height: 100%;
  padding: 8px;
  border-right: 1px solid #dddddd;

  .el-input__wrapper {
    background-color: #f6f6f9;
  }
}

.fx {
  display: flex;
  align-items: center;
}

.saveBtn {
  background-color: #3246d2;
  color: #fff;
}

.saveBtn:hover {
  background-color: #5468ff;
  color: #fff;
}

.custom-tree-node {
  font-size: 14px;
  font-weight: 400;
  color: #222222;
  height: 24px;
  display: flex;
  align-items: center;
}
</style>
