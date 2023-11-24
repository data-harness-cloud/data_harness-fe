<template>
  <div class="info-widget">
    <el-form v-if="state.formData" ref="elFormRef" :model="state.formData" :rules="state.rules" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="state.formData.name" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="routeDescribe">
        <el-input v-model="state.formData.routeDescribe" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="请求类型" prop="requestType">
        <el-radio-group v-model="state.formData.requestType">
          <el-radio :label="2">POST</el-radio>
          <el-radio :label="1">GET</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="url" prop="url">
        <el-input v-model="state.formData.url">
          <template #prefix>api/</template>
        </el-input>
      </el-form-item>
      <el-form-item label="数据库" prop="databaseName">
        <el-select v-model="state.formData.databaseName" placeholder="选择数据源">
          <el-option v-for="item in databases" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="执行sql" prop="sqlScript">
        <el-input v-show="false"></el-input>
        <div id="monaco"></div>
      </el-form-item>
      <el-form-item label="参数" prop="parameter">
        <el-input v-show="false"></el-input>
        <el-table :data="parameter" style="width: 100%">
          <el-table-column prop="name" label="参数名" width="120"> </el-table-column>
          <el-table-column prop="type" label="类型" width="110">
            <template #default="scope">
              <el-select v-model="scope.row.type" class="m-2" placeholder="Select" size="small">
                <el-option label="String" value="String" />
                <el-option label="Number" value="Number" />
                <el-option label="Boolean" value="Boolean" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="required" label="是否必填" width="80">
            <template #default="scope"> <el-switch v-model="scope.row.required" size="small" /> </template>
          </el-table-column>
          <el-table-column prop="default" label="默认值" width="160">
            <template #default="scope">
              <el-input :disabled="scope.row.required" v-model="scope.row.default" size="small" />
            </template>
          </el-table-column>
          <el-table-column prop="describe" label="描述">
            <template #default="scope"> <el-input v-model="scope.row.describe" size="small" /> </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <div class="flex flex-pack-between mt24">
        <div>
          <el-button v-if="state.formData.id" type="primary" size="large" @click="testCustomizeRoute">测试</el-button>
        </div>
        <div class="flex">
          <el-button type="primary" :plain="true" size="large" @click="handleCancel(false)"> 取消 </el-button>
          <el-button type="primary" size="large" @click="handleSubmit"> 提交 </el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import { ProjectEngineController } from '@/api/index'
import * as monaco from 'monaco-editor'
import http from '@/core/http/index'
import { language as sqlLanguage } from 'monaco-editor/esm/vs/basic-languages/sql/sql.js'
import useUserStore from '@/store/modules/user'
import { deepClone } from '@/core/js/$'
const userStore = useUserStore()
const { proxy } = getCurrentInstance()
const props = defineProps({
  observer: {
    type: Object,
    required: true,
  },
  defaultController: {
    type: Object,
    default: {},
  },
  mode: {
    type: String,
    default: 'edit',
  },
  defaultData: {
    type: Object,
    default: null,
  },
  defaultOptions: {
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
  memberIdList: [],
  rules: {
    name: [{ required: true, message: '必须选择', trigger: 'blur' }],
    url: [{ required: true, message: '必须填写', trigger: 'blur' }],
    databaseName: [{ required: true, message: '必须选择', trigger: 'blur' }],
    requestType: [{ required: true, message: '必须选择', trigger: 'blur' }],
  },
})
state.formData = Object.assign({}, state.dataExample, props.defaultData)
const parameter = ref(JSON.parse(state.formData.parameter))
state.formData.url = state.formData.url.slice(5)
function setParameter(content) {
  const regex = /\${(.*?)}/g
  const matches = []
  let match
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[1]) // 提取匹配项中的第一个捕获组（即花括号中的内容）
  }
  const matchesMap = new Set()
  matches.forEach((item, index) => {
    matchesMap.add(item, index)
  })
  const parameterMap = new Set()
  parameter.value.forEach((item, index) => {
    parameterMap.add(item.name, index)
  })
  //找到所有matches有，但是不在parameter中的项
  for (let i = 0; i < matches.length; i++) {
    if (!parameterMap.has(matches[i])) {
      parameter.value.push({
        name: matches[i],
        type: 'Stirng',
        required: true,
        defaultValue: '',
        describe: '',
      })
    }
  }
  // 找到parameter中有，但是不在matches中的项
  for (let i = 0; i < parameter.value.length; i++) {
    if (!matchesMap.has(parameter.value[i].name)) {
      parameter.value.splice(i, 1)
      i--
    }
  }
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
  monacoEditor = monaco.editor.create(document.getElementById('monaco'), {
    value: state.formData.sqlScript || '',
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

  monacoEditor.onDidChangeModelContent(() => {
    setParameter(monacoEditor.getValue())
  })
}
function testCustomizeRoute() {
  const obj = deepClone(state.formData)
  obj.parameter = JSON.stringify(parameter.value)
  obj.sqlScript = monacoEditor.getValue()
  obj.url = '/api/' + obj.url
  console.log(obj)
  props.defaultController.update(obj).then((res) => {
    props.defaultController.handleTestCustomizeRoute(obj)
  })
}

onMounted(() => {
  getDatabase()
  initMonaco()
})

const handleCancel = (isSuccess = false) => {
  let pStart = Promise.resolve()
  if (props.observer != null) {
    pStart = pStart.then(() => {
      state.formData.parameter = JSON.stringify(parameter.value)
      state.formData.sqlScript = monacoEditor.getValue()
      state.formData.url = '/api/' + state.formData.url
      return props.observer?.cancel(isSuccess, state.formData)
    })
  }
  return pStart
}

const handleSubmit = () => {
  proxy.$refs['elFormRef'].validate((valid) => {
    if (!valid) return
    handleCancel(true)
  })
}
</script>

<style scoped lang="scss">
#monaco {
  width: 100%;
  height: 200px;
  border: 1px solid #dddddd;
  :deep(.margin-view-overlays) {
    background-color: #f4f7fa;
  }
}
</style>
