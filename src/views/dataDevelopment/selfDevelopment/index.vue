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
      <div style="overflow: hidden">
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
              <el-option
                v-for="item in databases"
                :key="item.id"
                :label="item.datasourceName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div id="monaco"></div>
        <!-- <div v-if="selectedObj.startTime" class="tt"></div> -->
        <div class="sqlPane" v-if="selectedObj.result">
          <div v-for="res in selectedObj.result" :key="res.sql">
            <div class="flBetween">
              <div class="flex"></div>
              <div class="flex">
                <div>导出</div>
                <div>另存为</div>
                <div>分析</div>
              </div>
            </div>
            <div class="resultPane">
              <el-table :data="res" style="width: 100%">
                <el-table-column
                  v-for="columnName in selectedObj.result.columnName"
                  :key="columnName"
                  :prop="columnName"
                  :label="columnName"
                />
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as monaco from 'monaco-editor'
import { DevConsoleController, DatabaseManagementController, ProjectDatasourceController } from '@/api/index'
import ConsoleController from '@/core/classes/DevConsoleController/index'
import { onMounted, onBeforeUnmount } from 'vue'
import { language as sqlLanguage } from 'monaco-editor/esm/vs/basic-languages/sql/sql.js'
import http from '@/core/http/index'
import { ElMessage } from 'element-plus'
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
  })
}
const consoleController = new ConsoleController()

function runSQL() {
  if (!selectedObj.value.queryDatabase) {
    ElMessage.error('请选择数据源')
    return
  }

  const database = databases.value.find((item) => item.id === selectedObj.value.queryDatabase)
  console.log(database)
  const databaseContent = JSON.parse(database.datasourceContent)
  DatabaseManagementController.executeSql(http, {
    databaseManagement: {
      ...databaseContent,
    },
    sql: addLimitToSelect(monacoEditor.getValue()),
  }).then((res) => {
    console.log(res.data)
    selectedObj.value.result = res.data
  })
}

function addLimitToSelect(str) {
  const selectIndex = str.toLowerCase().lastIndexOf('select')
  if (selectIndex !== -1) {
    if (str.toLowerCase().indexOf('limit') !== -1) return str
    const lastSemicolonIndex = str.lastIndexOf(';')
    if (lastSemicolonIndex !== -1) {
      str = str.slice(0, lastSemicolonIndex) + ' LIMIT 100' + str.slice(lastSemicolonIndex)
    } else {
      str += ' LIMIT 100'
    }
  }
  return str
}

function saveDev() {
  selectedObj.value.queryStatements = monacoEditor.getValue()
  console.log(selectedObj.value)
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
    obj.result = null
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
  await ProjectDatasourceController.list(
    http,
    {
      projectDatasourceDtoFilter: {},
    },
    null,
    { showMask: false }
  ).then((res) => {
    databases.value = res.data.dataList
  })
}

onMounted(() => {
  getDatabase()
  //   initMonaco()
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
}
.sqlPane {
  width: 100%;
  height: 400px;
  margin-top: 32px;
  border: 1px solid #dddddd;
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
.resultPane {
  overflow-x: auto;
  overflow-y: auto;
  //overflow-y 宽度
  &::-webkit-scrollbar {
    display: block;
  }
  height: 100%;
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
