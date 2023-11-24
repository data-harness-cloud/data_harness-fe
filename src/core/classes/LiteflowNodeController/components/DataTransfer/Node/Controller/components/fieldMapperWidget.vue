<template>
  <div class="info-widget">
    <div class="title">
      <contented-title v-model="state.formData.name" />
    </div>
    <div style="width: 100%">
      <div class="flBetween">
        <div class="titleBox">
          <img src="/static/icons/sourceNode.svg" />
          <div>数据来源</div>
        </div>
        <div class="titleBox" style="justify-content: space-between">
          <div class="flex">
            <img src="/static/icons/targetNode.svg" />
            <div>数据目标</div>
          </div>
          <div>
            <el-select v-model="nodeTag" placeholder="选择数据目标" size="small" @change="setTarget">
              <el-option
                v-for="item in props.nodes.endNodes"
                :key="item.nodeTag"
                :label="item.name"
                :value="item.nodeTag"
              />
            </el-select>
          </div>
        </div>
      </div>
      <div class="tabeCanvas">
        <img src="/static/icons/right_arrow.svg" class="bigArrow" />
        <canvas ref="tableListCanvas" class="abs"></canvas>
        <div
          class="abs"
          id="tableBox"
          style="display: flex"
          @pointermove="moveBezier($event)"
          @pointerup.stop="endBezier($event)"
        >
          <div class="tableList" id="fromTableList" @scroll="updateBezier()">
            <div
              v-for="column in formTabe"
              :key="column.fieldName"
              class="col"
              :class="{
                colActive: column.to || nowColumn === column,
                colAuto: column.auto && column.to,
              }"
              @pointerdown.stop="(event) => createBezier(event, column)"
            >
              <div>
                {{ column.fieldName }}
              </div>
              <div class="fieldtype">
                {{ column.typeName }}
              </div>
            </div>
          </div>
          <div style="width: 188px"></div>
          <div class="tableList" id="toTableList" @scroll="updateBezier()">
            <div
              v-for="column in toTabe"
              :key="column.fieldName"
              class="col"
              :class="{
                colActive: column.from,
                colAuto: column.auto && column.from,
              }"
              @pointerup.stop="(event) => endBezier(event, column)"
            >
              <div class="noneDiv">
                {{ column.fieldName }}
              </div>
              <div class="fieldtype">
                {{ column.typeName }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex" style="margin: 16px 0 24px">
        <div class="btn1" @click="automaticMatching">自动匹配</div>
      </div>
      <div class="dashed"></div>
      <div style="font-weight: bold; color: #222222">已映射字段</div>
      <div class="mappingFieldsTable">
        <template v-for="column in formTabe" :key="column.fieldName">
          <div v-if="column.to" class="tableBodyItem">
            <div class="tableBodyItemField">
              <div>
                {{ column.fieldName }}
              </div>
              <div class="fieldtype">
                {{ column.typeName }}
              </div>
            </div>
            <img src="/static/icons/right_arrow.svg" />
            <div class="tableBodyItemField">
              <div>
                {{ column.to }}
              </div>
              <div class="fieldtype">
                {{ column.typeName }}
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="mydashed"></div>
    </div>

    <el-row class="no-scroll flex-box" type="flex" justify="end" style="margin-top: 16px">
      <el-button type="primary" :plain="true" size="large" @click="handleCancel(false)"> 取消 </el-button>
      <el-button type="primary" size="large" @click="handleSubmit"> 提交 </el-button>
    </el-row>
  </div>
</template>

<script setup>
import ContentedTitle from '@/components/ContentedTitle/index.vue'
import { DatabaseManagementController, ProjectDatasourceController } from '@/api/index'
import http from '@/core/http/index'
import { ElMessage } from 'element-plus'
import * as PIXI from 'pixi.js'
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
  defaultOptions: {
    type: Object,
    default: null,
  },
  nodes: {
    type: Object,
    default: null,
  },
})

