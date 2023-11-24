<template>
  <div class="wrapper">
    <div class="wheader">
      <div class="url">
        <div class="requestType">{{ state.formData.requestType === 1 ? 'GET' : 'POST' }}</div>
        <el-divider direction="vertical" />
        <div class="text">{{ state.formData.url }}</div>
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
import { CustomizeRouteController } from '@/api/index'
import * as monaco from 'monaco-editor'
import http from '@/core/http/index'
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
vv.pageParam = {
  pageNum: 1,
  pageSize: 10,
}
function send() {
  CustomizeRouteController.testCustomizeRoute(http, {
    id: state.formData.id,
    params: JSON.parse(monacoEditor.getValue()),
  }).then((res) => {
    console.log('执行结果', res)
    if (!resEditor) {
      resEditor = initMonaco('monaco2', true)
    }
    resEditor.setValue(JSON.stringify(res))
    setTimeout(() => {
      resEditor.trigger(null, 'editor.action.formatDocument')
    }, 100)
  })
}
let monacoEditor
let resEditor
function initMonaco(ele, flag = false) {
  const editor = monaco.editor.create(document.getElementById(ele), {
    value: '',
    language: 'json',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true, // 自动布局
    readOnly: false,
    renderSideBySide: false,
    lineNumbers: 'on',
    minimap: {
      enabled: false,
    },
    folding: flag,
  })

  return editor
}
onMounted(() => {
  monacoEditor = initMonaco('monaco3')
  monacoEditor.setValue(JSON.stringify(vv))
  setTimeout(() => {
    monacoEditor.trigger(null, 'editor.action.formatDocument')
  }, 34)
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
