<template>
  <div id="monaco"></div>
</template>

<script setup>
import { getCurrentInstance, reactive, onMounted } from 'vue'
import useUserStore from '@/store/modules/user'
import projectConfig from '@/core/config/index'
import axios from 'axios'
import * as monaco from 'monaco-editor'
import './language-log'
const userStore = useUserStore()
const { proxy } = getCurrentInstance()
const props = defineProps({
  observer: {
    type: Object,
    required: true,
  },
  mode: {
    type: String,
    default: 'edit',
  },
  defaultData: {
    type: Object,
    default: null,
  },
})

const state = reactive({
  dataExample: {},
  formData: null,
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)
console.log(state.formData)

let monacoEditor
function initMonaco(logContent) {
  monacoEditor = monaco.editor.create(document.getElementById('monaco'), {
    value: logContent,
    theme: 'logview',
    language: 'log',
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

function getPreviewUrl(data) {
  const params = Object.assign(typeof data.logFileJson === 'object' ? data.logFileJson : JSON.parse(data.logFileJson), {
    id: data.id,
  })
  params['Authorization'] = userStore.userInfo.tokenData
  return (
    projectConfig.baseUrl +
    `admin/app/devLiteflowLog/download?` +
    Object.keys(params)
      .map((e) => `${e}=${params[e]}`)
      .join('&')
  )
}

onMounted(() => {
  axios.get(getPreviewUrl(state.formData)).then((response) => {
    const logContent = response.data
    initMonaco(logContent)
  })
})

const handleCancel = (isSuccess = false) => {
  let pStart = Promise.resolve()
  if (props.observer != null) {
    pStart = pStart.then(() => {
      return props.observer?.cancel(isSuccess, state.formData)
    })
  }

  return pStart
}
</script>

<style scoped lang="scss">
#monaco {
  width: 100%;
  height: 600px;
  border: 1px solid #dddddd;
}
</style>