const state = reactive({
  dataExample: {
    name: '',
    source: null,
    sink: null,
    field_mapper: {},
  },
  formData: null,
  rules: {
    name: [{ required: true, message: '必须选择', trigger: 'blur' }],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)

console.log('nodes', props.nodes)
let formTabeIndexMap = {}
let toTabeIndexMap = {}

const tableListCanvas = ref(null)
let app
let nowBezier = null
let nowColumn = ref(null)
let startPoint = { x: 0, y: 0 }
let endPoint = { x: 0, y: 0 }

const formTabe = ref([])
const toTabe = ref([])

function canvasInit() {
  app = new PIXI.Application({
    width: 876, // 画布宽度
    height: 400, // 画布高度
    antialias: true, // 抗锯齿
    transparent: false, // 不透明
    backgroundColor: 0xffffff, // 背景颜色
    backgroundAlpha: 0,
    // resolution: 1, // 分辨率
    // autoDensity: true, // 自动调整分辨率
    // resizeTo: window, // 自动调整大小
    view: tableListCanvas._value,
  })
}

function getPos(event) {
  const endDom = document.getElementById('tableBox')
  let x = event.offsetX
  let y = event.offsetY
  let target = event.target
  let index = 0
  while (target !== endDom) {
    x += target.offsetLeft
    y += target.offsetTop
    y -= target.parentNode.scrollTop
    target = target.offsetParent
  }
  return { x, y }
}
let fromTableListDom, toTableListDom
function getFromColumnPos(column) {
  let index = formTabeIndexMap[column.fieldName]
  let x = 344,
    y = index * 40 + 20 - fromTableListDom.scrollTop
  return { x, y }
}
function getToColumnPos(column) {
  let index = toTabeIndexMap[column.fieldName]
  let x = 532,
    y = index * 40 + 20 - toTableListDom.scrollTop
  return { x, y }
}
function createBezier(event, column) {
  nowColumn.value = column
  startPoint = getFromColumnPos(column)
  if (nowBezier) {
    app.stage.removeChild(nowBezier)
    nowBezier = null
    return
  }
  if (nowColumn.value.to) {
    console.log('已经有了', nowColumn.value.bezier)
    let toColumn = toTabe.value[toTabeIndexMap[nowColumn.value.to]]
    toColumn.from = null

    nowColumn.value.to = null
    nowColumn.value.bezier.clear()
    app.stage.removeChild(nowColumn.value.bezier)
    nowColumn.value.bezier = null
    toColumn.bezier = null
  }
  nowBezier = new PIXI.Graphics()
  app.stage.addChild(nowBezier)
}
function moveBezier(event) {
  if (nowBezier) {
    endPoint = getPos(event)
    nowBezier.clear()
    nowBezier.lineStyle(2, 0x818fed)
    nowBezier.moveTo(startPoint.x, startPoint.y)
    // console.log(startPoint.x, startPoint.y, endPoint.x, endPoint.y)
    nowBezier.bezierCurveTo(startPoint.x + 70, startPoint.y, endPoint.x - 70, endPoint.y, endPoint.x, endPoint.y)
  }
}
function endBezier(event, column = null) {
  if (nowBezier) {
    if (!column) {
      app.stage.removeChild(nowBezier)
      nowBezier = null
      nowColumn.value = null
      return
    }

    nowColumn.value.to = column.fieldName
    nowColumn.value.bezier = nowBezier
    nowColumn.value.auto = false

    if (column.from) {
      let fromColumn = formTabe.value[formTabeIndexMap[column.from]]
      fromColumn.to = null
      fromColumn.bezier.clear()
      app.stage.removeChild(fromColumn.bezier)
      fromColumn.bezier = null
    }
    column.from = nowColumn.value.fieldName
    column.auto = false
    column.bezier = nowBezier
    endPoint = getToColumnPos(column)
    nowBezier.clear()
    nowBezier.lineStyle(2, 0x818fed)
    nowBezier.moveTo(startPoint.x, startPoint.y)
    nowBezier.bezierCurveTo(startPoint.x + 70, startPoint.y, endPoint.x - 70, endPoint.y, endPoint.x, endPoint.y)
    nowBezier = null
  }
}
function updateBezier() {
  for (let i = 0; i < formTabe.value.length; i++) {
    let column = formTabe.value[i]
    if (column.to) {
      let pos = getFromColumnPos(column)
      let endPoint = getToColumnPos(toTabe.value[toTabeIndexMap[column.to]])
      column.bezier.clear()
      if (column.auto) {
        column.bezier.lineStyle(2, 0xf4f7fa)
      } else {
        column.bezier.lineStyle(2, 0x818fed)
      }
      column.bezier.moveTo(pos.x, pos.y)
      column.bezier.bezierCurveTo(pos.x + 70, pos.y, endPoint.x - 70, endPoint.y, endPoint.x, endPoint.y)
    }
  }
}

const nodeTag = ref(null)
function automaticMatching() {
  formTabe.value.forEach((element) => {
    if (element.bezier) {
      element.bezier.clear()
      app.stage.removeChild(element.bezier)
      element.bezier = null
      element.to = null
    }
  })
  toTabe.value.forEach((element) => {
    if (element.from) {
      element.bezier = null
      element.from = null
    }
  })
  for (let i = 0; i < formTabe.value.length; i++) {
    let column = formTabe.value[i]
    let index = toTabeIndexMap[column.fieldName]
    if (index !== undefined) {
      let toColumn = toTabe.value[index]
      column.to = toColumn.fieldName
      column.auto = true
      toColumn.from = column.fieldName
      toColumn.auto = true
      let pos = getFromColumnPos(column)
      let endPoint = getToColumnPos(toColumn)
      column.bezier = new PIXI.Graphics()
      app.stage.addChild(column.bezier)
      column.bezier.lineStyle(2, 0xf4f7fa)
      column.bezier.moveTo(pos.x, pos.y)
      column.bezier.bezierCurveTo(pos.x + 70, pos.y, endPoint.x - 70, endPoint.y, endPoint.x, endPoint.y)
      toColumn.bezier = column.bezier
    }
  }
}

async function setTarget() {
  const targetnode = props.nodes.endNodes.find((item) => item.nodeTag === nodeTag.value)
  state.formData.sink = targetnode
  toTabeIndexMap = {}
  if (!targetnode.database) {
    ElMessage.error('数据目标未配置')
  } else {
    nodeTag.value = targetnode.nodeTag
    const sinkTableFields = await queryTableFields(targetnode)
    toTabe.value = []
    for (const key in sinkTableFields) {
      const element = sinkTableFields[key]
      element.from = null
      element.bezier = null
      element.auto = false
      toTabe.value.push(element)
    }
    for (let i = 0; i < toTabe.value.length; i++) {
      toTabeIndexMap[toTabe.value[i].fieldName] = i
    }
    formTabe.value.forEach((element) => {
      if (element.bezier) {
        element.bezier.clear()
        app.stage.removeChild(element.bezier)
        element.bezier = null
        element.to = null
        element.auto = false
      }
    })
  }
}
function queryTableFields(configuration) {
  return DatabaseManagementController.queryTableFields(
    http,
    {
      databaseManagement: configuration,
    },
    null,
    { showMask: false }
  ).then((res) => {
    return res.data
  })
}
onMounted(async () => {
  if (props.nodes.startNode) {
    state.formData.source = props.nodes.startNode
  }
  if (props.nodes.endNode) {
    state.formData.sink = props.nodes.endNode
  }

  if (state.formData.source) {
    if (!state.formData.source.database) {
      ElMessage.error('数据来源未配置')
    } else {
      const sourceTableFields = await queryTableFields(state.formData.source)
      for (const key in sourceTableFields) {
        const element = sourceTableFields[key]
        element.to = null
        element.bezier = null
        element.auto = false
        formTabe.value.push(element)
      }
    }
  } else {
    ElMessage.warning('数据来源未链接')
  }
  if (state.formData.sink) {
    if (!state.formData.sink.database) {
      ElMessage.error('数据目标未配置')
    } else {
      nodeTag.value = state.formData.sink.nodeTag
      const sinkTableFields = await queryTableFields(state.formData.sink)
      for (const key in sinkTableFields) {
        const element = sinkTableFields[key]
        element.from = null
        element.bezier = null
        element.auto = false
        toTabe.value.push(element)
      }
    }
  } else {
    ElMessage.warning('数据目标未链接')
  }

  canvasInit()
  fromTableListDom = document.getElementById('fromTableList')
  toTableListDom = document.getElementById('toTableList')
  for (let i = 0; i < formTabe.value.length; i++) {
    formTabeIndexMap[formTabe.value[i].fieldName] = i
  }
  for (let i = 0; i < toTabe.value.length; i++) {
    toTabeIndexMap[toTabe.value[i].fieldName] = i
  }

  if (props.defaultData.field_mapper) {
    for (const key in props.defaultData.field_mapper) {
      if (Object.hasOwnProperty.call(props.defaultData.field_mapper, key)) {
        const element = props.defaultData.field_mapper[key]
        let index = formTabeIndexMap[key]
        if (index !== undefined) {
          let toColumn = toTabe.value[toTabeIndexMap[element]]
          if (!toColumn) {
            continue
          }
          let column = formTabe.value[index]
          column.to = element
          column.auto = true
          toColumn.from = key
          toColumn.auto = true
          let pos = getFromColumnPos(column)
          let endPoint = getToColumnPos(toColumn)
          column.bezier = new PIXI.Graphics()
          app.stage.addChild(column.bezier)
          column.bezier.lineStyle(2, 0xf4f7fa)
          column.bezier.moveTo(pos.x, pos.y)
          column.bezier.bezierCurveTo(pos.x + 70, pos.y, endPoint.x - 70, endPoint.y, endPoint.x, endPoint.y)
          toColumn.bezier = column.bezier
        }
      }
    }
  }
})

const handleCancel = (isSuccess = false) => {
  let pStart = Promise.resolve()
  if (props.observer != null) {
    pStart = pStart.then(() => {
      state.formData.field_mapper = {}
      formTabe.value.forEach((element) => {
        if (element.to) {
          state.formData.field_mapper[element.fieldName] = element.to
        }
      })
      return props.observer?.cancel(isSuccess, state.formData)
    })
  }

  return pStart
}

const handleSubmit = () => {
  handleCancel(true)
}
</script>

<style scoped lang="scss">
.info-widget {
  position: relative;
  padding: 0 14px;
  margin-top: 10px;
  .title {
    position: absolute;
    top: -44px;
    left: 14px;
  }
}
.titleBox {
  display: flex;
  align-items: center;
  width: 344px;

  border: 1px solid #dddddd;
  height: 48px;
  padding: 16px;
  font-size: 14px;
  font-weight: bold;
  color: #222222;
  img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
}

.tabeCanvas {
  width: 100%;
  height: 400px;
  position: relative;
  display: flex;
  .abs {
    position: absolute;
    top: 0;
    left: 0;
  }
  #tableListCanvas {
  }
}
.tableList {
  width: 344px;
  height: 400px;
  border: 1px solid #dddddd;
  overflow-y: auto;

  .col {
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #dddddd;
    user-select: none;
    color: #222222;
    font-size: 14px;
    font-weight: 400;
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .fieldtype {
      font-size: 12px;
      color: #999999;
    }
    &:hover {
      background-color: #c8cdf4 !important;
    }
  }
  .colActive {
    background-color: #c8cdf4;
  }
  .colAuto {
    background-color: #f4f7fa;
  }
}
.dashed {
  width: 100%;
  height: 1px;

  background: linear-gradient(to left, transparent 0%, transparent 50%, #dddddd 50%, #dddddd 100%);
  background-size: 10px 1px;
  background-repeat: repeat-x;

  margin: 24px 0px;
}
.mappingFieldsTable {
  width: 100%;
  max-height: 160px;
  border: 1px solid #dddddd;
  overflow-y: auto;
  margin-top: 8px;
  .tableBodyItem {
    height: 40px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #dddddd;
    align-items: center;
    img {
      width: 22px;
      height: 22px;
    }
    .tableBodyItemField {
      width: 334px;
      height: 40px;
      user-select: none;
      color: #222222;
      font-size: 14px;
      font-weight: 400;
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .fieldtype {
        font-size: 12px;
        color: #999999;
      }
    }
  }
}
.noneDiv {
  pointer-events: none;
}
.bigArrow {
  width: 98px;
  height: 98px;
  position: absolute;
  left: 390px;
  top: 150px;
}
.mydashed {
  width: calc(100% + 68px);
  height: 1px;
  margin-top: 24px;
  background-color: #dddddd;
  transform: translate(-34px, 0);
}
</style>
