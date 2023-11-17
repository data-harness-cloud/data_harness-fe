<template>
  <div class="wrapper">
    <div class="wheader">
      <div class="url">
        <div class="requestType">{{ state.formData.requestType === 1 ? 'GET' : 'POST' }}</div>
        <el-divider direction="vertical" />
        <div class="text">{{ 'api/' + state.formData.url }}</div>
      </div>

      <el-button type="primary" size="large" @click="send">发送</el-button>
    </div>
    <div class="testContent">
      <div class="testValue">
        <div class="tvtatle">参数</div>
        <div id="monaco3"></div>
      </div>
      <div class="testMessage">
        <div class="tvtatle">结果</div>
        <div id="monaco2"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as monaco from 'monaco-editor'
import http from '@/core/http/index'
import { language as sqlLanguage } from 'monaco-editor/esm/vs/basic-languages/sql/sql.js'

const props = defineProps({
  observer: {
    type: Object,
    required: true,
  },
  defaultController: {
    type: Object,
    default: {},
  },
  defaultData: {
    type: Object,
    default: null,
  },
})

const state = reactive({
  dataExample: {
    databaseName: '',
    routeDescribe: '',
    name: '',
    parameter: '[]',
    processId: null,
    projectId: null,
    requestType: 2,
    sqlScript: '',
    state: -1,
    url: '',
    id: null,
  },
  formData: null,
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)
const parameter = ref(JSON.parse(state.formData.parameter))
console.log(parameter.value)

const vv = {}
parameter.value.forEach((item) => {
  vv[item.name] = ''
})
;(vv.pageParam = {
  pageNum: 1,
  pageSize: 10,
}),
  function send() {}
let monacoEditor
function initMonaco() {
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
  monacoEditor = monaco.editor.create(document.getElementById('monaco3'), {
    value: JSON.stringify(vv),
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
onMounted(() => {
  initMonaco()
})
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  .wheader {
    width: 100%;
    height: 40px;
    display: flex;
    .url {
      width: 100%;
      border: 1px solid #979797;
      border-radius: 4px;
      margin-right: 10px;
      display: flex;
      align-items: center;
      padding: 2px 8px;
      .requestType {
        font-size: 14px;
        font-weight: 700;
        color: #6673d8;
      }
      .text {
      }
    }
  }
  .testContent {
    width: 100%;
    display: flex;
    height: 600px;
    margin-top: 32px;
    .testValue {
      flex: 1;
    }
    #monaco3,
    #monaco2 {
      width: 100%;
      height: 582px;
      border: 1px solid #dddddd;
    }
    .testMessage {
      flex: 1;
    }
  }
}
</style>
