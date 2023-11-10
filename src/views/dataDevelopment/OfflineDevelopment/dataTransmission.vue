<template>
  <div class="wrapper">
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
          :key="column.field"
          class="col"
          @pointerdown.stop="(event) => createBezier(event, column)"
        >
          {{ column.field }}
        </div>
      </div>
      <div style="width: 200px"></div>
      <div class="tableList" id="toTableList" @scroll="updateBezier()">
        <div
          v-for="column in toTabe"
          :key="column.field"
          class="col"
          @pointerup.stop="(event) => endBezier(event, column)"
        >
          {{ column.field }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as PIXI from 'pixi.js'
const formTabe = ref([
  { field: 'id', type: 'varchar(16)', to: null, bezier: null },
  { field: 'name', type: 'varchar(16)', to: null, bezier: null },
  { field: 'age', type: 'decimal(16,4)', to: null, bezier: null },
  { field: 'book_remake', type: 'varchar(16)', to: null, bezier: null },
  { field: 'book_tag', type: 'varchar(16)', to: null, bezier: null },
  { field: 'order_id', type: 'varchar(16)', to: null, bezier: null },
  { field: 'order_status', type: 'varchar(16)', to: null, bezier: null },
  { field: 'is_send', type: 'varchar(16)', to: null, bezier: null },
  { field: 'paid_remake', type: 'varchar(16)', to: null, bezier: null },
  { field: 'total_money', type: 'varchar(16)', to: null, bezier: null },
  { field: 'paid_remake2', type: 'varchar(16)', to: null, bezier: null },
  { field: 'book_tag2', type: 'varchar(16)', to: null, bezier: null },
])
const toTabe = ref([
  { field: 'id', type: 'varchar(16)' },
  { field: 'name', type: 'varchar(16)' },
  { field: 'nianling', type: 'decimal(16,4)' },
  { field: 'book_remake', type: 'varchar(16)' },
  { field: 'book_tag', type: 'varchar(16)' },
  { field: 'orderId', type: 'varchar(16)' },
  { field: 'order_status', type: 'varchar(16)' },
  { field: 'sends', type: 'varchar(16)' },
  { field: 'paid_remake', type: 'varchar(16)' },
  { field: 'total_money', type: 'varchar(16)' },
  { field: 'paid_remake2', type: 'varchar(16)' },
  { field: 'book_tag2', type: 'varchar(16)' },
  { field: 'idadsf', type: 'varchar(16)' },
  { field: 'namasdfe', type: 'varchar(16)' },
  { field: 'nianlifghng', type: 'decimal(16,4)' },
  { field: 'bodfghok_remake', type: 'varchar(16)' },
  { field: 'bookdfgh_tag', type: 'varchar(16)' },
  { field: 'ordvcnberId', type: 'varchar(16)' },
  { field: 'ordexcvbr_status', type: 'varchar(16)' },
  { field: 'sendzcxvs', type: 'varchar(16)' },
  { field: 'paid_vbnremake', type: 'varchar(16)' },
  { field: 'total_cvbnmoney', type: 'varchar(16)' },
  { field: 'paicvbn_remake2', type: 'varchar(16)' },
  { field: 'book_tcbvnag2', type: 'varchar(16)' },
])
let formTabeIndexMap = {}
let toTabeIndexMap = {}

const tableListCanvas = ref(null)
let app
let nowBezier = null
let nowColumn = null
let startPoint = { x: 0, y: 0 }
let endPoint = { x: 0, y: 0 }
function canvasInit() {
  app = new PIXI.Application({
    width: 600, // 画布宽度
    height: 400, // 画布高度
    antialias: true, // 抗锯齿
    transparent: false, // 不透明
    backgroundColor: 0xffffff, // 背景颜色
    // resolution: 1, // 分辨率
    //   autoDensity: true, // 自动调整分辨率
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
  let index = formTabeIndexMap[column.field]
  let x = 200,
    y = index * 40 + 20 - fromTableListDom.scrollTop
  return { x, y }
}
function getToColumnPos(column) {
  let index = toTabeIndexMap[column.field]
  let x = 400,
    y = index * 40 + 20 - toTableListDom.scrollTop
  return { x, y }
}
function createBezier(event, column) {
  nowColumn = column
  startPoint = getFromColumnPos(column)
  if (nowBezier) {
    app.stage.removeChild(nowBezier)
    nowBezier = null
    return
  }
  if (nowColumn.to) {
    console.log('已经有了', nowColumn.bezier)
    nowColumn.to = null
    nowColumn.bezier.clear()
    app.stage.removeChild(nowColumn.bezier)
    nowColumn.bezier = null
  }
  nowBezier = new PIXI.Graphics()
  app.stage.addChild(nowBezier)
}
function moveBezier(event) {
  if (nowBezier) {
    endPoint = getPos(event)
    nowBezier.clear()
    nowBezier.lineStyle(2, 0xff0000)
    nowBezier.moveTo(startPoint.x, startPoint.y)
    nowBezier.bezierCurveTo(startPoint.x + 70, startPoint.y, endPoint.x - 70, endPoint.y, endPoint.x, endPoint.y)
  }
}
function endBezier(event, column = null) {
  if (nowBezier) {
    if (!column) {
      app.stage.removeChild(nowBezier)
      nowBezier = null
      return
    }

    nowColumn.to = column.field
    nowColumn.bezier = nowBezier
    endPoint = getToColumnPos(column)
    nowBezier.clear()
    nowBezier.lineStyle(2, 0xff0000)
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
      column.bezier.lineStyle(2, 0xff0000)
      column.bezier.moveTo(pos.x, pos.y)
      column.bezier.bezierCurveTo(pos.x + 70, pos.y, endPoint.x - 70, endPoint.y, endPoint.x, endPoint.y)
    }
  }
}
onMounted(() => {
  canvasInit()
  fromTableListDom = document.getElementById('fromTableList')
  toTableListDom = document.getElementById('toTableList')
  for (let i = 0; i < formTabe.value.length; i++) {
    formTabeIndexMap[formTabe.value[i].field] = i
  }
  for (let i = 0; i < toTabe.value.length; i++) {
    toTabeIndexMap[toTabe.value[i].field] = i
  }
})
</script>

<style lang="scss" scoped>
.wrapper {
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
  width: 200px;
  height: 400px;
  border: 1px solid #000;
  overflow-y: auto;

  .col {
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #000;
    user-select: none;
    &:hover {
      background-color: #00a3c4;
    }
  }
  .colActive {
  }
}
</style>
