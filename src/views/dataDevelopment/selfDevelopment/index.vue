<template>
  <div style="display: flex; height: 100%; flex: 1 0 400px; overflow: hidden">
    <div class="smSiderBar">
      <div style="width: 100%; display: flex; margin-bottom: 10px">
        <div class="searchIcon"><img src="/static/icons/icon_search.svg" /></div>
        <input type="text" class="my-input" placeholder="请输入内容" v-model="searchKeywords" />
        <div class="iconBox ml4 pointer" @click="addConsole">
          <img src="/static/icons/add2.svg" />
        </div>
      </div>
      <div v-for="dev in devConsoleList" :key="dev.id" class="line" @click="selectObj(dev)">
        <img src="/static/icons/file.svg" class="levelImg" />
        {{ dev.queryConsoleName || '新建任务' }}
      </div>
    </div>
    <div class="main" v-if="selectedObj">
      <div class="tabs">
        <template v-for="dev in openedConsoleList" :key="dev.id">
          <div class="tabPane" :class="{ tabPaneAct: consoleName === dev.id }" @click="changeTab(dev)">
            <img src="/static/icons/file.svg" alt="" />
            <div class="ml4 mr8">
              {{ dev.queryConsoleName }}
            </div>
            <img src="/static/icons/xx.svg" class="xx" />
          </div>
        </template>
      </div>
      <div class="flex flex-v" style="overflow: hidden; height: 100%; width: 100%">
        <div class="monacoHeader">
          <div class="monacoHeaderLeft">
            <div class="monacoBtn" @click="runSQL">执行</div>
            <div class="monacoBtn">格式化</div>
            <div class="monacoBtn" @click="saveDev">保存</div>
          </div>
          <div class="source">
            <el-select
              v-model="selectedObj.queryDatabase"
              placeholder="选择数据源"
              style="margin-right: 6px; width: 160px"
            >
              <el-option v-for="item in databases" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </div>
        </div>
        <div id="monaco"></div>

        <div class="sqlPane" v-if="selectedObj.result">
          <div class="resultTags">
            <div class="tabPane" :class="{ tabPaneAct: !selectResult }" @click="selectResult = null">输出</div>
            <template v-for="(res, index) in selectedObj.result" :key="res.sql">
              <div
                v-if="res && res.type == 'select'"
                class="tabPane"
                :class="{ tabPaneAct: selectResult?.id === res.id }"
                @click="selectResult = res"
              >
                结果{{ index + 1 }}
              </div>
            </template>
          </div>

          <div class="sqlBox" v-if="selectResult && selectResult.type == 'select' && selectResult.data">
            <div class="tableOps">
              <div class="ops1">
                <img src="/static/icons/zuo.svg" @click="selectResult.prevPage()" />
                <el-dropdown trigger="click">
                  <div class="page">
                    {{ selectResult.currentpage * selectResult.pageSize }} -
                    {{ (selectResult.currentpage + 1) * selectResult.pageSize }}
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="selectResult.setPageSize(100)"> 100条/页 </el-dropdown-item>
                      <el-dropdown-item @click="selectResult.setPageSize(200)"> 200条/页 </el-dropdown-item>
                      <el-dropdown-item @click="selectResult.setPageSize(500)"> 500条/页 </el-dropdown-item>
                      <el-dropdown-item @click="selectResult.setPageSize(1000)"> 1000条/页 </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <img src="/static/icons/you.svg" @click="selectResult.nextPage()" />
              </div>
              <div class="ops2">
                <img src="/static/icons/export.svg" />
                <img src="/static/icons/save2.svg" />
                <img src="/static/icons/analysis.svg" />
              </div>
            </div>
            <div class="resultPane scroller">
              <table class="resultTable">
                <thead>
                  <tr>
                    <th></th>
                    <th v-for="field in selectResult.data.queryResultData?.fieldList" :key="field">{{ field }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(queryData, index) in selectResult.data.queryResultData?.queryDataList" :key="index">
                    <td>{{ index + selectResult.pageSize * selectResult.currentpage }}</td>
                    <td v-for="field in selectResult.data.queryResultData?.fieldList" :key="field">
                      {{ queryData[field] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else-if="!selectResult" class="output scroller">
            <template v-for="(res, index) in result" :key="index">
              <div class="flex mt6">
                <span style="color: #64c37d; margin-right: 6px">{{ res.database }} > </span>
                <span style="color: #5161db">{{ res.sql }}</span>
              </div>
              <div class="mt2" :style="{ color: res.isSuccess ? 'black' : 'red' }">{{ res.message }}</div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as monaco from 'monaco-editor'
import { DevConsoleController, ProjectEngineController } from '@/api/index'
import ConsoleController from '@/core/classes/DevConsoleController/index'
import { onMounted, onBeforeUnmount } from 'vue'
import { language as sqlLanguage } from 'monaco-editor/esm/vs/basic-languages/sql/sql.js'
import http from '@/core/http/index'
import { ElMessage } from 'element-plus'
import { SqlController } from './SqlController'
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
let monacoEditor
const consoleName = ref('')
function monacoConfig() {
  monaco.languages.registerCompletionItemProvider('sql', {
    provideCompletionItems: (model, position) => {
      let suggestions = []
      const { lineNumber, column } = position
      const textBeforePointer = model.getValueInRange({
        startLineNumber: lineNumber,
        startColumn: 0,
        endLineNumber: lineNumber,
        endColumn: column,
      })
      const contents = textBeforePointer.trim().split(/\s+/)
      const lastContents = contents[contents?.length - 1] // 获取最后一段非空字符串
      if (lastContents) {
        const sqlConfigKey = ['builtinFunctions', 'keywords', 'operators']
        sqlConfigKey.forEach((key) => {
          sqlLanguage[key].forEach((sql) => {
            suggestions.push({
              label: sql, // 显示的提示内容;默认情况下，这也是选择完成时插入的文本。
              insertText: sql, // 选择此完成时应插入到文档中的字符串或片段
            })
          })
        })
      }
      return {
        suggestions,
      }
    },
  })
}
const selectedObj = ref(null)
function changeTab(dev) {
  if (selectedObj.value) selectedObj.value.queryStatements = monacoEditor.getValue()
  selectedObj.value = dev
  consoleName.value = dev.id
  if (monacoEditor) monacoEditor.setValue(dev.queryStatements)
}
function initMonaco() {
  if (monacoEditor) {
    return
  }
  monacoEditor = monaco.editor.create(document.getElementById('monaco'), {
    value: selectedObj.value.queryStatements || '',
    language: 'sql',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true, // 自动布局
    readOnly: false,
    renderSideBySide: false,
    lineNumbers: 'on',
    minimap: {
      enabled: false,
    },
    folding: false,
  })
}
const consoleController = new ConsoleController()
const selectResult = ref(null)
const result = reactive([])
async function runSQL() {
  if (!selectedObj.value.queryDatabase) {
    ElMessage.error('请选择数据源')
    return
  }
  selectedObj.value.result.length = 0
  const str = monacoEditor.getModel().getValueInRange(monacoEditor.getSelection())
  if (!str) {
    ElMessage.error('请选择要执行的sql')
    return
  }
  selectResult.value = null
  const sqlStrings = str.split(';')
  console.log(sqlStrings)
  for (let i = 0; i < sqlStrings.length; i++) {
    if (!sqlStrings[i]) continue
    const sqlController = new SqlController({
      sql: sqlStrings[i],
      database: selectedObj.value.queryDatabase,
      projectId: userStore.projectId,
      id: i + 1,
      result: result,
    })
    selectedObj.value.result.push(sqlController)
    await sqlController.execute()
    if (sqlController.type === 'select') selectResult.value = sqlController
  }
}

function saveDev() {
  selectedObj.value.queryStatements = monacoEditor.getValue()
  const fromData = {
    dataDeptId: selectedObj.value.dataDeptId,
    dataUserId: selectedObj.value.dataUserId,
    id: selectedObj.value.id,
    queryConsoleName: selectedObj.value.queryConsoleName,
    queryDatabase: selectedObj.value.queryDatabase,
    queryStatements: selectedObj.value.queryStatements,
    responseResults: '',
  }

  consoleController.update(fromData).then((res) => {
    console.log(res)
  })
}
const devConsoleList = ref([])
const openedConsoleList = ref([])
function getDevConsole() {
  return DevConsoleController.list(http, {
    devConsoleDto: {},
  }).then((res) => {
    devConsoleList.value = res.data.dataList
  })
}

function selectObj(obj) {
  if (openedConsoleList.value.findIndex((item) => item.id === obj.id) === -1) {
    if (!obj.queryDatabase) obj.queryDatabase = ''
    obj.startTime = ''
    obj.queryTime = ''
    obj.result = []
    openedConsoleList.value.push(obj)
  }

  changeTab(obj)
  setTimeout(() => {
    initMonaco()
  }, 100)

  console.log(consoleName.value)
}

function addConsole() {
  consoleController.handleAdd().then((res) => {
    devConsoleList.value.push(res)
  })
}

const databases = ref(null)
async function getDatabase() {
  await ProjectEngineController.getAllDatabaseName(
    http,
    {
      projectId: userStore.projectId,
    },
    null,
    { showMask: false }
  ).then((res) => {
    databases.value = res.data
  })
}

onMounted(() => {
  getDatabase()
  monacoConfig()
  getDevConsole()
})

onBeforeUnmount(() => {
  if (monacoEditor) {
    monacoEditor.dispose()
  }
})
</script>

<style lang="scss" scoped>
.smSiderBar {
  width: 256px;
  min-width: 256px;
  height: 100%;
  padding: 16px;
  border-right: 1px solid #dddddd;
  position: relative;
}
.my-input {
  width: 160px;
  height: 32px;
  background: #f6f6f9;
  border-radius: 0px 4px 4px 0px;
  padding-left: 4px;
  border: none;

  font-size: 14px;
  color: #666666;
  outline: none;
}

.main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  #monaco {
    width: 100%;
    height: 300px;
    border: 1px solid #dddddd;
    :deep(.margin-view-overlays) {
      background-color: #f4f7fa;
    }
  }
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

.line {
  width: 100%;
  height: 32px;
  font-weight: 400;
  font-size: 14px;
  display: flex;
  padding: 0 8px;
  border-radius: 4px 4px 4px 4px;
  align-items: center;
  overflow: hidden;
  user-select: none;

  .treeTitle {
  }

  .levelImg {
    margin-right: 4px;
    filter: drop-shadow(#000 100px 0);
    transform: translateX(-100px);
  }
}

.selectedBar {
  background: #3246d2;
  color: #fff;

  .levelImg {
    filter: drop-shadow(#fff 100px 0);
  }
}

.line:hover {
  background: #3246d2;
  color: #fff;

  .levelImg {
    filter: drop-shadow(#fff 100px 0);
  }
}
.tHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  color: #222222;
}
.monacoHeader {
  background: #f4f7fa;
  border: 1px solid #dddddd;
  border-bottom: none;
  display: flex;
  justify-content: space-between;
  .monacoHeaderLeft {
    display: flex;
    align-items: center;
    height: 32px;
    div {
      font-size: 12px;
      font-family: PingFangSC-Regular-, PingFangSC-Regular;
      font-weight: normal;
      color: #666666;
      margin: 0 8px;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        color: #3246d2;
      }
      &:active {
        color: #3246d2;
        background: #b2b8e8;
      }
    }
  }
}
.tabs {
  display: flex;
  background: #ffffff;
  height: 34px;
}
.tabPane {
  font-size: 14px;
  font-weight: 400;
  color: #666666;
  display: flex;
  align-items: center;
  line-height: 24px;
  padding: 0 12px;
  cursor: pointer;
  .xx {
    width: 10px;
    height: 10px;
    display: none;
  }
  &:hover {
    color: #3246d2;
    background: #f4f7fa;
    .xx {
    }
  }
}
.tabPaneAct {
  color: #3246d2;
  background: #ffffff;
  border-bottom: 1px solid #3246d2;
  img {
    transform: translateY(-60px);
    filter: drop-shadow(#3246d2 0 60px);
    overflow: hidden;
  }
  .xx {
    display: block;
  }
}
.sqlPane {
  width: 100%;
  flex: 1 0 400px;
  border: 1px solid #dddddd;
  overflow: hidden;
}
.sqlBox {
  height: 100%;
  overflow: hidden;
}
.tt {
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  font-size: 12px;
  font-family: PingFangSC-Regular-, PingFangSC-Regular;
  font-weight: normal;
  color: #222;
}
.resultTags {
  margin-top: 26px;
  height: 30px;
  display: flex;
}
.tableOps {
  display: flex;
  justify-content: space-between;
  background-color: #f4f7fa;
  border-top: 1px solid #c7d8ee;
  padding: 0 8px;
  height: 24px;
  .page {
    display: flex;
    font-size: 14px;
    cursor: pointer;
  }
  .ops1 {
    display: flex;

    align-items: center;
    img {
      width: 12px;
      height: 12px;
      margin: 0 6px;
      cursor: pointer;
    }
  }
  .ops2 {
    display: flex;
    align-items: center;
    img {
      width: 16px;
      height: 16px;
      margin-right: 8px;
      cursor: pointer;
    }
  }
}
.resultPane {
  overflow-x: auto;
  overflow-y: auto;
  //overflow-y 宽度
  border-top: 1px solid #c7d8ee;

  height: calc(100% - 100px);
  .resultTable {
    border-collapse: collapse;
    th {
      // border: 1px solid #c7d8ee;
      border-left: 1px solid #c7d8ee;
      padding: 2px 8px;
      font-size: 14px;
    }
    thead th {
      position: sticky;
      top: 0;
      background-color: #f4f7fa;
      border-bottom: 1px solid #c7d8ee;
    }
    td {
      color: #666666;
      font-size: 14px;
      border: 1px solid #c7d8ee;
      padding: 4px 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
    }
    td:first-child,
    th:first-child {
      position: sticky;
      left: 0;
      z-index: 1;
      background-color: #f4f7fa;
      border: none;
      border-bottom: 1px solid #c7d8ee;
    }
    th:first-child {
      z-index: 2;
    }
  }
}
.output {
  border: 1px solid #c7d8ee;
  height: 100%;
  overflow: auto;
  padding: 0 8px;
  font-size: 15px;
}
</style>
<style lang="scss">
.source {
  .el-input__wrapper {
    background-color: transparent;
    box-shadow: none !important;
  }
  .el-select .el-input.is-focus .el-input__wrapper {
    box-shadow: none !important;
  }
  .el-select .el-input__wrapper.is-focus {
    box-shadow: none !important;
  }
}
</style>
